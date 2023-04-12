---
title: Testing with MUnit
type: chapter
description: The introduction of the MUnit library
num: 5
previous-page: intro-project
next-page: munit-write-tests
---

MUnit is a lightweight testing library that focuses on ease of use and flexibility. It provides a single testing syntax that help you get started quiclky, even if you are new to testing with Scala.

Testing is essential for any software development process because it helps catch bugs early, improves code quality and facilitates collaboration.

Despite its simplicity, MUnit contains all the most useful features for testing:
- assertions to verify the behavior of the program
- fixtures to ensure that the tests have access to all the necessary resources
- asynchronous support, for testing concurrent and distributed applications.

MUnit produces actionable error reports, with diff and source location, to help you quickly understand a test failure.

{% include markdown.html path="_markdown/install-munit.md" %}
