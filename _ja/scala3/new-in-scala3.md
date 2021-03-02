---
layout: singlepage-overview
title: New in Scala 3
scala3: true
---

Scala 3 はScala 2 から大幅な改善が行われ、さまざまな新機能が追加されています。
ここでは Scala 3 の特に重要な変更点を概観します。

より詳しく知りたい方は以下の参考リンクをご覧ください。

- [Scala 3 Book]({% link _overviews/scala3-book/introduction.md %}) はScalaを書いたことがない開発者向けに書かれています。
- [Syntax Summary][syntax-summary] ではScala 3 で新しく追加されたシンタックスを解説しています。
- [Language Reference][reference] を見ればScala 2 と Scala 3の変更点を詳しく確認できます。
- Scala 2 からScala 3 への移行を考えている方は[Migration Guide][migration] をご覧ください。

## What's new in Scala 3
Scala 3 は Scala 2 を徹底的に見直して再設計されています。核心部分で、型システムの多くの面が変更されより原理原則に基づいたものになりました。この変更によって新機能(ユニオン型)が使えるようになったこともそうですが、なにより型システムがさらに使いやすくなりました。 例えば、[型推論][type-inference] や overload resolution が改善されました.

### 新機能 & 特長: 文法
(重要度の低い)多くの文法の整理に加えて、Scala 3 の文法は次のように改善されました。

- 制御構造( `if`, `while`, や `for`)を書く際に括弧を省略してより簡潔に書けるようになりました。 ([new control syntax][syntax-control])
-  `new` キーワードがオプショナルになりました。 (_aka_ [creator applications][creator])
- [Optional braces][syntax-indentation]: クロージャを中括弧`{}`ではなくインデントで表現できるようになりました。
- [ワイルドカード型][syntax-wildcard] が `_` から `?` に変更されました。
- Implicitsとその文法が [大幅に修正][implicits]されました.

### Opinionated: Contextual Abstractions
それぞれを組み合わせることで高い(そして時には見たこともないような)表現力を発揮する一連の強力な機能をユーザーにあたえることがScalaの当初のコアコンセプトとしてありました。(これは今でもある程度は当てはまります。) 例えば _implicit_ の機能は、コンテキストの受け渡し、型レベル演算、型クラス、暗黙の変換、既存クラスの拡張メソッドなどに使われています。

これらのユースケースを参考にして、Scala 3 では少し違ったアプローチをとっています。Scala 3 では、`implicit`がどのようなメカニズムによるものか、ということよりもどのような意図で使われるのかに焦点を当てています。

Scala3 ではひとつの強力な機能として`implicit`を提供するのではなく、開発者がその意図を表現しやすいように複数の異なる言語機能として提供しています。

- **Abtracting over contextual information**. [Using clauses][contextual-using]を使って呼び出し時に利用可能で、暗黙に引き渡されるべき情報を抽象化することができます。Scala 2 からの改善としては、`using` 節が型だけで指定できるようになったことが挙げられます。 これによって明示的に参照されることのない関数の引数に命名する必要がなくなりました。
- **Providing Type-class instances**. [Given instances][contextual-givens] を使ってある型に対応する _canonical value_ を定義することができます。実装を公開することなく、型クラスを使ったプログラミングをよりわかりやすく書けます。。

- **Retroactively extending classes**. In Scala 2 では拡張メソッドは暗黙の変換か implicit classを使って書くことができました. 一方 Scala 3 では [extension methods][contextual-extension] が直接的に言語使用に含まれているのでよりわかりやすいエラーメッセージを表示できます。型推論も改善されました。
- **Viewing one type as another**. 暗黙の変換は型クラス`Conversion`のインスタンスとしてゼロから [再設計][contextual-conversions]されました。 
- **Higher-order contextual abstractions**. 全く新しい 機能である  [context functions][contextual-functions] は暗黙の引数をとる関数型を第一級オブジェクトとして扱います。この機能はライブラリ作者にとって重要です。また、簡潔なドメイン特化言語(DSL)を記述するのにも役立ちます。

