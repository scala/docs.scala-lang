---
title: Becoming a Scala OSS Contributor
num: 1

explore_resources:
  - title: Who can contribute?
    description: "Open source is for everyone! If you are reading this you are already a contributor..."
    icon: "fa fa-hand-sparkles"
    link: "#who-can-contribute-to-open-source"
  - title: Why should I contribute?
    description: "Giving back to the community has many benefits..."
    icon: "fa fa-circle-question"
    link: "#why-should-i-contribute-to-open-source"
  - title: How can I contribute?
    description: "From friendly documentation to coding a bug-fix, there is lots to do..."
    icon: "fa fa-clipboard-list"
    link: "#how-can-i-contribute-to-open-source"
  - title: Where should I contribute?
    description: "If you are already using OSS, or are curious about projects, you can begin right away..."
    icon: "fa fa-check-to-slot"
    link: "#how-do-i-choose-where-to-contribute"

compiler_resources:
  - title: "Join the Compiler Issue Spree"
    description: "A tri-weekly event where you can get mentored on the compiler. Register for participation here."
    icon: "fa fa-clipboard-user"
    link: https://airtable.com/app94nwzow5R6W1O6/pagvjIzxYnqTTlhwY/form
  - title: "Compiler Academy videos"
    description: "In-depth tours of the Scala 3 compiler's internals, aimed to help you get started."
    icon: "fa fa-circle-play"
    link: https://www.youtube.com/channel/UCIH0OgqE54-KEvYDg4LRhKQ
  - title: "Scala 3 contributing guide"
    description: "Guide to the Scala 3 Compiler and fixing an issue"
    icon: "fa fa-code-merge"
    link: https://nightly.scala-lang.org/docs/contributing/index.html

spree_resources:
  - title: "Scala open source sprees"
    description: "Learn about the next upcoming community spree"
    icon: "fa fa-hand-holding-heart"
    link: "https://github.com/scalacenter/sprees"
  - title: "Upcoming conferences"
    description: "See upcoming Scala conferences where you can meet open source maintainers."
    icon: "fa fa-calendar-check"
    link: "https://www.scala-lang.org/events/"

scala_resources:
  - title: Documentation
    description: "Library API docs, new guides on docs.scala-lang.org, and help with scala-lang.org."
    icon: fa fa-book
    link: /contribute/documentation.html
  - title: Bug fixes
    description: "Issues with the tools, core libraries and compiler. Also, you can help us by reporting bugs."
    icon: fa fa-bug
    link: /contribute/guide.html
  - title: Code Reviews
    description: "Review pull requests against scala/scala, scala/scala3, scala/scala-lang, scala/docs.scala-lang, and others."
    icon: fa fa-eye
    link: /contribute/codereviews.html
  - title: Core Libraries
    description: "Update and expand the capabilities of the core (and associated) Scala libraries."
    icon: fa fa-clipboard
    link: /contribute/corelibs.html
  - title: IDE and Build Tools
    description: "Enhance the Scala tools with features for build tools, IDE plug-ins and other related projects."
    icon: fa fa-terminal
    link: /contribute/tools.html
  - title: Compiler/Language
    description: "Larger language features and compiler enhancements including language specification and SIPs."
    icon: fa fa-cogs
    link: /contribute/guide.html#larger-changes-new-features

library_resources:
  - title: Library Authors Guide
    description: "Lists all the tools that library authors should setup to publish and document their libraries."
    icon: "fa fa-book"
    link: "/overviews/contributors/index.html"
  - title: Make Projects more Inclusive
    description: "How you can write code and documentation that welcomes all"
    icon: "fa fa-door-open"
    link: "inclusive-language-guide.html"
  - title: Create a Welcoming Community
    description: "Our code of conduct is practical agreement for a healthy community"
    icon: "fa fa-handshake-simple"
    link: "https://scala-lang.org/conduct"
  - title: Binary Compatibility Guide
    description: "Evolve your library over time, giving users the confidence to upgrade safely."
    icon: "fa fa-puzzle-piece"
    link: "/overviews/core/binary-compatibility-for-library-authors.html"
---

Welcome to the guide on contributing to all parts of Scala's open-source ecosystem!

## Newcomers' FAQ

If you are reading this page, we welcome you, regardless of your background, to begin contributing to Scala's
open-source ecosystem. We have answered some common questions for you below:

{% include inner-documentation-sections.html links=page.explore_resources %}

