---
layout: multipage-overview
title: Generating Scaladoc
partof: scaladoc
overview-name: Scaladoc
num: 4
permalink: /overviews/scaladoc/:title.html
---

There are two ways to generate API documentation in HTML from your Scala code.  Those options are:

* use sbt to do it,
* use the scaladoc command-line tool.

## Using sbt

The easiest and most commonly used way to generate API documentation from your Scala code is with the build tool [sbt](https://www.scala-sbt.org).

In the sbt shell, generate Scaladoc by running `doc`:

    > doc
    [info] Main Scala API documentation to target/scala-2.12/api...
    [info] model contains 1 documentable templates
    [info] Main Scala API documentation successful.
    [success] Total time: 20 s

The HTML documentation will show up in the respective `target/` directory (or directories for builds with multiple projects) that sbt prints to the console output.

For more information on using sbt on your system, see the [download instructions](https://www.scala-lang.org/download/) for [getting started with Scala and sbt on the command line]({{site.baseurl}}/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html).

For additional information about configuring Scaladoc in sbt, see the [Generate API documentation](https://www.scala-sbt.org/1.x/docs/Howto-Scaladoc.html) section of the sbt reference manual.

## Using scaladoc command

If you use Scala commands directly to start a console with `scala` or compile with `scalac`, then you should have a `scaladoc` command-line utility, as well. The `scaladoc` command can also be installed using Coursier: `coursier install scaladoc`. Using the command-line utility is a more advanced and less commonly used method of generating Scaladoc.

    $ scaladoc src/main/scala/App.scala
    model contains 1 documentable templates

This will put the HTML in the current directory.  This is probably not what you want.  It's preferable to output to a subdirectory.   To specify a different target directory, use the `-d` command-line option:

    $ scaladoc -d build/ src/main/scala/App.scala

For more information on the `scaladoc` command and what other command-line options it supports, see the `scaladoc --help`.

This command is harder to operate with more complex projects containing both multiple Scala source files and library dependencies.  This is why using sbt (see above) is easier and better suited for generating Scaladoc.

The Scaladoc command exists because it preceded the development of sbt, but also because it is useful to the Scala development team with studying bug reports for Scaladoc.

More information on directly using the Scala commands, like `scaladoc`, is discussed at [your first Scala program](https://docs.scala-lang.org/scala3/book/taste-hello-world.html).

## Options Reference

The scaladoc options as of version 3.3.0 are:

```
% scaladoc --help
Usage: scaladoc <options> <source files>
where possible standard options include:
        -Dproperty=value  Pass -Dproperty=value directly to the runtime system.
                -J<flag>  Pass <flag> directly to the runtime system.
                      -P  Pass an option to a plugin, e.g. -P:<plugin>:<opt>
                      -V  Print a synopsis of verbose options.
                      -W  Print a synopsis of warning options.
                  -Wconf  Configure compiler warnings.
                 -Werror  Fail the compilation if there are any warnings.
                      -X  Print a synopsis of advanced options.
                      -Y  Print a synopsis of private options.
                 -author  Include authors.
          -bootclasspath  Override location of bootstrap class files.
              -classpath  Specify where to find user class files.
                          Default .
                  -color  Colored output
                          Default always
                          Choices : always, never
         -comment-syntax
           -coverage-out  Destination for coverage classfiles and
                          instrumentation data.
                      -d  Destination for generated classfiles.
       -default-template  The static site is generating empty files for indexes
                          that haven't been provided explicitly in a
                          sidebar/missing index.html in directory. User can
                          specify what default template should be used for such
                          indexes. It can be useful for providing generic
                          templates that interpolate some common settings, like
                          title, or can have some custom html embedded.
            -deprecation  Emit warning and location for usages of deprecated
                          APIs.
 -doc-canonical-base-url  A base URL to use as prefix and add `canonical` URLs
                          to all pages. The canonical URL may be used by search
                          engines to choose the URL that you want people to see
                          in search results. If unset no canonical URLs are
                          generated.
       -doc-external-doc  Legacy option from Scala 2. Mapping betweeen path and
                          external documentation. Use -external-mappings
                          instead.
       -doc-root-content  The file from which the root package documentation
                          should be imported.
         -doc-source-url  Legacy option from Scala 2. Use -source-links instead.
               -encoding  Specify character encoding used by source files.
                          Default UTF-8
                -explain  Explain errors in more detail.
          -explain-types  Explain type errors in more detail (deprecated, use
                          -explain instead).
                -extdirs  Override location of installed extensions.
      -external-mappings  Mapping between regexes matching classpath entries and
                          external documentation.
                          'regex::[scaladoc|scaladoc|javadoc]::path' syntax is
                          used
                -feature  Emit warning and location for usages of features that
                          should be imported explicitly.
             -from-tasty  Compile classes from tasty files. The arguments are
                          .tasty or .jar files.
                 -groups  Group similar functions together (based on the @group
                          annotation)
                   -help  Print a synopsis of standard options.
                 -indent  Together with -rewrite, remove {...} syntax when
                          possible due to significant indentation.
    -java-output-version  Compile code with classes specific to the given
                          version of the Java platform available on the
                          classpath and emit bytecode for this version.
                          Corresponds to -release flag in javac.
                          Choices : 8, 9, 10, 11
      -javabootclasspath  Override java boot classpath.
            -javaextdirs  Override java extdirs classpath.
               -language  Enable one or more language features.
             -new-syntax  Require `then` and `do` in control expressions.
              -no-indent  Require classical {...} syntax, indentation is not
                          significant.
       -no-link-warnings  Avoid warnings for ambiguous and incorrect links in
                          members look up. Doesn't affect warnings for incorrect
                          links of assets etc.
                 -nowarn  Silence all warnings.
             -old-syntax  Require `(...)` around conditions.
              -pagewidth  Set page width
                          Default 80
            -print-lines  Show source code line numbers.
            -print-tasty  Prints the raw tasty.
                -private  Show all types and members. Unless specified, show
                          only public and protected types and members.
                -project  The name of the project.
         -project-footer  A footer on every Scaladoc page.
           -project-logo  Path to the file that contains the project's logo.
                          Provided path can be absolute or relative to the
                          project root directory.
            -project-url  The source repository of your project.
        -project-version  The current version of your project.
            -quick-links  List of quick links that is displayed in the header of
                          documentation.
               -revision  Revision (branch or ref) used to build project project
                -rewrite  When used in conjunction with a `...-migration` source
                          version, rewrites sources to migrate to new version.
                -scalajs  Compile in Scala.js mode (requires scalajs-library.jar
                          on the classpath).
-scalajs-genStaticForwardersForNonTopLevelObjects
                          Generate static forwarders even for non-top-level
                          objects (Scala.js only)
   -scalajs-mapSourceURI  rebases source URIs from uri1 to uri2 (or to a
                          relative URI) for source maps (Scala.js only)
  -scastie-configuration  Additional configuration passed to Scastie in code
                          snippets
      -semanticdb-target  Specify an alternative output directory for SemanticDB
                          files.
               -siteroot  A directory containing static files from which to
                          generate documentation.
                          Default ./docs
             -skip-by-id  Identifiers of packages or top-level classes to skip
                          when generating documentation
          -skip-by-regex  Regexes that match fully qualified names of packages
                          or top-level classes to skip when generating
                          documentation
          -skip-packages  Deprecated, please use `-skip-by-id` or
                          `-skip-by-regex`
       -snippet-compiler
           -social-links  Links to social sites.
                          '[github|twitter|gitter|discord]::link' syntax is
                          used.
                 -source  source version
                          Default 3.3
                          Choices : 3.0-migration, 3.0, 3.1, 3.2-migration, 3.2,
                          3.3-migration, 3.3, future-migration, future
           -source-links  Source links provide a mapping between file in
                          documentation and code repository.
             -sourcepath  Specify location(s) of source files.
             -sourceroot  Specify workspace root directory.
                          Default .
              -unchecked  Enable additional warnings where generated code
                          depends on assumptions.
                 -uniqid  Uniquely tag all identifiers in debugging output.
              -usejavacp  Utilize the java.class.path in classpath resolution.
                -verbose  Output messages about what the compiler is doing.
                -version  Print product version and exit.
-versions-dictionary-url  A URL pointing to a JSON document containing a
                          dictionary `version label -> documentation location`.
                          The JSON file has single property "versions" that
                          holds dictionary of labels of specific docs and URL
                          pointing to their index.html top-level file. Useful
                          for libraries that maintain different versions of
                          their documentation.
                 @<file>  A text file containing compiler arguments (options and
                          source files).
```