- **Actionable feedback from the compiler**. コンパイラが暗黙の引数の解決に失敗した場合、解決に役立つ [import suggestions](https://www.scala-lang.org/blog/2020/05/05/scala-3-import-suggestions.html) を提示します。

### Say What You Mean: 型システムの改善
型推論の大幅な改善に加えて、 Scala 3 の型システムは他にも様々な新機能があります。これらの機能は型で不変な値を静的に表現するパワフルな手段を提供します。

- **Enumerations**. [Enums][enums] は case class と上手く組み合わせられるよう、また代数的データ型[algebraic data types][enums-adts]の新しい標準をつくるために再設計されました

- **Opaque Types**.  [opaque type aliases][types-opaque]を使うとパフォーマンス低下の懸念なしに実装の詳細を隠ぺいできます。 Opaque types は値クラスにとってかわる概念です。Opaque types を使うとBoxingのオーバーヘッドを起こすことなく抽象化のバリアを設定できます。

- **Intersection and union types**. 型システムの基盤を刷新したことで、新しい型システムの機能が使えるようになりました: 交差型 [intersection types][types-intersection](`A & B` と表記する)のインスタンスは  `A` でありかつ `B`であるような型のインスタンスです。 合併型[union types][types-union](`A | B` と表記する) のインスタンスは `A`または`B`のどちらか一方の型のインスタンスです。 これらの2つの構成体は開発者が継承ヒエラルキー以外の方法で柔軟に型制約を表現できるようにします。

- **Dependent function types**. Scala 2 ではすでに引数の型に応じて返り値の型を変化させることができました。Scala 3 ではこのパターンをさらに抽象化することができ、[dependent function types][types-dependent]を表現することができます。 つまり `type F = (e: Entry) => e.Key` というふうに、返り値の型が引数によって変化するように書けます。

- **Polymorphic function types**. dependent function types のように Scala 2 では型パラメタを受け取るメソッドを定義することができました。 しかし、開発者はこれらのメソッドをさらに抽象化することはできませんでした。Scala 3 では、`[A] => List[A] => List[A]` といった書き方をする[polymorphic function types][types-polymorphic] を使って引数に加えて型引数をとるような関数を抽象化できます。

- **Type lambdas**. Scala 2 で[compiler plugin](https://github.com/typelevel/kind-projector)を使わないと表現できなかった型ラムダは Scala 3 では第一級の機能としてサポートされています。: 型ラムダは補助的な型を定義しないでも高階型引数として引数を受け渡せる型レベルの関数です。
- **Match types**. 暗黙の型解決を使って型レベル演算をエンコードする代わりに、Scala 3 では型のパターンマッチング[matching on types][types-match]をサポートしています。 型レベルの演算を型チェックと統合することでエラーメッセージをわかりやすく改善し、また複雑なエンコーディングをしなくていいようにしています。


### 再構想: オブジェクト指向プログラミング
Scala は常に関数型プログラミングとオブジェクト指向プログラミングの間のフロンティアにあります。そしてScala 3 はその境界を両方に広げます。
先に言及した型システムの変更とcontextual abtstractions の再設計によって、関数型プログラミングを以前にも増して簡単に書けるようになりました。
同時に、次に掲げる新機能を使うと _オブジェクト指向設計_ をうまく構造化してベストプラクティスを実践しやすくなります。
- **Pass it on**. Trait は class のように 引数をとれるようになりました。詳しくは [parameters][oo-trait-parameters] をご覧ください。 これによって trait はソフトウェアをモジュールに分解するツールとしてよりいっそうパワフルになりました。
- **Plan for extension**.  継承を意図していないクラスが継承されてしまうことはオブジェクト指向設計において長年の問題でした。この問題に対処するため Scala 3 では [open classes][oo-open]の概念を導入することで _明示的に_ クラスを継承可能であるとしめすようライブラリ作者に要求するようにしました。
- **Hide implementation details**. ふるまいを実装した Utility traits は推論される型に含まれるべきでない場合があります。Scala 3 ではそのようなtraitsに [transparent][oo-transparent] とマークすることで継承をユーザーに公開しないようにすることができます。
- **Composition over inheritance**. このフレーズはしばしば引用されますが、実装するのは面倒です。 しかしScala 3 の [export clauses][oo-export]を使えば楽になります。imports と対称的に、 export clauses はオブジェクトの特定のメンバーへアクセスするためのエイリアスを定義します。
- **No more NPEs**. Scala 3 はかつてないほどnull安全です。: [explicit null][oo-explicit-null] によって `null` を型ヒエラルキーの外側に追い出しました。これによってエラーを静的にキャッチしやすくなります。また、 [safe initialization][oo-safe-init]の追加的なチェックで初期化されていないオブジェクトへのアクセスを検知できます。

### Batteries Included: メタプログラミング
Scala 2 のマクロはあくまで実験的な機能という位置づけでしたが、Scala 3 ではメタプログラミングに役立つ強力なツールが標準ライブラリに入っています。

 [macro tutorial]({% link _overviews/scala3-macros/index.md %}) のページに異なった機能についての詳しい情報があります。特に Scala 3 は次のようなメタプログラミングのための機能を提供しています。

- **Inline**. [inline][meta-inline] を使うことで値やメソッドをコンパイル時に評価できます。 このシンプルな機能はさまざまなユースケースに対応しています。また同時に`inline`はより高度な機能のエントリーポイントとしても使えます。
- **Compile-time operations**. [`scala.compiletime`][meta-compiletime] パッケージには inline method を実装するのに役立つ追加的な機能が含まれています。
- **Quoted code blocks**. Scala 3 には [quasi-quotation][meta-quotes]という新機能があります。この機能を使えば扱いやすい高レベルなインターフェースを介してコードを組み立てたり分析したりすることができます。  `'{ 1 + 1 }` と書くだけで1 と 1 を足すASTを組み立てられます。
- **Reflection API**. もっと高度なユースケースでは [TASTy reflect][meta-reflection]を使ってより細かくプログラムツリーを操作したり生成したりすることができます。


Scala 3 のメタプログラミングについてもっと知りたいかたは、 こちらの[tutorial][meta-tutorial]をご覧ください。


[enums]: {{ site.scala3ref }}/enums/enums.html
[enums-adts]: {{ site.scala3ref }}/enums/adts.html

[types-intersection]: {{ site.scala3ref }}/new-types/intersection-types.html
[types-union]: {{ site.scala3ref }}/new-types/union-types.html
[types-dependent]: {{ site.scala3ref }}/new-types/dependent-function-types.html
[types-lambdas]: {{ site.scala3ref }}/new-types/type-lambdas.html
[types-polymorphic]: {{ site.scala3ref }}/new-types/polymorphic-function-types.html
[types-match]: {{ site.scala3ref }}/new-types/match-types.html
[types-opaque]: {{ site.scala3ref }}/other-new-features/opaques.html

[type-inference]: {{ site.scala3ref }}/changed-features/type-inference.html
[overload-resolution]: {{ site.scala3ref }}/changed-features/overload-resolution.html
[reference]: {{ site.scala3ref }}/overview.html
[creator]: {{ site.scala3ref }}/other-new-features/creator-applications.html
[migration]: https://scalacenter.github.io/scala-3-migration-guide

[implicits]: {{ site.scala3ref }}/contextual/motivation.html
[contextual-using]: {{ site.scala3ref }}/contextual/using-clauses.html
[contextual-givens]: {{ site.scala3ref }}/contextual/givens.html
[contextual-extension]: {{ site.scala3ref }}/contextual/extension-methods.html
[contextual-conversions]: {{ site.scala3ref }}/contextual/conversions.html
[contextual-functions]: {{ site.scala3ref }}/contextual/context-functions.html

[syntax-summary]: {{ site.scala3ref }}/syntax.html
[syntax-control]: {{ site.scala3ref }}/other-new-features/control-syntax.html
[syntax-indentation]: {{ site.scala3ref }}/other-new-features/indentation.html
[syntax-wildcard]: {{ site.scala3ref }}/changed-features/wildcards.html

[meta-tutorial]: {% link _overviews/scala3-macros/index.md %}
[meta-inline]: {% link _overviews/scala3-macros/tutorial/inline.md %}
[meta-compiletime]: {% link _overviews/scala3-macros/tutorial/compiletime.md %}
[meta-quotes]: {% link _overviews/scala3-macros/tutorial/quotes.md %}
[meta-reflection]: {% link _overviews/scala3-macros/tutorial/reflection.md %}

[oo-explicit-null]: {{ site.scala3ref }}/other-new-features/explicit-nulls.html
[oo-safe-init]: {{ site.scala3ref }}/other-new-features/safe-initialization.html
[oo-trait-parameters]: {{ site.scala3ref }}/other-new-features/trait-parameters.html
[oo-open]: {{ site.scala3ref }}/other-new-features/open-classes.html
[oo-transparent]: {{ site.scala3ref }}/other-new-features/transparent-traits.html
[oo-export]: {{ site.scala3ref }}/other-new-features/export.html
