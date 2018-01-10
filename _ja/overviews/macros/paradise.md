---
layout: multipage-overview
language: ja

discourse: false

partof: macros
overview-name: Macros

num: 10

title: マクロパラダイス
---
<span class="label success" style="float: right;">NEW</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

> I have always imagined that paradise will be a kind of library.
> <small>Jorge Luis Borges, "Poem of the Gifts"</small>

マクロパラダイス (Macro paradise) とは Scala の複数のバージョンをサポートするコンパイラプラグインで、一般向けにリリースされている <code>scalac</code> と共に正しく動作するように設計されている。
これによって、将来の Scala に取り込まれるよりもいち早く最新のマクロ機能を使えるようになっている。
[サポートされている機能とバージョンの一覧](/ja/overviews/macros/roadmap.html))に関してはロードマップページを、
動作の保証に関しては[マクロパラダイスのアナウンスメント](http://scalamacros.org/news/2013/08/07/roadmap-for-macro-paradise.html)を参照してほしい。

    ~/210x $ scalac -Xplugin:paradise_*.jar -Xshow-phases
        phase name  id  description
        ----------  --  -----------
            parser   1  parse source into ASTs, perform simple desugaring
     macroparadise   2  let our powers combine
             namer   3  resolve names, attach symbols to trees in paradise
    packageobjects   4  load package objects in paradise
             typer   5  the meat and potatoes: type the trees in paradise
                    ...

マクロパラダイスプラグインに対してコンパイル時の依存性を導入するマクロパラダイスの機能と、コンパイル時の依存性を導入しない機能があるが、どの機能も実行時にはマクロパラダイスを必要としない。
詳細は[機能の一覧を](/ja/overviews/macros/roadmap.html)参照。

具体例に関しては [https://github.com/scalamacros/sbt-example-paradise](https://github.com/scalamacros/sbt-example-paradise) を参照してほしいが、要点をまとめると、マクロパラダイスを使うには以下の二行をビルド定義に加えるだけでいい
(すでに[sbt を使っている](/ja/overviews/macros/overview.html#using_macros_with_maven_or_sbt)ことが前提だが):

    resolvers += Resolver.sonatypeRepo("releases")

    addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0-M4" cross CrossVersion.full)

マクロパラダイスを Maven から利用するには、Stack Overflow の [Enabling the macro-paradise Scala compiler plugin in Maven projects](http://stackoverflow.com/questions/19086241/enabling-the-macro-paradise-scala-compiler-plugin-in-maven-projects) に書かれた手順に従ってほしい。
(Sonatype snapshots と `scala-reflect.jar` への依存性を追加することにも注意)

    <compilerPlugins>
      <compilerPlugin>
        <groupId>org.scalamacros</groupId>
        <artifactId>paradise_<YOUR.SCALA.VERSION></artifactId>
        <version>2.1.0-M4</version>
      </compilerPlugin>
    </compilerPlugins>

マクロパラダイスのソースは [https://github.com/scalamacros/paradise](https://github.com/scalamacros/paradise) から入手できる。
最新の 2.10.x リリース版、
最新の 2.11.0 リリース版、
Scala 2.10.x、2.11.x、2.12.x 系列のスナップショット版、
および Scala virtualized に対してそれぞれブランチがある。
