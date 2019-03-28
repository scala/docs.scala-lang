---
layout: tour
title: シングルトンオブジェクト
language: ja

discourse: true

partof: scala-tour

num: 13

next-page: regular-expression-patterns
previous-page: pattern-matching
redirect_from: "/tutorials/tour/singleton-objects.html"
prerequisite-knowledge: classes, methods, private-methods, packages, option
---
オブジェクトは丁度1つのインスタンスを持つクラスです。
それはlazy valのように参照された際に遅れて作られます。

トップレベルのオブジェクトは、シングルトンです。
エンクロージングクラス（外部クラス）のメンバーやローカルの値のように、オブジェクトはまるで遅延評価valのように振る舞います。

# シングルトンオブジェクトの定義
オブジェクトは値です。オブジェクトの定義はクラスのように見えますが、キーワード`object`を使います。
```tut
object Box
```
これはメソッドを持つオブジェクトの例です。
```
package logging

object Logger {
  def info(message: String): Unit = println(s"INFO: $message")
}
```
`info`メソッドはプログラム上のどこからでもimportすることができます。
このように便利なメソッドを作ることはシングルトンオブジェクトのユースケースと同じです。

他のパッケージで`info`がどのように使われるか見てみましょう。

```
import logging.Logger.info

class Project(name: String, daysToComplete: Int)

class Test {
  val project1 = new Project("TPS Reports", 1)
  val project2 = new Project("Website redesign", 5)
  info("Created projects")  // Prints "INFO: Created projects"
}
```

import文`import logging.Logger.info`により、`info`メソッドが見えるようになります。

import文には取り込むシンボルへの"変動しないパス"が必要であり、オブジェクトは変動しないパスとなります。

注意：`オブジェクト`がトップレベルではないが、他のクラスやオブジェクトを必要とする時、オブジェクトは他のメンバーのように"経路依存性"があります。
これは2種類の飲み物`牛乳 クラス`と`オレンジジュース クラス`が与えられた場合、クラスメンバーの`栄養素 object`はエンクロージングクラス、すなわち牛乳またはオレンジジュースのいずれかのインスタンスに依存することを意味します。
`milk.NutritionInfo`は`oj.NutritionInfo`とは全く異なります。

## コンパニオンオブジェクト

クラスと同じ名前のオブジェクトは*コンパニオンオブジェクト*と呼ばれます。
逆にクラスはオブジェクトのコンパニオンクラスとなります。
コンパニオンクラスやコンパニオンオブジェクトは自身のコンパニオンのプライベートメンバーにアクセスできます。
コンパニオンクラスのインスタンスの固有ではないメソッドや値にはコンパニオンオブジェクトを使います。

```
import scala.math._

case class Circle(radius: Double) {
  import Circle._
  def area: Double = calculateArea(radius)
}

object Circle {
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)
}

val circle1 = new Circle(5.0)

circle1.area
```

`class Circle`は各インスタンスの固有のメンバー`area`を持ち、シングルトンオブジェクト`object Circle`は全てのインスタンスで利用できる`calculateArea`メソッドを持ちます。

コンパニオンオブジェクトはファクトリーメソッドを含むことができます。
```tut
class Email(val username: String, val domainName: String)

object Email {
  def fromString(emailString: String): Option[Email] = {
    emailString.split('@') match {
      case Array(a, b) => Some(new Email(a, b))
      case _ => None
    }
  }
}

val scalaCenterEmail = Email.fromString("scala.center@epfl.ch")
scalaCenterEmail match {
  case Some(email) => println(
    s"""Registered an email
       |Username: ${email.username}
       |Domain name: ${email.domainName}
     """)
  case None => println("Error: could not parse email")
}
```
`object Email`はファクトリー`fromString`を持ち、Stringから`Email`インスタンスを作ります。
エラー解析のケース内では`Email`インスタンスを`Option[Email]`として返します。

注意：クラスまたはオブジェクトがコンパニオンを持つ場合、クラス、オブジェクトの両方は同じファイルの中に定義されている必要があります。
REPL内でコンパニオンを定義する場合は、それらを同じ行で定義するか、`:paste`モードに入ります。

## Javaプログラマのための注意事項 ##

Javaにおける`static`メンバーはScalaではコンパニオンオブジェクトの一般メンバーとして作られています。

Javaのコードからコンパニオンオブジェクトを使う場合、メンバーはコンパニオンクラス内で`static`識別子を用いて定義されます。
これを*static forwarding*と呼ばれます。
これはコンパニオンクラスを定義していなかったとしても起きます。
