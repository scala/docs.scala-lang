---
layout: sip
title: SIP-NN - Name Based XML Literals
vote-status: pending
permalink: /sips/:title.html
redirect_from: /sips/pending/name-based-xml.html
---

**By: Yang, Bo**

## History

| Date          | Version       |
|---------------|---------------|
| Oct 24th 2019 | Initial Draft |

## Introduction

Name-based `for` comprehension has been proven success in Scala language design. A `for` / `yield` expression will be converted to higher-order function calls to `flatMap` , `map` and `withFilter` methods, no matter which type signatures they are. The `for` comprehension can be used for either `Option` or `List` , even when `List` has an additional implicit `CanBuildFrom` parameter. Third-party libraries like Scalaz and Cats also provides `Ops` to allow monadic data types in `for` comprehension.

[Name-based pattern matching](https://dotty.epfl.ch/docs/reference/changed-features/pattern-matching.html) is introduced by Dotty. It is greatly simplified the implementation compared to Scala 2. In addition, specific symbols in Scala library ( `Option` , `Seq` ) are decoupled from the Scala compiler.

Considering the success of the above name-based syntactic sugars, in order to decouple `scala-xml` library from Scala compiler, name-based XML literal is an obvious approach.

## Motivating Examples

### Examples

Given an XML literal `<div title="my-title">line1<br/>line2</div>`, at the parser phase, the compiler should internally convert it to an AST equivalent to the following code:

``` scala
xml.literal(
  xml.elements.div(
    xml.attributes.title(xml.values.`my-title`),
    xml.texts.line1,
    xml.elements.br(),
    xml.texts.line2
  )
)
```

By creating or importing different implementation of `xml`, various representation of objects for the XML literal will be created. For example, to create HTML DOM in Scala.js, you can define `xml` object as following:

``` scala
import org.scalajs.dom.document
import org.scalajs.dom.raw._

object xml {
  type Attribute[-A <: Element] = A => Unit
  object values extends Dynamic {
    def selectDynamic(data: String) = data
  }
  object texts extends Dynamic {
    def selectDynamic(data: String) = data
  }
  object attributes {
    def title(value: String): Attribute[Element] = _.setAttribute("title", value)
  }
  object elements {
    class Builder[+E <: Element](val element: E) extends AnyVal {
      def apply(attributesAndChildren: Any*) = {
        attributesAndChildren.foreach {
          case text: String =>
            element.appendChild(document.createTextNode(text))
          case builder: Builder[_] =>
            element.appendChild(builder.element)
          case node: Node =>
            element.appendChild(node)
          case attribute: Attribute[E] =>
            attribute(element)
        }
        element
      }
    }
    def div = new Builder(document.createElement("div"))
    def br = new Builder(document.createElement("br"))
    def literal[+E <: Element](builder: Builder[E]) = builder.element
  }
}
```

The ability of custom implementation for XML literals enables a lot of possibilities, including React-like virtual DOM frameworks, static type checked XML schema, and reactive XHTML/FXML templating.

### Comparison Examples

XML literals in Scala 2.13 are symbol based, which means the type of an XML literal is always `scala.xml.Elem`. The code `<div title="my-title">line1<br/>line2</div>` will be parsed to an AST equivalent to the following code:

``` scala
{
  var $md: MetaData = Null;
  $md = new UnprefixedAttribute("title", new Text("my-title"), $md);
  new Elem(null, "div", $md, TopScope, false, ({
    val $buf = new NodeBuffer();
    $buf.$amp$plus(new Text("line1"));
    $buf.$amp$plus({
      {
        new Elem(null, "br", Null, TopScope, true)
      }
    });
    $buf.$amp$plus(new Text("line2"));
    $buf
  }: _*))
}
```

Note that `MetaData`, `UnprefixedAttribute`, `Text`, `Elem` and `TopScope` are types defined in `scala.xml`. Library authors cannot create their custom representation of XML literals.

### Counter-Examples

With the help of this proposal, a library author can create custom XML based DSL.

``` scala
<div><label v-if={math.random() < 0.5}>You might see me</label></div>
```

It will be translated to:

``` scala
xml.literal(
  xml.elements.div(
    xml.elements.label(
      xml.attributes.`v-if`(xml.interpolation(math.random() < 0.5)),
      xml.texts.`You might see me`
    )
  )
)
```

The translated `v-if` method can be supported by creating an `implicit class` for `xml.attributes` easily. However, this proposal is not intended to be used for creating a DSL as an alternative to regular Scala code. Instead, you should just use ordinary `if` expression.

``` scala
<div>{
  if (math.random() < 0.5) {
    <label>You might see me</label>
  } else {
    <!--condition not met-->
  }
}</div>
```

and it will be translated to:

``` scala
xml.literal(
  xml.elements.div(
    xml.interpolation {
      if (math.random() < 0.5) {
        xml.literal(
          xml.elements.label(
            xml.texts.`You might see me`
          )
        )
      } else {
        xml.literal(
          xml.comment("condition not met")
        )
      }
    }
  )
)
```

Name based XML literal is best for modeling existing XML format within Scala source files. For other cases, just use ordinary Scala control flows for dynamic conditions, and use ordinary Scala case class for data structures not defined in the existing XML format.

## Design

### Goals

* Keeping source-level backward compatibility to existing symbol-based XML literals in most use cases of `scala-xml`.
* Allowing schema-aware XML literals, i.e. static type varying according to tag names, similar to the current TypeScript and [Binding.scala](https://github.com/ThoughtWorksInc/Binding.scala) behavior.
* Schema-aware XML literals should be understandable by both the compiler and IDE (e.g. no white box macros involved).
* Existing libraries like ScalaTags should be able to support XML literals by adding a few simple wrapper classes. No macro or meta-programming knowledge is required for library authors.
* Able to implement an API to build a DOM tree with no more cost than manually written Scala code.

### Non-goals

* Embedding fully-featured standard XML in Scala.
* Allowing arbitrary tag names and attribute names (or avoiding reserved word).
* Distinguishing lexical differences, e.g. `<a b = "&#99;"></a>` vs `<a b="c"/>` .

### Other consideration
#### White space only text

Whitespace-only is preserved by default. However, a XML library vendor is able to discard whitespace texts during constructing the object for the XML literal.

#### The usage of varargs

Since an element might contain arbitrary number of child nodes, varargs are required to handle these child nodes. Unfortunately, traditional varargs are type unsafe as it erase all arguments to their common super type, inefficient as it creates a temporary `Seq` that is difficult to be eliminated by optimizer.

Both problems can be resolved with the help of [Curried Varargs](https://docs.scala-lang.org/sips/curried-varargs.html), which is another SIP to address the type safety and performance issues in traditional varargs.

## Other Examples

### Self-closing tags without prefixes

``` scala
<tag-name />
```

will be translated to

``` scala
xml.literal(
  xml.elements.`tag-name`()
)
```

### Node list

``` scala
<tag-name />
<prefix-1:tag-name />
```

will be translated to

``` scala
xml.literal(
  xml.elements.`tag-name`(),
  `prefix-1`.elements.`tag-name`()
)
```
### Attributes

``` scala
<tag-name attribute-1="value"
          attribute-2={ f() }/>
```

will be translated to

``` scala
xml.literal(
  xml.elements.`tag-name`(
    xml.attributes.`attribute-1`(xml.values.value),
    xml.attributes.`attribute-2`(xml.interpolation(f()))
  )
)
```

### CDATA

`<![CDATA[raw]]>` will be translated to `xml.literal(xml.texts.raw)` if `-Xxml:coalescing` flag is on, or `xml.literal(xml.cdata("raw"))` if the flag is turned off as `-Xxml:-coalescing` .

### Process instructions

``` scala
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
```

will be translated to

``` scala
xml.literal(
  xml.processInstructions.`xml-stylesheet`("type=\"text/xsl\" href=\"style.xsl\"")
)
```

### Child nodes

``` scala
<tag-name attribute-1="value">
  text &amp; &#x68;exadecimal reference &AMP; &#100;ecimal reference
  <child-1/>
  <!-- my comment -->
  { math.random }
  <![CDATA[ raw ]]>
</tag-name>
```

will be translated to

``` scala
xml.literal(
  xml.elements.`tag-name`(
    xml.attributes.`attribute-1`(xml.values.value),
    xml.texts.`$u000A  text `,
    xml.entities.amp,
    xml.texts.` hexadecimal reference `,
    xml.entities.AMP,
    xml.texts.` decimal reference$u000A  `,
    xml.elements.`child-1`(),
    xml.texts.`$u000A  `,
    xml.comment(" my comment "),
    xml.texts.`$u000A  `,
    xml.interpolation(math.random),
    xml.texts.`$u000A  `,
    xml.cdata(" raw "), //  or (xml.texts.` raw `), if `-Xxml:coalescing` flag is set
    xml.texts.`$u000A  `
  )
)
```

Note that hexadecimal references and decimal references will be unescaped and translated to `xml.texts` automatically, while entity references are translated to fields in `xml.entities` .

### Prefixes without `xmlns` bindings.

``` scala
<prefix-1:tag-name-1 attribute-1="value-1" prefix-2:attribute-2="value-2">
  <tag-name-2>content</tag-name-2>
  <!-- my comment -->
</prefix-1:tag-name-1>
```

will be translated to

``` scala
xml.literal(
  `prefix-1`.elements.`tag-name-1`(
    `prefix-1`.attributes.`attribute-1`(`prefix-1`.values.`value-1`),
    `prefix-2`.attributes.`attribute-2`(`prefix-2`.values.`value-2`),
    `prefix-1`.texts.`$u000A  `,
    xml.elements.`tag-name-2`(
      xml.texts.content
    ),
    `prefix-1`.texts.`$u000A  `,
    `prefix-1`.comment(" my comment "),
    `prefix-1`.texts.`$u000A`
  )
)
```

Note that unprefixed attribute will be treated as if it has the same prefix as its enclosing element.

### `xmlns` bindings.

``` scala
<prefix-1:tag-name-1 xmlns="http://example.com/0" xmlns:prefix-1="http://example.com/1" xmlns:prefix-2="http://example.com/2" attribute-1="value-1" prefix-2:attribute-2="value-2">
  <tag-name-2>content</tag-name-2>
  <!-- my comment -->
</prefix-1:tag-name-1>
```

will be translated to

``` scala
xml.literal(
  xml.prefixes.`prefix-1`(xml.uris.`http://example.com/1`).elements.`tag-name-1`(
    xml.prefixes.`prefix-1`(xml.uris.`http://example.com/1`).attributes.`attribute-1`(xml.prefixes.`prefix-1`(xml.uris.`http://example.com/1`).values.`value-1`),
    xml.prefixes.`prefix-2`(xml.uris.`http://example.com/2`).attributes.`attribute-2`(xml.prefixes.`prefix-2`(xml.uris.`http://example.com/2`).values.`value-2`),
    xml.prefixes.`prefix-1`(xml.uris.`http://example.com/1`).texts.`$u000A  `,
    xml.noPrefix(xml.uris.`http://example.com/0`).elements.`tag-name-2`(
      xml.noPrefix(xml.uris.`http://example.com/0`).texts.content
    ),
    xml.prefixes.`prefix-1`(xml.uris.`http://example.com/1`).texts.`$u000A  `,
    xml.prefixes.`prefix-1`(xml.uris.`http://example.com/1`).comment(" my comment "),
    xml.prefixes.`prefix-1`(xml.uris.`http://example.com/1`).texts.`$u000A`
  )
)
```

## Implementation

The implementation of this proposal can be two parts:

1. Compile-time XML translator
2. XML library vendors

### Compile-time XML translator

Compile-time XML translator will translate XML literal to Scala AST before type checking. It can be implemented either in the Scala compiler or in a white box macro.  [nameBasedXml.scala](https://github.com/GlasslabGames/nameBasedXml.scala) is an implementation of the proposal in a white box macro.

### XML library vendors

An XML library vendor should provide a package or object named `xml` , which contains the following methods or values:

* `elements`
* `attributes`
* `values`
* `entities`
* `processInstructions`
* `texts`
* `comment`
* `cdata`
* `interpolation`
* `noPrefix`
* `prefixes`
* `uris`
* `literal`

All above methods except `literal` should return a builder, and `literal` will turn one or more builders into an XML object / or an XML node list.

An XML library user can switch different implementations by importing different `xml` packages or objects. `scala.xml` is used by default when no explicit import is present.

In a schema-aware XML library like Binding.scala, its `elements` , `attributes` , `processInstructions` and `entities` methods should return factory objects that contain all the definitions of available tag names and attribute names. An XML library user can provide additional tag names and attribute names in user-defined implicit classes for `tags` and `attributes` .

In a schema-less XML library like `scala-xml` , its `elements` , `attributes` , `processInstructions` and `entities` should return builders that extend [scala.Dynamic](https://www.scala-lang.org/api/current/scala/Dynamic.html) in order to handle tag names and attribute names in `selectDynamic` or `applyDynamic` .

Those XML libraries can be extended with the help of standard XML namespace bindings. A plug-in author can create `implicit class` for `xml.uris` to introduce foreign elements embedded in existing XML literals.

[html.scala](https://github.com/GlasslabGames/html.scala) is an XML library vendor for creating reactive HTML templates.

## Drawbacks

### Name clash

`<toString/>` or `<foo equals="bar"/>` will not compile due to name clash to `Any.toString` and `Any.equals` .

* Compilation error is the desired behavior in a schema-aware XML library as long as `toString` is not a valid name in the schema. Fortunately, unlike JSX, `<div class="foo"></div>` should compile because `class` is a valid method name.
* A schema-less XML library user should instead explicit construct `<toString/>` in Scala code, e.g. `new Elem("toString")` .

## Alternative approach

XML initialization can be implemented in a special string interpolation as `xml"<x/>"`, which can be implemented in a macro library. [scala-xml-quote](https://github.com/densh/scala-xml-quote) is an implementation in this approach. The pros and cons of these approaches are listed in the following table:

||symbol-based XML literals in Scala 2.12|name-based XML literals in this proposal|`xml` string interpolation|
| --- | --- | --- | --- |
|XML is parsed by ...|compiler|compiler|library, IDE, and other code browsers including Github, Jekyll (if syntax highlighting is wanted)|
|Is third-party schema-less XML library supported?|No, unless using white box macros|Yes|Yes|
|Is third-party schema-aware XML library supported?|No, unless using white box macros|Yes|No, unless using white box macros|
|How to highlight XML syntax?|By regular highlighter grammars|By regular highlighter grammars|By special parsing rule for string content|
|Can presentation compiler perform code completion for schema-aware XML literals?|No|Yes|No|

## References

* [nameBasedXml.scala](https://github.com/GlasslabGames/nameBasedXml.scala)
* [API Documentation](https://javadoc.io/page/org.lrng.binding/namebasedxml_2.12/1.0.0/org/lrng/binding/nameBasedXml.html)
* [html.scala](https://github.com/GlasslabGames/html.scala)
* [Discussion on Scala Contributors Forum](https://contributors.scala-lang.org/t/pre-sip-name-based-xml-literals/2175)
* [Curried Varargs](https://docs.scala-lang.org/sips/curried-varargs.html)
* [scala-xml-quote](https://github.com/densh/scala-xml-quote)
