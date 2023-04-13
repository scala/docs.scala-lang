---
title: Scalafix
type: section
description: This page describes how to use Scalafix with Dotty.
num: 25
previous-page: ides-tools-mill
next-page:
---

# Working with Scalafix

First, create a new rule as follows (command from [scalacenter](https://scalacenter.github.io/scalafix/docs/developers/setup.html)):

```bash
sbt new scalacenter/scalafix.g8 --repo="Repository Name"
```

To run the rule against some codebase:

```bash
scalafix -r file:scalafix/rules/src/main/scala/fix/YourRule.scala your/code/base/
```

Where `YourRule.scala` is the rule you developed and `your/code/base` is the code base you are running the rule against.