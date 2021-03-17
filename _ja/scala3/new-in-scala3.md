---
layout: singlepage-overview
title: New in Scala 3
scala3: true
---

Scala 3 は Scala 2 から大幅な改善が行われ、さまざまな新機能が追加されている。
ここでは Scala 3 の特に重要な変更点を概観する。

より詳しく知りたい方は以下の参考リンクを参照。

- [Scala 3 Book]({% link _overviews/scala3-book/introduction.md %}) は Scala を書いたことがない開発者向けに書かれている。
- [Syntax Summary][syntax-summary] では Scala 3 で新しく追加されたシンタックスを解説している。
- [Language Reference][reference] を見ればScala 2 と Scala 3 の変更点を詳しく確認できる。
- Scala 2 から Scala 3 への移行を考えている方は[Migration Guide][migration] を参照。

## What's new in Scala 3
Scala 3 は Scala 2 を徹底的に見直して再設計されている。核心部分で、型システムの多くの面が変更されより原理原則に基づいたものになった。この変更によって新機能(ユニオン型)が使えるようになったことにくわえて、なにより型システムがさらに使いやすくなった。 例えば、[型推論][type-inference] や overload resolution が改善された.

### 新機能 & 特長: 文法
(重要度の低い)多くの文法の整理に加えて、Scala 3 の文法は次のように改善された。

- 制御構造( `if`, `while`, や `for`)を書く際に括弧を省略してより簡潔に書けるようになった。 ([new control syntax][syntax-control])
- `new` キーワードがオプショナルになった。 (_aka_ [creator applications][creator])
- [Optional braces][syntax-indentation]: クロージャを中括弧`{}`ではなくインデントで表現できるようになった。
- [ワイルドカード型][syntax-wildcard] が `_` から `?` に変更された。
- Implicitsとその文法が [大幅に修正][implicits]された。

### Opinionated: Contextual Abstractions
それぞれを組み合わせることで高い(そして時には見たこともないような)表現力を発揮する一連の強力な機能をユーザーにあたえることがScalaの当初のコアコンセプトとしてあった。(これは今でもある程度は当てはまる。) 例えば _implicit_ の機能は、コンテキストの受け渡し、型レベル演算、型クラス、暗黙の変換、既存クラスの拡張メソッドなどに使われている。

これらのユースケースを参考にして、Scala 3 では少し違ったアプローチをとっている。Scala 3 では、`implicit`がどのようなメカニズムによるものか、ということよりもどのような意図で使われるのかに焦点を当てている。

Scala 3 ではひとつの強力な機能として`implicit`を提供するのではなく、開発者がその意図を表現しやすいように複数の異なる言語機能として提供している。

- **Abtracting over contextual information**. [Using clauses][contextual-using]を使って呼び出し時に利用可能で、暗黙に引き渡されるべき情報を抽象化することができる。Scala 2 からの改善としては、`using` 節が型だけで指定できるようになったことが挙げられる。 これによって明示的に参照されることのない関数の引数に命名する必要がなくなった。
- **Providing Type-class instances**. [Given instances][contextual-givens] を使ってある型に対応する _canonical value_ を定義することができる。実装を公開することなく、型クラスを使ったプログラミングをよりわかりやすく書ける。

- **Retroactively extending classes**. Scala 2 では拡張メソッドは暗黙の変換か implicit classを使って書くことができた. 一方 Scala 3 では [extension methods][contextual-extension] が直接的に言語使用に含まれているのでよりわかりやすいエラーメッセージを表示できる。型推論も改善された。
- **Viewing one type as another**. 暗黙の変換は型クラス`Conversion`のインスタンスとしてゼロから [再設計][contextual-conversions]された。 
- **Higher-order contextual abstractions**. 全く新しい機能である  [context functions][contextual-functions] は暗黙の引数をとる関数型を第一級オブジェクトとして扱う。この機能はライブラリ作者にとって重要である。また、簡潔なドメイン特化言語(DSL)を記述するのにも役立つ。

