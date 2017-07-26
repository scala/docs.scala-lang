---
layout: singlepage-overview
title: Future と Promise

partof: futures

language: ja

discourse: false
---

**Philipp Haller, Aleksandar Prokopec, Heather Miller, Viktor Klang, Roland Kuhn, Vojin Jovanovic 著**<br>
**Eugene Yokota 訳**

## 概要

**Future** は並列に実行される複数の演算を取り扱うのに便利な方法を提供する。それは効率的でノンブロッキングな方法だ。
大まかな考え方はシンプルなもので、`Future` はまだ存在しない計算結果に対するプレースホルダのようなものだ。
一般的に、`Future` の結果は並行に計算され後で集計することができる。
このように並行なタスクを合成することで、より速く、非同期で、ノンブロッキングな並列コードとなることが多い。

デフォルトでは、Future も Promise もノンブロッキングであり、典型的なブロッキング演算の代わりにコールバックを使う。
コールバックの使用を概念的にも構文的にも単純化するために、Scala は Future をノンブロッキングに合成する `flatMap`、`foreach`、`filter` といったコンビネータを提供する。
ブロックすることは可能で、(推奨されないが) 絶対に必要だという場面においては Future をブロックすることもできる。

<!--
The futures and promises API builds upon the notion of an
`ExecutionContext`, an execution environment designed to manage
resources such as thread pools between parallel frameworks and
libraries (detailed in an accompanying SIP, forthcoming). Futures and
promises are created through such `ExecutionContext`s. For example, this makes it possible,
in the case of an application which requires blocking futures, for an underlying execution
environment to resize itself if necessary to guarantee progress.
-->

## Future

`Future` は、ある時点において利用可能となる可能性のある値を保持するオブジェクトだ。
この値は、なんらかの計算結果であることが多い。
その計算が例外とともに失敗する可能性があるため、`Future` は計算が例外を投げる場合を想定して例外を保持することもできる。
ある `Future` が値もしくは例外を持つとき、`Future` は**完了**したという。
`Future` が値とともに完了した場合、`Future` はその値とともに**成功**したという。
`Future` が例外とともに完了した場合、`Future` はその例外とともに**失敗**したという。

`Future` には 1回だけ代入することができるという重要な特性がある。
一度 Future オブジェクトが値もしくは例外を持つと、実質不変となり、それが上書きされることは絶対に無い。

Future オブジェクトを作る最も簡単な方法は、非同期の計算を始めてその結果を持つ `Future` を返す
`future` メソッドを呼び出すことだ。
計算結果は `Future` が完了すると利用可能になる。

ここで注意して欲しいのは `Future[T]` は Future オブジェクトの型であり、
`future` はなんらかの非同期な計算を作成しスケジュールして、その計算結果とともに完了する
Future オブジェクトを返すメソッドだということだ。

具体例で説明しよう。
ある人気ソーシャルネットワークの API を想定して、与えられたユーザの友達のリストを取得できるものとする。
まず新しいセッションを開いて、ある特定のユーザの友達リストを申請する:

    import scala.concurrent._
    import ExecutionContext.Implicits.global

    val session = socialNetwork.createSessionFor("user", credentials)
    val f: Future[List[Friend]] = Future {
      session.getFriends()
    }

上の例では、まず `scala.concurrent` パッケージの内容をインポートすることで
`Future` 型と `future` が見えるようにしている。
2つ目のインポートは追って説明する。

次に、仮想の `createSessionFor` メソッドを呼んでサーバにリクエストを送るセッション変数を初期化している。

ユーザの友達リストを取得するには、ネットワークごしにリクエストを送信する必要があり、それは長い時間がかかる可能性がある。
これは `getFriends` メソッドで例示されている。
応答が返ってくるまでの間に CPU を有効に使うには、プログラムの残りをブロックするべきではない。
つまり、この計算は非同期にスケジュールされるべきだ。
ここで使われている `future` メソッドはまさにそれを行い、与えれたブロックを並行に実行する。
この場合は、リクエストを送信し応答を待ち続ける。

サーバが応答すると Future `f` 内において友達リストが利用可能となる。

試みが失敗すると、例外が発生するかもしれない。
以下の例では、`session` 変数の初期化が不正なため、`future` ブロック内の計算が
`NullPointerException` を投げる。この Future `f` は、この例外とともに失敗する:

    val session = null
    val f: Future[List[Friend]] = Future {
      session.getFriends
    }

