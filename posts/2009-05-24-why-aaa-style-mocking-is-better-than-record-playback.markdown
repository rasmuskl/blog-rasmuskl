---
layout: post
title: "Why AAA style mocking is better than Record / Playback"
date: 2009-05-24 21:06:52
tags: [Mocking, Testing, C#]
---

If you've followed me on twitter for more than a couple of days, you will most probably have heard my grumbling each time I run into issues using record / playback mocking - so I thought I'd write a short post on my experiences with both and why I think that I keep bumping into issues with record / playback.
 
## Phases of a test
 
If you take a look at the normal flow of a test method without mocking, it will usually perform some kind of setup, then perform some action that invokes the code under test - and then at the end, make some assertions about the state of some component that you want verified. While some tests continue after this point, this is where you should stop if you're following the "one assert per test" rule - this is sort of the single responsibility principle for tests. This flow is also the inspiration for the AAA name - first you **Arrange **your test setup, then you **Act** upon the class under test - and then you **Assert** something about the state. Here's a simple example without mocking:
 
``` csharp
[Test]
public void CanRemoveCategories()
{
    // Arrange
    var collection = new CategoryCollection("test");
    // Act
    collection.RemoveCategory("test");
    // Assert
    Assert.That(collection.Count, Is.EqualTo(0));
}
```
This test is chronologically sound, it makes sense and it is easy to read - but then again, this is a state-based test, I said I was going to talk about behavioral tests - mock tests.

## Phase confusion

Many people find that mocking is rather difficult to understand and that it often very hard to read and understand. Since our tests act as an API-description for our code - and since we want to be able to figure out how to fix our failed tests - readability is important. Now, let's look at one of my tests from a Record / Playback point of view. I'm using Rhino Mocks as my mocking framework in this test:

``` csharp
[Test]
public void ShouldIgnoreRespondentsThatDoesNotExistRecordPlayback()
{
    var guid = Guid.NewGuid();
    IEventRaiser executeRaiser;
    using(_mocks.Record())
    {
        Expect.Call(_view.Respondents).Return(new[] {guid.ToString()});
        Expect.Call(_repository.GetById(guid)).Return(null);
        _view.ExecuteOperation += null;
        executeRaiser = LastCall.IgnoreArguments()
            .Repeat.Any()
            .GetEventRaiser();
        Expect.Call(_view.OperationErrors = null)
            .IgnoreArguments()
            .Constraints(List.IsIn("Non-existant respondent: " + guid));
    }
    using(_mocks.Playback())
    {
        new BulkRespondentPresenter(_view, _repository);
        executeRaiser.Raise(null, EventArgs.Empty);
    }
}
```

Now, at a glance, can you tell me what this test is really doing? There's something with a view and a repository and we can probably deduce quite a bit from the test name. But it's rather hard to separate the different phases I talked about before **Arrange**, **Act** and **Assert**. Below, I've tried to annotate the test with the phases:

``` csharp
[Test]
 public void ShouldIgnoreRespondentsThatDoesNotExistRecordPlayback()
 {
     // Arrange
     var guid = Guid.NewGuid();
     // Part of Act
     IEventRaiser executeRaiser;
     using(_mocks.Record())
     {
         // Arrange (or Assert?)
         Expect.Call(_view.Respondents).Return(new[] {guid.ToString()});
         Expect.Call(_repository.GetById(guid)).Return(null);
         // Part of Act
         _view.ExecuteOperation += null;
         executeRaiser = LastCall.IgnoreArguments()
             .Repeat.Any()
             .GetEventRaiser();
         // Assert
         Expect.Call(_view.OperationErrors = null)
             .IgnoreArguments()
             .Constraints(List.IsIn("Non-existant respondent: " + guid));
     }
     using(_mocks.Playback())
     {
         // Arrange
         new BulkRespondentPresenter(_view, _repository);
         // Act
         executeRaiser.Raise(null, EventArgs.Empty);
     }
 }
```

No wonder it's hard to read and understand. The phases are mixed all over - and the Asserts are in the middle of the test - this is <u>nothing</u> like the natural flow of the previous test without mocking. I usually like to have the phases separated in my test with comments as well, but it's just not possible in this test. I wrote this test up rather quickly, so there might be a better way of doing it that I am missing - if there is, please yell at me :-)

## Sorting out the confusion

AAA mocking, as the name suggests, is all about clearing out the confusion in that last test - it's about maintaining the original test flow. It just so happens also to have some other benefits, that I will get into later in the post. I've written the same test as above in an AAA style, this time with Moq, since I'm trying it out at the moment, but Rhino Mocks has similar syntax. Moq is pretty heavy on lambda expressions, but even if you haven't worked with those yet, I'm sure you will grasp the idea. If you want a general introduction to mocking with Moq, [Justin Etheredge](http://www.codethinked.com/) has a small [series](http://www.codethinked.com/post/2009/03/13/Beginning-Mocking-With-Moq-3-Part-1.aspx) about it.

``` csharp
[Test]
public void ShouldIgnoreRespondentsThatDoesNotExist()
{
    // Arrange
    var guid = Guid.NewGuid();
    _viewMock.Setup(x => x.Respondents).Returns(new[] { guid.ToString() });
    _repositoryMock.Setup(x => x.GetById(guid)).Returns(() => null);
    // Act
    _viewMock.Raise(x => x.ExecuteOperation += null, EventArgs.Empty);
    // Assert
    _viewMock.VerifySet(x => x.OperationErrors =
        It.Is<IList<string>>(l => l.Contains("Non-existant respondent: "+guid)));
}
```

Those comments are actually in my original test as well - and in my test live template I generate all my tests with. If you compare this test to the one above, you will see that it has more or less the same components, but this time, they're arranged in a way that makes sense for the next reader of the test. The fact that the test is shorter is also slightly unfair, since my first test used an event raiser, which involves "many" lines of code. Also the separation of the phases allowed me to move the actual construction of the presenter our of the actual test and into shared setup code.

So what techniques did AAA mocking introduce to help alleviate the pains? First of all, the mocks no longer has states - that's what record and playback really refer to: A mock in record state will record calls made on it and then expect them to be called again during the playback state. Furthermore, it cleanly separates mock setup from mock expectations.

## What is gained?

So what did we gain with AAA style mocking over the traditional record / playback style? 

- The main selling point for me is readability and test simplicity - it is much easier for me to explain mocking to someone else with AAA. 
- If you have done any fairly advanced record / playback mocking, you will find that when the mocks have states, it will often result in subtle test failures.
- Clean separation of test phases.
- Greatly improved ability to move shared code out of tests. Since you have the first part of your test handling setup, extending this part to start before the actual test (in a setup method) is no problem. With record / playback mocking, you will often run into state failures if you attempt it.
