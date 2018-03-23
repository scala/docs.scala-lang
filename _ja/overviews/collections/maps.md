---
layout: multipage-overview
title: マップ

discourse: false

partof: collections
overview-name: Collections

num: 7

language: ja
---

マップ ([`Map`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Map.html)) はキーと値により構成されるペアの [`Iterable`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterable.html) の一種で、**写像** (mapping) や**関連** (association) とも呼ばれる。Scala の [`Predef`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/Predef$.html) クラスは、ペアの `(key, value)` を `key -> value` と書けるような暗黙の変換を提供する。例えば、`Map("x" -> 24, "y" -> 25, "z" -> 26)` は `Map(("x", 24), ("y", 25), ("z", 26))` と全く同じことを意味するがより可読性が高い。

マップの基本的な演算は集合のものと似ている。それらは、以下の表にまとめられており、以下のカテゴリーに分類できる:

* **検索演算** には `apply`、`get`、`getOrElse`、`contains`、および `isDefinedAt` がある。これらはマップをキーから値への部分関数に変える。マップの最も基本的な検索メソッドは `def get(key): Option[Value]` だ。"`m get key`" という演算はマップが `key` に関連する値があるかを調べる。もしあれば、マップはその関連する値を `Some` に包んで返す。`key` がマップ中に定義されていなければ `get` は `None` を返す。マップはまた、任意のキーに関連する値を `Option` に包まずに直接返す `apply` メソッドも定義する。マップにキーが定義されていない場合は、例外が発生する。
* **加算と更新演算**である `+`、`++`、`updated` は、マップに新しい対応関係を追加するか、既存の対応関係を更新する。
* **減算**である `-`、 `--` は、対応関係をマップから削除する。
* **サブコレクション取得演算**である `keys`、`keySet`、`keysIterator`、`values`、`valuesIterator` は、マップのキーや値を様々な形で別に返す。
* **変換演算**である `filterKeys` と `mapValues` は、既存のマップの対応関係をフィルターしたり変換することで新たなマップを生成する。

### Map トレイトの演算 ###

| 使用例                    | 振る舞い|
| ------                   | ------                                                           |
|  **検索演算:**            |                                                                  |
|  `ms get k`  	            |マップ `ms` 内のキー `k` に関連付けられた値のオプション値、もしくは、キーが見つからない場合、`None`。|
|  `ms(k)`  	            |(展開した場合、`ms apply k`) マップ `ms` 内のキー `k` に関連付けられた値、もしくは、キーが見つからない場合は例外。|
|  `ms getOrElse (k, d)`    |マップ `ms` 内のキー `k` に関連付けられた値、もしくは、キーが見つからない場合、デフォルト値 `d`。|
|  `ms contains k`  	    |`ms` がキー `k` への写像を含むかを調べる。|
|  `ms isDefinedAt k`  	    |`contains` に同じ。                             |
| **加算と更新演算:**|						     |
|  `ms + (k -> v)`          |`ms` 内の全ての写像と、キー `k` から値 `v` への写像 `k -> v` を含むマップ。|
|  `ms + (k -> v, l -> w)`  |`ms` 内の全ての写像と、渡されたキーと値のペアを含むマップ。|
|  `ms ++ kvs`              |`ms` 内の全ての写像と、`kvs`内の全てのキーと値のペアを含むマップ。|
|  `ms updated (k, v)`      |`ms + (k -> v)` に同じ。|
| **減算:**             |						     |
|  `ms - k`  	            |キー `k` からの写像を除く、`ms` 内の全ての写像。|
|  `ms - (k, 1, m)`  	    |渡されたキーからの写像を除く、`ms` 内の全ての写像。|
|  `ms -- ks`  	            |`ks`内のキーからの写像を除く、`ms` 内の全ての写像。|
|   **サブコレクション取得演算:**     |						     |
|  `ms.keys`  	            |`ms`内の全てのキーを含む iterable。|
|  `ms.keySet`              |`ms`内の全てのキーを含む集合。|
|  `ms.keysIterator`        |`ms`内の全てのキーを返すイテレータ。|
|  `ms.values`      	    |`ms`内のキーに関連付けられた全ての値を含む iterable。|
|  `ms.valuesIterator`      |`ms`内のキーに関連付けられた全ての値を返すイテレータ。|
|   **変換演算:**     |						     |
|  `ms filterKeys p`        |キーが条件関数 `p` を満たす `ms`内の写像のみを含むマップのビュー。|
|  `ms mapValues f`         |`ms`内のキーに関連付けられた全ての値に関数 `f` を適用して得られるマップのビュー。|

