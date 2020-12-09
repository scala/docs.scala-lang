---
layout: tour
title: Функции Высшего Порядка

discourse: true

partof: scala-tour

num: 8
language: ru
next-page: nested-functions
previous-page: mixin-class-composition

---

Функции высшего порядка могут принимать другие функции в качестве параметров или возвращать функцию в качестве результата 
Такое возможно поскольку функции являются объектами первого класса в Scala. 
На текущем этапе терминология может казаться немного запутанной, мы используем следующую фразу "функция высшего порядка" как для методов, так и для функций, которые могут принимать другие функции в качестве параметров, или возвращать функции в качестве результата. 

Одним из наиболее распространенных примеров функции высшего порядка 
является функция `map`, которая доступна в коллекциях Scala.
```scala mdoc
val salaries = Seq(20000, 70000, 40000)
val doubleSalary = (x: Int) => x * 2
val newSalaries = salaries.map(doubleSalary) // List(40000, 140000, 80000)
```
`doubleSalary` - это функция, которая принимает один Int `x` и возвращает `x * 2`. В общем случае, кортеж (список имен в скобках) слева от стрелки `=>` - это список параметров, а значение выражения следует справа. Это же значение возвращается в качестве результата. В строке 3 к каждому элементу списка зарплат (salaries) применяется функция `doubleSalary`.

Чтобы сократить код, мы можем сделать функцию анонимной и передать ее напрямую в качестве аргумента в map:
```scala mdoc:nest
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(x => x * 2) // List(40000, 140000, 80000)
```
Обратите внимание, что в приведенном выше примере `x`не объявлен как `Int`. Это потому, что компилятор может вывести тип, основываясь на типе который ожидает функция map. Еще более элегантным способом написания этого же кода было бы таким:

```scala mdoc:nest
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(_ * 2)
```
Поскольку компилятор Scala уже знает тип параметров (Int), вам нужно только указать правую часть функции. Единственное условие заключается в том, что вместо имени параметра необходимо использовать `_` (в предыдущем примере это было `x`).

## Преобразование методов в функции
Также возможно передавать методы в качестве аргументов функциям более высокого порядка, поскольку компилятор Scala может преобразовать метод в функцию.
```scala mdoc
case class WeeklyWeatherForecast(temperatures: Seq[Double]) {

  private def convertCtoF(temp: Double) = temp * 1.8 + 32

  def forecastInFahrenheit: Seq[Double] = temperatures.map(convertCtoF) // <-- передается метод convertCtoF
}
```
Здесь метод `convertCtoF` передается в `forecastInFahrenheit`. Это возможно, потому что компилятор преобразовывает `convertCtoF` в функцию `x => ConvertCtoF(x)` (примечание: `x` будет сгенерированным именем, которое гарантированно будет уникальным в рамках своей области видимости).

## Функции, которые принимают функции
Одной из причин использования функций высшего порядка является сокращение избыточного кода. Допустим, вам нужны какие-то методы, которые могли бы повышать чью-то зарплату по разным условиям. Без создания функции высшего порядка это могло бы выглядеть примерно так:

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

Обратите внимание, что каждый из этих трех методов отличается только коэффициентом умножения. Для упрощения можно перенести повторяющийся код в функцию высшего порядка:

```scala mdoc:nest
object SalaryRaiser {

  private def promotion(salaries: List[Double], promotionFunction: Double => Double): List[Double] =
    salaries.map(promotionFunction)

  def smallPromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * 1.1)

  def bigPromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * math.log(salary))

  def hugePromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * salary)
}
```

Новый метод, `promotion`, берет зарплату и функцию типа `Double => Double` (т.е. функция, которая берет Double и возвращает Double) и возвращает их произведение.

## Функции, возвращающие функции

Есть определенные случаи, когда вы хотите сгенерировать функцию. Вот пример метода, который возвращает функцию.

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

Обратите внимание, что возвращаемый тип urlBuilder`(String, String) => String`. Это означает, что возвращаемая анонимная функция принимает две строки и возвращает строку. В нашем случае возвращаемая анонимная функция `(endpoint: String, query: String) => s"https://www.example.com/$endpoint?$query"`.
