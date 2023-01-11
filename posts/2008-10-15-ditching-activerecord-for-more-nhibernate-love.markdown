---
layout: post
title: "Ditching ActiveRecord For More NHibernate Love"
date: 2008-10-15 22:19:00
comments: true
categories: [NHibernate, C#, ActiveRecord]
---

## Introduction

I had a project using an old version of [Castle ActiveRecord](http://www.castleproject.org/activerecord/index.html) and [NHibernate](http://www.hibernate.org/343.html) 1.2. Lately there's been a lot of interesting projects surrounding NHibernate and I've been wanting to make the switch away from the old version of ActiveRecord. 

ActiveRecord is a thin layer on top of NHibernate that makes it easier to use and configure, especially through configuration using attributes on classes and properties (hence the [ActiveRecord](http://en.wikipedia.org/wiki/Active_record_pattern) name as seen in Ruby on Rails). However unless you build all the tools yourself, it can be quite the dependency hell to play around with all the new NHibernate toys. So I wanted to eradicate ActiveRecord from my reference list and upgrade NHibernate from 1.2. So I thought I'd share my experiences and some of the useful links I found along the way.

## Fluent NHibernate

One of the new things I wanted to try out for NHibernate was [Fluent NHibernate](http://code.google.com/p/fluent-nhibernate/), a refreshing new way of doing configuration using a fluent interface in C#. NHibernate is usually configured through XML files that look something like this: 

{% codeblock lang:xml %}
<?xml version="1.0" encoding="utf-16"?>
<hibernate-mapping  auto-import="true" default-lazy="false" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:nhibernate-mapping-2.2">
  <class name="Model.Survey, Model" table="Surveys">
    <id name="Id" access="property" column="Id" type="System.Guid" unsaved-value="00000000-0000-0000-0000-000000000000">
      <generator class="assigned">
      </generator>
    </id>
    <property name="Name" access="property" type="String">
      <column name="Name"/>
    </property>
    <property name="Label" access="property" type="String">
      <column name="Label"/>
    </property>
    <property name="HeaderFile" access="property" type="String">
      <column name="HeaderFile"/>
    </property>
    <property name="FooterFile" access="property" type="String">
      <column name="FooterFile"/>
    </property>
  </class>
</hibernate-mapping>
{% endcodeblock %}

Actually I don't mind XML files that much, except that they are cumbersome to write. But moving to code has it's merits. First of all you get the static type checking from the compiler, which is nice for avoiding spelling mistakes and such. Secondly, having your mapping directly in code makes it refactor-friendly. Renaming properties will automagically propagate to your mapping and reduce strange errors. However, unless you specify column names for your mapping, you might end up refactoring your database indirectly (depending on how you manage your schema), so keep that in mind. Third of all I like the clarity and readability of the configuration:

{% codeblock lang:csharp %}
public class SurveyMap : ClassMap<Survey>
{
    public SurveyMap()
    {
        WithTable("Surveys");

        Id(x => x.Id).GeneratedBy.Assigned();

        Map(x => x.Name);
        Map(x => x.Label);
        Map(x => x.HeaderFile);
        Map(x => x.FooterFile);
    }
}
{% endcodeblock %}

Notice the clever use of lambdas and expressions to avoid strings. Nice indeed. The Fluent NHibernate package also includes a some "framework" classes to ease the testing of your database mappings, as outlined in this [post](http://codebetter.com/blogs/jeremy.miller/archive/2008/06/18/working-faster-and-fewer-mapping-errors-with-nhibernate.aspx) by [Jeremy Miller](http://codebetter.com/blogs/jeremy.miller/default.aspx).

## LINQ to NHibernate

I haven't had much time to try LINQ yet, so getting my NHibernate upgraded meant a chance to try out [LINQ to NHibernate](http://www.hookedonlinq.com/LINQToNHibernate.ashx). Actually LINQ to NHibernate is scheduled for NHibernate 2.1, which is not out yet, but [Daniel Guenter](http://slagd.com/) has created a backport for NHibernate 2.0. Playing around with it was a pleasant change from writing SQL or HQL in in strings. I haven't spend that much time on expanding the use of `IQueryable<T>` into my application yet, but I did convert my repositories so they use LINQ now. I really want to experiment more with this and I think I'll draw some inspiration from this [post](http://skarpt.dk/blog/?p=16) by [Søren Skovsbøll](http://skarpt.dk/blog/) on his repository layout.

## Gotchas

I ran into a few issues when doing the actual conversion.

As my focus was to upgrade my version of NHibernate, I didn't want to convert all my mappings to Fluent NHibernate from the beginning, so I wanted to generate the XML mapping files from my ActiveRecord configuration and then use these as my basis for going fluent later. However, I was using an InPlaceConfiguration with ActiveRecord which is really just a glorified dictionary of properties for setting up connection strings and such instead of an XML file or a web.config section. ActiveRecord Configurations have a Debug property which will output the XML mapping files for you, but unfortunately this property was read-only in my old version of ActiveRecord. I actually checked and it seems to be fixed in the ActiveRecord trunk. So I converted my InPlaceConfiguration into an XML file and enabled debug to get my mappings.


There was some breaking changes in NHibernate 2.0, as outlined in this [list](http://ayende.com/Blog/archive/2008/03/31/NHibernate-2.0-Alpha-is-out.aspx) by Ayende. The only one I ran into was that configuration values no longer were prefixed with "hibernate". This threw me off with some peculiar errors at first until I found the list.

The last thing I ran into was actually a feature from ActiveRecord that I use on application startup called `VerifyModelsAgainstDBSchema`. What this does is to verify that the database schema has the necessary table and columns to fit your mapping. Since the application is question is designed to be very drop-able in terms of throwing it into a web directory and starting it up, I've included functionality to create the database if needed. Luckily, this feature is implementing using very little code. If using LINQ to NHibernate, it can be done as easy as:

{% codeblock lang:csharp %}
try
{
    var query = (from o in Session.Linq<Object>()
                 where 1 == 0
                 select o);
    query.ToList();
    IsDBInitialized = true;
}
catch (ADOException ex)
{
    _dbExceptions.Add(ex);
}
{% endcodeblock %}

The trick (as far as I understand) is that NHibernate supports polymorphism in query engine, so by querying for objects of type Object, you're actually grabbing all the tables in your mapping and thus checking the consistency - since the SQL statement will fail on invalid table and/or column names. By adding the always `false` statement `1 == 0`, you make sure that you don't actually pull anything from the database. Clever.

## Conclusion

In this post I described my 8-hour hike from an ancient version of ActiveRecord to NHibernate 2.0. It was actually very smooth and the problems were easily solved. I'm really looking forward to working more with these new exciting technologies. Enjoy.