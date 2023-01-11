---
layout: post
title: Env Reboot Diaries - The First Day
date: 2013-09-30 21:25:23
tags: [EnvReboot, Vim]
---

Today was the first day of my new job. I've always been a Windows user except for when using university computers - and my professional career has mainly consisted of .NET C# development. My new job is in a polyglot environment, the main language is Ruby - but there's also CoffeeScript and Clojure. I'll also be doing it on a Macbook Pro instead of my usual Windows machine. I thought it would be interesting to capture some of the thoughts as I go through learning a new OS and a new development stack.

## The Macbook Pro

I spent most of the day setting up my temporary machine and doing some research for the first feature I'm assisting on. I was curious about how I'd like the Macbook Pro. I haven't had much luck with Apple products in the past. I've owned both an iPhone and an iPad and ended up selling both, usually due being annoyed with too few configuration options. Regarding the Macbook Pro, I think I might survive it. It's a nice piece of hardware, to be sure. I like the crisp display and the feel of both keyboard and trackpad are very good. The keyboard layout (Danish) will definitely take some getting used to, but I'm hoping it won't be much worse than learning `fn` key combinations on any other new laptop these days.

Likes so far:

*   The virtual screens and navigating options are pleasant to work with. I've actually just been working on the Macbook without an external screen today. 
*   The terminal. Tab completion etc seems more natural than both `cmd` and PowerShell. Will have to look at term replacements though, obviously.
*   Stronger package management. I've been using `homebrew` and `homebrew-cask` to install stuff. Installing Spotify with `homebrew cask install spotify` is a winner in my book. This has improved a bit on the Windows side of things with [Chocolatey](http://chocolatey.org/) though.

Dislikes so far:

*   Having to enter my credit card information to install free apps from AppStore.
*   Also having to choose 3 security questions to install free apps - with crappy choices.
*   I'm not too keen on the dock yet either. But maybe it'll grow on me.

## Text Editor vs IDE

I've been addicted to perfecting IDE use for quite some time. Give me Visual Studio and ReSharper and I'll slice and dice C# code with my hands behind my back. Tools like ReSharper are huge boosters - not just for writing code, but also for molding existing code into new shapes and even more importantly, for navigating, reading and understanding code. And while I am a huge fan - I've also come to realize that these tools sometimes become a prison. Introducing new technology that depends on some new file type into the Microsoft world more or less requires Visual Studio integration. In my experience, developers will be very reluctant to adopt it (myself included), if it doesn't have Intellisense for instance.

So while I've considered starting out with Jetbrains' RubyMine, I've decided to try a text editor instead - at least for now. I actually thought I was going to pick Sublime Text, but in the end I decided to give vim a try. I've run through `vimtutor` tonight and plan to do it again tomorrow - and got a basic `.vimrc` config up and running. For now, I'm going to try and keep the number of plugins down - but have install [Vundle](https://github.com/gmarik/vundle) for managing plugins, the [solarized](https://github.com/altercation/vim-colors-solarized) theme and [vim-airline](https://github.com/bling/vim-airline) as an improved status bar.
