---
layout: tutorial
title: Higher-order Functions

disqus: true

tutorial: scala-tour
num: 8
next-page: nested-functions
previous-page: anonymous-function-syntax
assumed-knowledge: sequence-comprehensions
---

Higher order functions take other functions as parameters or return a function as
a result. This is possible because functions are first-class objects in Scala.
One of the most common examples is the higher-order
function `map` which is available for collections in Scala.
```tut
val salaries = Seq(20000, 70000, 40000)
val doubleSalary = (x: Int) => x * 2
val newSalaries = salaries.map(doubleSalary) // List(40000, 140000, 80000)
```
In this case, the function `doubleSalary` gets applied to each element in the
list of salaries. A more idiomatic way to write the same piece of code would be

```tut
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(_ * 2)
```
The Scala compiler already knows the type of the parameters (a single Int) that function argument
for `map` needs. Therefore you just need to provide the right side of the function `doubleSalary`. The only
caveat is that you need to use `_` in place of a parameter name (it was `x` in
the previous example).

## Coercing methods into functions
It is also possible to pass methods as arguments to higher-order functions because
the Scala compiler will coerce the method into a function.
```
case class WeeklyWeatherForecast(temperatures: Seq[Double]) {

  private def convertCtoF(temp: Double) = temp * 1.8 + 32

  def getForecastInFahrenheit() = temperatures.map(convertCtoF) // <-- passing the method convertCtoF
}
```
Here the method `convertCtoF` is passed to getForecastInFahrenheit  This is possible because the compiler coerces `convertCtoF` to `_ => convertCtoF(_)`, i.e. a function.

## Functions that accept functions
One reason to use higher-order functions is to reduce redundant code. Let's say you wanted functions  that could either search for files by directory, by regular expression, or by a substring. Without creating a higher-order function,
it might look something like this:

```tut
  object FileFinder {
    private def filesHere = (new java.io.File(".")).listFiles

    def filesEndingWith(query: String) =
      for (file <- filesHere; if file.getName.endsWith(query))
        yield

    def filesContaining(query: String) =
      for (file <- filesHere; if file.getName.contains(query))
        yield file

    def filesMatchingRegex(query: String) =
      for (file <- filesHere; if file.getName.matches(query))
        yield file
  }
```

Notice how each of the three methods vary only by a single method call. To simplify,
you can extract the repeated code into a higher-order function like so:

```tut
object FileMatcher {
  private def filesHere = (new java.io.File(".")).listFiles

  private def filesMatching(matcher: String => Boolean) =
    for (file <- filesHere; if matcher(file.getName))
          yield file

    def filesEndingWith(query: String) =
      filesMatching(_.endsWith(query))

    def filesContaining(query: String) =
      filesMatching(_.contains(query))

    def filesMatchingRegex(query: String) =
      filesMatching(_.matches(query))
    }
```

The new function, `filesMatching`, takes a function of type `String => Boolean`
(i.e. a function that takes a String and returns a Boolean) and returns the Sequence comprehension
created by the `for`/`yield`.

Credit: Odersky, Martin, Lex Spoon, and Bill Venners. Programming in Scala. Walnut Creek, CA: Artima, 2010. Web.

## Functions that return functions

There are certain cases where you want to generate a function. Here's an example
of a method that returns a function.

```tut
def urlBuilder(ssl: Boolean, domainName: String): (String, String) => String = {
  val schema = if (ssl) "https://" else "http://"
  (endpoint: String, query: String) => s"$schema$domainName/$endpoint?$query"
}
​
val domainName = "www.example.com"
def getURL = urlBuilder(ssl=true, domainName)
​
val endpoint = "users"
val query = "id=1"
val url = getURL(endpoint, query) // "https://www.example.com/users?id=1": String
​```
Notice the return type of urlBuilder `(String, String) => String`. This means that
the returned anonymous function takes two Strings and returns a String.
