---
title: Sending HTTP requests with sttp
type: chapter
description: The introduction of the sttp library
num: 26
previous-page: upickle-what-else
next-page: sttp-send-request
---

sttp is a popular, hightly flexible and feature-rich library for making HTTP requests to web servers.

Out of the box, it provides a synchronous backend, an asynchronous, `Future`-base backend, and the WebSocket support.
It is pluggable with many extensions that enrich its core functionnalities with streaming, logging, telemetry, serialization, and more.
It operates well with uPickle for the JSON serialization and deserialization of requests and responses.

sttp has a unified API for all platforms: it can runs on the JVM, in the browser with Scala.js, and it can compile to native binaries with Scala Native.

One of the key benefits of sttp, compared to other HTTP client library, is its versatility.
Whether you're working on a synchronous script or a large-scale highly-concurrent application, sttp provides the same level of quality on a wide-range of features.
