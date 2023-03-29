---
title: How to write a JSON?
type: section
description: How to write a JSON with Scala Toolkit.
num: 24
previous-page: upickle-read-json-typed
next-page: upickle-modify-jsons
---

{% include markdown.html path="_markdown/install-upickle.md" %}

## Writing values to JSONs in Scala Toolkit
In Scala Toolkit, you can use `write` operation from `upickle` library to write Scala primitive and collection types to json.
It also allows you to write your own data types to json.
When you want to, for example, convert a list from `String` to `Int` to JSON, you can use the `write` method without any preparation:

{% tabs 'array' %}
{% tab 'Scala 2 and 3' %}
```scala
import upickle.default._
val json = write(
   Map(
      "Toolkitty" -> 3
      "Scaniel"   -> 5
   )
   println(json) 
   // outputs {"Toolkitty":3,"Scaniel":5}
)
```
{% endtab %}
{% endtabs %}
The same operation works for List, other collections and primitive types. But be cautious! 
This approach works only when the types are the same in the whole collection. 
You could not output a Map with key `name` pointing to `String`, and  key `pets` pointing to `List[String]`.
To do that, we need to define our own data type.

## Writing your own data types to JSON
In Scala, you can use a `case class` to define your own data type. For example, if you wanted to represent a Person with names of its pets, you could do it as follows:
```scala
case class PetOwner(name: String, pets: List[String])
```
After defining this `case class`, you can write a JSON containing its fields. But first, you need to provide an instance of `ReadWriter` that will tell the library
how to handle this type. Luckily, `upickle` is able to fully automate that and all have to do is to write this:
{% tabs 'given' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
implicit val ownerRw: ReadWriter[PetOwner] = macroRW
```
`implicit` keyword may appear strange at first, but it just says that this value may be used later transparently in your code by some functions that need a `ReadWriter[PetOwner]`. 
{% endtab %}
{% tab 'Scala 3' %}
```scala
case class PetOwner(name: String, pets: List[String]) derives ReadWriter
```
`derives` keyword will automatically provide the `ReadWriter[PetOwner]` in current scope. This value may be used later transparently in your code by some functions that need a `ReadWriter[PetOwner]`. 
{% endtab %}
{% endtabs %}
As long as this value is available, you will be able to write value that conforms to the type of a `PetOwner` to a JSON.
After this declaration, you can put everything together and write a JSON as you inteded to:
{% tabs 'full' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import upickle.default._

case class PetOwner(name: String, pets: List[String])
implicit val ownerRw: ReadWriter[PetOwner] = macroRW
val petOwner = PetOwner("Peter", List("Toolkitty", "Scaniel"))
val json: String = write[PetOwner](petOwner)
println(json) 
// Prints "{"name":"Peter","pets":["Toolkitty","Scaniel"]}"
``` 
{% endtab %}
{% tab 'Scala 3' %}
```scala
import upickle.default._

case class PetOwner(name: String, pets: List[String]) derives ReadWriter
val petOwner = PetOwner("Peter", List("Toolkitty", "Scaniel"))
val json: String = write[PetOwner](petOwner)
println(json) 
// Prints "{"name":"Peter","pets":["Toolkitty","Scaniel"]}"
``` 
{% endtab %}
{% endtabs %}


