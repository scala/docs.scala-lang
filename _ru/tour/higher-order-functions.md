---
layout: tour
title: Функции Высшего Порядка
partof: scala-tour
num: 8
language: ru
next-page: nested-functions
previous-page: mixin-class-composition
---

Функции высшего порядка могут принимать другие функции в качестве параметров или возвращать функцию в качестве результата.
Такое возможно поскольку функции являются объектами первого класса в Scala.
На текущем этапе терминология может казаться немного запутанной, мы используем следующую фразу "функция высшего порядка" как для методов, так и для функций, которые могут принимать другие функции в качестве параметров, или возвращать функции в качестве результата.

В чисто объектно-ориентированном мире рекомендуется избегать раскрытия методов,
параметризованных функциями, которые могут привести к утечке внутреннего состояния объекта.
Утечка внутреннего состояния может нарушить инварианты самого объекта, тем самым нарушив инкапсуляцию.

Одним из наиболее распространенных примеров функции высшего порядка
является функция `map`, которая доступна в коллекциях Scala.

{% tabs map_example_1 %}

{% tab 'Scala 2 и 3' for=map_example_1 %}

```scala mdoc:nest
val salaries = Seq(20_000, 70_000, 40_000)
val doubleSalary = (x: Int) => x * 2
val newSalaries = salaries.map(doubleSalary) // List(40000, 140000, 80000)
```

{% endtab %}

{% endtabs %}

`doubleSalary` - это функция, которая принимает один Int `x` и возвращает `x * 2`. В общем случае, кортеж (список имен в скобках) слева от стрелки `=>` - это список параметров, а значение выражения следует справа. Это же значение возвращается в качестве результата. В строке 3 к каждому элементу списка зарплат (salaries) применяется функция `doubleSalary`.

Чтобы сократить код, мы можем сделать функцию анонимной и передать ее напрямую в качестве аргумента в map:

{% tabs map_example_2 %}

{% tab 'Scala 2 и 3' for=map_example_2 %}

```scala mdoc:nest
val salaries = Seq(20_000, 70_000, 40_000)
val newSalaries = salaries.map(x => x * 2) // List(40000, 140000, 80000)
```

{% endtab %}

{% endtabs %}

Обратите внимание, что в приведенном выше примере `x`не объявлен как `Int`. Это потому, что компилятор может вывести тип, основываясь на типе который ожидает функция map. Еще более элегантным способом написания этого же кода было бы таким:

{% tabs map_example_3 %}

{% tab 'Scala 2 и 3' for=map_example_3 %}

```scala mdoc:nest
val salaries = Seq(20_000, 70_000, 40_000)
val newSalaries = salaries.map(_ * 2)
```

{% endtab %}

{% endtabs %}

Поскольку компилятор Scala уже знает тип параметров (Int), вам нужно только указать правую часть функции. Единственное условие заключается в том, что вместо имени параметра необходимо использовать `_` (в предыдущем примере это было `x`).

## Преобразование методов в функции

Также возможно передавать методы в качестве аргументов функциям более высокого порядка, поскольку компилятор Scala может преобразовать метод в функцию.

{% tabs Coercing_methods_into_functions class=tabs-scala-version %}

{% tab 'Scala 2' for=Coercing_methods_into_functions %}

```scala mdoc
case class WeeklyWeatherForecast(temperatures: Seq[Double]) {

  private def convertCtoF(temp: Double) = temp * 1.8 + 32

  def forecastInFahrenheit: Seq[Double] = temperatures.map(convertCtoF) // <-- передается метод convertCtoF
}
```

{% endtab %}

{% tab 'Scala 3' for=Coercing_methods_into_functions %}

```scala
case class WeeklyWeatherForecast(temperatures: Seq[Double]):

  private def convertCtoF(temp: Double) = temp * 1.8 + 32

  def forecastInFahrenheit: Seq[Double] = temperatures.map(convertCtoF) // <-- передается метод convertCtoF
```

{% endtab %}

{% endtabs %}

Здесь метод `convertCtoF` передается в `forecastInFahrenheit`. Это возможно, потому что компилятор преобразовывает `convertCtoF` в функцию `x => ConvertCtoF(x)` (примечание: `x` будет сгенерированным именем, которое гарантированно будет уникальным в рамках своей области видимости).

