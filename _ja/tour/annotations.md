---
layout: tour
title: アノテーション
language: ja

discourse: true

partof: scala-tour

num: 32
next-page: packages-and-imports
previous-page: by-name-parameters

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

アノテーション句はそれに続く最初の定義か宣言に適用されます。定義と宣言の前には1つ以上のアノテーション句を置くことができます。これらの句の順番は重要ではありません。


## エンコーディングの正確性を保証するアノテーション
条件が一致しない場合にコンパイルを失敗させるアノテーションもあります。例えば、アノテーション`@tailrec`はメソッドが[末尾再帰](https://en.wikipedia.org/wiki/Tail_call)であると保証します。末尾再帰ではメモリ使用量が一定になります。こちらは階乗を計算するメソッドの中での使われ方です。
```scala mdoc
import scala.annotation.tailrec

def factorial(x: Int): Int = {

  @tailrec
  def factorialHelper(x: Int, accumulator: Int): Int = {
    if (x == 1) accumulator else factorialHelper(x - 1, accumulator * x)
  }
  factorialHelper(x, 1)
}
```
`factorialHelper`メソッドは`@tailrec`を持ちます。`@tailrec`はメソッドが実際に末尾再帰であると保証します。もし`factorialHelper`の実装を以下のように変更すれば、失敗し
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
`@inline`のようなアノテーションは生成されたコードに影響します(つまり、アノテーションを使わなかった場合とでjarファイルのバイト数が異なる場合があります)。インライン化とは、メソッドを呼び出している箇所にメソッド本体のコードを挿入することを意味します。結果のバイトコードはより長くなりますが、上手くいけば実行が早くなります。アノテーション`@inline`を使ってもメソッドのインライン化が保証されるわけではありません。しかし、生成されたコードのサイズに関するヒューリスティックスが満たされた場合に限りコンパイラにインライン化をさせます。

### Javaのアノテーション ###
Javaと相互運用するScalaのコードを書いている時、記述するアノテーション構文は少し違います。

**注:** Javaアノテーションを使う場合、`-target:jvm-1.8`オプションを使ってください。

Javaには[アノテーション](https://docs.oracle.com/javase/tutorial/java/annotations/)の形をしたユーザー定義メタデータがあります。Javaのアノテーションの特徴は、要素の初期化のために名前と値のペアを指定する必要があることです。例えば、クラスのソースを追いかけるためのアノテーションが必要なとき、以下のように定義するかもしれません。

```
@interface Source {
  public String URL();
  public String mail();
}
```

そして、それは以下のように適用されます。

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
public class MyClass extends TheirClass ...
```

Scalaでのアノテーションの適用はコンストラクタの呼び出しと似ています。Javaのアノテーションをインスタンス化するためには名前付き引数を使う必要があります。

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
class MyScalaClass ...
```

アノテーションが(デフォルト値を除き)要素を1つだけ含む場合、この構文はかなり退屈です。そのため慣例により、名前が`value`と指定されていれば、コンストラクタのような構文でJavaに適用できます。

```
@interface SourceURL {
    public String value();
    public String mail() default "";
}
```

そして以下のように適用します。

```
@SourceURL("https://coders.com/")
public class MyClass extends TheirClass ...
```

この場合、Scalaでも同じことができます。

```
@SourceURL("https://coders.com/")
class MyScalaClass ...
```

`mail`要素はデフォルト値つきで定義されているので、明示的に値を指定する必要がありません。しかしながら、もし値を指定する必要がある場合、Javaでは2つのスタイルを混ぜて組み合わせることはできません。

```
@SourceURL(value = "https://coders.com/",
           mail = "support@coders.com")
public class MyClass extends TheirClass ...
```

Scalaはこの点においてより柔軟です。

```
@SourceURL("https://coders.com/",
           mail = "support@coders.com")
    class MyScalaClass ...
```
