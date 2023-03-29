---
title: How to upload a file over HTTP?
type: section
description: How to upload a file over HTTP request with Scala Toolkit.
num: 23
previous-page: sttp-request-body-custom
next-page: sttp-receive-json-body
---

{% include markdown.html path="_markdown/install-sttp.md" %}


## Making a request with a file
You can use either `File` or `Path` from the java standard library to send the file in the request. See [operating on paths](https://docs.oracle.com/javase/tutorial/essential/io/pathOps.html) to learn how to use them. 
After you have a `File` or `Path`, you can just put them in the request's body with `.body` function on `basicRequest`:
{% tabs 'file' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}
import java.nio.file.Path

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val requestFilePath = Path.of("image.png") // Path of the file you want to send
val request = basicRequest.post(uri"https://example.com/").body(requestFilePath) // Construct a POST request to upload the file to https://example.com/
val response = client.send(request) // Send the request and get the response
println(response.body) // Print the body of the response
```
{% endtab %}
{% endtabs %}

## Multi-part request
Many webservices can receive one or many files in a multipart body.
To achieve that with sttp, you can use the `multipartBody` method on the `basicRequest`.
{% tabs 'multipart' %}
{% tab 'Scala 2 and 3' %}
```scala
import sttp.client3._
import java.nio.file.Path

val file1 = Path.of("avatar1.png")
val file2 = Path.of("avatar2.png")
val request = basicRequest.multipartBody(Seq(
    multipart("avatar1.png", file1), 
    multipart("avatar2.png", file2)
))
```
{% endtab %}
{% endtabs %}

See more in the [sttp documention about multipart requests](https://sttp.softwaremill.com/en/latest/requests/multipart.html).