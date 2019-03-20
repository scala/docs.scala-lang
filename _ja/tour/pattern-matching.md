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

redirect_from: "/tutorials/tour/pattern-matching.html"
---

パターンマッチングはパターンに対応させて値をチェックするための機能です。
マッチに成功すれば、はその構成要素のパーツを一つの値に分解することもできます。
Javaの`switch`文の強化バージョンで、if/else文の連続の代わりとして同様に使うことができます。

## 構文

マッチ式は値、キーワード`match`と最低でも1つの`case`句を持ちます。
```tut
import scala.util.Random

val x: Int = Random.nextInt(10)

x match {
  case 0 => "zero"
  case 1 => "one"
  case 2 => "two"
  case _ => "many"
}
```
上記の`val x`は0から10の間のランダムな整数です。`x`は`match`演算子の左オペランドで、右側は4つのケースを持つ式です。
最後のケース`_`は 2より大きい全ての数字のための"全てを捕捉する"ケースです。
ケースは*オルタナティブ*とも呼ばれます。

マッチ表現は値を持ちます。
```tut
def matchTest(x: Int): String = x match {
  case 1 => "one"
  case 2 => "two"
  case _ => "many"
}
matchTest(3)  // many
matchTest(1)  // one
```
このマッチ表現はString型を持ちます、なぜなら全てのケースはStringを返します。
そのため関数`matchTest`はStringを返します。

## ケースクラスでのマッチング

ケースクラスはパターンマッチングで特に役立ちます。

```tut
abstract class Notification

case class Email(sender: String, title: String, body: String) extends Notification

case class SMS(caller: String, message: String) extends Notification

case class VoiceRecording(contactName: String, link: String) extends Notification

```
`Notification`はケースクラスで実装された`Email`、 `SMS`、 そして`VoiceRecording`3つの具体的なお知らせの種類を持つ抽象スーパークラスです。
今、これらのケースクラスでパターンマッチングをすることができます。

```
def showNotification(notification: Notification): String = {
  notification match {
    case Email(email, title, _) =>
      s"You got an email from $email with title: $title"
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
関数`showNotification`は抽象型`Notification`のパラメータとして受け取り、`Notification` の種類とマッチします（すなわち`Email`、`SMS`、または `VoiceRecording`のいずれであるかを解決します）。
`case Email(email, title, _)` ではフィールド`email`と`title`が戻り値として使われますが、`_`を使うことでフィールド`body`は無視されます。

## パターンガード
パターンガードはケースをより特別にするために使われる簡単な真偽表現です。
ただ`if <boolean expression>`をパターンの後ろに追加するだけです。

```

def showImportantNotification(notification: Notification, importantPeopleInfo: Seq[String]): String = {
  notification match {
    case Email(email, _, _) if importantPeopleInfo.contains(email) =>
      "You got an email from special someone!"
    case SMS(number, _) if importantPeopleInfo.contains(number) =>
      "You got an SMS from special someone!"
    case other =>
      showNotification(other) // 特別なものではなく、オリジナルのshowNotification関数に委任します。
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

`case Email(email, _, _) if importantPeopleInfo.contains(email)`では、パターンは`email`が重要な人のリストに存在して初めてマッチします。

## 型のみでのマッチング

以下のように型のみでマッチすることができます。
```tut
abstract class Device
case class Phone(model: String) extends Device{
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
`def goIdle`は`Device`のタイプによって異なる振る舞いをします。
これはケースがパターン内でメソッドを呼び出す必要がある時に役立ちます。
ケースの識別子には型の最初の一文字（この場合に`p`と`c`）を利用する慣習があります。

## シールドクラス
トレイトとクラスは全てのサブタイプは同一ファイル内で宣言されているべきとする`sealed`でマークすることができます。
これは全てのサブタイプは既知であると保証します。

```tut
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
Scalaのパターンマッチング文は[ケース型](case-classes.html)を通して代数型の表現のマッチングの際に最も役立ちます。


Scalaは[抽出子オブジェクト](extractor-objects.html)で`unapply`メソッドを利用した独立したケースクラスのパターン定義ができます。
