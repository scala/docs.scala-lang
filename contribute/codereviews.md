---
layout: page
title: Code Review Contributions
---
## Code Review Contributions

In addition to [bug fixing](./guide.html), you can help us review 
[waiting pull requests](#pull_requests_awaiting_comment). This is also a good (and recommended) way to get to know the feel of
the bug-fixing and submissions process before jumping in (lurk for a while,
reading pull requests from others and maybe commenting on them).

### Etiquette

[Code of Conduct Reminder](http://docs.scala-lang.org/conduct.html)

There are many coding approaches and styles. Asserting that yours is the only correct one is not likely to lead to a smooth interaction with others. Code review is where programmers (often volunteers) surrender up their efforts for public scrutiny.

Code reviewing is a great way to both learn and mentor, and *all* comments made during pull request reviews should bear those two aims in mind.

Assuming the pull request has been made following the guidelines laid out in the rest of the contributor documentation (e.g. for Scala bug fixes, the PR is against an open issue, and has adhered to the guidelines for code changes and submitting the PR), then the comments for the pull request are *not* the correct place to discuss on whether this PR is even needed or other broad, negative assertions. 

The comments are for looking for potential problems in the code, suggesting improvements, looking for items that might have been missed by the submitter and so on. If you feel it necessary to discuss whether the issue should even be addressed, that should be carried out ([in a professional manner](http://docs.scala-lang.org/conduct.html)) on the comments for that Issue rather than the PR. General discussions should likewise be directed to forums like [scala-debate](https://groups.google.com/d/forum/scala-debate), [scala-user](https://groups.google.com/d/forum/scala-user), [scala-language](https://groups.google.com/d/forum/scala-language) or [scala-internals](https://groups.google.com/d/forum/scala-internals). 

Conversely if you are receiving a review, consider that the advice is being given to make you, and Scala, better rather than as a negative critique. Assume the best, rather than the worst.
 
### Review Guidelines

* Keep comments on-topic, concise and precise.
* Attach comments to particular lines or regions they pertain to whenever possible.
* Short code examples are often more descriptive than prose.
* If (and only if) you have thoroughly reviewed the PR and thought through all angles, and you want to accept it, LGTM (Looks Good To Me) is the preferred acceptance response. If there are already LGTMs on the PR, consider whether you are adding anything or just being "me too".
* Above all, remember that the people you are reviewing might be reviewing your PRs one day too :-).

## Pull Requests Awaiting Comment

<div class="container">
<div class="row">
<div class="span4 doc-block">
<h4><a href="https://github.com/scala/scala/pulls">scala/scala</a></h4>
<p>Scala bug fixes and changes in the language, core libs and included tools.</p>
</div>
<div class="span4 doc-block">
<h4><a href="https://github.com/scala/scala.github.com/pulls">scala/github.scala.com</a></h4>
<p>Scala documentation site.</p>
</div>
</div>

<div class="row">
<div class="span4 doc-block">
<h4><a href="https://github.com/scala/scala-lang/pulls">scala/scala-lang</a></h4>
<p>The Scala language web site.</p>
</div>
<div class="span4 doc-block">
<h4><a href="https://github.com/scala">All Scala Github Projects</a></h4>
<p>For other PRs, follow the scala project from here.</p>
</div>
</div>
</div>

Also note that the [Tools contributions](./tools.html) page has more projects that will generate pull requests.