---
layout: post
title: "ReSharper Series - Part 5: Generating Code"
date: 2009-03-04 21:55:59
tags: [ReSharper]
---

Welcome to the 5th part of my [ReSharper Series](/2009/01/10/resharper-series/) - in this post we are going to take a look at how you can easily generate a lot of the fluff code that surrounds your real functionality.
 
While C# is a great language, there is a quite of bit of the code that you write every day that feels somewhat crufty. It is these standard things that we do a thousand times, like writing constructors, properties, backing fields to said properties (better with automatic properties - but you still often need a backing field). Luckily, ReSharper can help ease your pain - or at least let you focus on writing that core functionality - and not worry about the cost of adding another class (in terms of typing).
 
## Generating Class Members
 
We have already the power of **Alt+Enter** in one of the [earlier posts](/2009/01/21/resharper-series-part-1-the-power-of-alt-enter/) - and this a tool that most people I have seen use for creating new code. It can do stuff like implementing missing methods and assigning creating backing fields for you from constructor arguments. If we use it on our balance argument that is unused (gray), ReSharper offers the following options:
 
{% img /post-images/WindowsLiveWriter/ReSharperSeriesPart5_127BE/image_thumb.png %} 
 
However, we might want more - we had to write the constructor ourselves - and we have to create the property afterwards. Let's introduce another shortcut - **Alt+Ins**. While **Alt+Enter** is a general purpose tool, **Alt+Ins** is focused on generating code. Use it anywhere in a class and you will be presented with the following options:
 
{% img /post-images/WindowsLiveWriter/ReSharperSeriesPart5_127BE/image_thumb_1.png %} 
 
Generating a **constructor** will bring up a dialog allowing you to select which members / properties you want to initialize from the constructor. **Read-only properties** / **Properties** will give quick options to create read-only properties from whatever backing fields you already have in your class. **Implementing missing members** will create any members not yet implemented from interfaces or abstract base classes. **Equality members** will implement Equals and the equality operators - `GetHashCode` included, based on the properties / fields you choose. **Formatting members** will introduce a `ToString` method that contains the values of whatever properties / fields you want.
 
The last one I didn't mention is the one I think is mostly underused - it is the **Delegating members** option. It is often useful in object oriented design to encapsulate another class and provide delegated methods for a number of the contained type's methods. The perfect example is when implementing the decorator pattern - this pattern, by design, requires you to delegate all the methods the contained type. This is a pain to do by hand. However, let's try using the delegating members option in my Account class, after adding a `List<int>` - like so:
 
{% img /post-images/WindowsLiveWriter/ReSharperSeriesPart5_127BE/image_thumb_3.png %} 
 
This brings up the following dialog:
 
{% img /post-images/WindowsLiveWriter/ReSharperSeriesPart5_127BE/image_thumb_4.png %} 
 
So basically, ReSharper lets me pick and choose any or all methods / properties that I want to directly delegate. For this class, maybe I need the Add and indexer methods, so I check them off and hit finish:
 
{% img /post-images/WindowsLiveWriter/ReSharperSeriesPart5_127BE/image_thumb_5.png %} 
 
The code for delegating members is silly simple - and this is EXACTLY why we want to generate it in the first place. Generating delegating members let me focus on my intent of which options I want to expose from my class instead of the laborious task of typing out the code.
 
## Generating Files
 
As a final note in this post, I would like to introduce another usage of **Alt+Ins** which I have grown quite fond of - in the solution explorer, pressing the shortcut will allow you to add new files in a more lightweight way than the usual add file dialog:
 
{% img /post-images/WindowsLiveWriter/ReSharperSeriesPart5_127BE/image_thumb_6.png %} 
 
Later, when we look at live templates, we will also see how to add your own file templates to this menu.