## Функции, которые принимают функции

Одной из причин использования функций высшего порядка является сокращение избыточного кода. Допустим, вам нужны какие-то методы, которые могли бы повышать чью-то зарплату по разным условиям. Без создания функции высшего порядка это могло бы выглядеть примерно так:

{% tabs Functions_that_accept_functions_1 class=tabs-scala-version %}

{% tab 'Scala 2' for=Functions_that_accept_functions_1 %}

```scala mdoc
object SalaryRaiser {

  def smallPromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * 1.1)

  def greatPromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * math.log(salary))

  def hugePromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * salary)
}
```

{% endtab %}

{% tab 'Scala 3' for=Functions_that_accept_functions_1 %}

```scala
object SalaryRaiser:

  def smallPromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * 1.1)

  def greatPromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * math.log(salary))

  def hugePromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * salary)
```

{% endtab %}

{% endtabs %}

Обратите внимание, что каждый из этих трех методов отличается только коэффициентом умножения. Для упрощения можно перенести повторяющийся код в функцию высшего порядка:

{% tabs Functions_that_accept_functions_2 class=tabs-scala-version %}

{% tab 'Scala 2' for=Functions_that_accept_functions_2 %}

```scala mdoc:nest
object SalaryRaiser {

  private def promotion(salaries: List[Double], promotionFunction: Double => Double): List[Double] =
    salaries.map(promotionFunction)

  def smallPromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * 1.1)

  def greatPromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * math.log(salary))

  def hugePromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * salary)
}
```

{% endtab %}

{% tab 'Scala 3' for=Functions_that_accept_functions_2 %}

```scala
object SalaryRaiser:

  private def promotion(salaries: List[Double], promotionFunction: Double => Double): List[Double] =
    salaries.map(promotionFunction)

  def smallPromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * 1.1)

  def greatPromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * math.log(salary))

  def hugePromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * salary)
```

{% endtab %}

{% endtabs %}

Новый метод, `promotion`, берет зарплату и функцию типа `Double => Double` (т.е. функция, которая берет Double и возвращает Double) и возвращает их произведение.

Методы и функции обычно выражают поведение или преобразования данных, поэтому наличие функций,
которые составляются на основе других функций, может помочь в создании универсальных механизмов.
Эти общие механизмы откладываются, чтобы заблокировать все поведение операции,
предоставляя клиентам возможность контролировать или дополнительно настраивать части самой операции.

## Функции, возвращающие функции

Есть определенные случаи, когда вы хотите сгенерировать функцию. Вот пример метода, который возвращает функцию.

{% tabs Functions_that_return_functions class=tabs-scala-version %}

{% tab 'Scala 2' for=Functions_that_return_functions %}

```scala mdoc
def urlBuilder(ssl: Boolean, domainName: String): (String, String) => String = {
  val schema = if (ssl) "https://" else "http://"
  (endpoint: String, query: String) => s"$schema$domainName/$endpoint?$query"
}

val domainName = "www.example.com"
def getURL = urlBuilder(ssl=true, domainName)
val endpoint = "users"
val query = "id=1"
val url = getURL(endpoint, query) // "https://www.example.com/users?id=1": String
```

{% endtab %}

{% tab 'Scala 3' for=Functions_that_return_functions %}

```scala
def urlBuilder(ssl: Boolean, domainName: String): (String, String) => String =
  val schema = if ssl then "https://" else "http://"
  (endpoint: String, query: String) => s"$schema$domainName/$endpoint?$query"

val domainName = "www.example.com"
def getURL = urlBuilder(ssl=true, domainName)
val endpoint = "users"
val query = "id=1"
val url = getURL(endpoint, query) // "https://www.example.com/users?id=1": String
```

{% endtab %}

{% endtabs %}

Обратите внимание, что возвращаемый тип urlBuilder`(String, String) => String`. Это означает, что возвращаемая анонимная функция принимает две строки и возвращает строку. В нашем случае возвращаемая анонимная функция `(endpoint: String, query: String) => s"https://www.example.com/$endpoint?$query"`.