上の `import ExecutionContext.Implicits.global`
という一文はデフォルトのグローバルな実行コンテキスト (execution context) をインポートする。
実行コンテキストは渡されたタスクを実行し、スレッドプールのようなものだと考えていい。
これらは、非同期計算がいつどのように実行されるかを取り扱うため、`future` メソッドに欠かせないものだ。
独自の実行コンテキストを定義して `future`
とともに使うことができるが、今のところは上記のようにデフォルトの実行コンテキストをインポートできるということが分かれば十分だ。

この例ではネットワークごしにリクエストを送信して応答を待つという仮想のソーシャルネットワーク API を考えてみた。
すぐに試してみることができる非同期の計算の例も考えてみよう。
テキストファイルがあったとして、その中である特定のキーワードが最初に出てきた位置を知りたいとする。
この計算はファイルの内容をディスクから読み込むのにブロッキングする可能性があるため、他の計算と並行実行するのは理にかなっている。

    val firstOccurence: Future[Int] = Future {
      val source = scala.io.Source.fromFile("myText.txt")
      source.toSeq.indexOfSlice("myKeyword")
    }

### コールバック

これで非同期な計算を始めて新しい Future オブジェクトを作る方法は分かったけども、計算結果が利用可能となったときにそれを使って何かをする方法をまだみていない。
多くの場合、計算の副作用だけじゃなくて、その結果に興味がある。

Future の実装の多くは、Future の結果を知りたくなったクライアントは Future が完了するまで自分の計算をブロックすることを強要する。そうしてやっと Future の計算結果を得られた後に自分の計算を続行できるようになる。
後でみるように、この方式も Scala の Future API で可能となっているが、性能という観点から見ると Future
にコールバックを登録することで完全にノンブロッキングで行う方が好ましいと言える。
このコールバックは Future が完了すると非同期に呼び出される。
コールバックの登録時に Future が既に完了している場合は、コールバックは非同期に実行されるか、もしくは同じスレッドで逐次的に実行される。

コールバックを登録する最も汎用的な方法は、`Try[T] => U` 型の関数を受け取る `onComplete` メソッドを使うことだ。
このコールバックは、Future が成功すれば `Success[T]` 型の値に適用され、失敗すれば `Failure[T]` 型の値に適用される。

この `Try[T]` は、それが何らか型の値を潜在的に保持するモナドだという意味において
`Option[T]` や `Either[T, S]` に似ている。
しかし、これは値か Throwable なオブジェクトを保持することに特化して設計されている。
`Option[T]` が値 (つまり `Some[T]`) を持つか、何も持たない (つまり `None`)
のに対して、`Try[T]` は値を持つ場合は `Success[T]` で、それ以外の場合は `Failure[T]` で必ず例外を持つ。
`Failure[T]` は、何故値が無いのかを説明できるため、`None` よりも多くの情報を持つ。
同様に `Try[T]` を `Either[Throwable, T]`、つまり左値を `Throwable` に固定した特殊形だと考えることもできる。

ソーシャルネットワークの例に戻って、最近の自分の投稿した文のリストを取得して画面に表示したいとする。
これは `List[String]` を返す `getRecentPosts` メソッドを呼ぶことで行われ、戻り値には最近の文のリストが入っている:

    val f: Future[List[String]] = Future {
      session.getRecentPosts
    }

    f onComplete {
      case Success(posts) => for (post <- posts) println(post)
      case Failure(t) => println("エラーが発生した: " + t.getMessage)
    }

`onComplete` メソッドは、Future 計算の失敗と成功の両方の結果を扱えるため、汎用性が高い。
成功した結果のみ扱う場合は、(部分関数を受け取る) `onSuccess` コールバックを使う:

    val f: Future[List[String]] = Future {
      session.getRecentPosts
    }

    f onSuccess {
      case posts => for (post <- posts) println(post)
    }

失敗した結果のみ扱う場合は、`onFailure` コールバックを使う:

    val f: Future[List[String]] = Future {
      session.getRecentPosts
    }

    f onFailure {
      case t => println("エラーが発生した: " + t.getMessage)
    }

    f onSuccess {
      case posts => for (post <- posts) println(post)
    }

