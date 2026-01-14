---
layout: singlepage-overview
title: Scala Compiler Options
---

<style type="text/css">
.definition-list dd { 
    margin-left: 2em;
}
.definition-list .deprecated { 
    padding: 0.25em 0.5em; 
    background-color: #fff3f3;
    border-radius: 4px;
}
.definition-list .note { 
    padding: 0.25em 0.25em; 
    background-color: #f3f3ff;
    border-radius: 4px;
}
.definition-list dd {
    margin-bottom:18px;    
}
</style>

## Introduction

The Scala compiler `scalac` offers various **compiler options**, or **flags**, that change the compiler's default behavior.

This page documents compiler options for both **Scala 2** and **Scala 3**. While many options are shared between versions, some flags are version-specific, and their behavior may differ. Where relevant, options are documented with their supported Scala versions.

Some options just generate more compiler output in the form of diagnostics or warnings, while others change the result of compilation.

The Scala command `scala`, which runs scripts or compiled code, accepts the same options as the `scalac` compiler, plus a few more that determine how to run a program.

Options may be specified on the command line to `scalac` or in the configuration of a build tool or IDE.

The Scala distribution includes a `man` page. If Scala is installed as a system command, that documentation may be available from `man scalac`.

## How to use compiler options

### Use compiler options with scalac

```bash
scalac [ <options> ] <source files>
```

Boolean flags are specified in the usual way:

`scalac -Werror -Xlint Hello.scala`

Options that require arguments use "colon" syntax:

`scalac -Vprint:parser,typer`

Options that take just a single argument accept traditional syntax:

`scalac -d /tmp`

Conventionally, options have a prefix `-V` if they show "verbose" output;
`-W` to manage warnings; `-X` for extended options that modify tool behavior;
`-Y` for private options with limited support, where `Y` may suggest forking behavior.
Several options have historical aliases, such as `-Xfatal-warnings` for `-Werror`.

In Scala 2, default paths can be listed by running a tool in the distribution:

```
scala scala.tools.util.PathResolver [ <options> ]
```

That can help debug errors in options such as `--classpath`.

### Use compiler options with sbt

Here is a typical configuration of the `scalacOptions` setting in `sbt`:

```scala
scalacOptions ++= Seq(          // use ++= to add to existing options
  "-encoding", "utf8",          // if an option takes an arg, supply it on the same line
  "-feature",                   // then put the next option on a new line for easy editing
  "-language:implicitConversions",
  "-language:existentials",
  "-unchecked",
  "-Werror",
  "-Xlint",                     // exploit "trailing comma" syntax so you can add an option without editing this line
)                               // for "trailing comma", the closing paren must be on the next line
```

The convention is always to append to the setting with `++=` and to supply one option per line.

Normally the last option will have a trailing comma so that `git diff` is a bit cleaner when options are added.

{% for category in site.data.compiler-options %}

<h2>{{ category.category }}</h2>
{% if category.description %}{{ category.description | markdownify }}{% endif %}

