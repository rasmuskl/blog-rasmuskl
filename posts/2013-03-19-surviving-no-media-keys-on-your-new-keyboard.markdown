---
layout: post
title: Surviving no media keys on your new keyboard
date: 2013-03-19 19:41:42
tags: [AutoHotKey, Tips]
---

I've recently acquired a new keyboard, after using my trusty old Logitech for many years. I've come to rely on my media keys and the volume wheel for controlling Spotify or other apps. 

My solution is to use [AutoHotKey](http://www.autohotkey.com) to bind the following combinations after a short conversation with [Mark](http://www.improve.dk) (although we don't entirely agree on the layout):

- Win + Numpad 4 - Previous track
- Win + Numpad 5 - Play / pause
- Win + Numpad 6 - Next track
- Win + Numpad 8 - Volume up
- Win + Numpad 2 - Volume down
- Win + Numpad 7 - Mute

Here's the script to add to AHK:

``` autohotkey
#Numpad4::Send {Media_Prev}
#Numpad5::Send {Media_Play_Pause}
#Numpad6::Send {Media_Next}
#Numpad2::Send {Volume_Down}
#Numpad7::Send {Volume_Mute}
#Numpad8::Send {Volume_Up}
```

... and on a final semi-unrelated note, I'll recommend my new mechanical keyboard - [Das Keyboard S Ultimate Silent](http://www.daskeyboard.com/model-s-ultimate-silent/). It's far from silent - but it's an awesome keyboard. The keys have a very nice feel as you're typing along and the keyboard itself is rather heavy (almost 2kg) and thus stay completely in place when typing.

{% img center /post-images/mechanical_keyboard_hero.jpg %}
