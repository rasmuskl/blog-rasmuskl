---
layout: post
title: "BlogEngine.NET, TinyMCE And SyntaxHighlighter"
date: 2008-10-21 19:55:00
tags: [BlogEngine]
---

I went through my few posts the other day to put some tags on them using BlogEngine.NETs administration page, but as I finished and went to see the end result, TinyMCE had stripped my syntax highlighting. 

Apparently this is a known issue and there's a fix to have TinyMCE allow pre html tags to keep their name attribute (needed for syntaxhighlighter). The fix can be found on Scott Dougherty's page [here](http://www.scottdougherty.com/blog/post/Adding-SyntaxHighlighter-to-BlogEngineNET.aspx).

Furthermore it seems that TinyMCE eats my indentation which is rather annoying. Scott's fix didn't solve this, so I'll have to either avoid online editing or find a fix for this as well.

If you know, please let me know.