- **Actionable feedback from the compiler**. コンパイラが暗黙の引数の解決に失敗した場合、解決に役立つ [import suggestions](https://www.scala-lang.org/blog/2020/05/05/scala-3-import-suggestions.html) を提示する。

### Say What You Mean: 型システムの改善
型推論の大幅な改善に加えて、 Scala 3 の型システムは他にも様々な新機能がある。これらの機能は型で不変な値を静的に表現するパワフルな手段を提供する。

- **Enumerations**. [Enums][enums] は case class と上手く組み合わせられるよう、また代数的データ型[algebraic data types][enums-adts]の新しい標準をつくるために再設計された

- **Opaque Types**.  [opaque type aliases][types-opaque]を使うとパフォーマンス低下の懸念なしに実装の詳細を隠ぺいできる。 Opaque types は値クラスにとってかわる概念だ。Opaque types を使うと Boxing のオーバーヘッドを起こすことなく抽象化のバリアを設定できる。

- **Intersection and union types**. 型システムの基盤を刷新したことで、新しい型システムの機能が使えるようになった: 交差型 [intersection types][types-intersection](`A & B` と表記する)のインスタンスは  `A` でありかつ `B`であるような型のインスタンスだ。 合併型[union types][types-union](`A | B` と表記する) のインスタンスは `A`または`B`のどちらか一方の型のインスタンスだ。 これらの2つの構成体は開発者が継承ヒエラルキー以外の方法で柔軟に型制約を表現できるようにする。

- **Dependent function types**. Scala 2 ではすでに引数の型に応じて返り値の型を変化させることができました。Scala 3 ではこのパターンをさらに抽象化することができ、[dependent function types][types-dependent]を表現することができる。 つまり `type F = (e: Entry) => e.Key` というふうに、返り値の型が引数によって変化するように書けます。

- **Polymorphic function types**. dependent function types のように Scala 2 では型パラメータを受け取るメソッドを定義することができました。 しかし、開発者はこれらのメソッドをさらに抽象化することはできませんでした。Scala 3 では、`[A] => List[A] => List[A]` といった書き方をする[polymorphic function types][types-polymorphic] を使って引数に加えて型引数をとるような関数を抽象化できる。

- **Type lambdas**. Scala 2 で[compiler plugin](https://github.com/typelevel/kind-projector)を使わないと表現できなかった型ラムダは Scala 3 では第一級の機能としてサポートされている。: 型ラムダは補助的な型を定義しないでも高階型引数として引数を受け渡せる型レベルの関数である。
- **Match types**. 暗黙の型解決を使って型レベル演算をエンコードする代わりに、Scala 3 では型のパターンマッチング[matching on types][types-match]をサポートしている。 型レベルの演算を型チェックと統合することでエラーメッセージをわかりやすく改善し、また複雑なエンコーディングをしなくていいようにしている。


### 再構想: オブジェクト指向プログラミング
Scala は常に関数型プログラミングとオブジェクト指向プログラミングの間のフロンティアにある。そして Scala 3 はその境界を両方に広げます。
先に言及した型システムの変更と contextual abtstractions の再設計によって、関数型プログラミングを以前にも増して簡単に書けるようになった。
同時に、次に掲げる新機能を使うと _オブジェクト指向設計_ をうまく構造化してベストプラクティスを実践しやすくなる。
- **Pass it on**. Trait は class のように 引数をとれるようになった。詳しくは [parameters][oo-trait-parameters] をご覧ください。 これによって trait はソフトウェアをモジュールに分解するツールとしてよりいっそうパワフルになった。
- **Plan for extension**.  継承を意図していないクラスが継承されてしまうことはオブジェクト指向設計において長年の問題でした。この問題に対処するため Scala 3 では [open classes][oo-open]の概念を導入することで _明示的に_ クラスを継承可能であるとしめすようライブラリ作者に要求するようにしました。
- **Hide implementation details**. ふるまいを実装した Utility traits は推論される型に含まれるべきでない場合がある。Scala 3 ではそのようなtraitsに [transparent][oo-transparent] とマークすることで継承をユーザーに公開しないようにすることができる。
- **Composition over inheritance**. このフレーズはしばしば引用されるが、実装するのは面倒だ。 しかし Scala 3 の [export clauses][oo-export]を使えば楽になる。imports と対称的に、 export clauses はオブジェクトの特定のメンバーへアクセスするためのエイリアスを定義する。
- **No more NPEs**. Scala 3 はかつてないほど null 安全だ。: [explicit null][oo-explicit-null] によって `null` を型ヒエラルキーの外側に追い出しました。これによってエラーを静的にキャッチしやすくなる。また、 [safe initialization][oo-safe-init]の追加的なチェックで初期化されていないオブジェクトへのアクセスを検知できる。

### Batteries Included: メタプログラミング
Scala 2 のマクロはあくまで実験的な機能という位置づけだが、Scala 3 ではメタプログラミングに役立つ強力なツールが標準ライブラリに入っている。

 [macro tutorial]({% link _overviews/scala3-macros/index.md %}) のページに異なった機能についての詳しい情報がある。特に Scala 3 は次のようなメタプログラミングのための機能を提供している。

- **Inline**. [inline][meta-inline] を使うことで値やメソッドをコンパイル時に評価できる。 このシンプルな機能はさまざまなユースケースに対応している。また同時に`inline`はより高度な機能のエントリーポイントとしても使える。
- **Compile-time operations**. [`scala.compiletime`][meta-compiletime] パッケージには inline method を実装するのに役立つ追加的な機能が含まれている。
- **Quoted code blocks**. Scala 3 には [quasi-quotation][meta-quotes]という新機能がある。この機能を使えば扱いやすい高レベルなインターフェースを介してコードを組み立てたり分析したりすることができる。  `'{ 1 + 1 }` と書くだけで1 と 1 を足すASTを組み立てられる。
- **Reflection API**. もっと高度なユースケースでは [TASTy reflect][meta-reflection]を使ってより細かくプログラムツリーを操作したり生成したりすることができる。


Scala 3 のメタプログラミングについてもっと知りたいかたは、 こちらの[tutorial][meta-tutorial]を参照。


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
