---
layout: tour
title: 高阶函数
partof: scala-tour

num: 7

language: zh-cn

next-page: nested-functions
previous-page: mixin-class-composition
---

高阶函数是指使用其他函数作为参数、或者返回一个函数作为结果的函数。在Scala中函数是“一等公民”，所以允许定义高阶函数。这里的术语可能有点让人困惑，我们约定，使用函数值作为参数，或者返回值为函数值的“函数”和“方法”，均称之为“高阶函数”。

最常见的一个例子是Scala集合类（collections）的高阶函数`map`
```
val salaries = Seq(20000, 70000, 40000)
val doubleSalary = (x: Int) => x * 2
val newSalaries = salaries.map(doubleSalary) // List(40000, 140000, 80000)
```
函数`doubleSalary`有一个整型参数`x`，返回`x * 2`。一般来说，在`=>`左边的元组是函数的参数列表，而右边表达式的值则为函数的返回值。在第3行，函数`doubleSalary`被应用在列表`salaries`中的每一个元素。

为了简化压缩代码，我们可以使用匿名函数，直接作为参数传递给`map`:
```
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(x => x * 2) // List(40000, 140000, 80000)
```
注意在上述示例中`x`没有被显式声明为Int类型，这是因为编译器能够根据map函数期望的类型推断出`x`的类型。对于上述代码，一种更惯用的写法为：
```scala mdoc
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(_ * 2)
```
既然Scala编译器已经知道了参数的类型（一个单独的Int），你可以只给出函数的右半部分，不过需要使用`_`代替参数名（在上一个例子中是`x`）

## 强制转换方法为函数
你同样可以传入一个对象方法作为高阶函数的参数，这是因为Scala编译器会将方法强制转换为一个函数。
```
case class WeeklyWeatherForecast(temperatures: Seq[Double]) {

  private def convertCtoF(temp: Double) = temp * 1.8 + 32

  def forecastInFahrenheit: Seq[Double] = temperatures.map(convertCtoF) // <-- passing the method convertCtoF
}
```
在这个例子中，方法`convertCtoF`被传入`forecastInFahrenheit`。这是可以的，因为编译器强制将方法`convertCtoF`转成了函数`x => convertCtoF(x)` （注: `x`是编译器生成的变量名，保证在其作用域是唯一的）。

## 接收函数作为参数的函数
使用高阶函数的一个原因是减少冗余的代码。比方说需要写几个方法以通过不同方式来提升员工工资，若不使用高阶函数，代码可能像这样：
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

注意这三个方法的差异仅仅是提升的比例不同，为了简化代码，其实可以把重复的代码提到一个高阶函数中：

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

新的方法`promotion`有两个参数，薪资列表和一个类型为`Double => Double`的函数（参数和返回值类型均为Double），返回薪资提升的结果。

## 返回函数的函数

有一些情况你希望生成一个函数， 比如：

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

注意urlBuilder的返回类型是`(String, String) => String`，这意味着返回的匿名函数有两个String参数，返回一个String。在这个例子中，返回的匿名函数是`(endpoint: String, query: String) => s"https://www.example.com/$endpoint?$query"`。
