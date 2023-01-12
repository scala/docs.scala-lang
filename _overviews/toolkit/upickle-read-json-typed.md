---
title: How to read a JSON to typed structure?
type: section
description: How to read a JSON to typed structure with Scala Toolkit
num: 21
previous-page: upickle-read-json
next-page: upickle-write-json
---

{% include markdown.html path="_markdown/install-upickle.md" %}

In Scala Toolkit, it is possible to read a JSON and values inside of it in two ways:
 - First one offers everything you need to quickly extract data from a JSON, without requiring any specific structure. 
 This approach is described in the [How to read a JSON]({% link _overviews/toolkit/upickle-read-json.md %}) tutorial. Visit it if you want a simple and fast way to read JSONs.
 - The second approach one allows you to work with the json in a fully typed code, and even to provide your custom data structures. 
 This approach is described in this tutorial. It is more well-suited when you plan on reusing, storing and operating on the structures loaded from jsons.

## Reading JSONs to a typed structure
To perform typed operations on JSONs, you can utilize a `upickle` Toolkit library. 
This approach has an advantage of additional safety and convenience of working with the structured data.
As an example - if you know that your JSON contains a set of fields, where each field's value is an array of numbers, 
you can use the `read[Map[String, List[Int]]](json)` function that will return a map of this exact type.
You can see an example of that below
```scala
import upickle.default._
val jsonString = """{"primes": [2, 3, 5], "evens": [2, 4, 6]} """
val map = read[Map[String, List[Int]]](jsonString)
val primes = map("primes")
println(primes.head) // Prints 2
```

### Reading JSONs of your own data types
In Scala, you can use a `case class` to define your own data type. For example, if you wanted to represent a Person with names of its pets, you could do it as follows:
```scala
case class PetOwner(name: String, pets: List[String])
```
After defining this `case class`, you can read a JSON containing its fields. But first, you need to provide an instance of `ReadWriter` that will tell the library
how to handle this type. Luckily, `upickle` is able to fully automate that and all have to do is:
```scala
given ReadWriter[PetOwner] = macroRW
```
`given` keyword may appear strange at first, but it just says that this value may be used later transparently in your code by some functions that needs a `ReadWriter[PetOwner]`. 
You don't need to think about it for too long, that's the only thing you need to do - as long as this value is available, you will be able to read a JSON that conforms to the type of a `PetOwner`.
The second part of this definition, `macroRW`, automates everything that needs to be done to provide this mechanism capable of reading these JSONs.
After this declaration, you can put everything together and read a JSON as you inteded to:
```scala
import upickle.default._

case class PetOwner(name: String, pets: List[String])
given ReadWriter[PetOwner] = macroRW
val jsonString = """{"name": "Peter", "pets": ["Toolkitty", "Scaniel"]}"""
val petOwner: PetOwner = read[PetOwner](jsonString)
val ownerName = petOwner.name
val ownerFirstAnimal = petOwner.pets.head
println(s"$ownerName has a pet called $ownerFirstAnimal") 
// Prints "Peter has a pet called Toolkitty
``` 

### Providing ReadWriter in the companion object

If you want to have the `ReadWriter[PetOwner]` always available with the `PetOwner`, no matter where in your project you are, you can use a Scala's feature called `companion objects`.
Next to the `PetOwner` case class, you need to put an `object` that is called the same - `object PetOwner`. In that object, you can put the `given` ReadWriter.
After you do that, the `ReadWriter` will be always available alongside the `PetOwner` case class.
```scala
object PetOwner:
   given ReadWriter[PetOwner] = macroRW
```
