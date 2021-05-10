---
layout: tour
title: 高階関数
language: ja

discourse: true

partof: scala-tour

num: 8
next-page: nested-functions
previous-page: mixin-class-composition

---

高階関数は他の関数をパラメーターとして受け取る、もしくは結果として関数を返します。
このようなことができるのは、Scalaでは関数が第一級値 (first-class value) だからです。
用語が少し紛らわしいかもしれませんが、
ここでは"高階関数"というフレーズを関数をパラメーターとして受け取る、または関数を返すメソッドと関数の両方に対して使います。

もっとも一般的な例の1つは、Scalaのコレクションで利用可能な高階関数`map`です。
```scala mdoc
val salaries = Seq(20000, 70000, 40000)
val doubleSalary = (x: Int) => x * 2
val newSalaries = salaries.map(doubleSalary) // List(40000, 140000, 80000)
```
`doubleSalary`はInt`x`を1つだけ受け取り、`x * 2`を返す関数です。
一般的に、アロー`=>`の左側のタプルは引数リストであり、右側の式の値が返されます。
3行目で、給与のリストのそれぞれの値に`doubleSalary`が適用されます。

コードを減らすため、以下のように無名関数を作ることができ、引数として直接mapに渡すことができます
```scala mdoc:nest
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(x => x * 2) // List(40000, 140000, 80000)
```
上記例では`x`をIntとして宣言していないことに注意してください。
それはmap関数が期待する型を基にコンパイラーが型を推論できるからです。
さらに言えば、慣用的には同じコードを以下のように書きます。

```scala mdoc:nest
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(_ * 2)
```
Scalaコンパイラはパラメーターの型を（Intが1つだけと）既に知っているため、関数の右側を提供するだけでよいです。
唯一の注意点はパラメータ名の代わりに`_`を使う必要があるということです（先の例では`x`でした）。

## メソッドを関数に強制変換
高階関数には引数としてとしてメソッドを渡すことも可能で、それはScalaコンパイラがメソッドを関数に強制変換するからです。
```scala mdoc
case class WeeklyWeatherForecast(temperatures: Seq[Double]) {

  private def convertCtoF(temp: Double) = temp * 1.8 + 32

  def forecastInFahrenheit: Seq[Double] = temperatures.map(convertCtoF) // <-- convertCtoFメソッドが渡されます
}
```
ここで、メソッド`convertCtoF`が`forecastInFahrenheit`に渡されています。
これはコンパイラが`convertCtoF`を関数`x => convertCtoF(x)`(注意点：`x`はスコープ内でユニークであることが保証された名前になります)に変換することで実現します。

## 関数を受け取る関数
高階関数を使う理由の1つは余分なコードを削減することです。
たとえば、何通りかの係数で人の給料を上げるメソッドが欲しいとしましょう。
高階関数を作らないなら、こんな感じになるかもしれません。

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

3つのメソッドはそれぞれ掛け算の係数のみ異なることに気をつけてください。
簡潔にするため、以下のように繰り返されているコードを高階関数に抽出することができます。

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
新しいメソッド`promotion`はsalariesと`Double => Double`型の関数(すなわち、Doubleを受け取り、Doubleを返す関数)を受け取り、積を返します。

## 関数を返す関数

関数を生成したい場合がいくつかあります。
こちらは関数を返すメソッドの例になります。

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

urlBuilderの戻り値型`(String, String) => String`に注意してください。
これは返される無名関数はStringを2つ受け取り、Stringを1つ返すことを意味します。
このケースでは返される無名関数は`(endpoint: String, query: String) => s"https://www.example.com/$endpoint?$query"`です。
