---
title: How to upload a file over HTTP?
type: section
description: Uploading a file over HTTP with sttp.
num: 28
previous-page: sttp-json
next-page: sttp-what-else
---

{% include markdown.html path="_markdown/install-sttp.md" %}


## Uploading a file

To upload a file, you can put a Java `Path` in the body of a request.

You can get a `Path` directly using `Paths.get("path/to/file")` or by converting an OS-Lib path to a Java path with `toNIO`.

{% tabs 'file' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client4.quick.*

val file: java.nio.file.Path = (os.pwd / "image.png").toNIO
val response = quickRequest.post(uri"https://example.com/").body(file).send()

println(response.code)
// prints: 200
```
{% endtab %}
{% endtabs %}

## Multi-part requests

If the web server can receive multiple files at once, you can use a multipart body, as follows:

{% tabs 'multipart' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client4.quick.*

val file1 = (os.pwd / "avatar1.png").toNIO
val file2 = (os.pwd / "avatar2.png").toNIO
val response = quickRequest
  .post(uri"https://example.com/")
  .multipartBody(
    multipartFile("avatar1.png", file1), 
    multipartFile("avatar2.png", file2)
  )
  .send()
```
{% endtab %}
{% endtabs %}

Learn more about multipart requests in the [sttp documention](https://sttp.softwaremill.com/en/latest/requests/multipart.html).
