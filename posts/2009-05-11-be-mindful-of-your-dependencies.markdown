---
layout: post
title: "Be Mindful Of Your Dependencies"
date: 2009-05-11 20:35:55
tags: [Craftsmanship, Thoughts, Principles]
---

Dependencies are everywhere in your code, you cannot avoid them, without dependencies, your software would make no sense, it is the interaction and collaboration between the software entities that create the program. Now this statement doesn't mean that we should not worry about our dependencies - we just can't remove them completely. But as with almost any other aspect of good software development, we should be mindful of our dependencies.

## Coupling
When a software entity depends on another, they are said to be coupled. Coupling ranges in degrees from totally decoupled over loosely coupled to tightly coupled. The tighter two software entities are coupled, the bigger risk that when one changes, the other will be forced to change as well. Why is this important? Because coupling is transitive (if A depends on B and B depends on C, A indirectly depends on C) and we would like to be able to change our program in the future. If you have a program where all components depend on each other and the coupling is high, a small change will often ripple through the system - either a) forcing you to change a bigger part of the system (potentially creating more ripples) or b) breaking the system in unexpected places. If not treated properly, these ripples can cause developers to loose confidence in their changes (what will I break this time?) and slow development down - maybe even to a halt.

## Cohesion
Cohesion describes how related the responsibilities within a component are, how focused it is. This relates to the functionality within the component - a static utility class will often have rather low cohesion. But it also relates to the level of abstraction used within the component - again, a class that does both very high level operations and very low level operations will often have very low cohesion. Code with low cohesion will often be harder to understand, since it doing many different things. It will often be easier to reuse a component with high cohesion, since it will be more focused on doing a single task.

## Managing Dependencies
So how do we manage dependencies? As mentioned, we can't get rid of them - but we can choose to decouple our software components from each other - and we can work to increase the cohesion of our components. Looking into the [Gang of Four book](http://www.amazon.com/Design-Patterns-Object-Oriented-Addison-Wesley-Professional/dp/0201633612), some basic advice is available:

- Program to an interface, not an implementation.
- Favor composition over inheritance.

## Interfaces
Decoupling often involves programming to an interface instead of an implementation. Interfaces can help us break our dependency chains - looking at the example from before: If A depends on B and B depends on C - we can break the dependency chain by making an interface IB of B. Now A depends on IB instead. Interfaces, when used properly, can be seen as concepts and are thus more "stable" than an actual implementation. It is a contract that describes a set of properties for some object to fulfill. If you were to build a tall tower, would you prefer to have the core of the tower made of stable building blocks or instable ones? 
 
Having an interface also allows us to tweak other things, such as the granularity of access - the size of the surface on which A is dependant. If we reduce the size of the interface and thus the dependency, A's usage of B will be easier to control - and new concrete classes based on IB will probably be easier to implement and have higher cohesion too.

## Composition
Another factor that can help us reduce coupling is to favor composition over inheritance. I like the analogy from the Gang of Four book where they talk about inheritance as white-box reuse, while composition is black-box reuse. What this means is that a sub-class will often be tightly coupled to the internals of the parent. In languages like C# and Java, single inheritance limits your options even further, once you start inheriting - and languages with multiple inheritance often suffer from other [problems](http://en.wikipedia.org/wiki/Diamond_problem).
 
Composition on the other hand, is all about creating small units of focused behavior and then "weaving" this behavior into the desired functionality. With composition, different components are free to vary independent of each other - whereas this might cause combinatorial explosions in inheritance trees.
 
This is not to say that inheritance is not useful, but it is often overused - composition is often a little harder to grasp at first (I know it took me a while), but it is a really powerful technique.

## Conclusion
In this post I have discussed some of the basics about managing dependencies. It is on a reasonably low level, but will be the basis for some of my next posts on design principles and design patterns - since many of them build upon exactly this.
