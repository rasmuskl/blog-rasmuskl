---
layout: post
title: "Simple ASP.NET MVC Beta AJAX with jQuery!"
date: 2008-11-05 21:23:19
comments: true
tags: [ASP.NET MVC, C#]
---
## Introduction
 
[ASP.NET MVC](http://www.asp.net/mvc/) is all the rage these days - and after Microsoft [announced](http://weblogs.asp.net/scottgu/archive/2008/09/28/jquery-and-microsoft.aspx) their partnership with the great folks over at [jQuery](http://www.jquery.com) and started shipping it - I knew I had to explore the whole AJAX experience again. I've still not played too much with the MVC framework, but I am working on switching a few projects over from WebForms - and I must say that the experience is quite different. So I've set out to do the smallest (simple) demo possible of ASP.NET MVC AJAX with jQuery - just to get (and give you) the flavor of it.
 
## The Story
 
I did play around with the [Microsoft AJAX Library](http://www.asp.net/ajax/) earlier, but found it too heavy-weight and never really liked the concept of UpdatePanels. It just seemed like too much server-side cruft and coupled with the rather complex WebForm lifecycle, it just didn't seem worth it. I must admit that this is a while ago and I haven't reinvestigated, but I doubt it has the grace and simplicity of jQuery. So I've been using jQuery since forever for various client-side snippets, but never really played around with the AJAX bits since it seemed kind of cumbersome with WebForms.
 
## Lets Get Started
 
Okay, so I grabbed the beta bits from the ASP.NET MVC and installed them on my machine and fired up a new ASP.NET MVC site:
 
{% img /post-images/WindowsLiveWriter/ASP.NETMVCBetajQuery_15027/image_thumb.png %} 
 
The solution now already contains a "Scripts" folder that contains Microsoft AJAX and jQuery. Continued to head into the Site.Master masterpage in Views/Shared to add jQuery. Now I'd caught the glimpse of blog posts mentioning intellisense for jQuery and found this [post](http://blogs.msdn.com/webdevtools/archive/2008/10/28/rich-intellisense-for-jquery.aspx) describing how to grab the vsdoc version of jQuery from the jQuery site and plug it in.
 
{% img /post-images/WindowsLiveWriter/ASP.NETMVCBetajQuery_15027/image_thumb_1.png %} 
 
Since this was just going to be a demo site, I decided to just use the documented version directly, but this proved to be a bad idea. I encountered a few different runtime JavaScript errors while using this version, more specifically related to the ajaxStart event function. The solution apparently involves a masterpage with the following added to the head section:

``` csharp
<% if (false) { %>
<script type="text/javascript" src="../../Scripts/jquery-1.2.6-vsdoc.js"></script>
<% } %>
<script type="text/javascript" src="../../Scripts/jquery-1.2.6.min.js"></script>
```

The trick here is that Visual Studio will see the vsdoc version and grab documentation from there, but it will never actually load on your pages. As described in the before mentioned post, this will be fixed and in the future it should be enough to reference the original jQuery file and have the vsdoc version present. I also found that the intellisense was kind of flaky (not showing up) sometimes in nested functions, hopefully this will be fixed as well.

Next I grabbed the Index.aspx view in Views/Home and cleared out all the contents of the Content PlaceHolder and added a bit of HTML:

``` html
<div>
    <input type="text" id="name" />
    <a href="#" id="link">Click me!</a>
    <div id="result" style="margin-top: 15px"></div>
</div>
```

This is just plain and simple HTML, with a "void" link that doesn't go anywhere. It looks like this:

{% img /post-images/WindowsLiveWriter/ASP.NETMVCBetajQuery_15027/image_thumb_2.png %} 

Now one of the great forces about jQuery is it's power to hook into the DOM using powerful selectors. This means that you can have your JavaScript almost completely separated from your HTML. I've often had several small jQuery files that would completely change the appearance of a page and add all kinds of fancy if they were included. This also makes it very easy to enable / disable effects and even test your page degradation for users who have JavaScript disabled (just remove your script reference). However, for simplicity, I've just included my jQuery directly in a script tag:

``` html
<script type="text/javascript">
    $(document).ready(function() {
        // Register a click handler on our link
        $("#link").click(function() {
            // Perform a get with a callback of updateResult
            $.get("/Home/AjaxHtml", getName(), updateResult, "html");
        });
        // Extract name from textbox as associative array (JSON)
        function getName() {
            return { name: $("#name").val() };
        }
        // Append HTML to the result div
        function updateResult(html) {
            $("#result").append(html);
        }
    });
</script>
```

Now I decided not to start doing JavaScript templating and return lots of JSON data. Instead I'm just going to pull a normal HTML page from the HomeController and append the data to the result div. Most of the magic is in the click function which registers a handler to grab the defined page /Home/AjaxHtml with the name entered in the textbox as parameter and to execute the updateResult function when the data comes back. After this it was time to add the action to the HomeController: 

``` csharp
public ActionResult AjaxHtml(string name)
{
    Thread.Sleep(3000);
    return View("AjaxHtml", new { Name=name, Time=DateTime.Now });
}
```

Rather simple really. Just sleeps for a few seconds (to allow me to see the load on my local dev machine) and then renders a new view called AjaxHtml with a simple Dictionary containing the passed argument name and the current time as ViewModel. I also added a new View called AjaxHtml:

``` csharp
<%@ Page Language="C#" AutoEventWireup="true" 
 CodeBehind="AjaxHtml.aspx.cs" 
 Inherits="MvcAjaxTest.Views.Home.AjaxHtml" %>
Ajax Call: <%= ViewData.Model %><br />
```

The only thing to note about this is that I didn't use my normal masterpage for this page - since I'm only interested in passing this little tidbit of HTML back - not my entire page layout. Launching the application again, typing a name and hitting the link produces the following without a full page reload:

{% img /post-images/WindowsLiveWriter/ASP.NETMVCBetajQuery_15027/image_thumb_3.png %} 

Additional clicks append further AJAX lines like so:

{% img /post-images/WindowsLiveWriter/ASP.NETMVCBetajQuery_15027/image_thumb_4.png %} 

Obviously this could have been some other information posted - but this little sample contains both information from client-side (the name) and some data appended by the server (the timestamp).

## Load Indicator

Now, after doing all this, it didn't feel so impressive to click the link and wait for 3 seconds for another line of text to appear, so the obvious solution is to add some extra effects - and it's not like it's real AJAX [tm] if it ain't got a cool load indicator. So off I went to the kind people at [ajaxload.info](http://www.ajaxload.info/) where you can customize your own animated gif load indicator. I went with the shape called "Snake" with a nice blue MVC template-like color.

Adding the load indicator was a breeze really. I just threw the load indicator in an invisible image after the link:

``` html
<div>
    <input type="text" id="name" />
    <a href="#" id="link">Click me!</a>
    <img id="loading" style="visibility: hidden" 
      src="../../Content/small-ajax.gif" />
    <div id="result" style="margin-top: 15px"></div>
</div>
```

Note that I used the CSS style visibility: hidden instead of using display: none. Both work, but when using display: none, the space for the image is not reserved on the page, which caused a small annoying "jump" effect on my page as the load indicator appeared (and was a few pixels taller than the link text). With the visibility style, space is actually reserved for the image and the line doesn't jump.

All we have left is hooking the load indicator onto jQuerys AJAX call - for a simple scenario like this, the global AJAX events called ajaxStart and ajaxStop are just what we need. ajaxStart will run whenever an AJAX request is started and ajaxStop will run whenever one ends. So at the end of my script block (after the updateResult function), I added the following:

``` js
$("#loading").ajaxStart(function() { $(this).css("visibility", "visible"); });
$("#loading").ajaxStop(function() { $(this).css("visibility", "hidden"); });
```

If we had used display: none instead, we could have used the jQuery functions show() and hide() instead of the whole CSS stunt, but I like this better. Firing up the browser and hitting the link now produces enough eye candy to distract my eyes from the 3 second wait:

{% img /post-images/WindowsLiveWriter/ASP.NETMVCBetajQuery_15027/image_thumb_5.png %}

## Resources

Now this is definitely only a beginning. You'd want to do some proper error handling and probably some more advanced scenarios.
If you want to find more information on ASP.NET MVC, you definitely want to go read / subscribe to some of these blogs: [ScottGu](http://weblogs.asp.net/Scottgu/), [Phil Haack](http://haacked.com/), [Rob Conery](http://blog.wekeroad.com/) (especially the Storefront series), [Stephen Walther](http://weblogs.asp.net/StephenWalther/) and many more.
As for more jQuery, there's been a storm of posts about this lately, which should be easy to find, but for documentation, nothing beats the plain ol' jQuery [documentation](http://docs.jquery.com/) or a personal favorite of mine for quick access: [visual jQuery](http://visualjquery.com/), a jQuery-optimized version of the jQuery docs. 

## Conclusion

In this post I gave a quick introduction to the world of AJAX using jQuery with ASP.NET MVC. I really enjoy the model and simplicity. It just feels right - and finally I have control over my HTML. Hope it was useful for you as well. 
