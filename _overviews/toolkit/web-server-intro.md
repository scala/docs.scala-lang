---
title: Building web servers with Cask
type: chapter
description: The introduction of the Cask library
num: 30
previous-page: http-client-what-else
next-page: web-server-static
---

Cask is an HTTP micro-framework, providing a simple and flexible way to build web applications.

Its main focus is on the ease of use, which makes it ideal for newcomers, at cost of eschewing some features other
frameworks provide, like asynchronicity.

To define an endpoint it's enough to annotate a function with an appropriate annotation, specifying the request path.
Cask allows for building the response manually using tools the Cask library provides, specifying the content, headers,
status code etc. An endpoint function can also just return a string, [uPickle](https://com-lihaoyi.github.io/upickle/) JSON type, or a [Scalatags](https://com-lihaoyi.github.io/scalatags/)
template and Cask will automatically create a response, setting all the necessary headers.

Cask comes bundled with uPickle library for handling JSONs, supports WebSockets and allows for extending endpoints with
decorators, which can be used to handle authentication or rate limiting.

{% include markdown.html path="_markdown/install-cask.md" %}
