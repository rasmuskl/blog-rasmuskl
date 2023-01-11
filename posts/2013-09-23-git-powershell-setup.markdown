---
layout: post
title: My Git + PowerShell setup for .NET development
date: 2013-09-23 23:16:51
tags: [Git, PowerShell, Tips]
---

{% img right /post-images/git.png %}

I've been using git for a couple of years and thought I would document my setup. Git's linux heritage shows and while it's not many tools that I use via a shell, it's actually a real breeze. So I've mainly been using it through PowerShell.

## Git

I run the plain [Git for Windows](http://msysgit.github.io/) installation.

My only comment for the installation is that I usually choose the option (not default) to use checkout-as-is, commit-as-is for line endings. I mainly work with .NET projects and prefer to keep my Windows line endings in the repository to avoid any problems.

### .gitattributes

The line endings configuration can give problems in a mixed team - and recently I've been using a `.gitattributes` file in the root of my repositories with the following content:

```
* -text
```

This will instruct git to not mess with any line endings in the repository across the team, regardless of the installation options, which is nice as long as you don't have a mix of platforms.


### .gitignore

I usually build my `.gitignore` file as needed - I always do `git status` before committing, so it's been quite a while since something has slipped by. My minimal `.gitignore` will usually look something like this:

```
bin
obj
*.csproj.user
*.suo
packages
```

Generally I prefer to use NuGet for all possible dependencies and avoid checking the binary files in to keep the overall repository size down.

### posh-git

I use posh-git to get a bit of contextual information about my repository and some nice tab completion.

{% img /wp-content/uploads/2013-09-23-20_29_45-poshgit-test-project-master.png %}

posh-git is rather simple to install by following the instructions in the main [repository](https://github.com/dahlbyk/posh-git).

### gitk

Working in a shell environment is fine for many of the every day operations, sometimes a bit of GUI can be nice to get an overview. Git includes `gitk` which while a bit basic usually works just fine. I usually launch it with `gitk --all` to see all branches.

{% img /wp-content/uploads/2013-09-23-21_27_26-gitk_-alphalaunch.png %}

If you want a more advanced GUI for Git, you can either download [SourceTree](http://www.sourcetreeapp.com/) from Atlassian or [GitHub for Windows](http://windows.github.com/).


## PowerShell

My PowerShell setup mainly consists of my profile, which is loaded when PowerShell starts. On my system it's found under:

```
C:\Users\Rasmus\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
```

You can however access it through PowerShell using `$PROFILE` variable. So you can easily edit it with:

```
notepad $PROFILE
```

After you've made changes to your profile, you'll have to reload it into the current PowerShell session with:

```
. $PROFILE
```

My full PowerShell profile is available in this [gist](https://gist.github.com/rasmuskl/3786798).

### General purpose aliases

I have two aliases set up that I use often, but are not entirely Git related. First off I have `np`:

```
set-alias -name np -value "C:\Program Files\Sublime Text 3\sublime_text.exe"
```

This is just always set up to open my current text editor whenever it's [Sublime Text](http://www.sublimetext.com/) or [Notepad++](http://notepad-plus-plus.org/) and used to do quick edits.

My other alias is `vsh`, which is just short for "Visual Studio here". What it'll do is to search recursively from the current folder and open the first solution it encounters. It'll give you a quick standard way to open your solution from the root of a repository where you generally want your shell most of the time anyway.

```
function vsh() {
  Write-Output "Opening first solution..."
    $sln = (dir -in *.sln -r | Select -first 1)
    Write-Output "Found $($sln.FullName)"
    Invoke-Item $sln.FullName
}
```

{% img /wp-content/uploads/2013-09-23-21_06_03-poshgit-alphalaunch-master.png %}

### Git aliases

I have two main aliases for interacting with Git, namely `ga` and `gco`.

My alias for adding everything to the staging area is `ga`. For a long time I'd use `git add .` usually and then `git add -A` whenever I also had deletes - but I'm happy with `ga` now. As a bonus it also does a `git status` so I'm forced to review what the heck I'm doing.

``` powershell
function ga() {
  Write-Output "Staging all changes..."
    git add -A
    git status
}
```

After staging files I have to commit obviously. I got a bit annoyed with typing `git add -m "blah"` all the time and came up with `gco`. Besides being shorter, it has 2 little twists:

- If you add `-a` or `-amend` it'll do a `git commit --amend` for overwriting the last commit. Useful for fixing typoes or unsaved files that didn't make it into the commit.
- Under most circumstances you can leave out the surrounding quotes and it'll work just fine. So you can write `gco message` instead of `gco "message"`. If you're using special chars like apostrophes in your messages however, you still have to add the quotes.

``` powershell
function gco() {
  param([switch]$amend, [switch]$a)

    $argstr = $args -join ' '
    $message = '"', $argstr, '"' -join ''

    if ($amend -or $a) {
      Write-Output "Amending previous commit with message: $message"
        git commit -m $message --amend
    } else {
      Write-Output "Committing with message: $args"
        git commit -m $message
    }
}
```

I also have a `gca` alias, which is basically `gco -a` - but I don't use it often. You can grab it from the [profile gist](https://gist.github.com/rasmuskl/3786798).
