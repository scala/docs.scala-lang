---
layout: tour
title: アノテーション
language: ja

discourse: true

partof: scala-tour

num: 32
next-page: default-parameter-values
previous-page: by-name-parameters

redirect_from: "/tutorials/tour/annotations.html"
---

アノテーションはメタ情報と定義を関連づけます。例えば、メソッドの前のアノテーション`@deprecated`はメソッドが使われたらコンパイラに警告を出力させます。
```
object DeprecationDemo extends App {
  @deprecated("deprecation message", "release # which deprecates method")
  def hello = "hola"

  hello  
}
```
これはコンパイルされますが、コンパイラは警告"there was one deprecation warning"を出力します。

アノテーション句はそれに続くに最初の定義か宣言に適用されます。定義と宣言の前には1つ以上のアノテーション句を置くことができます。与えられたこれらの句の中での順番は重要ではありません。


## エンコーディングの正確性を保証するアノテーション
確かにいくつかのアノテーションは条件が一致すればコンパイルを失敗させます。例えば、アノテーション`@tailrec`はメソッドは[末尾再帰](https://en.wikipedia.org/wiki/Tail_call)であると保証します。末尾再帰は必須メモリを一定に維持します。こちらは階乗を計算するメソッドの中での使われ方です。
```tut
import scala.annotation.tailrec

def factorial(x: Int): Int = {

  @tailrec
  def factorialHelper(x: Int, accumulator: Int): Int = {
    if (x == 1) accumulator else factorialHelper(x - 1, accumulator * x)
  }
  factorialHelper(x, 1)
}
```
`factorialHelper`メソッドは`@tailrec`を持ちます。`@tailrec`はメソッドが実際に末尾再帰であることを保証します。もし`factorialHelper`の実装を以下のように変更すれば、失敗し
```
import scala.annotation.tailrec

def factorial(x: Int): Int = {
  @tailrec
  def factorialHelper(x: Int): Int = {
    if (x == 1) 1 else x * factorialHelper(x - 1)
  }
  factorialHelper(x)
}
```
"Recursive call not in tail position"というメッセージを受け取ります。


## コード生成に影響するアノテーション
`@inline`のようなアノテーションは生成されたコードに影響します。(つまり、アノテーションを使わなかった場合とでjarファイルのバイト数が異なる場合があります。)インライン化は呼び出し時にメソッドの本体へのコード挿入を意味します。結果のバイトコードはより長くなりますが、上手くいけば実行が早くなります。アノテーション`@inline`を使ってもメソッドのインライン化はされません。しかし、生成されたコードのサイズに関するヒューリスティックスが満たされた場合に限りコンパイラにインライン化をさせます。

### Javaのアノテーション ###
Javaと相互運用するScalaのコードを書いている時、記述するアノテーション構文は少し違います。

**注:** Javaアノテーションを使う場合、`-target:jvm-1.8`オプションを使ってください。

Javaには[アノテーション](https://docs.oracle.com/javase/tutorial/java/annotations/)の形をしたユーザー定義メタデータがあります。アノテーションの主な機能は要所の初期化にのために名前と値のペアを指定する必要があります。例えば、あるクラスのソースを追いかけるためにアノテーションが必要な場合、以下のようにそれを定義します。

```
@interface Source {
  public String URL();
  public String mail();
}
```

そして、それは以下のように適用されます。

```
@Source(URL = "http://coders.com/",
        mail = "support@coders.com")
public class MyClass extends TheirClass ...
```

Scalaでのアノテーションの適用はコンストラクタの呼び出しと似ています。Javaのアノテーションをインスタンス化するためには名前付き引数を使う必要があります。

```
@Source(URL = "http://coders.com/",
        mail = "support@coders.com")
class MyScalaClass ...
```

アノテーションが(デフォルト値を除き)要素を1つだけ含む場合、この構文はかなり退屈です。そのため慣例により、名前が`value`と指定されていれば、コンストラクタっぽい構文でJavaに適用できます。

```
@interface SourceURL {
    public String value();
    public String mail() default "";
}
```

そして以下のように適用します。

```
@SourceURL("http://coders.com/")
public class MyClass extends TheirClass ...
```

この場合、Scalaは同じ可能性を提供します。

```
@SourceURL("http://coders.com/")1
class MyScalaClass ...
```

`mail`要素はデフォルト値で指定されます。そのためはっきりとそれに値を与える必要がありません。しかしながら、もしそれをする必要があるなら、Javaでは2つのスタイルを混ぜて組み合わせることはできません。

```
@SourceURL(value = "http://coders.com/",
           mail = "support@coders.com")
public class MyClass extends TheirClass ...
```

Scalaはこの点においてより多くの柔軟性を提供します。

```
@SourceURL("http://coders.com/",
           mail = "support@coders.com")
    class MyScalaClass ...
```