<dl class="definition-list">
{% for option in category.options %}
    {% capture option_argument_separator %}{% if option.schema.type contains "Choice" %}:{% else %} {% endif %}{% endcapture %}
    {% capture option_argument_placeholder %}{% if option.schema.arg %}{{ option.schema.arg | upcase }}{% else %}ARG{% endif %}{% endcapture %}
    {% capture option_argument %}{% if option.schema.type != "Boolean" and option.schema.type != "Prefix" %}{{ option_argument_separator }}{{ option_argument_placeholder }}{% if option.schema.multiple %}1,{{ option_argument_placeholder }}2{% endif %}{% endif %}{% endcapture %}
    <dt>
        <code>{{ option.option | xml_escape }}{{ option_argument }}</code>
        {% if option.abbreviations %}
        {% for abbreviation in option.abbreviations %}
         or <code>{{ abbreviation | xml_escape }}{{ option_argument }}</code>
        {% endfor %}  
        {% endif %}
    </dt>
    {% if option.deprecated %}<dd class="deprecated"><i class="fa fa-exclamation-triangle"></i> Deprecated: {{ option.deprecated | markdownify | remove: '<p>' | remove: '</p>'}}</dd>{% endif %}            
    <dd class="description">
        {{ option.description | markdownify }}
        {% if option.schema.default %}Default: <code>{{ option.schema.default | xml_escape }}</code><br>{% endif %}
        {% if option.schema.min %}Min: <code>{{ option.schema.min }}</code><br>{% endif %}
        {% if option.schema.max %}Max: <code>{{ option.schema.max }}</code><br>{% endif %}        
    </dd>
    {% if option.note %}<dd class="note"><i class="fa fa-sticky-note"></i> Note: {{ option.note | markdownify | remove: '<p>' | remove: '</p>'}}</dd>{% endif %}            
    {% if option.schema.choices %}
    <dd class="choices">
        <dl class="choices">
          <!-- TODO: deprecated for choice -->          
          {% for choice in option.schema.choices %}
            <dt><code>{{ option.option | xml_escape }}{{ option_argument_separator }}{{ choice.choice | xml_escape }}</code></dt>
            {% if choice.deprecated %}<dd class="deprecated"><i class="fa fa-exclamation-triangle"></i> Deprecated: {{ choice.deprecated | markdownify | remove: '<p>' | remove: '</p>'}}</dd>{% endif %}
            {% if choice.description %}<dd class="description">{{ choice.description | markdownify}}</dd>{% endif %}
            {% if choice.note %}<dd class="note"><i class="fa fa-sticky-note"></i> Note: {{ choice.note | markdownify | remove: '<p>' | remove: '</p>'}}</dd>{% endif %}
          {% endfor %}  
        </dl>
    </dd>
    {% endif %}
{% endfor %}  
</dl>

{% endfor %}

### Targeting a version of the JVM

Applications or libraries targeting the JVM may wish to specify a target version.

The `-release` option specifies the target version, such as "8" or "18".

Like the option for `javac`, it allows building against an earlier version of the JDK. It will compile against the API for that version and also output class files for that version.

The deprecated option `-target` does not compile against the desired API, but only specifies a target class file format.

## Additional resources

### Compilation Phases

<dl class="definition-list">
<!--
  Generated with GNU sed: 
    scalac -Vphases | tail -n+3 | sed -rn 's|^\s*([a-z]+)\s+[0-9]+\s+([a-z@].+)$|<dt>\1</dt>\n<dd>\2</dd>\n|p'
-->
<dt>parser</dt>
<dd>parse source into ASTs, perform simple desugaring</dd>

<dt>namer</dt>
<dd>resolve names, attach symbols to named trees</dd>

<dt>packageobjects</dt>
<dd>load package objects</dd>

<dt>typer</dt>
<dd>the meat and potatoes: type the trees</dd>

<dt>superaccessors</dt>
<dd>add super accessors in traits and nested classes</dd>

<dt>extmethods</dt>
<dd>add extension methods for inline classes</dd>

<dt>pickler</dt>
<dd>serialize symbol tables</dd>

<dt>refchecks</dt>
<dd>reference/override checking, translate nested objects</dd>

<dt>patmat</dt>
<dd>translate match expressions</dd>

<dt>uncurry</dt>
<dd>uncurry, translate function values to anonymous classes</dd>

<dt>fields</dt>
<dd>synthesize accessors and fields, add bitmaps for lazy vals</dd>

<dt>tailcalls</dt>
<dd>replace tail calls by jumps</dd>

<dt>specialize</dt>
<dd>@specialized-driven class and method specialization</dd>

<dt>explicitouter</dt>
<dd>this refs to outer pointers</dd>

<dt>erasure</dt>
<dd>erase types, add interfaces for traits</dd>

<dt>posterasure</dt>
<dd>clean up erased inline classes</dd>

<dt>lambdalift</dt>
<dd>move nested functions to top level</dd>

<dt>constructors</dt>
<dd>move field definitions into constructors</dd>

<dt>flatten</dt>
<dd>eliminate inner classes</dd>

<dt>mixin</dt>
<dd>mixin composition</dd>

<dt>cleanup</dt>
<dd>platform-specific cleanups, generate reflective calls</dd>

<dt>delambdafy</dt>
<dd>remove lambdas</dd>

<dt>jvm</dt>
<dd>generate JVM bytecode</dd>

<dt>terminal</dt>
<dd>the last phase during a compilation run</dd>
</dl>
