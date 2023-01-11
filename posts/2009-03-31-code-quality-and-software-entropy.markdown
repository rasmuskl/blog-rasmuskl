---
layout: post
title: "Code Quality and Software Entropy"
date: 2009-03-31 22:05:06
tags: [Craftsmanship, Thoughts]
---
{% img right /post-images/WindowsLiveWriter/CodeQualityandYou_1284E/complexity_thumb.jpg %}

Code is an odd thing, it can be beautiful, ugly, horrible, elegant, it can smell - some people even compare code to poetry. If you are a developer, you will know that there are an almost infinite number of ways that you can write a piece of code with the same functionality. The way chosen will affect the different qualities that the code - and thus the program as a whole - will exhibit. These qualities are things like performance, testability, robustness, security, scalability etc.

However, when developers talk about code quality (at least when I do) the main focus is often maintainability and flexibility. From my point of view, any software project is always decaying, especially if you have multiple people working on it, hacks are made, designs are twisted into fulfilling new responsibilities that their original creator didn't foresee or intend. Even with a clean design and a focus on maintaining high quality, the amount of code is almost always increasing with new functionality, as is the programs complexity. This is sometimes known as software entropy - chaos. If this entropy is ignored over longer periods of time, the technical debt incurred will keep increasing until the interest is so high that the project will grind to a halt - creating new features takes a long time and introduces many new and interesting bugs.

Maintainability is important on most projects, it often depends on the complexity of the program and the expected lifetime - so if you are doing prototypes or mock-ups, focusing on maintainability may not be beneficial, although in my experience, when management sees a really cool prototype, they often feel like building a project on top of it. Most software projects will have a rather long lifetime, often with multiple versions and a need to maintain the project even after it has shipped.

Obtaining high code quality is a craft, it requires discipline and continuous refactoring and improvement. This will be the main topic of my blog for a while, save the random posts about ReSharper or other intriguing things that may come up. Topics within this field off the top of my head: Unit testing, design principles (SOLID and others), design patterns, understanding and taming dependencies, inversion of control containers, simplicity and many more - ideas are welcome.