`onFalure` コールバックは Future が失敗した場合、つまりそれが例外を保持する場合のみ実行される。

部分関数は `isDefinedAt` メソッドを持つため、`onFailure` メソッドはコールバックが特定の `Throwable` に対して定義されている場合のみ発火される。
以下の例では、登録された `onFailure` コールバックは発火されない:

    val f = Future {
      2 / 0
    }

    f onFailure {
      case npe: NullPointerException =>
        println("これが表示されているとしたらビックリ。")
    }

キーワードの初出の位置を検索する例に戻ると、キーワードの位置を画面に表示したいかもしれない:

    val firstOccurence: Future[Int] = Future {
      val source = scala.io.Source.fromFile("myText.txt")
      source.toSeq.indexOfSlice("myKeyword")
    }

    firstOccurence onSuccess {
      case idx => println("キーワードの初出位置: " + idx)
    }

    firstOccurence onFailure {
      case t => println("ファイルの処理に失敗した: " + t.getMessage)
    }

`onComplete`、`onSuccess`、および `onFailure` メソッドは全て `Unit` 型を返すため、これらの呼び出しを連鎖させることができない。
これは意図的な設計で、連鎖された呼び出しが登録されたコールバックの実行の順序を暗示しないようにしている
(同じ Future に登録されたコールバックは順不同に発火される)。

ここで、コールバックが実際のところ**いつ**呼ばれるのかに関して説明する必要がある。
Future 内の値が利用可能となることを必要とするため、Future が完了した後でのみ呼び出されることができる。
しかし、Future を完了したスレッドかコールバックを作成したスレッドのいずれかにより呼び出されるという保証は無い。
かわりに、コールバックは Future オブジェクトが完了した後のいつかに何らかスレッドにより実行される。
これをコールバックが実行されるのは **eventually** だという。

さらに、コールバックが実行される順序は、たとえ同じアプリケーションを複数回実行した間だけでも決定してない。
実際、コールバックは逐次的に呼び出されるとは限らず、一度に並行実行されるかもしれない。
そのため、以下の例における変数 `totalA` は計算されたテキスト内の正しい小文字と大文字の `a` の合計数を持たない場合がある。

    @volatile var totalA = 0

    val text = Future {
      "na" * 16 + "BATMAN!!!"
    }

    text onSuccess {
      case txt => totalA += txt.count(_ == 'a')
    }

    text onSuccess {
      case txt => totalA += txt.count(_ == 'A')
    }

2つのコールバックが順次に実行された場合は、変数 `totalA` は期待される値 `18` を持つ。
しかし、これらは並行して実行される可能性もあるため、その場合は `totalA` は
`+=` が atomic な演算ではないため、
(つまり、読み込みと書き込みというステップから構成されており、それが他の読み込みと書き込みの間に挟まって実行される可能性がある)
`16` または `2` という値になってしまう可能性もある。

万全を期して、以下にコールバックの意味論を列挙する:

<!-- keep this html -->
<ol>
<li>Future に <code>onComplete</code> コールバックを登録することで、対応するクロージャが Future が完了した後に eventually に実行されることが保証される。</li>

<li><code>onSuccess</code> や <code>onFailure</code> コールバックを登録することは <code>onComplete</code> と同じ意味論を持つ。ただし、クロージャがそれぞれ成功したか失敗した場合のみに呼ばれるという違いがある。</li>

<li>既に完了した Future にコールバックを登録することは (1 により) コールバックが eventually に実行されることとなる。</li>

<li>Future に複数のコールバックが登録された場合は、それらが実行される順序は定義されない。それどころか、コールバックは並行に実行される可能性がある。しかし、<code>ExecutionContext</code> の実装によっては明確に定義された順序となる可能性もある。</li>

<li>例外を投げるコールバックがあったとしても、他のコールバックは実行される。</li>

<li>完了しないコールバックがあった場合 (つまりコールバックに無限ループがあった場合)他のコールバックは実行されない可能性がある。そのような場合はブロックする可能性のあるコールバックは <code>blocking</code> 構文を使うべきだ (以下参照)。</li>

<li>コールバックの実行後はそれは Future オブジェクトから削除され、GC 対象となる。</li>
</ol>

### 関数型合成と for 内包表記

