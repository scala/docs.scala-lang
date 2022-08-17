---
title: Becoming a Scala OSS Contributor
num: 1

explore_resources:
  - title: Who Can Contribute?
    description: "Open source is for everyone! If you are reading this you are already a contributor..."
    icon: "fa fa-hand-sparkles"
    link: "#who-can-contribute-to-open-source"
  - title: Why Should I Contribute?
    description: "Giving back to the community has many benefits..."
    icon: "fa fa-circle-question"
    link: "#why-should-i-contribute-to-open-source"
  - title: How Can I Contribute?
    description: "From friendly documentation to coding a bug-fix, there is lots to do..."
    icon: "fa fa-clipboard-list"
    link: "#how-can-i-contribute-to-open-source"
  - title: Where Should I Contribute?
    description: "If you are already using OSS, or are curious about projects, you can begin right away..."
    icon: "fa fa-check-to-slot"
    link: "#how-do-i-choose-where-to-contribute"

contrib_resources:
  - title: "Scala 3 Contributing Guide"
    description: "Guide to the Scala 3 Compiler and fixing an issue"
    icon: "fa fa-code-merge"
    link: /scala3/guides/contribution/contribution-intro.html
  - title: "Scala 2 Hackers Guide"
    description: "Guide to the Scala 3 Compiler and fixing an issue"
    icon: "fa fa-code-pull-request"
    link: /scala3/guides/contribution/contribution-intro.html

library_resources:
  - title: Library Authors Guide
    description: "Lists all the tools that library authors should setup to publish and document their libraries."
    icon: "fa fa-book"
    link: "/overviews/contributors/index.html"
  - title: Make Projects more Inclusive
    description: "How you can write code and documentation that welcomes all"
    icon: "fa fa-door-open"
    link: "inclusive-language-guide.html"
  - title: Binary Compatability Guide
    description: "Evolve your library over time, giving users the confidence to upgrade safely."
    icon: "fa fa-puzzle-piece"
    link: "/overviews/core/binary-compatibility-for-library-authors.html"
---

Welcome to the guide on contributing to all parts of Scala's open-source ecosystem!

## Newcomers' FAQ

If you are reading this page, we welcome you, regardless of your background, to begin contributing to Scala's
open-source ecosystem. Find out more by clicking the links:

{% include inner-documentation-sections.html links=page.explore_resources %}

## Ways to Start Today

### So You Want To Write A Library...

Read these guides if you are a maintainer of a library, or are thinking of starting a new project:

{% include inner-documentation-sections.html links=page.library_resources %}

### Scala Project

There is also an option to contribute to the Scala 3 compiler itself. The Scala Center runs the
Compiler Academy project to onboard and educate new people in the Scala 3 compiler. One of the Compiler Academy
projects is an Issue Spree – an event that takes place every 3 weeks where people fix Scala 3 compiler issues
in pair programming sessions while learning the compiler together. You can apply for the Spree participation
by [filling the form](https://forms.gle/DfoSuHFm3T6MA3L59).

{% include inner-documentation-sections.html links=page.contrib_resources %}

## Your Questions, Answered

{% capture backButton %}
<p>
  <a href="#newcomers-faq">
    <i class="fa-solid fa-angle-left"></i>
    <span> back</span>
  </a>
</p>
{% endcapture %}

### Who Can Contribute To Open Source?
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
{{backButton}}

### Why Should I Contribute to Open Source?
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
{{backButton}}

### How Can I Contribute to Open Source?
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
{{backButton}}

### How Do I Choose Where To Contribute?
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
  [LinkedIn](https://www.linkedin.com/company/scala-center/) and [Twitter](https://twitter.com/scala_lang) to stay up-to-date with the possible contribution opportunities. For example, every year, the Scala Center participates
  in the Google Summer of Code program where you are paid to work on open source Scala projects over the course
  of summer.
{{backButton}}
