---
layout: post
title: "Testing a Visitor - Mocking and Test Readability"
date: 2009-01-22 21:53:46
tags: [Patterns, Testing, Visitor, Mocking]
---

The other day I was using TDD to write a visitor for an object graph at work. I often use mocks a lot and was using mocks in this particular batch of tests as well. However, in the end creating my own fake class turned out to be much better (in my opinion). Favoring state-based testing over interaction-based testing (sometimes) can really simplify the noise within a test and provide clarity.
 
What I wanted to test was that objects of the correct types were visited from the parent object and was thus producing a number of tests that look something like this:
 
``` csharp
private MockRepository mocks;
[SetUp]
public void Setup()
{
    mocks = new MockRepository();
}
[Test]
public void ShouldVisitObject1BelowRootObject()
{
    var rootObject = ObjectMother.Build<RootObject>();
    var object1 = ObjectMother.Build<Object1>();
    rootObject.AddObject(object1);
    var visitor = mocks.DynamicMock<IVisitor>();
    using (mocks.Record())
    {
        Expect.Call(delegate { visitor.Visit(object1); });
    }
    using (mocks.Playback())
    {
        rootObject.Accept(visitor);
    }
}
```

Now this was a pretty big object graph, so there were a lot of tests that looked very much like this one. What I am doing here is **interaction-based testing**, using a mock to verify that my class under test calls a particular method. There is quite a bit of mock noise in this test, stuff that is related to setting up mocks and our expectations. Noise like this can be much worse - and it was worse in my production code.

In this particular model, all the objects have a collection of sub items - and this collection conveniently contained some the various object types to visit. So I had a lot of tests that very almost identical to the one above. I thought I'd be clever and refactor my tests so I wouldn't have to duplicate as much code for each of these particular cases. After wrestling with it for a bit I came up with this:

``` csharp
private MockRepository mocks;
[SetUp]
public void Setup()
{
    mocks = new MockRepository();
}
[Test]
public void ShouldVisitObject1BelowRootObject()
{
    TestVisitor<RootObject, Object1>(
        delegate(IVisitor visitor, Object1 obj)
        {
            visitor.Visit(obj);
        });
}
```

It still looks kind of weird, with the delegate floating around (using C# 2.0 at work for now, so no lambda syntax). The test is still arguably even less readable. The delegate is actually used in the helper method to add the expectation to the mock, since the visitor has overload methods for concrete classes (this is the whole idea of visitor, implementing [double dispatch](http://en.wikipedia.org/wiki/Double_dispatch) - promise I will post about it soon), you can't really abuse generics.

The helper method is shown below and is also kind of hairy.

``` csharp
private delegate void VisitExpectDelegate<T>(IVisitor visitor, T child);
private void TestVisitor<TParent, TChild>(VisitExpectDelegate<TChild> visitExpectDelegate)
    where TParent : AbstractObject
    where TChild : AbstractObject
{
    var parent = ObjectMother.Build<TParent>();
    var child = ObjectMother.Build<TChild>();
    parent.AddObject(child);
    var visitor = mocks.DynamicMock<IVisitor>();
    using (mocks.Record())
    {
        visitExpectDelegate(visitor, child);
    }
    using (mocks.Playback())
    {
        parent.Accept(visitor);
    }
}
```

Another small thing that annoyed me besides the readability issue is that the code only works for a very specific case, checking that sub items are visited below a parent object. Furthermore, trying to mock visitor behavior of a deeper class hierarchy can turn into a mocking headache real fast.

I asked a colleague about the readability of my test and if he thought it was acceptable. He suggested that I tried faking (creating my own class) the visitor instead of mocking it. In essence, he suggested that I'd use **state-based testing** over my current interaction-based method.

The result was this:

``` csharp
private CountingVisitor visited;
[SetUp]
public void Setup()
{
    visited = new CountingVisitor();
}
[Test]
public void ShouldVisitObject1BelowRootObject()
{
    var rootObject = ObjectMother.Build<RootObject>();
    rootObject.AddObject(ObjectMother.Build<Object1>());
    rootObject.Accept(visited);
    Assert.That(visited.TotalCount, Is.EqualTo(2));
    Assert.That(visited.GetCount<Object1>(), Is.EqualTo(1));
}
```

My fake was basically just a visitor that would count how many times it had visited a given type of object and the total count of visits it had made. For me this test is so much more readable - build an object graph, give it to the visitor, make asserts about the visit count using NUnit's `Assert.That` syntax. The cool thing about this is that it makes no assumptions about sub items and can actually be used for any visitor that visits any object graph. It could also test deeper object graphs with ease. I am aware that it doesn't test which particular instances are visited, but I didn't feel that it would add much value to add this to the visitor, although it is possible.

The fake visitor looks like this and is really just a few generic tricks and a dictionary.

``` csharp
private class CountingVisitor : IVisitor
{
    private readonly Dictionary<Type, int> _count = new Dictionary<Type, int>();
    private int _totalCount = 0;
    private void Add<T>(T obj)
    {
        if (!_count.ContainsKey(typeof(T))) _count[typeof(T)] = 0;
        _count[typeof (T)] += 1;
        _totalCount += 1;
    }
    public int TotalCount
    {
        get { return _totalCount; }
    }
    public int GetCount<T>()
    {
        if(!_count.ContainsKey(typeof(T))) return 0;
        return _count[typeof (T)];
    }
    public void Visit(RootObject obj) { Add(obj); }
    public void Visit(Object1 obj) { Add(obj); }
    public void Visit(Object2 obj) { Add(obj); }
}
```

So remember the state-based testing, mocks are useful animals and sometimes they will be the only reasonable way or the easiest and you should use them, but other types of fakes (particularly hand-crafted ones - I think this one is actually called a "spy") can really give a good boost in readability and flexibility with a minimal code effort.