上でみたコールバック機構により Future の結果を後続の計算に連鎖することが可能となった。
しかし、場合によっては不便だったり、コードが肥大化することもある。
具体例で説明しよう。
為替トレードサービスの API があって、米ドルを有利な場合のみ買いたいとする。
まずコールバックを使ってこれを実現してみよう:

    val rateQuote = Future {
      connection.getCurrentValue(USD)
    }

    rateQuote onSuccess { case quote =>
      val purchase = Future {
        if (isProfitable(quote)) connection.buy(amount, quote)
        else throw new Exception("有益ではない")
      }

      purchase onSuccess {
        case _ => println(amount + " USD を購入した")
      }
    }

まずは現在の為替相場を取得する `rateQuote` という `Future` を作る。
この値がサーバから取得できて Future が成功した場合は、計算は
`onSuccess` コールバックに進み、ここで買うかどうかの決断をすることができる。
ここでもう 1つの Future である `purchase` を作って、有利な場合のみ買う決定をしてリクエストを送信する。
最後に、`purchase` が完了すると、通知メッセージを標準出力に表示する。

これは動作するが、2つの理由により不便だ。
第一に、`onSuccess` を使わなくてはいけなくて、2つ目の Future である
`purchase` をその中に入れ子にする必要があることだ。
例えば `purchase` が完了した後に別の貨幣を売却したいとする。
それはまた `onSuccess` の中でこのパターンを繰り返すことになり、インデントしすぎで理解しづらく肥大化したコードとなる。

第二に、`purchase` は他のコードのスコープ外にあり、`onSuccess`
コールバック内においてのみ操作することができる。
そのため、アプリケーションの他の部分は `purchase` を見ることができず、他の貨幣を売るために別の
`onSuccess` コールバックを登録することもできない。

これらの 2つの理由から Future はより自然な合成を行うコンビネータを提供する。
基本的なコンビネータの 1つが `map` で、これは与えられた Future
とその値に対する投射関数から、元の Future が成功した場合に投射した値とともに完了する新しい Future を生成する。
Future の投射はコレクションの投射と同様に考えることができる。

上の例を `map` コンビネータを使って書き換えてみよう:

    val rateQuote = Future {
      connection.getCurrentValue(USD)
    }

    val purchase = rateQuote map { quote =>
      if (isProfitable(quote)) connection.buy(amount, quote)
      else throw new Exception("有益ではない")
    }

    purchase onSuccess {
      case _ => println(amount + " USD を購入した")
    }

`rateQuote` に対して `map` を使うことで `onSuccess` コールバックを一切使わないようになった。
それと、より重要なのが入れ子が無くなったことだ。
ここで他の貨幣を売却したいと思えば、`purchase` に再び `map` するだけでいい。

しかし、`isProfitable` が `false` を返して、例外が投げられた場合はどうなるだろう?
その場合は `purchase` は例外とともに失敗する。
さらに、コネクションが壊れて `getCurrentValue` が例外を投げて `rateQuote`
が失敗した場合を想像してほしい。
その場合は、投射する値が無いため `purchase` は自動的に `rateQuote` と同じ例外とともに失敗する。

結果として、もし元の Future が成功した場合は、返される Future は元の Future の値を投射したものとともに完了する。
もし投射関数が例外を投げた場合は Future はその例外とともに完了する。
もし元の Future が例外とともに失敗した場合は、返される Future も同じ例外を持つ。
この例外を伝搬させる意味論は他のコンビネータにおいても同様だ。

Future の設計指針の 1つは for 内包表記から利用できるようにすることだった。
このため、Future は `flatMap`、`filter` そして `foreach` コンビネータを持つ。
`flatMap` メソッドは値を新しい Future `g` に投射する関数を受け取り、`g`
が完了したときに完了する新たな Future を返す。

米ドルをスイス・フラン (CHF) と交換したいとする。
両方の貨幣の為替レートを取得して、両者の値に応じて購入を決定する必要がある。
以下に for 内包表記を使った `flatMap` と `withFilter` の例をみてみよう:

    val usdQuote = Future { connection.getCurrentValue(USD) }
    val chfQuote = Future { connection.getCurrentValue(CHF) }

    val purchase = for {
      usd <- usdQuote
      chf <- chfQuote
      if isProfitable(usd, chf)
    } yield connection.buy(amount, chf)

    purchase onSuccess {
      case _ => println(amount + " CHF を購入した")
    }

