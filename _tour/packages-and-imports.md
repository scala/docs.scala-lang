---
layout: tour
title: Packages and Imports
partof: scala-tour

num: 35
next-page: package-objects
previous-page: annotations
---

# Packages and Imports
Scala uses packages to create namespaces which allow you to modularize programs.

## Creating a package
Packages are created by declaring one or more package names at the top of a Scala file.

{% tabs packages-and-imports_1 %}
{% tab 'Scala 2 and 3' for=packages-and-imports_1 %}
```
package users

class User
```
{% endtab %}
{% endtabs %}

One convention is to name the package the same as the directory containing the Scala file. However, Scala is agnostic to file layout. The directory structure of an sbt project for `package users` might look like this:
```
- ExampleProject
  - build.sbt
  - project
  - src
    - main
      - scala
        - users
          User.scala
          UserProfile.scala
          UserPreferences.scala
    - test
```
Notice how the `users` directory is within the `scala` directory and how there are multiple Scala files within the package. Each Scala file in the package could have the same package declaration. The other way to declare packages is by using braces:

{% tabs packages-and-imports_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=packages-and-imports_2 %}
```scala
package users {
  package administrators {
    class NormalUser
  }
  package normalusers {
    class NormalUser
  }
}
```
{% endtab %}
{% tab 'Scala 3' for=packages-and-imports_2 %}
```scala
package users:
  package administrators:
    class NormalUser
  package normalusers:
    class NormalUser
```
{% endtab %}
{% endtabs %}

As you can see, this allows for package nesting and provides greater control for scope and encapsulation.

The package name should be all lower case and if the code is being developed within an organization which has a website, it should be the following format convention: `<top-level-domain>.<domain-name>.<project-name>`. For example, if Google had a project called `SelfDrivingCar`, the package name would look like this:

{% tabs packages-and-imports_3 %}
{% tab 'Scala 2 and 3' for=packages-and-imports_3 %}
```scala
package com.google.selfdrivingcar.camera

class Lens
```
{% endtab %}
{% endtabs %}

This could correspond to the following directory structure: `SelfDrivingCar/src/main/scala/com/google/selfdrivingcar/camera/Lens.scala`.

## Imports
`import` clauses are for accessing members (classes, traits, functions, etc.) in other packages. An `import` clause is not required for accessing members of the same package. Import clauses are selective:

{% tabs packages-and-imports_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=packages-and-imports_4 %}
```
import users._  // import everything from the users package
import users.User  // import the class User
import users.{User, UserPreferences}  // Only imports selected members
import users.{UserPreferences => UPrefs}  // import and rename for convenience
```
{% endtab %}
{% tab 'Scala 3' for=packages-and-imports_4 %}
```
import users.*  // import everything from the users package except given
import users.given // import all given from the users package
import users.User  // import the class User
import users.{User, UserPreferences}  // Only imports selected members
import users.UserPreferences as UPrefs  // import and rename for convenience
```
{% endtab %}
{% endtabs %}

One way in which Scala is different from Java is that imports can be used anywhere:

{% tabs packages-and-imports_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=packages-and-imports_5 %}
```scala mdoc
def sqrtplus1(x: Int) = {
  import scala.math.sqrt
  sqrt(x) + 1.0
}
```
{% endtab %}
{% tab 'Scala 3' for=packages-and-imports_5 %}
```scala
def sqrtplus1(x: Int) =
  import scala.math.sqrt
  sqrt(x) + 1.0
```
{% endtab %}
{% endtabs %}

In the event there is a naming conflict and you need to import something from the root of the project, prefix the package name with `_root_`:

{% tabs packages-and-imports_6 class=tabs-scala-version %}
{% tab 'Scala 2' for=packages-and-imports_6 %}
```scala
package accounts

import _root_.users._
```
{% endtab %}
{% tab 'Scala 3' for=packages-and-imports_6 %}
```scala
package accounts

import _root_.users.*
```
{% endtab %}
{% endtabs %}

Note: The `scala` and `java.lang` packages as well as `object Predef` are imported by default.
