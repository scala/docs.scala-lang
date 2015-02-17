---
layout: page
title: Documentation Contributions
---
## Contributing Documentation to the Scala project

There are several ways you can help out with the improvement of Scala documentation. These include:

* API Documentation in Scaladoc
* Code examples and tutorials in activator templates.
* The Scala Wiki
* Guides, Overviews, Tutorials, Cheat Sheets and more on the docs.scala-lang.org site
* Updating Documents on the Main Scala Language Site (this one)

Please read this page, and the pages linked from this one, fully before contributing documentation. Many of the questions you have will be answered in these resources. If you have a question that isn't answered, feel free to ask on the [scala-internals Google group](https://groups.google.com/forum/#!forum/scala-internals) and then, please, submit a pull request with updated documentation reflecting that answer.

**General requirements** for documentation submissions include spell-checking all written language, ensuring code samples compile and run correctly, correct grammar, and clean formatting/layout of the documentation. 

Thanks

### API Documentation (Scaladoc)

The Scala API documentation lives with the scala project source code. There are many ways you can help with improving Scaladoc, including:

* [Log issues for missing scaladoc documentation](./scala-standard-library-api-documentation.html#contribute-api-documentation-bug-reports) - 
Please *follow the issue submission process closely* to help prevent duplicate issues being created.
* [Claim Scaladoc Issues and Provide Documentation](./scala-standard-library-api-documentation.html) - please claim issues prior to working on a specific scaladoc task to prevent duplication of effort. If you sit on an issue for too long without submitting a pull request, it will revert back to unassigned and you will need to re-claim it.
* You can also just 
[submit new Scaladoc](./scala-standard-library-api-documentation.html) 
without creating an issue, but please look to see if there is an issue already submitted for your task and claim it if there is. If not, please post your intention to work on a specific scaladoc task on scala-internals so that people know what you are doing. 

### Examples/Tutorials in Activator Templates

[Typesafe Activator](https://typesafe.com/community/core-tools/activator-and-sbt) 
is a tool based on SBT, with a UI mode that is ideal for code based tutorials, overviews and walk-throughs. To contribute an example in activator, you can fork an existing template, edit it, add a tutorial, upload it to github and then submit the github project into the template repository. It's the fastest way to produce a working code example with tutorial.

Please see [Contributing an Activator Template](https://typesafe.com/activator/template/contribute) for more details.

### The Scala Wiki

The [Scala wiki](https://wiki.scala-lang.org/) could be a useful resource, but tends to get out of date quickly. It is perhaps best viewed as a place for information to temporarily live while it is constructed and refined, but with an aim to putting the material into the [docs.scala-lang.org](http://docs.scala-lang.org) site eventually (see the next section). Nonetheless, it is a fast way to add some public documentation.

The wiki is self documenting, so make sure to take a look at the [home page](https://wiki.scala-lang.org/) to get started. Please consider contributions to [docs.scala-lang.org](docs.scala-lang.org) for more enduring documentation, even though it is more work to get through the review process for the main doc site.

### The Main Scala Documentation Site

[docs.scala-lang.org](https://wiki.scala-lang.org/) houses the primary source of written, non-API documentation for Scala. It's a github project that you can fork and submit pull requests from. It includes:

* Overviews
* Tutorials
* Conversion Guides from Other Languages
* Cheat Sheets
* A Glossary
* The Scala Style Guide
* The Scala Language Specification
* SIP (Scala Improvement Process) Proposals
and more

Please read [contributing to the docs.scala-lang.org site](http://docs.scala-lang.org/contribute.html) through before embarking on changes. The site uses 
the [Jekyll](http://jekyllrb.com/) markdown engine so you will need to follow the instructions to get that running as well.

### The Scala Language Site

Additional high-level documentation (including documentation on contributing
to Scala and related projects) is provided on the main 
[Scala Language site](http://scala-lang.org), and is also kept in the 
[scala-lang github project](https://github.com/scala/scala-lang) which may be forked to create pull requests. 

Please read both the
[docs.scala-lang.org contribution](http://docs.scala-lang.org/contribute.html) document and the scala-lang.org github README file before embarking on any changes to the Scala language site, as it uses the same Jekyll markdown tool and many of the same conventions as the Scala documentation site.