この `purchase` は `usdQuote` と `chfQuote` が完了した場合のみ完了する。
これら 2つの Future の値に依存するため、それよりも早く自分の計算を始めることができない。

上の for 内包表記は以下のように翻訳される:

    val purchase = usdQuote flatMap {
      usd =>
      chfQuote
        .withFilter(chf => isProfitable(usd, chf))
        .map(chf => connection.buy(amount, chf))
    }

これは for 内包表記に比べて分かりづらいが、`flatMap` 演算をより良く理解するために解析してみよう。
`flatMap` 演算は自身の値を別の Future へと投射する。
この別の Future が完了すると、戻り値の Future もその値とともに完了する。
上記の例では、`flatMap` は `usdQuote` Future の値を用いて `chfQuote`
の値をある特定の値のスイス・フランを購入するリクエストを送信する 3つ目の Future に投射している。
結果の Future である `purchase` は、この 3つ目の Future が `map` から帰ってきた後にのみ完了する。

これは難解だが、幸いな事に `flatMap` 演算は使いやすく、また分かりやすい
for 内包表記以外の場合はあまり使われない。

`filter` コンビネータは、元の Future の値が条件関数を満たした場合のみその値を持つ新たな Future を作成する。
それ以外の場合は新しい Future は `NoSuchElementException` とともに失敗する。
Future に関しては、`filter` の呼び出しは `withFilter` の呼び出しと全く同様の効果がある。

`collect` と `filter` コンビネータの関係はコレクション API におけるこれらのメソッドの関係に似ている。

`foreach` コンビネータで注意しなければいけないのは値が利用可能となった場合に走査するのにブロックしないということだ。
かわりに、`foreach` のための関数は Future が成功した場合のみ非同期に実行される。
そのため、`foreach` は `onSuccess` コールバックと全く同じ意味を持つ。

`Future` トレイトは概念的に (計算結果と例外という) 2つの型の値を保持することができるため、例外処理のためのコンビネータが必要となる。

`rateQuote` に基いて何らかの額を買うとする。
`connection.buy` メソッドは `amount` と期待する `quote` を受け取る。
これは買われた額を返す。
`quote` に変更があった場合は、何も買わずに `QuoteChangedException` を投げる。
例外の代わりに `0` を持つ Future を作りたければ `recover` コンビネータを用いる:

    val purchase: Future[Int] = rateQuote map {
      quote => connection.buy(amount, quote)
    } recover {
      case QuoteChangedException() => 0
    }

`recover` コンビネータは元の Future が成功した場合は同一の結果を持つ新たな Future
を作成する。成功しなかった場合は、元の Future を失敗させた `Throwable`
に渡された部分関数が適用される。
もしそれが `Throwable` を何らかの値に投射すれば、新しい Future はその値とともに成功する。
もしその `Throwable` に関して部分関数が定義されていなければ、結果となる
Future は同じ `Throwable` とともに失敗する。

`recoverWith` コンビネータは元の Future が成功した場合は同一の結果を持つ新たな Future
を作成する。成功しなかった場合は、元の Future を失敗させた `Throwable`
に渡された部分関数が適用される。
もしそれが `Throwable` を何らかの Future に投射すれば、新しい Future はその Future とともに成功する。
`recover` に対する関係は `flatMap` と `map` の関係に似ている。

`fallbackTo` コンビネータは元の Future が成功した場合は同一の結果を持ち、成功しなかった場合は引数として渡された Future の成功した値を持つ新たな Future を作成する。
この Future と引数の Future が両方失敗した場合は、新しい Future はこの Future の例外とともに失敗する。
以下に米ドルの値を表示することを試みて、米ドルの取得に失敗した場合はスイス・フランの値を表示する具体例をみてみよう:

    val usdQuote = Future {
      connection.getCurrentValue(USD)
    } map {
      usd => "値: " + usd + " USD"
    }
    val chfQuote = Future {
      connection.getCurrentValue(CHF)
    } map {
      chf => "値: " + chf + "CHF"
    }

    val anyQuote = usdQuote fallbackTo chfQuote

    anyQuote onSuccess { println(_) }

