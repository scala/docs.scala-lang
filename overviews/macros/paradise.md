---
layout: overview-large
title: Macro Paradise

disqus: true

partof: macros
num: 11
outof: 13
languages: [ko, ja]
---
<span class="label success" style="float: right;">NEW</span>

**Eugene Burmako**

> I have always imagined that paradise will be a kind of library.
> <small>Jorge Luis Borges, "Poem of the Gifts"</small>

Macro paradise is a plugin for several versions of Scala compilers.
It is designed to reliably work with production releases of <code>scalac</code>,
making latest macro developments available way before they end up in future versions Scala.
Refer to the roadmap for [the list of supported features and versions](/overviews/macros/roadmap.html)
and visit [the paradise announcement](http://scalamacros.org/news/2013/08/07/roadmap-for-macro-paradise.html)
to learn more about our support guarantees.

    ~/210x $ scalac -Xplugin:paradise_*.jar -Xshow-phases
        phase name  id  description
        ----------  --  -----------
            parser   1  parse source into ASTs, perform simple desugaring
     macroparadise   2  let our powers combine
             namer   3  resolve names, attach symbols to trees in paradise
    packageobjects   4  load package objects in paradise
             typer   5  the meat and potatoes: type the trees in paradise
                    ...

Some features in macro paradise bring a compile-time dependency on the macro paradise plugin,
some features do not, however none of those features need macro paradise at runtime.
Proceed to the [the feature list](/overviews/macros/roadmap.html) document for more information.

Consult [https://github.com/scalamacros/sbt-example-paradise](https://github.com/scalamacros/sbt-example-paradise)
for an end-to-end example, but in a nutshell working with macro paradise is as easy as adding the following two lines
to your build (granted you’ve already [set up sbt](/overviews/macros/overview.html#using_macros_with_maven_or_sbt)
to use macros).

    resolvers += Resolver.sonatypeRepo("releases")
    addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)

To use macro paradise in Maven follow the instructions provided at Stack Overflow on the page ["Enabling the macro-paradise Scala compiler plugin in Maven projects"](http://stackoverflow.com/questions/19086241/enabling-the-macro-paradise-scala-compiler-plugin-in-maven-projects) (also make sure to add the dependency on the Sonatype snapshots repository and `scala-reflect.jar`).

    <compilerPlugins>
      <compilerPlugin>
        <groupId>org.scalamacros</groupId>
        <artifactId>paradise_<YOUR.SCALA.VERSION></artifactId>
        <version>2.1.0</version>
      </compilerPlugin>
    </compilerPlugins>

Sources of macro paradise are available at [https://github.com/scalamacros/paradise](https://github.com/scalamacros/paradise).
There are branches that support the latest 2.10.x release, the latest 2.11.x release,
snapshots of 2.10.x, 2.11.x and 2.12.x, as well as Scala virtualized.
