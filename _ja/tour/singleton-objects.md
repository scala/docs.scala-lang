---
layout: tour
title: シングルトンオブジェクト
language: ja

discourse: true

partof: scala-tour

num: 13

next-page: regular-expression-patterns
previous-page: pattern-matching
prerequisite-knowledge: classes, methods, private-methods, packages, option
---
オブジェクトは丁度1つのインスタンスを持つクラスです。
それはlazy valのように参照された際に遅れて作られます。

トップレベルにあるオブジェクトは、シングルトンです。
クラスのメンバーやローカル変数としてのオブジェクトは、lazy valと全く同じように振る舞います。

# シングルトンオブジェクトの定義
オブジェクトは値です。オブジェクトの定義はクラスのように見えますが、キーワード`object`を使います。
```scala mdoc
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

注意：`object`がトップレベルではなく他のクラスやオブジェクトにネストされている時、そのオブジェクトは他のメンバーのように"経路依存性"があります。
これは2種類の飲み物`class 牛乳`と`class オレンジジュース`が与えられた場合、クラスメンバーの`object 栄養素`はそれが属するインスタンス、すなわち牛乳またはオレンジジュースのいずれかに依存することを意味します。
`milk.NutritionInfo`は`oj.NutritionInfo`とは全く異なります。

## コンパニオンオブジェクト

クラスと同じ名前のオブジェクトは*コンパニオンオブジェクト*と呼ばれます。
逆にそのクラスはオブジェクトのコンパニオンクラスと呼ばれます。
コンパニオンクラスやコンパニオンオブジェクトは自身のコンパニオンのプライベートメンバーにアクセスできます。
コンパニオンクラスのインスタンスに特定されないメソッドや値にはコンパニオンオブジェクトを使います。

```
import scala.math._

case class Circle(radius: Double) {
  import Circle._
  def area: Double = calculateArea(radius)
}

object Circle {
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)
}

val circle1 = Circle(5.0)

circle1.area
```

`class Circle`は各インスタンスの固有のメンバー`area`を持ち、シングルトンオブジェクト`object Circle`は全てのインスタンスで利用できる`calculateArea`メソッドを持ちます。

コンパニオンオブジェクトはファクトリーメソッドを含むことができます。
```scala mdoc
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
     """.stripMargin)
  case None => println("Error: could not parse email")
}
```
`object Email`はファクトリー`fromString`を持ち、Stringから`Email`インスタンスを作ります。
パースエラーの場合も考えて、返り値の型を`Option[Email]`とします。

注意：クラスまたはオブジェクトがコンパニオンを持つ場合、クラス、オブジェクトの両方は同じファイルの中に定義されていなければなりません。
REPL内でコンパニオンを定義する場合は、それらを同じ行で定義するか、`:paste`モードに入ります。

## Javaプログラマのための注意事項 ##

Javaにおける`static`メンバーはScalaではコンパニオンオブジェクトの一般メンバーとして作られています。

Javaのコードからコンパニオンオブジェクトを使う場合、メンバーはコンパニオンクラス内で`static`識別子を用いて定義されます。
これは*static forwarding*と呼ばれます。
これはコンパニオンクラスを自分で定義していなかったとしても起きます。