`andThen` コンビネータは副作用の目的のためだけに用いられる。
これは、成功したか失敗したかに関わらず現在の Future と全く同一の結果を返す新たな Future を作成する。
現在の Future が完了すると、`andThen` に渡されたクロージャが呼び出され、新たな Future
はこの Future と同じ結果とともに完了する。
これは複数の `andThen` 呼び出しが順序付けられていることを保証する。
ソーシャルネットワークからの最近の投稿文を可変セットに保存して、全ての投稿文を画面に表示する以下の具体例をみてみよう:

    val allposts = mutable.Set[String]()

    Future {
      session.getRecentPosts
    } andThen {
      case Success(posts) => allposts ++= posts
    } andThen {
      case _ =>
      clearAll()
      for (post <- allposts) render(post)
    }

まとめると、Future に対する全てのコンビネータは元の Future に関連する新たな Future
を返すため、純粋関数型だといえる。

### 投射

例外として返ってきた結果に対して for 内包表記が使えるように Future は投射を持つ。
元の Future が失敗した場合は、`failed` 投射は `Throwable` 型の値を持つ Future を返す。
もし元の Future が成功した場合は、`failed` 投射は `NoSuchElementException`
とともに失敗する。以下は例外を画面に表示する具体例だ:

    val f = Future {
      2 / 0
    }
    for (exc <- f.failed) println(exc)

以下の例は画面に何も表示しない:

    val f = Future {
      4 / 2
    }
    for (exc <- f.failed) println(exc)

<!--
There is another projection called `timedout` which is specific to the
`FutureTimeoutException`. It works in exactly the same way as the
`failed` projection, but is triggered only for this exception type. In
all other cases, it fails with a `NoSuchElementException`.
-->

<!--
TODO: the `failed` projection can be extended to be parametric in
the throwable types it matches.
-->

<!--
Invoking the `Future` construct uses an implicit execution context to start an asynchronous computation. In the case the client desires to use a custom execution context to start an asynchronous computation:

    val f = Future {
      4 / 2
    }(customExecutionContext)
-->

### Future の拡張

Future API にユーティリティメソッドを追加して拡張できるようにすることを予定している。
これによって、外部フレームワークはより特化した使い方を提供できるようになる。

## ブロッキング

前述のとおり、性能とデッドロックの回避という理由から Future をブロックしないことを強く推奨する。
コールバックとコンビネータを使うことが Future の結果を利用するのに適した方法だ。
しかし、状況によってはブロックすることが必要となるため、Future API と Promise API
においてサポートされている。

前にみた為替取引の例だと、アプリケーションの最後に全ての Future
が完了することを保証するためにブロックする必要がある。
Future の結果に対してブロックする方法を以下に具体例で説明しよう:

    import scala.concurrent._
    import scala.concurrent.duration._

    def main(args: Array[String]) {
      val rateQuote = Future {
        connection.getCurrentValue(USD)
      }

      val purchase = rateQuote map { quote =>
        if (isProfitable(quote)) connection.buy(amount, quote)
        else throw new Exception("有益ではない")
      }

      Await.result(purchase, 0 nanos)
    }

Future が失敗した場合は、呼び出し元には Future が失敗した例外が送られてくる。
これは `failed` 投射を含むため、元の Future が成功した場合は
`NoSuchElementException` が投げられることとなる。

代わりに、`Await.ready` を呼ぶことで Future が完了するまで待機するがその結果を取得しないことができる。
同様に、このメソッドを呼んだ時に Future が失敗したとしても例外は投げられない。

`Future` トレイトは `ready()` と `result()` というメソッドを持つ `Awaitable` トレイトを実装する。
これらのメソッドはクライアントからは直接呼ばれず、実行コンテキストからのみ呼ばれる。

`Awaitable` トレイトを実装することなくブロックする可能性のある第三者のコードを呼び出すために、以下のように
`blocking` 構文を使うことができる:

    blocking {
      potentiallyBlockingCall()
    }

ブロックされたコードは例外を投げるかもしれない。その場合は、呼び出し元に例外が送られる。

## 例外処理

非同期の計算が処理されない例外を投げた場合、その計算が行われた Future は失敗する。
失敗した Future は計算値のかわりに `Throwable` のインスタンスを格納する。
`Future` は、`Throwable` に適用することができる `PartialFunction` を受け取る
`onFailure` コールバックメソッドを提供する。
以下の特別な例外に対しては異なる処理が行われる:

1. `scala.runtime.NonLocalReturnControl[_]`。この例外は戻り値に関連する値を保持する。
典型的にはメソッド本文内の `return` 構文はこの例外を用いた `throw` へと翻訳される。
この例外を保持するかわりに、関連する値が Future もしくは Promise に保存される。

