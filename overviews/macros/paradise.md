---
layout: overview-large
title: Macro Paradise

disqus: true

partof: macros
num: 9
outof: 10
languages: [ja]
---
<span class="label success" style="float: right;">NEW</span>

**Eugene Burmako**

Macro paradise is a plugin for several versions of Scala compilers.
It is designed to reliably work with production releases of <code>scalac</code>,
making latest macro developments available way before they end up in future versions Scala.
Refer to the roadmap for [the list of supported features and versions](/overviews/macros/roadmap.html).

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
to your build (granted you’ve already [set up SBT](/overviews/macros/overview.html#using_macros_with_maven_or_sbt)
to use macros):

    resolvers += Resolver.sonatypeRepo("snapshots")
    addCompilerPlugin("org.scala-lang.plugins" % "macro-paradise" % "2.0.0-SNAPSHOT" cross CrossVersion.full)

To use macro paradise in Maven follow the instructions provided at Stack Overflow on the page ["Enabling the macro-paradise Scala compiler plugin in Maven projects"](http://stackoverflow.com/questions/19086241/enabling-the-macro-paradise-scala-compiler-plugin-in-maven-projects) (also make sure to add the dependency on the Sonatype snapshots repository and `scala-reflect.jar`).

    <compilerPlugins>
      <compilerPlugin>
        <groupId>org.scala-lang.plugins</groupId>
        <artifactId>macro-paradise_2.10.3</artifactId>
        <version>2.0.0-SNAPSHOT</version>
      </compilerPlugin>
    </compilerPlugins>

Sources of macro paradise are available at [https://github.com/scalamacros/paradise](https://github.com/scalamacros/paradise).
There are branches that support the latest stable 2.10.3, the upcoming 2.11.0 and Scala virtualized.
