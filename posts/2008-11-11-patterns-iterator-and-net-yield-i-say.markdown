---
layout: post
title: "Patterns: Iterator And .NET - Yield I Say!"
date: 2008-11-11 23:24:51
comments: true
tags: [C#, Patterns]
---
## Introduction
 
In this second post of my patterns and principles series, I aim to give an overview of the Iterator pattern, a pattern most of us .NET people have so integrated in our languages that we don't even think about it. But it is still useful to know the theory of the pattern and how it is integrated into the framework - the solution baked in allows for more variation than you'd think.
 
## The Theory
 
According to Gang of Four, the Iterator pattern's intent is to:

> Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

Basically what we want to do is abstract the traversal so we don't have to worry about it. The Iterator will provide us with a nice interface for getting the next object in our data structure, maintain state about how far we've already progressed in our traversal and tell us when we're done. Abstracting the traversal also makes it easier to change the actual traversal - like if you want to iterate over your data structure in reverse order.
 
Furthermore, encapsulating the traversal logic in an Iterator will often result in higher cohesion and lower coupling for client code. Higher cohesion because they can more clearly express their intent instead of worrying about iteration state and order - and lower coupling because they are not as tied to the actual implementation of the data structure being iterated. As a result, it is possible with Iterators to provide a uniform interface for traversing different data structures.
 
Iterators are also sometimes used as Generators, where they generate a series of values instead of actually iterating over an object structure. If implemented lazily, these can generate potentially infinite series like a never-ending stream of numbers or primes or whatever.
 
## How Does It Work In .NET?
 
One of the reasons we rarely think about the Iterator pattern is because it's so embedded into our languages. In the .NET world, an Iterator is actually called an Enumerator - and if we look in the framework documentation, we find an interface named `IEnumerator` that looks something like this (the generic version):
 
``` csharp
public interface IEnumerator<T>
{
	bool MoveNext();
	void Reset();
	T Current { get; }
}
```

This looks a lot like the abstraction described in the Gang of Four book. But how often do you actually see the `IEnumerator` interface in your code - not too often I bet. This is because the pattern is even more tightly integrated into the framework. Digging deeper, we find the `IEnumerable` interface which looks like this:

``` csharp
public interface IEnumerable<T>
{
	IEnumerator<T> GetEnumerator();
}
```

So any class that implements the `IEnumerable` interface is able to supply you with an Iterator. Lots of classes in the .NET framework implement `IEnumerable` - and a naive usage of it might look something like this:

``` csharp
void NaiveEnumeration()
{
	var list = new ArrayList<int> { 1, 2, 3, 4, 5 };
	
	var enumerator = list.GetEnumerator();
	while(enumerator.MoveNext()) 
	{
		var number = enumerator.Current;
		Console.WriteLine(number);
	}
}
```

But iteration is something we do often - and the pattern has even mandated its own keyword - `foreach` - so when you go like this:

``` csharp
void NormalEnumeration()
{
	var list = new ArrayList<int> { 1, 2, 3, 4, 5 };
	
	foreach(var number in list)
	{
		Console.WriteLine(number);
	}
}
```

You're actually using the `IEnumerable` and `IEnumerator` interfaces, you just don't see them. Simply put, foreach is really just syntactic sugar for the above construction - conceptually at least.

But this isn't all. Since C# 2.0, there has also been the [yield](http://msdn.microsoft.com/en-us/library/9k7k7cf0.aspx) keyword. Yield can be somewhat tricky to wrap your head around at first, but once you've used it a few times, you really appreciate the power of it. It provides a nice and clean way of implementing the Iterator pattern without worrying too much about managing state. It basically allows you to point out values have the framework create an Iterator for you. The reason it can be somewhat confusing is that it messes with the normal semantics of executing a method. Lets take an example:

``` csharp
IEnumerable<int> GetNumbers()
{
	var number = 1;
	while(true)
	{
		yield return number;
		number += 1;
	}
}
```

At first sight, this method looks kind of broken. Notice that the function returns an `IEnumerable` - that is: an object that provides an `IEnumerator`. The `IEnumerator` is created for us behind the scenes and whenever it encounters your `yield return` statement, it "freezes" your method and returns this value. When `MoveNext` is called the next time (explicitly or through a foreach loop), the code picks up exactly where it stopped last time - in this case adding 1 to number and yielding once again. Note that even though this code won't loop forever when creating the Iterator, a `foreach` statement using `GetNumbers` will - as expected.

There's also a `yield break` statement that you can use when implementing an Iterator with yield - it just returns nothing and stops the iteration, much like the `break` statement in a `for` loop.

## Variation Point (And More .NET)

As with most patterns, the Iterator has variation points. One of the variation points in the Iterator pattern is who controls the iteration. Gang of Four distinguishes between an **internal iterator** and an **external iterator**. 

With an external iterator the client of the iterator has the responsibility for advancing the iterator explicitly and to request the item that is being processed. The examples we saw above using the various constructs are all examples of external iterators.

An internal iterator on the other hand is more declarative, with an internal iterator, we actually don't see the iterator itself, but we provide an operation to be performed on the iterated elements. An example of this is the `ForEach` method defined on `List<T>`. This allows you to pass a delegate that is to be executed on each element in the list. In C# 3.0, using lambdas the above could look something like this:

``` csharp
void InternalEnumeration()
{
	var list = new ArrayList<int> { 1, 2, 3, 4, 5 };
	
	list.ForEach(number => Console.WriteLine(number));
}
```

In this case we no longer control the iterator and can't stop after 2 elements if that's what we wanted.

Considering LINQ in this light is left as an exercise to the reader.

## Conclusion

In this post I've given a short introduction to the Iterator pattern and shown how we use it every day without even thinking about it. But they can be used for much more than our every day scenario iterating over already made collections. And be sure to play around with the yield statement.
