---
layout: multipage-overview

discourse: false

partof: reflection
overview-name: Reflection

num: 6

language: ja
title: スレッドセーフティ
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

残念ながら Scala 2.10.0 でリリースされた現行の状態ではリフレクションはスレッドセーフではない。
[SI-6240](https://issues.scala-lang.org/browse/SI-6240) が報告されているので、それを使って進捗を追跡したり、技術的な詳細を照会することができるが、ここに現状で分かっていることをまとめてみたい。

<p><span class="label success">NEW</span>Thread safety issues have been fixed in Scala 2.11.0-RC1, but we are going to keep this document available for now, since the problem still remains in the Scala 2.10.x series, and we currently don't have concrete plans on when the fix is going to be backported.</p>

現在の所、リフレクション関連では 2通りの競合状態があることが分かっている。第一はリフレクションの初期化
(`scala.reflect.runtime.universe` が最初にアクセルされるときに呼ばれるコード)
は複数のスレッドから安全に呼び出すことができない。
第二に、シンボルの初期化
(シンボルのフラグまたは型シグネチャが最初にアクセスされたときに呼ばれるコード)
も安全ではない。以下が典型的な症例だ:

    java.lang.NullPointerException:
    at s.r.i.Types$TypeRef.computeHashCode(Types.scala:2332)
    at s.r.i.Types$UniqueType.<init>(Types.scala:1274)
    at s.r.i.Types$TypeRef.<init>(Types.scala:2315)
    at s.r.i.Types$NoArgsTypeRef.<init>(Types.scala:2107)
    at s.r.i.Types$ModuleTypeRef.<init>(Types.scala:2078)
    at s.r.i.Types$PackageTypeRef.<init>(Types.scala:2095)
    at s.r.i.Types$TypeRef$.apply(Types.scala:2516)
    at s.r.i.Types$class.typeRef(Types.scala:3577)
    at s.r.i.SymbolTable.typeRef(SymbolTable.scala:13)
    at s.r.i.Symbols$TypeSymbol.newTypeRef(Symbols.scala:2754)

実行時リフレクション (`scala.reflect.runtime.universe` から公開されるもの)
に比べてコンパイル時リフレクション (`scala.reflect.macros.Context` によってマクロに公開されるもの)
の方がこの問題の影響を受けづらいことはせめてもの救いだ。
第一の理由は、マクロが実行される段階においてはコンパイル時リフレクションのユニバースは既に初期化済みであるため、競合状態の最初の状態は無くなることだ。
第二の理由はこれまでにコンパイラそのものがスレッドセーフであったことが無いため、並列実行を行なっているツールが無いことだ。
しかし、複数のスレッドを作成するマクロを作っている場合は気をつけるべきだろう。

一転して、実行時リフレクションの話は暗くなる。リフレクションの初期化は
`scala.reflect.runtime.universe` が初期化されるときに呼び出され、これは間接的に起こりうる。
中でも顕著な例は context bound の `TypeTag` がついたメソッドを呼び出すと問題が起こりえることだ。
これは、そのようなメソッドを呼び出すと Scala は普通は型タグを自動生成する必要があり、そのために型を生成する必要があり、そのためにはリフレクションのユニバースの初期化が必要だからだ。この結果、特殊な対策を取らない限りテストなどから
`TypeTag` を使ったメソッドを安全に呼び出すことができないということが導き出される。
これは sbt など多くのツールがテストを並列実行するからだ。

まとめ:

<ul>
<li>マクロを書いているならば、明示的にスレッドを使わない限り大丈夫だ。</li>
<li>実行時リフレクションとスレッドやアクターを混ぜると危険。</li>
<li><code>TypeTag</code> の context bound を使ったメソッドを複数のスレッドから呼び出すと非決定的な結果になる可能性がある。</li>
<li>この問題の進捗を知りたければ <a href="https://issues.scala-lang.org/browse/SI-6240">SI-6240</a> を参照する。</li>
</ul>
