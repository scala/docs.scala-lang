---
layout: overview-large
title: Macro Paradise

disqus: true

partof: macros
num: 8
outof: 9
---
<span class="label success" style="float: right;">NEW</span>

**Eugene Burmako**

Macro paradise is a plugin to the 2.10.x series of Scala compilers,
It is designed to reliably work with production releases of <code>scalac</code>,
making latest macro developments available way before they end up in future versions Scala.

    ~/210x $ scalac -Xplugin:macro-paradise_*.jar -Xshow-phases
        phase name  id  description
        ----------  --  -----------
            parser   1  parse source into ASTs, perform simple desugaring
     macroparadise   2  let our powers combine
             namer   3  resolve names, attach symbols to trees in paradise
    packageobjects   4  load package objects in paradise
             typer   5  the meat and potatoes: type the trees in paradise
                    ...

Consult [https://github.com/scalamacros/sbt-example-paradise](https://github.com/scalamacros/sbt-example-paradise)
for an end-to-end example, but in a nutshell working with macro paradise is as easy as adding these two lines
to your build (granted you’ve already [set up SBT](http://docs.scala-lang.org/overviews/macros/overview.html#using_macros_with_maven_or_sbt)
to use macros):

    resolvers += Resolver.sonatypeRepo("snapshots")
    addCompilerPlugin("org.scala-lang.plugins" % "macro-paradise_2.10.3-RC1" % "2.0.0-SNAPSHOT")