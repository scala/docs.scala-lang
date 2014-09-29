---
layout: overview-large
language: ja

disqus: true

partof: macros
num: 9
outof: 10

title: マクロパラダイス
---
<span class="label success" style="float: right;">NEW</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

マクロパラダイス (Macro paradise) とは Scala 2.10.x シリーズ用のコンパイラプラグインで、一般向けにリリースされている <code>scalac</code> と共に正しく動作するように設計されている。
これによって、将来の Scala に取り込まれるよりもいち早く最新のマクロ機能を使えるようになっている。
[サポートされている機能の一覧](/ja/overviews/macros/roadmap.html))はロードマップページを参照。

    ~/210x $ scalac -Xplugin:macro-paradise_*.jar -Xshow-phases
        phase name  id  description
        ----------  --  -----------
            parser   1  parse source into ASTs, perform simple desugaring
     macroparadise   2  let our powers combine
             namer   3  resolve names, attach symbols to trees in paradise
    packageobjects   4  load package objects in paradise
             typer   5  the meat and potatoes: type the trees in paradise
                    ...

具体例に関しては [https://github.com/scalamacros/sbt-example-paradise](https://github.com/scalamacros/sbt-example-paradise) を参照してほしいが、要点をまとめると、マクロパラダイスを使うには以下の二行をビルド定義に加えるだけでいい
(すでに[sbt を使っている](/ja/overviews/macros/overview.html#using_macros_with_maven_or_sbt)ことが前提だが):

    resolvers += Resolver.sonatypeRepo("snapshots")

    addCompilerPlugin("org.scala-lang.plugins" % "macro-paradise" % "2.0.0-SNAPSHOT" cross CrossVersion.full)

マクロパラダイスを Maven から利用するには、Stack Overflow の [Enabling the macro-paradise Scala compiler plugin in Maven projects](http://stackoverflow.com/questions/19086241/enabling-the-macro-paradise-scala-compiler-plugin-in-maven-projects) に書かれた手順に従ってほしい。
(Sonatype snapshots と `scala-reflect.jar` への依存性を追加することにも注意)

    <compilerPlugins>
      <compilerPlugin>
        <groupId>org.scala-lang.plugins</groupId>
        <artifactId>macro-paradise_2.10.3</artifactId>
        <version>2.0.0-SNAPSHOT</version>
      </compilerPlugin>
    </compilerPlugins>

マクロパラダイスのソースは [https://github.com/scalamacros/paradise](https://github.com/scalamacros/paradise) から入手できる。
最新安定版の 2.10.3、将来出る予定の 2.10.4、2.11.0、および Scala virtualized に対してそれぞれブランチがある。