2. `ExecutionException`。`InterruptedException`、`Error`、もしくは `scala.util.control.ControlThrowable`
が処理されないことで計算が失敗した場合に格納される。
この場合は、処理されなかった例外は `ExecutionException` に保持される。
これらの例外は非同期計算を実行するスレッド内で再び投げられる。
この理由は、通常クライアント側で処理されないクリティカルもしくは制御フロー関連の例外が伝搬することを回避し、同時に Future の計算が失敗したことをクライアントに通知するためだ。

より正確な意味論の説明は [`NonFatal`](http://www.scala-lang.org/api/current/index.html#scala.util.control.NonFatal$) を参照。

## Promise

これまでの所、`future` メソッドを用いた非同期計算により作成される `Future` オブジェクトのみをみてきた。
しかし、Future は **Promise** を用いて作成することもできる。

Future がリードオンリーのまだ存在しない値に対するプレースホルダ・オブジェクトの一種だと定義されるのに対して、Promise
は書き込み可能で、1度だけ代入できるコンテナで Future を完了させるものだと考えることができる。
つまり、Promise は `success` メソッドを用いて (約束を「完了させる」ことで) Future を値とともに成功させることができる。
逆に、Promise  は `failure` メソッドを用いて Future を例外とともに失敗させることもできる。

Promise の `p` は `p.future` によって返される Future を完了させる。
この Future は Promise `p` に特定のものだ。実装によっては `p.future eq p` の場合もある。

ある計算が値を生産し、別の計算がそれを消費する Producer-Consumer の具体例を使って説明しよう。
この値の受け渡しは Promise を使って実現している。

    import scala.concurrent.{ Future, Promise }
    import scala.concurrent.ExecutionContext.Implicits.global

    val p = Promise[T]()
    val f = p.future

    val producer = Future {
      val r = produceSomething()
      p success r
      continueDoingSomethingUnrelated()
    }

    val consumer = Future {
      startDoingSomething()
      f onSuccess {
        case r => doSomethingWithResult()
      }
    }

ここでは、まず Promise を作って、その `future` メソッドを用いて完了される `Future`
を取得する。
まず何らかの計算が実行され、`r` という結果となり、これを用いて Future `f` を完了させ、`p` という約束を果たす。
ここで注意してほしいのは、`consumer` は `producer` が `continueDoingSomethingUnrelated()` を実行し終えてタスクが完了する前に結果を取得できることだ。

前述の通り、Promise は 1度だけ代入できるという意味論を持つ。
そのため、完了させるのも 1回だけだ。
既に完了 (もしくは失敗した) Promise に対して `success` を呼び出すと
`IllegalStateException` が投げられる。

以下は Promise を失敗させる具体例だ。

    val p = Promise[T]()
    val f = p.future

    val producer = Future {
      val r = someComputation
      if (isInvalid(r))
        p failure (new IllegalStateException)
      else {
        val q = doSomeMoreComputation(r)
        p success q
      }
    }

ここでは `producer` は中間結果 `r` を計算して、それが妥当であるか検証する。
不正であれば、Promise `p` を例外を用いて完了させることで Promise を失敗させる。
それ以外の場合は、`producer` は計算を続行して Promise `p` を妥当な結果用いて完了させることで、Future
`f` を完了させる。

Promise は潜在的な値である `Try[T]` (失敗した結果の `Failure[Throwable]`
もしくは成功した結果の `Success[T]`)
を受け取る `complete` メソッドを使って完了させることもできる。

`success` 同様に、既に完了した Promise に対して `failure` や `complete` を呼び出すと
`IllegalStateException` が投げられる。

これまでに説明した Promise の演算とモナディックで副作用を持たない演算を用いて合成した Future
を使って書いたプログラムの便利な特性としてそれらが決定的 (deterministic) であることが挙げられる。
ここで決定的とは、プログラムで例外が投げられなければ、並列プログラムの実行スケジュールのいかんに関わらずプログラムの結果
(Future から観測される値) は常に同じものとなるという意味だ。

場合によってはクライアントは Promise が既に完了していないときにのみ完了させたいこともある
(例えば、複数の HTTP がそれぞれ別の Future から実行されていて、クライアントは最初の戻ってきた
HTTP レスポンスにのみ興味がある場合で、これは最初に Promise を完了させる Future に対応する)。
これらの理由のため、Promise には `tryComplete`、`trySuccess`、および `tryFailure` というメソッドがある。
クライアントはこれらのメソッドを使った場合はプログラムの結果は決定的でなくなり実行スケジュールに依存することに注意するべきだ。

`completeWith` メソッドは別の Future を用いて Promise を完了させる。
渡された Future が完了すると、その Promise も Future の値とともに完了する。
以下のプログラムは `1` と表示する:

    val f = Future { 1 }
    val p = Promise[Int]()

    p completeWith f

    p.future onSuccess {
      case x => println(x)
    }

Promise を例外とともに失敗させる場合は、`Throwable` の 3つのサブタイプが特殊扱いされる。
Promise を失敗させた `Throwable` が `scala.runtime.NonLocalReturnControl`
の場合は、Promise は関連する値によって完了させる。
Promise を失敗させた `Throwable` が `Error`、`InterruptedException`、もしくは
`scala.util.control.ControlThrowable` の場合は、`Throwable`
は新たな `ExecutionException` の理由としてラッピングされ Promise が失敗させられる。

Promise、Future の `onComplete` メソッド、そして `future`
構文を使うことで前述の関数型合成に用いられるコンビネータの全てを実装することができる。
例えば、2つの Future `f` と `g` を受け取って、(最初に成功した) `f` か `g`
のどちらかを返す `first` という新しいコンビネータを実装したいとする。
以下のように書くことができる:

    def first[T](f: Future[T], g: Future[T]): Future[T] = {
      val p = Promise[T]()

      f onSuccess {
        case x => p.tryComplete(x)
      }

      g onSuccess {
        case x => p.tryComplete(x)
      }

      p.future
    }


<!--
## Migration p

scala.actor.Futures?
for clients


## Implementing custom futures and promises p
for library writers
-->

## ユーティリティ

並列アプリケーション内における時間の扱いを単純化するために　`scala.concurrent`
は `Duration` という抽象体を導入する。
`Duration` は既に他にもある一般的な時間の抽象化を目的としていない。
並列ライブラリとともに使うことを目的とするため、`scala.concurrent` パッケージ内に置かれている。

`Duration` は時の長さを表す基底クラスで、それは有限でも無限でもありうる。
有限の時間は `FiniteDuration` クラスによって表され `Long` の長さと `java.util.concurrent.TimeUnit`
によって構成される。
無限時間も `Duration` を継承し、これは `Duration.Inf` と `Duration.MinusInf` という 2つのインスタンスのみが存在する。
このライブラリは暗黙の変換のためのいくつかの `Duration` のサブクラスを提供するが、これらは使用されるべきではない。

抽象クラスの `Duration` は以下のメソッドを定義する:

1. 時間の単位の変換 (`toNanos`、`toMicros`、`toMillis`、
`toSeconds`、`toMinutes`、`toHours`、`toDays`、及び `toUnit(unit: TimeUnit)`)。
2. 時間の比較 (`<`、`<=`、`>`、および `>=`)。
3. 算術演算 (`+`、`-`、`*`、`/`、および `unary_-`)。
4. この時間 `this` と引数として渡された時間の間の最小値と最大値 (`min`、`max`)。
5. 時間が有限かの検査 (`isFinite`)。

`Duration` は以下の方法で作成することができる:

1. `Int` もしくは `Long` 型からの暗黙の変換する。例: `val d = 100 millis`。
2. `Long` の長さと `java.util.concurrent.TimeUnit` を渡す。例: `val d = Duration(100, MILLISECONDS)`。
3. 時間の長さを表す文字列をパースする。例: `val d = Duration("1.2 µs")`。

`Duration` は `unapply` メソッドも提供するため、パータンマッチング構文の中から使うこともできる。以下に具体例をみる:

    import scala.concurrent.duration._
    import java.util.concurrent.TimeUnit._

    // 作成
    val d1 = Duration(100, MILLISECONDS) // from Long and TimeUnit
    val d2 = Duration(100, "millis") // from Long and String
    val d3 = 100 millis // implicitly from Long, Int or Double
    val d4 = Duration("1.2 µs") // from String

    // パターンマッチング
    val Duration(length, unit) = 5 millis
