---
layout: multipage-overview
title: Overview

discourse: true

partof: jdk-compatibility
overview-name: JDK Compatibility

num: 1
permalink: /overviews/jdk-compatibility/:title.html
---

Scala runs primarily on the Java Virtual Machine (JVM). As Scala and the JVM improve independently over time, Scala drops compatibility with older versions of the Java Developer Kit (JDK) in order to focus development efforts on supporting new JVM features that benefit Scala.

This table shows the first Scala release in each series that functions on each JDK.

| JDK version | First Scala release supporting JDK version per series |
|:-----------:|:-----------------------------------------------------|
| 9           | 2.12.4, 2.11.12                                      |
| 8           | 2.12.0, 2.11.0, 2.10.7                               |
| 7           | 2.11.0, 2.10.0                                       |
| 6           | 2.10.0                                               |

Note that JDK 9 support requires minimum sbt version 1.1.0, or 0.13.17 in the 0.13.x series.
