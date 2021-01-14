---
layout: tour
title: パターンマッチング
language: ja

discourse: true

partof: scala-tour

num: 12

next-page: singleton-objects
previous-page: case-classes
prerequisite-knowledge: case-classes, string-interpolation, subtyping

---

パターンマッチングは値をパターンに照合するための仕組みです。
マッチに成功すれば、一つの値をその構成要素のパーツに分解することもできます。
Javaの`switch`文の強化バージョンで、if/else文の連続の代わりとして同様に使うことができます。

## 構文

マッチ式は値、キーワード`match`と少なくとも1つの`case`句を持ちます。
```scala mdoc
import scala.util.Random

val x: Int = Random.nextInt(10)

x match {
  case 0 => "zero"
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
}
```
上記の`val x`は0から10の間のランダムな整数です。`x`は`match`演算子の左オペランドで、右側は4つのケースを持つ式です。
最後のケース`_`は その他の取りうる整数値のための"全てを捕捉する"ケースです。
ケースは*オルタナティブ*とも呼ばれます。

マッチ式は値を持ちます。
```scala mdoc
def matchTest(x: Int): String = x match {
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
}
matchTest(3)  // other
matchTest(1)  // one
```
全てのケースでStringを返しているので、このマッチ式はString型を持ちます。
そのため関数`matchTest`はStringを返します。

## ケースクラスでのマッチング

ケースクラスはパターンマッチングで特に役立ちます。

```scala mdoc
abstract class Notification

case class Email(sender: String, title: String, body: String) extends Notification

case class SMS(caller: String, message: String) extends Notification

case class VoiceRecording(contactName: String, link: String) extends Notification

```
`Notification`は抽象スーパークラスで、ケースクラスの実装`Email`、 `SMS`、 `VoiceRecording`3つの具象クラスがあります。
今、これらのケースクラスでパターンマッチングをすることができます。

```
def showNotification(notification: Notification): String = {
  notification match {
    case Email(sender, title, _) =>
      s"You got an email from $sender with title: $title"
    case SMS(number, message) =>
      s"You got an SMS from $number! Message: $message"
    case VoiceRecording(name, link) =>
      s"you received a Voice Recording from $name! Click the link to hear it: $link"
  }
}
val someSms = SMS("12345", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")

println(showNotification(someSms))  // You got an SMS from 12345! Message: Are you there? が出力されます。

println(showNotification(someVoiceRecording))  // you received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123 が出力されます。
```
関数`showNotification`は抽象型`Notification`をパラメータとして受け取り、`Notification`の型でマッチします（すなわち`Email`、`SMS`、または `VoiceRecording`のいずれであるかを解決します）。
`case Email(sender, title, _)` ではフィールド`sender`と`title`が戻り値として使われますが、`_`を使うことでフィールド`body`は無視されます。

## パターンガード
パターンガードはケースをより具体的にするために使われる簡単な真偽表現です。
`if <boolean式>`をパターンの後ろに追加するだけです。

```

def showImportantNotification(notification: Notification, importantPeopleInfo: Seq[String]): String = {
  notification match {
    case Email(sender, _, _) if importantPeopleInfo.contains(sender) =>
      "You got an email from special someone!"
    case SMS(number, _) if importantPeopleInfo.contains(number) =>
      "You got an SMS from special someone!"
    case other =>
      showNotification(other) // 特別なものではなく、オリジナルのshowNotification関数に委譲します。
  }
}

val importantPeopleInfo = Seq("867-5309", "jenny@gmail.com")

val someSms = SMS("867-5309", "Are you there?")
val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")
val importantEmail = Email("jenny@gmail.com", "Drinks tonight?", "I'm free after 5!")
val importantSms = SMS("867-5309", "I'm here! Where are you?")

println(showImportantNotification(someSms, importantPeopleInfo))
println(showImportantNotification(someVoiceRecording, importantPeopleInfo))
println(showImportantNotification(importantEmail, importantPeopleInfo))
println(showImportantNotification(importantSms, importantPeopleInfo))
```

`case Email(sender, _, _) if importantPeopleInfo.contains(sender)`では、パターンは`sender`が重要な人のリストに存在して初めてマッチします。

## 型のみでのマッチング

以下のように型のみでマッチすることができます。
```scala mdoc
abstract class Device
case class Phone(model: String) extends Device {
  def screenOff = "Turning screen off"
}
case class Computer(model: String) extends Device {
  def screenSaverOn = "Turning screen saver on..."
}

def goIdle(device: Device) = device match {
  case p: Phone => p.screenOff
  case c: Computer => c.screenSaverOn
}
```
`def goIdle`は`Device`の型によって異なる振る舞いをします。
これはケースがそのパターンのメソッドを呼び出す必要がある時に役立ちます。
ケースの識別子には型の最初の一文字（この場合に`p`と`c`）を利用する慣習があります。

## シールドクラス
トレイトとクラスに`sealed`をつけると、全てのサブタイプは同一ファイル内で宣言されなければならないという意味になります。
これは全てのサブタイプが既知であることを保証します。

```scala mdoc
sealed abstract class Furniture
case class Couch() extends Furniture
case class Chair() extends Furniture

def findPlaceToSit(piece: Furniture): String = piece match {
  case a: Couch => "Lie on the couch"
  case b: Chair => "Sit on the chair"
}
```
これは"全てに対応する"ケースを必要としなくて済むので、パターンマッチングで役立ちます。

## 注意
Scalaのパターンマッチング文は[ケースクラス](case-classes.html)で表現される代数型のマッチングに最も役立ちます。


Scalaでは[抽出子オブジェクト](extractor-objects.html)の`unapply`メソッドを使うと、ケースクラスのパターンを独自に定義することもできます。
