---
title: Packaging and Imports
type: chapter
description: A discussion of using packages and imports to organize your code, build related modules of code, control scope, and help prevent namespace collisions.
languages: [ru, zh-cn]
num: 36
previous-page: fun-summary
next-page: collections-intro
---


Scala uses *packages* to create namespaces that let you modularize programs and help prevent namespace collisions.
Scala supports the package-naming style used by Java, and also the “curly brace” namespace notation used by languages like C++ and C#.

The Scala approach to importing members is also similar to Java, and more flexible.
With Scala you can:

- Import packages, classes, objects, traits, and methods
- Place import statements anywhere
- Hide and rename members when you import them

These features are demonstrated in the following examples.

## Creating a package

Packages are created by declaring one or more package names at the top of a Scala file.
For example, when your domain name is _acme.com_ and you’re working in the _model_ package of an application named _myapp_, your package declaration looks like this:

{% tabs packaging-imports-1 %}
{% tab 'Scala 2 and 3' %}
```scala
package com.acme.myapp.model

class Person ...
```
{% endtab %}
{% endtabs %}

By convention, package names should be all lower case, and the formal naming convention is *\<top-level-domain>.\<domain-name>.\<project-name>.\<module-name>*.

Although it’s not required, package names typically follow directory structure names, so if you follow this convention, a `Person` class in this project will be found in a *MyApp/src/main/scala/com/acme/myapp/model/Person.scala* file.

### Using multiple packages in the same file

The syntax shown above applies to the entire source file: all the definitions in the file
`Person.scala` belong to package `com.acme.myapp.model`, according to the package clause
at the beginning of the file.

Alternatively, it is possible to write package clauses that apply only to the definitions
they contain:

{% tabs packaging-imports-0 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
package users {

  package administrators {  // the full name of this package is users.administrators
    class AdminUser        // the full name of this class users.administrators.AdminUser
  }
  package normalusers {     // the full name of this package is users.normalusers
    class NormalUser       // the full name of this class is users.normalusers.NormalUser
  }
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
package users:

  package administrators:  // the full name of this package is users.administrators
    class AdminUser        // the full name of this class is users.administrators.AdminUser

  package normalusers:     // the full name of this package is users.normalusers
    class NormalUser       // the full name of this class is users.normalusers.NormalUser
```
{% endtab %}
{% endtabs %}

Note that the package names are followed by a colon, and that the definitions within
a package are indented.

The advantages of this approach are that it allows for package nesting, and provides more obvious control of scope and encapsulation, especially within the same file.

## Import statements, Part 1

Import statements are used to access entities in other packages.
Import statements fall into two main categories:

- Importing classes, traits, objects, functions, and methods
- Importing `given` clauses

If you’re used to a language like Java, the first class of import statements is similar to what Java uses, with a slightly different syntax that allows for more flexibility.
These examples demonstrate some of that flexibility:

{% tabs packaging-imports-2 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import users._                            // import everything from the `users` package
import users.User                         // import only the `User` class
import users.{User, UserPreferences}      // import only two selected members
import users.{UserPreferences => UPrefs}  // rename a member as you import it
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-2 %}

```scala
import users.*                            // import everything from the `users` package
import users.User                         // import only the `User` class
import users.{User, UserPreferences}      // import only two selected members
import users.{UserPreferences as UPrefs}  // rename a member as you import it
```

{% endtab %}
{% endtabs %}

Those examples are meant to give you a taste of how the first class of `import` statements work.
They’re explained more in the subsections that follow.

Import statements are also used to import `given` instances into scope.
Those are discussed at the end of this chapter.

A note before moving on:

> Import clauses are not required for accessing members of the same package.

### Importing one or more members

In Scala you can import one member from a package like this:

{% tabs packaging-imports-3 %}
{% tab 'Scala 2 and 3' %}
```scala
import scala.concurrent.Future
```
{% endtab %}
{% endtabs %}

and multiple members like this:

{% tabs packaging-imports-4 %}
{% tab 'Scala 2 and 3' %}
```scala
import scala.concurrent.Future
import scala.concurrent.Promise
import scala.concurrent.blocking
```
{% endtab %}
{% endtabs %}

When importing multiple members, you can import them more concisely like this:

{% tabs packaging-imports-5 %}
{% tab 'Scala 2 and 3' %}
```scala
import scala.concurrent.{Future, Promise, blocking}
```
{% endtab %}
{% endtabs %}

When you want to import everything from the *scala.concurrent* package, use this syntax:

{% tabs packaging-imports-6 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import scala.concurrent._
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-6 %}

```scala
import scala.concurrent.*
```

{% endtab %}
{% endtabs %}

### Renaming members on import

Sometimes it can help to rename entities when you import them to avoid name collisions.
For instance, if you want to use the Scala `List` class and also the *java.util.List* class at the same time, you can rename the *java.util.List* class when you import it:

{% tabs packaging-imports-7 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.util.{List => JavaList}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-7 %}

```scala
import java.util.{List as JavaList}
```
{% endtab %}
{% endtabs %}

Now you use the name `JavaList` to refer to that class, and use `List` to refer to the Scala list class.

You can also rename multiple members at one time using this syntax:

{% tabs packaging-imports-8 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.util.{Date => JDate, HashMap => JHashMap, _}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-8 %}

```scala
import java.util.{Date as JDate, HashMap as JHashMap, *}
```

{% endtab %}
{% endtabs %}

That line of code says, “Rename the `Date` and `HashMap` classes as shown, and import everything else in the _java.util_ package without renaming any other members.”

### Hiding members on import

You can also *hide* members during the import process.
This `import` statement hides the *java.util.Random* class, while importing everything else in the *java.util* package:

{% tabs packaging-imports-9 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.util.{Random => _, _}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-9 %}

```scala
import java.util.{Random as _, *}
```
{% endtab %}
{% endtabs %}

If you try to access the `Random` class it won’t work, but you can access all other members from that package:

{% tabs packaging-imports-10 %}
{% tab 'Scala 2 and 3' %}
```scala
val r = new Random   // won’t compile
new ArrayList        // works
```
{% endtab %}
{% endtabs %}

#### Hiding multiple members

To hide multiple members during the import process, list them before using the final wildcard import:

{% tabs packaging-imports-11 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.util.{List => _, Map => _, Set => _, _}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-11 %}

```scala
scala> import java.util.{List as _, Map as _, Set as _, *}
```
{% endtab %}
{% endtabs %}

Once again those classes are hidden, but you can use all other classes in *java.util*:

{% tabs packaging-imports-12 %}
{% tab 'Scala 2 and 3' %}
```scala
scala> new ArrayList[String]
val res0: java.util.ArrayList[String] = []
```
{% endtab %}
{% endtabs %}

Because those Java classes are hidden, you can also use the Scala `List`, `Set`, and `Map` classes without having a naming collision:

{% tabs packaging-imports-13 %}
{% tab 'Scala 2 and 3' %}
```scala
scala> val a = List(1, 2, 3)
val a: List[Int] = List(1, 2, 3)

scala> val b = Set(1, 2, 3)
val b: Set[Int] = Set(1, 2, 3)

scala> val c = Map(1 -> 1, 2 -> 2)
val c: Map[Int, Int] = Map(1 -> 1, 2 -> 2)
```
{% endtab %}
{% endtabs %}

### Use imports anywhere

In Scala, `import` statements can be anywhere.
They can be used at the top of a source code file:

{% tabs packaging-imports-14 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
package foo

import scala.util.Random

class ClassA {
  def printRandom(): Unit = {
    val r = new Random   // use the imported class
    // more code here...
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-14 %}

```scala
package foo

import scala.util.Random

class ClassA:
  def printRandom(): Unit =
    val r = new Random   // use the imported class
    // more code here...
```
{% endtab %}
{% endtabs %}

You can also use `import` statements closer to the point where they are needed, if you prefer:

{% tabs packaging-imports-15 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
package foo

class ClassA {
  import scala.util.Random   // inside ClassA
  def printRandom(): Unit = {
    val r = new Random
    // more code here...
  }
}

class ClassB {
  // the Random class is not visible here
  val r = new Random   // this code will not compile
}
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-15 %}

```scala
package foo

class ClassA:
  import scala.util.Random   // inside ClassA
  def printRandom(): Unit =
    val r = new Random
    // more code here...

class ClassB:
  // the Random class is not visible here
  val r = new Random   // this code will not compile
```

{% endtab %}
{% endtabs %}

### “Static” imports

When you want to import members in a way similar to the Java “static import” approach---so you can refer to the member names directly, without having to prefix them with their class name---use the following approach.

Use this syntax to import all static members of the Java `Math` class:

{% tabs packaging-imports-16 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.lang.Math._
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-16 %}

```scala
import java.lang.Math.*
```
{% endtab %}
{% endtabs %}

Now you can access static `Math` class methods like `sin` and `cos` without having to precede them with the class name:

{% tabs packaging-imports-17 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.lang.Math._

val a = sin(0)    // 0.0
val b = cos(PI)   // -1.0
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-17 %}

```scala
import java.lang.Math.*

val a = sin(0)    // 0.0
val b = cos(PI)   // -1.0
```
{% endtab %}
{% endtabs %}

### Packages imported by default

Two packages are implicitly imported into the scope of all of your source code files:

- java.lang.*
- scala.*

The members of the Scala object `Predef` are also imported by default.

> If you ever wondered why you can use classes like `List`, `Vector`, `Map`, etc., without importing them, they’re available because of definitions in the `Predef` object.

### Handling naming conflicts

In the rare event there’s a naming conflict and you need to import something from the root of the project, prefix the package name with `_root_`:

{% tabs packaging-imports-18 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
package accounts

import _root_.accounts._
```

{% endtab %}
{% tab 'Scala 3' for=packaging-imports-18 %}

```scala
package accounts

import _root_.accounts.*
```
{% endtab %}
{% endtabs %}

## Importing `given` instances

As you’ll see in the [Contextual Abstractions][contextual] chapter, in Scala 3 a special form of the `import` statement is used to import `given` instances.
The basic form is shown in this example:

{% tabs packaging-imports-19 %}
{% tab 'Scala 3 only' %}
```scala
object A:
  class TC
  given tc: TC
  def f(using TC) = ???

object B:
  import A.*       // import all non-given members
  import A.given   // import the given instance
```
{% endtab %}
{% endtabs %}

In this code, the `import A.*` clause of object `B` imports all members of `A` *except* the `given` instance `tc`.
Conversely, the second import, `import A.given`, imports *only* that `given` instance.
The two `import` clauses can also be merged into one:

{% tabs packaging-imports-20 %}
{% tab 'Scala 3 only' %}
```scala
object B:
  import A.{given, *}
```
{% endtab %}
{% endtabs %}
In Scala 2, that style of import does not exist. Implicit definitions are always imported by the wildcard import.
### Discussion

The wildcard selector `*` brings all definitions other than givens or extensions into scope, whereas a `given` selector brings all *givens*---including those resulting from extensions---into scope.

These rules have two main benefits:

- It’s more clear where givens in scope are coming from.
  In particular, it’s not possible to hide imported givens in a long list of other wildcard imports.
- It enables importing all givens without importing anything else.
  This is particularly important since givens can be anonymous, so the usual use of named imports is not practical.

### By-type imports

Since givens can be anonymous, it’s not always practical to import them by their name, and wildcard imports are typically used instead.
*By-type imports* provide a more specific alternative to wildcard imports, which makes it more clear what is imported:

{% tabs packaging-imports-21 %}
{% tab 'Scala 3 only' %}
```scala
import A.{given TC}
```
{% endtab %}
{% endtabs %}

This imports any `given` in `A` that has a type which conforms to `TC`.
Importing givens of several types `T1,...,Tn` is expressed by multiple `given` selectors:

{% tabs packaging-imports-22 %}
{% tab 'Scala 3 only' %}
```scala
import A.{given T1, ..., given Tn}
```
{% endtab %}
{% endtabs %}

Importing all `given` instances of a parameterized type is expressed by wildcard arguments.
For example, when you have this `object`:

{% tabs packaging-imports-23 %}
{% tab 'Scala 3 only' %}
```scala
object Instances:
  given intOrd: Ordering[Int]
  given listOrd[T: Ordering]: Ordering[List[T]]
  given ec: ExecutionContext = ...
  given im: Monoid[Int]
```
{% endtab %}
{% endtabs %}

This import statement imports the `intOrd`, `listOrd`, and `ec` instances, but leaves out the `im` instance because it doesn’t fit any of the specified bounds:

{% tabs packaging-imports-24 %}
{% tab 'Scala 3 only' %}
```scala
import Instances.{given Ordering[?], given ExecutionContext}
```
{% endtab %}
{% endtabs %}

By-type imports can be mixed with by-name imports.
If both are present in an import clause, by-type imports come last.
For instance, this import clause imports `im`, `intOrd`, and `listOrd`, but leaves out `ec`:

{% tabs packaging-imports-25 %}
{% tab 'Scala 3 only' %}
```scala
import Instances.{im, given Ordering[?]}
```
{% endtab %}
{% endtabs %}

### An example

As a concrete example, imagine that you have this `MonthConversions` object that contains two `given` definitions:

{% tabs packaging-imports-26 %}
{% tab 'Scala 3 only' %}

```scala
object MonthConversions:
  trait MonthConverter[A]:
    def convert(a: A): String

  given intMonthConverter: MonthConverter[Int] with
    def convert(i: Int): String =
      i match
        case 1 =>  "January"
        case 2 =>  "February"
        // more cases here ...

  given stringMonthConverter: MonthConverter[String] with
    def convert(s: String): String =
      s match
        case "jan" => "January"
        case "feb" => "February"
        // more cases here ...
```
{% endtab %}
{% endtabs %}

To import those givens into the current scope, use these two `import` statements:

{% tabs packaging-imports-27 %}
{% tab 'Scala 3 only' %}

```scala
import MonthConversions.*
import MonthConversions.{given MonthConverter[?]}
```
{% endtab %}
{% endtabs %}

Now you can create a method that uses those `given` instances:

{% tabs packaging-imports-28 %}
{% tab 'Scala 3 only' %}

```scala
def genericMonthConverter[A](a: A)(using monthConverter: MonthConverter[A]): String =
  monthConverter.convert(a)
```
{% endtab %}
{% endtabs %}

Then you can use that method in your application:

{% tabs packaging-imports-29 %}
{% tab 'Scala 3 only' %}

```scala
@main def main =
  println(genericMonthConverter(1))       // January
  println(genericMonthConverter("jan"))   // January
```
{% endtab %}
{% endtabs %}

As mentioned, one of the key design benefits of the “import given” syntax is to make it clear where givens in scope come from, and it’s clear in these `import` statements that the givens come from the `MonthConversions` object.

[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}
