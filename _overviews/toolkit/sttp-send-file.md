---
title: How to upload a file over HTTP request?
type: section
description: How to upload a file over HTTP request with Scala Toolkit.
num: 18
previous-page: sttp-request-body-custom
next-page:
---

{% include markdown.html path="_markdown/install-sttp.md" %}


## Making a request with a file
You can use either `File` or `Path` from the java standard library to send the file in the request. See [operating on paths](https://docs.oracle.com/javase/tutorial/essential/io/pathOps.html) to learn how to use them. After you have a `File` or `Path`, you can just put them in the request's body with `.body` function on `basicRequest`:
```scala
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}
import java.nio.file.Path

val client = SimpleHttpClient() // Create the instance of SimpleHttpClient
val requestFilePath = Path.of("image.png") // Path for the file you want to send
val request = basicRequest.post(uri"https://example.com/").body(requestBody) // Construct post request to the service - https://example.com/
val response = client.send(request) // send the request and get the response
println(response.body) // print the body of the response
```
## Multi-part request
Web services often require sending file in the `multipart body`. It also allows upload multiple named files at once. To achieve that with sttp, you can use `.multipartBody` function on `basicRequest`.
```scala
import sttp.client3._
import java.nio.file.Path

val file1 = Path.of("avatar1.png")
val file2 = Path.of("avatar2.png")
val request = basicRequest.multipartBody(Seq(
    multipart("avatar1.png", file1), 
    multipart("avatar2.png", file2)
))
// ... send the request as before
```

See more in the [sttp documention about multipart requests](https://sttp.softwaremill.com/en/latest/requests/multipart.html).