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
The function can either return a `cask.Response`, specifying the content, headers, status code etc., `String`, in which case 
the result will be sent as `text/plain`, uJson JSON type or a Scalatags template.

Cask comes bundled with uPickle library for handling JSONs, supports WebSockets and allows for extending endpoints with
decorators, which can be used to handle authentication or rate limiting.

{% include markdown.html path="_markdown/install-cask.md" %}
