---
layout: page
title: Using git
---

This is a step-by-step guide on how to use [git](http://git-scm.com/) and [github](http://github.com/) if you want to contribute to the Scala project. If you are new to git, make yourself familiar first. We recommend the [Git Pro]()http://git-scm.com/book/en/) online book.

### Signup

First create an account on [github](http://github.com/). You can also use your existing account, of course.

### Fork

Now, go to [https://github.com/scala/scala]() and click the "Fork" button at the top of the page.

![image](images/fork.png)

If everything went okay, you will be redirected to your own fork at `https://github.com/username/scala`, where `username` is your github user name. Make sure you read [http://help.github.com/fork-a-repo/](), which covers some of the things that will follow below.

### Clone

Clone your repository. Run the following on the command line:

    $ git clone https://github.com/username/scala

This will create a local directory called `scala`, which contains a clone of the remote repository. 

### Branch

Before you start making changes, always create your own branch. Never work on the `master` branch. Think of a name that describes the changes you plan on doing. Use a prefix that describes the nature of your change. There are essentially two kinds of changes: bug fixes and new features.

  - For bug fixes, use `issue/NNNN` for bug NNNN from the [Scala issue tracker](https://issues.scala-lang.org/). 
  - For a new feature use `topic/XXX` for feature XXX. 
  
Use feature names that make sense in the context of the whole Scala project and not just to you personally. For example, if you work on diagrams in Scaladoc, use `topic/scaldoc-diagrams` instead of just `topic/diagrams`.
  
For your initial contribution, try work on something manageable (TODO: link to the subproject overview page).

Now, it's time to create your branch. Run the following on the command line

    $ git checkout -b topic/XXX
    
If you are new to git and branching, please read the [Branching Chapter](http://git-scm.com/book/en/Git-Branching) in the Git Pro book.

### Change

Now, you are ready to make changes ot the code base. The [Git Basics](http://git-scm.com/book/en/Git-Basics) chapter in the Git online book covers most of the basic workflow during this stage.

TODO: refer to other development stuff, partest and so on.

### Sync and Rebase

Before you can submit your patch, make sure that your commit structure is clean. We won't accept pull requests for bug fixes that have more than one commit. For features, it is okay to have several commits, but all tests need to pass after every single commit. To clean up your commit structure, you want to [rewrite history](http://git-scm.com/book/en/Git-Branching-Rebasing) using `git rebase` so your commits are against the latest revision of `master`.

Occassionally, you also want to sync with `master` so you don't fall behind too much. Otherwise, creating a clean pull request can become a lot of work. It is often a good idea to use `git rebase` instead of `git merge` to stay on top of `master` and keep a linear commit structure (TODO: do we actually REQUIRE this???). Read more about this approach [here](http://git-scm.com/book/en/Git-Branching-Rebasing).

### Push

For now, you might have committed your changes only locally (or maybe you have pushed your changes already to your fork on github because you want others to see it). Once you are satisfied with your work, synced with `master` and cleaned up your commits you are ready to submit a patch to the central Scala repository. First, make sure you have pushed all of your local changes to your fork on github.

    $ git push username
    # This pushes all of your local branches to your fork on github.
    
Again, `username` stands for your github user name.

### Submit pull request

Now it's time to send your changes to the Scala project for review. To do so, you ask for your changes to be pulled into the main repository by submitting a pull request. Go to your own Scala project page at `https://github.com/username/scala` and switch to the branch that contains your changes.

![image](images/switchbranch.png)

Then click on the "Pull Request" button at the top.

![image](images/pullrequest.png)

The github help page at [http://help.github.com/send-pull-requests/]() covers sending pull requests in more detail. Make sure you submit your request against the right branch. Strictly follow our [Pull Request policy](https://github.com/scala/scala/wiki/Pull-Request-Policy).

A pull request is rarely accepted right away, so don't be depressed if the reviewer of your pull request will reject it or asks you to make additional changes before your request can be eventually accepted into the main repository. 