可変マップ ([`mutable.Map`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/Map.html)) は他にも以下の表にまとめた演算をサポートする。

### mutable.Map トレイトの演算 ###

| 使用例                    | 振る舞い|
| ------                   | ------                                                           |
|  **加算と更新演算:**            |                                                                  |
|  `ms(k) = v`              |(展開した場合、`ms.update(x, v)`)。マップ `ms` に副作用としてキー `k` から値 `v` への写像を加え、既に `k` からの写像がある場合は上書きする。|
|  `ms += (k -> v)`         |マップ `ms` に副作用としてキー `k` から値 `v` への写像を加え、`ms`自身を返す。|
|  `ms += (k -> v, l -> w)` |マップ `ms` に副作用として渡された写像を加え、`ms`自身を返す。|
|  `ms ++= kvs`             |マップ `ms` に副作用として `kvs`内の全ての写像を加え、`ms`自身を返す。|
|  `ms put (k, v)`          |マップ `ms` にキー `k` から値 `v` への写像を加え、以前の `k` からの写像のオプション値を返す。|
|  `ms getOrElseUpdate (k, d)`|マップ `ms`内にキー `k` が定義されている場合は、関連付けられた値を返す。定義されていない場合は、`ms` に写像 `k -> d` を加え、`d` を返す。|
|  **減算:**|						     |
|  `ms -= k`                |マップ `ms` から副作用としてキー `k` からの写像を削除して、`ms`自身を返す。|
|  `ms -= (k, l, m)`        |マップ `ms` から副作用として渡されたキーからの写像を削除して、`ms`自身を返す。|
|  `ms --= ks`              |マップ `ms` から副作用として `ks`内の全てのキーからの写像を削除して、`ms`自身を返す。|
|  `ms remove k`            |マップ `ms` からキー `k` からの写像を削除して、以前の `k` からの写像のオプション値を返す。|
|  `ms retain p`            |`ms`内の写像でキーが条件関数 `p` を満たすものだけを残す。|
|  `ms.clear()`             |`ms` から全ての写像を削除する。|
|  **変換演算:**      |						     |
|  `ms transform f`         |マップ `ms`内の全ての関連付けされた値を関数 `f` を使って変換する。|
|  **クローン演算:**             |						     |
|  `ms.clone`               |`ms` と同じ写像を持つ新しい可変マップを返す。|

マップの加算と減算は、集合のそれにならう。集合と同様、非破壊的な演算である `+`、`-`、と `updated` を提供するが、加算マップをコピーする必要があるため、これらはあまり使われることがない。そのかわり、可変マップは通常 `m(key) = value` か `m += (key -> value)` という2種類の更新演算を使って上書き更新される。さらに前に `key` から関連付けされていた値を
`Option`値で返すか、マップに `key` が無ければ `None` を返すというバリアントである `m put (key, value)` もある。

`getOrElseUpdate` はキャッシュとして振る舞うマップにアクセスするのに役立つ。例えば、関数 `f` により呼び出される時間のかかる計算があるとする:

    scala> def f(x: String) = {
           println("taking my time."); sleep(100)
           x.reverse }
    f: (x: String)String

さらに、`f` には副作用を伴わず、同じ引数で何回呼び出しても同じ戻り値が返ってくると仮定する。この場合、引数と以前の `f` 計算結果の対応関係をマップに格納して、引数がマップに無いときだけ `f` の結果を計算すれば時間を節約できる。この時、マップは関数 `f` の計算の**キャッシュ**であると言える。

    val cache = collection.mutable.Map[String, String]()
    cache: scala.collection.mutable.Map[String,String] = Map()

