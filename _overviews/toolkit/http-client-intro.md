---
title: Sending HTTP requests with sttp
type: chapter
description: The introduction of the sttp library
num: 23
languages: [ru]
previous-page: json-what-else
next-page: http-client-request
---

sttp is a popular and feature-rich library for making HTTP requests to web servers.

It provides both a synchronous API and an asynchronous `Future`-based API. It also supports WebSockets.

Extensions are available that add capabilities such as streaming, logging, telemetry, and serialization.

sttp offers the same APIs on all platforms (JVM, Scala.js, and Scala Native).

sttp is a good choice for small synchronous scripts as well as large-scale, highly concurrent, asynchronous applications.

{% include markdown.html path="_markdown/install-sttp.md" %}
