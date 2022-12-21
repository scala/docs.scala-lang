---
title: How to read a JSON?
type: section
description: How to read a JSON with Scala Toolkit.
num: 20
previous-page: upickle-intro
next-page: 
---

{% include markdown.html path="_markdown/install-upickle.md" %}

## Reading JSONs without knowing its structure
If you want to just parse a JSON and access some of its field, you may just use a `ujson` library that is included with Toolkit. 
Function `ujson.read` allows you to read a JSON and access it afterwards. 
You can access the fields in the returned JSON object by just providing their names exactly as you would to a standard function.
Afterwards you have to declare what you expect to be inside the field, for example `str` extracts field's value as a `String`.
For example, code below prints out `Peter`.
```scala
val jsonString = """{"name": "Peter", "age": 13}"""
val json = ujson.read(jsonString)
println(json("name").str) // Prints out "Peter"
```
You can operate on arrays similarly, as in the example below.
```scala
val jsonString = """{"name": "Peter", "pets": ["Toolkitty", "Scaniel"]}"""
val json = ujson.read(jsonString)
val ownerName = json("name").str
val firstPet = json("pets")(0) .str
println(s"$ownerName has a pet called $firstPet")
```
You can traverse the JSON structure as deeply as you want, to extract the fields you require.

## Reading JSONs to a typed structure
To perform typed operations on JSONs, you can utilize a `upickle` Toolkit library. 
This approach has an advantage of additional safety and convenience of working with a structured data.
If you know that your JSON contains a set of fields, where each field's value is an array of numbers, 
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