## Ways to start today

### Join the nearest open source spree

The [Scala Center](https://scala.epfl.ch) hosts open source sprees, colocated with other Scala events.
In the spree, regular project maintainers will mentor you to create your first contribution to the project.

{% include inner-documentation-sections.html links=page.spree_resources %}

### So you want to improve the Scala 3 compiler...

The [Scala 3 compiler](https://github.com/scala/scala3) is an open source project.
If you are curious about contributing but don't know how to begin, the [Scala Center](https://scala.epfl.ch)
runs the **Scala Compiler Academy** project to onboard and educate new people to the project. You can join the regular
**Compiler Issue Spree**, watch in-depth videos, and read the contributing guide:

{% include inner-documentation-sections.html links=page.compiler_resources %}

#### Which areas are perfect for newcomers?
- Adding new linting options, which help enforce cleaner code.
- Improving the clarity of error messages, so that the user understands better what went wrong.
- Add IDE quick-fix actions to error messages, e.g. PR [scala/scala3#18314](https://github.com/scala/scala3/pull/18314).

### So you want to write a library...

Read these guides if you are a maintainer of a library, or are thinking of starting a new project:

{% include inner-documentation-sections.html links=page.library_resources %}

### Want to improve Scala itself?
The Scala programming language is an open source project with a very
diverse community, where people from all over the world contribute their work,
with everyone benefiting from friendly help and advice, and
kindly helping others in return.

Read on to learn how to join the Scala community and help
everyone make things better.

## Contributing to the Scala project

**What Can I Do?**
That depends on what you want to contribute. Below are some getting started resources for different contribution domains. Please read all the documentation and follow all the links from the topic pages below before attempting to contribute, as many of the questions you have will already be answered.

### Reporting bugs

See our [bug reporting guide][bug-reporting-guide] to learn
how to efficiently report a bug.

### Contribute

Coordination of contribution efforts takes place on
[Scala Contributors](https://contributors.scala-lang.org/).

{% include inner-documentation-sections.html links=page.scala_resources %}

### Guidelines

When contributing, please follow:

* The [Scala Code of Conduct](https://scala-lang.org/conduct/)
* The [Inclusive Language Guide][inclusive-language-guide]

### Community tickets

All issues can be found in the [Scala bug tracker](https://github.com/scala/bug), or the [Scala 3 issue tracker](https://github.com/scala/scala3/issues). Most issues are labeled
to make it easier to find issues you are interested in.

### Tools and libraries

The Scala ecosystem includes a great many diverse open-source projects
with their own maintainers and community of contributors.  Helping out
one of these projects is another way to help Scala.  Consider lending
on a hand on a project you're already using.  Or, to find out about
other projects, see the
[Libraries and Tools section](https://scala-lang.org/community/#community-libraries-and-tools)
on our Community page.

### Scala community build

The Scala community build enables the Scala compiler team
to build and test a corpus of
Scala open source projects
against development versions of the Scala compiler and standard
library in order to discover regressions prior to releases.
The build uses Lightbend's
[dbuild](https://github.com/typesafehub/dbuild) tool,
which leverages [sbt](https://www.scala-sbt.org).

If you're the maintainer -- or just an interested user! -- of an
open-source Scala library or tool, please visit the
[community build documentation](https://github.com/scala/community-build/wiki)
for guidelines on what projects are suitable for the community build
and how projects can be added.

## Your questions, answered

{% capture backButton %}
<p>
  <a href="#newcomers-faq">
    <i class="fa-solid fa-angle-up"></i>
    <span> return to FAQ</span>
  </a>
</p>
{% endcapture %}

### Who can contribute to open source?
{{backButton}}
- **Everyone:** No matter your skills or background, non-technical or otherwise, there is always
  [some way](#how-can-i-contribute-to-open-source) you can contribute to a project.
- **Community organisers:** Communities often form around open source projects, perhaps you would like to help grow a
  community.
- **Scala learners:** If you are at the start of your Scala journey, once you have a basic understanding of everyday
  Scala programming, becoming familiar with open source code will show you new techniques, helping you to improve
  your expertise.
- **Got a cool idea?** Perhaps you have gained confidence in your skills and are looking to give back to the community,
  start a new project that fills that perfect niche, or maybe is the life-changing tool everyone never knew they needed.

### Why should I contribute to open source?
{{backButton}}
- **The world is built on OSS:**
  Open Source Software (OSS) libraries are the flesh on top of the bone structure of the core language itself.
  They power vast majority of the commercial and non-commercial projects out there alike.
- **Become more visible:**
  Contributing is a great way to strengthen your CV. It's also good from the community standpoint: if you do it
  consistently, with time, you get to know people, and people get to know you. Such a networking can lead to all
  sorts of opportunities.
- **Learn by doing something practical:** Contributing to open source libraries is a great way to learn Scala.
  A standard practice in open source software is code review – which means you are going to get expert feedback
  about your code. Learning together with feedback from competent people is much faster than making all the
  mistakes and figuring them out alone.
- **Have fun and help out:** Finally, by contributing you improve the projects you are using yourself. Being a part of
  a maintainer team can be a source of personal satisfaction, and working on an innovative library can be a lot of fun.

The above benefits are something good to achieve regardless of your level of experience.

### How can I contribute to open source?
{{backButton}}
- **Documentation:** Often it is outdated, incomplete, or with mistakes. If you see a way to improve the
  documentation for a project you are using, you should consider if the project is accepting contributions,
  in which case you can submit a pull request to include your changes.
- **Building community:** All projects have users, and users come together to form communities. Managing and growing
  communities takes coordination and effort.
- **Issue minimization:** Many of the reported issues found on a project's issue tracker are hard to reproduce and the
  reproduction involves a lot of code. However, it is very frequently the case that only a tiny fraction of the
  reported setup and code is necessary to reproduce the issue. More reproduction code means more work for the
  maintainer to fix an issue. You can help them considerably by investigating already reported issues in an attempt
  to make their reproduction as small as possible.
- **Issue reproduction:** Some reported issues lack reproduction instructions at all! If a maintainer can't
  reproduce it, they won't be able to fix it. Pinning down exact conditions that make an issue manifest is another
  way to contribute.
- **Fixing a bug:** If you are comfortable with reproducing an issue, perhaps you would like to trace its
  origin in code, and even try to build a solution that prevents the issue from occurring.
- **Adding a feature:** Sometimes projects maintain lists of planned or requested features, and you could assist
  in bringing those ideas to reality. Although please beware - you should only do this if the core maintainers
  have already approved the idea for the feature, they are not obligated to accept your additions!
- **Feel free to ask for help:** While implementing or fixing the feature, it is important to ask for help early
  when you feel stuck. Even if your code doesn't work, don't hesitate to submit a pull request while stating clearly
  that you need help. More information about the guidelines of good contribution you can find in the
  [talk by Seth Tisue](https://youtu.be/DTUpSTrnI-0) on how to be a good contributor.
- **Open-source your own project:** Do you have a pet project you are working on? Is there anything you're working
  on at work parts of which are generic enough that you can share them online? Open-sourcing your work is a way to
  solve a problem for other programmers who may also have it. If you are interested in going open-source, the
  [Library Author's Guide](https://docs.scala-lang.org/overviews/contributors/index.html) is an
  excellent resource on how to get started.

### How do I choose where to contribute?
{{backButton}}
- **Ask yourself, what am I using?** The best project to contribute to is the one that you are using yourself.
  Take an inventory of your work and hobby projects: what OSS libraries do they use? Have you ever encountered bugs in
  them? Or have you ever wanted a certain feature implemented? Pick a bug and a feature and commit to fixing or
  implementing it. Clone the project you are trying to improve, figure out how the tests are written and run there.
  Write a test for your feature or bug.
- **Try out an awesome library:** [Scaladex](https://index.scala-lang.org/awesome) is a great place to find new
  libraries. If you are passionate about contributing but don't see any attractive opportunities to contribute
  to projects you are already using, try learning a new Scala library, push it to its limits and see where it can
  be improved. For best results, spend a lot of time with the library to get a feel of what's important
  and what can improve.
- **Lookout for announcements:** You may want to keep an eye on the Scala Center
  [LinkedIn](https://www.linkedin.com/company/scala-center/) and [Bluesky](https://bsky.app/profile/scala-lang.org) or [X](https://x.com/scala_lang) to stay up-to-date with the possible contribution opportunities. For example, every year, the Scala Center participates
  in the Google Summer of Code program where you are paid to work on open source Scala projects over the course
  of summer.
{{backButton}}



[bug-reporting-guide]: {% link _overviews/contribute/bug-reporting-guide.md %}
[inclusive-language-guide]: {% link _overviews/contribute/inclusive-language-guide.md %}