これにより、より効率的な、キャッシュするバージョンの関数 `f` を作成することができる:

    scala> def cachedF(s: String) = cache.getOrElseUpdate(s, f(s))
    cachedF: (s: String)String
    scala> cachedF("abc")
    taking my time.
    res3: String = cba
    scala> cachedF("abc")
    res4: String = cba

`getOrElseUpdate` の第二引数は「名前渡し」(by-name) であるため、上の `f("abc")` は `getOrElseUpdate` が必要とする場合、つまり第一引数が `cache` に無い場合においてのみ計算されることに注意してほしい。 `cachedF` をより率直に、普通の map 演算を用いて実装することもできるが、コードは少し長くなる:

    def cachedF(arg: String) = cache get arg match {
      case Some(result) => result
      case None =>
        val result = f(x)
        cache(arg) = result
        result
    }

### 同期集合と同期マップ ###

`SynchronizedMap` トレイトを好みのマップ実装にミックスインすることでスレッドセーフな可変マップを得ることができる。例えば、以下のコードが示すように、`HashMap` に `SynchronizedMap` をミックスインすることができる。この例は `Map` と `SynchronizedMap` の二つのトレイト、そして `HashMap` という一つのクラスを `scala.collection.mutable` パッケージからインポートすることから始まる。例の残りは `makeMap` というメソッドを宣言するシングルトンオブジェクト `MapMaker` を定義する。`makeMap` メソッドは戻り値の型を文字列をキーとして文字列を値とする可変マップだと宣言する。

      import scala.collection.mutable.{Map,
          SynchronizedMap, HashMap}
      object MapMaker {
        def makeMap: Map[String, String] = {
            new HashMap[String, String] with
                SynchronizedMap[String, String] {
              override def default(key: String) =
                "Why do you want to know?"
            }
        }
      }

`makeMap` 本文の第1ステートメントは `SynchronizedMap` トレイトをミックスインする新しい可変 `HashMap` を作成する:

    new HashMap[String, String] with
      SynchronizedMap[String, String]

このコードを与えられると、Scala コンパイラは `SynchronizedMap` をミックスインする `HashMap` の合成的な子クラスを生成し、そのインスタンスを作成する (そして、それを戻り値として返す)。この合成クラスは、以下のコードのため、`default` という名前のメソッドをオーバーライドする。:

    override def default(key: String) =
      "何故知りたい？"

通常は、ある特定のキーに対する値をマップに問い合わせて、そのキーからの写像が無い場合は`NoSuchElementException` が発生する。新たなマップのクラスを定義して `default` メソッドをオーバーライドした場合は、しかしながら、存在しないキーに対する問い合わせに対して、この新しいマップは `default` が返す値を返す。そのため、同期マップのコードでコンパイラに生成された `HashMap` の合成の子クラスは、存在しないキーに対する問い合わせに `"何故知りたい？"` と少々意地の悪い答えを返す。

`makeMap` メソッドが返す可変マップは `SynchronizedMap` トレイトをミックスインするため、複数のスレッドから同時に使うことができる。マップへのそれぞれのアクセスは同期化される。以下は、インタープリタ中で一つのスレッドから使用した例だ:

    scala> val capital = MapMaker.makeMap  
    capital: scala.collection.mutable.Map[String,String] = Map()
    scala> capital ++ List("US" -> "Washington",
            "France" -> "Paris", "Japan" -> "Tokyo")
    res0: scala.collection.mutable.Map[String,String] =
      Map(France -> Paris, US -> Washington, Japan -> Tokyo)
    scala> capital("Japan")
    res1: String = Tokyo
    scala> capital("New Zealand")
    res2: String = Why do you want to know?
    scala> capital += ("New Zealand" -> "Wellington")
    scala> capital("New Zealand")                    
    res3: String = Wellington

同期集合も同期マップと同じ要領で作成することができる。例えば、このように `SynchronizedSet` トレイトをミックスインすることで同期 `HashSet` を作ることができる:

    import scala.collection.mutable
    val synchroSet =
      new mutable.HashSet[Int] with
          mutable.SynchronizedSet[Int]

最後に、同期コレクションを使うことを考えているならば、`java.util.concurrent` の並行コレクションを使うことも考慮した方がいいだろう。
