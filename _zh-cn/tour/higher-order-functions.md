---
layout: tour
title: 高阶函数

discourse: false

partof: scala-tour

num: 7

language: zh-cn

next-page: nested-functions
previous-page: mixin-class-composition
---

高阶函数可以使用其他函数作为参数, 或者用函数作为返回结果, 因为函数在 Scala 语言中是第一类对象. 现在讨论专业术语会带来轻微的困惑, 并且我们使用"高阶函数"这个短语即表示方法又表示函数, 只要它们使用其他函数作为参数, 或者用函数作为返回结果.

一个最常见的高阶函数的例子, 是 Scala 的集合类中的 `map` 方法.

```tut
val salaries = Seq(20000, 70000, 40000)
val doubleSalary = (x: Int) => x * 2
val newSalaries = salaries.map(doubleSalary) // List(40000, 140000, 80000)
```

`doubleSalary` 这个函数只有一个 `Int` 型参数 `x`, 并且返回 `x * 2`. 通常来说, 在箭头 `=>` 左边的元组是参数列表, 而在箭头右边的表达式的计算结果就是返回值. 在第3行,  函数 `doubleSalary` 会被应用到列表 `salaries` 中的每一个元素.

为了简化代码, 我们可以将上面的函数变成一个匿名函数, 并且将它作为参数直接传递给 `map` 方法:
```
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(x => x * 2) // List(40000, 140000, 80000)
```
注意这里 `x` 没有声明成上面例子中的 `Int` 类型. 是因为编译器会根据函数 `map` 的可接受参数类型来推断传入参数的类型. 另一个更加符合使用习惯的方式可以写出以下等价的代码:

```tut
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(_ * 2)
```
因为 Scala 编译器已经知道了所有的参数类型 (单个 `Int` ), 你只需要提供函数的右半部分. 唯一的限制就是你需要使用 `_` 来替代参数名字(上面例子中的 `x` ).

## 将方法强制转换成函数
将方法当成参数传递给高阶函数也是允许的, 因为 Scala 编译器会将方法强制转换成函数.
```
case class WeeklyWeatherForecast(temperatures: Seq[Double]) {

  private def convertCtoF(temp: Double) = temp * 1.8 + 32

  def forecastInFahrenheit: Seq[Double] = temperatures.map(convertCtoF) // <-- passing the method convertCtoF
}
```
这里方法 `convertCtoF` 被传递给 `forecastInFahrenheit`. 这是允许的，因为编译器强制将方法 `convertCtoF` 转换成函数 `x => convertCtoF(x)` (注意: `x` 是一个随机生成的名字, 在当前的作用域内是唯一的).

## 接受函数作为参数的高阶函数
一个使用高阶函数的好处是减少多余的代码. 假设你需要一些方法用来根据不同情况来给某人涨薪水. 如果不使用高阶函数, 写出代码大概如下:

```tut
object SalaryRaiser {

  def smallPromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * 1.1)

  def greatPromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * math.log(salary))

  def hugePromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * salary)
}
```

注意以上三个方法仅仅区别在相乘的因子上. 为了简化代码，你可以把重复的代码提取出来变成如下的高阶函数: 

```tut
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

新的方法 `promotion`, 接受  salaries 和一个类型是 `Double => Double` 函数(即一个函数, 参数是 Double 型, 返回值也是 Double 型)作为参数, 返回应用了函数之后的结果. 

## 返回值是函数的高阶函数

在一些场景下你需要生成一个函数, 以下是一个用方法来生成函数的例子:

```tut
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

注意方法 `urlBuilder` 的返回值类型 `(String, String) => String`. 这意味着返回的匿名函数接受两个 String 型参数, 并且返回一个 String 型值.
在这个例子中, 返回的匿名函数是 `(endpoint: String, query: String) => s"https://www.example.com/$endpoint?$query"`.
