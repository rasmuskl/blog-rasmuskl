---
layout: post
title: "ReSharper Series - Part 2: Basic Navigation"
date: 2009-01-27 22:42:46
tags: [ReSharper]
---

At part 2 of the [ReSharper series](/2009/01/10/resharper-series/), we will attempt to enable more "no mouse survival". We will take a look at navigating between files without using the mouse. This is also a great chance to mention that not all the stuff you will see here is exclusive ReSharper stuff, some times I will throw in some Visual Studio shortcuts - the essence is to increase productivity - not religiously using one product for everything. In addition I have been using the combination for so long that I am often confused what is what.
 
## Opening Files
 
ReSharper offers many ways of navigating between files based on what you need - and we are going to look at a few basic ones today. 
 
The first one is called Go to Type and is activated through **Ctrl+T**[IntelliJ: **Ctrl+N**]. This will bring up the window shown below. Basically it's a quick search in all your classes.
 
{% img /post-images/WindowsLiveWriter/ReSharperEventDay2_A25E/image_thumb_4.png %} 
 
Most often, navigating types is what you want, but sometimes it can be useful to navigate files instead, especially for configuration files, NHibernate mappings and other special files. ReSharper has a Go to File shortcut that brings up the following window - **Ctrl+Shift+T** [IntelliJ: **Ctrl+Shift+N**]:
 
{% img /post-images/WindowsLiveWriter/ReSharperEventDay2_A25E/image_thumb.png %} 
 
Both of the search windows allow * wildcards, like in the below search where I wanted to find all the files that contain the word "Base":
 
{% img /post-images/WindowsLiveWriter/ReSharperEventDay2_A25E/image_thumb_1.png %} 
 
They also allow the use of the + wildcard to denote one or more characters...
 
{% img /post-images/WindowsLiveWriter/ReSharperEventDay2_A25E/image_thumb_5.png %}
 
... and the ? wildcard to denote zero or one character: 
 
{% img /post-images/WindowsLiveWriter/ReSharperEventDay2_A25E/image_thumb_6.png %} 
 
## Closing Files
 
Closing tabs in the visual studio editor is as easy as pressing **Ctrl+F4**. Not a ReSharper shortcut - but nice to know.
 
## Accessing the Solution Explorer
 
While ReSharper gives us a nice way of opening files by name, it can still be useful to bring out the good ol' Solution Explorer once in a while. There's two shortcuts for this. There is a standard Visual Studio shortcut which will bring up the Solution Explorer tool - **Alt+Ctrl+L**. This will open the tool in it's current configuration - like you left it. 
 
Lets imagine that I am browsing the MVC source - standing in the ControllerBase file in the System.Web.Mvc project. In my Solution Explorer I browse to the MvcFutures project to see something. After leaving the Solution Explorer, pressing **Alt+Ctrl+L** will bring me to my last location again:
 
{% img /post-images/WindowsLiveWriter/ReSharperEventDay2_A25E/image_thumb_2.png %} 
 
However ReSharper also has a shortcut for bringing up the Solution Explorer - it is called Locate in Solution Explorer -** Alt+Shift+L**. Using this in the previous situation will actually track the current file and open the Solution Explorer with this file highlighted, as shown below:
 
{% img /post-images/WindowsLiveWriter/ReSharperEventDay2_A25E/image_thumb_3.png %} 
 
I actually find both shortcuts useful in different situations - but play around with it and see what works for you. 
 
## Escaping Tools
 
Another quick Visual Studio tip - the Solution Explorer and other tools you might activate while coding are easy to deactivate again with a quick **Esc**. This will bring the focus back to the code editor.
