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

Scala compiler `scalac` offers various **compiler options**, also referred to as **compiler flags**, to change how to compile your program.

Nowadays, most people are not running `scalac` from the command line.
Instead, they use sbt, an IDE, and other tools as their interface to the compiler.
Therefore they may not even have `scalac` installed, and won't think to do `man scalac`.

This page comes to the rescue for the people to find&hellip;

* What compiler options `scalac` offers
* How to use compiler options


## How to use compiler options

### Use compiler options with scalac

```bash
scalac [ <options> ] <source files>
```

E.g. `scalac -encoding utf8 -Xfatal-warnings Hello.scala`

Default paths can be listed by running a command line tool:
```
scala scala.tools.util.PathResolver [ <options> ]
```



### Use compiler options with sbt



```scala
scalacOptions ++= Seq(
  "-encoding", "utf8", // Option and arguments on same line
  "-Xfatal-warnings",  // New lines for each options
  "-deprecation",
  "-unchecked",
  "-language:implicitConversions",
  "-language:higherKinds",
  "-language:existentials",
  "-language:postfixOps"
)
```



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
    
