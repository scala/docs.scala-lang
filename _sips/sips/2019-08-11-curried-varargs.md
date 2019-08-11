---
layout: sips
discourse: true
title: SIP-NN - Curried varargs
---

**By: Yang, Bo**

## History

| Date          | Version       |
|---------------|---------------|
| Aug 11th 2019 | Initial Draft |

## Introduction

The [repeated parameters](https://scala-lang.org/files/archive/spec/2.13/04-basic-declarations-and-definitions.html#repeated-parameters) syntax is widely used in Scala libraries to create collection initializers, string interpolations, and DSLs. Unfortunately, repeated parameters are type unsafe as it erase all arguments to their common supertype, inefficient as it creates a temporary `Seq` that is difficult to be eliminated by optimizer. In practice, all sophisticated string interpolation libraries, including [string formatting](https://github.com/scala/scala/blob/43e040ff7e4ba92ccf223e77540580b32c1473c0/src/library/scala/StringContext.scala#L94) and [quasiquotes](https://github.com/scala/scala/blob/43e040ff7e4ba92ccf223e77540580b32c1473c0/src/reflect/scala/reflect/api/Quasiquotes.scala#L28) in standard library, [scalameta](https://scalameta.org/docs/trees/quasiquotes.html) and my [fastring](https://github.com/Atry/fastring/blob/67ae4eccdb9b7f58416ed90eae85ddb035b1ffb1/shared/src/main/scala/com/dongxiguo/fastring/Fastring.scala#L242) library, are written in macros in order to avoid runtime overhead of repeated parameters.

We propose **curried varargs** to improve both the type safety and the performance. Given a function call `f(a, b, c)`, when `f` is a subtype of `Curried`, the function call should be rewritten to `f.applyBegin.applyNext(a).applyNext(b).applyNext(c).applyEnd`.

## Motivating Examples

### Examples

Recently I was working on the implementation of [Pre SIP: name based XML literals](https://contributors.scala-lang.org/t/pre-sip-name-based-xml-literals/2175). During implementing that proposal, I found that the proposal is inefficiency due to repeated parameters, and it could be improved dramatically with the help of curried functions.

For example, according to the proposal the XML literal `<div title="my-title">line1<br/>line2</div>` will result the following code:

``` scala
xml.tags.div(
  xml.attributes.title(xml.text("my-title")),
  xml.text("line1"),
  xml.tags.br(),
  xml.text("line2")
)
```

With the help of this curried varargs proposal and `@inline`, we are able to implement an API to build a DOM tree with no additional overhead over manually written Scala code.

``` scala
import org.scalajs.dom.document
import org.scalajs.dom.raw._

object xml {
  type Attribute[-A <: Element] = A => Unit
  @inline def text(data: String) = data
  object attributes {
    @inline def title(value: String): Attribute[Element] = _.setAttribute("title", value)
  }
  object tags {
    class Builder[+E <: Element](private val element: E) extends AnyVal with Curried {
      @inline def applyBegin = this
      @inline def applyNext(text: String) = {
        element.appendChild(document.createTextNode(text))
        this
      }
      @inline def applyNext(node: Node) = {
        element.appendChild(node)
        this
      }
      @inline def applyNext[A <: Attribute[E]](attribute: A) = {
        attribute(element)
        this
      }
      @inline def applyEnd = element
    }
    @inline def div = new Builder(document.createElement("div"))
    @inline def br = new Builder(document.createElement("br"))
  }
}
```

Since `xml.tags.div` returns a `Builder`, which is a subtype of `Curried`, calls on `xml.tags.div` will be translated to the curried form, as shown below:
``` scala
xml.tags.div
  .applyBegin
  .applyNext(xml.attributes.title(xml.text("my-title")))
  .applyNext(xml.text("line1"))
  .applyNext(xml.tags.br.applyBegin.applyEnd)
  .applyNext(xml.text("line2"))
  .applyEnd
```

When the above code is compiled in Scala.js, the builders should be eliminated entirely as a zero cost abstraction layer, and the output JavaScript is tiny as shown below:

``` javascript
var $$this = $m_Lorg_scalajs_dom_package$().document__Lorg_scalajs_dom_raw_HTMLDocument().createElement("div");
$$this.setAttribute("title", "my-title");
$$this.appendChild($m_Lorg_scalajs_dom_package$().document__Lorg_scalajs_dom_raw_HTMLDocument().createTextNode("line1"));
var $$this$1 = $m_Lorg_scalajs_dom_package$().document__Lorg_scalajs_dom_raw_HTMLDocument().createElement("br");
$$this.appendChild($$this$1);
$$this.appendChild($m_Lorg_scalajs_dom_package$().document__Lorg_scalajs_dom_raw_HTMLDocument().createTextNode("line2"));
```

### Comparison Examples

The `Builder` API can be also implemented in repeated parameters:

``` scala
import org.scalajs.dom.document
import org.scalajs.dom.raw._

object xml {
  type Attribute[-A <: Element] = A => Unit
  @inline def text(data: String) = data
  object attributes {
    @inline def title(value: String): Attribute[Element] = _.setAttribute("title", value)
  }
  object tags {
    class Builder[+E <: Element](private val element: E) extends AnyVal {
      @inline def apply(attributesAndChildren: Any*) = {
        attributesAndChildren.foreach {
          case text: String =>
            element.appendChild(document.createTextNode(text))
          case node: Node =>
            element.appendChild(node)
          case attribute: Attribute[E] =>
            attribute(element)
        }
        element
      }
    }
    @inline def div = new Builder(document.createElement("div"))
    @inline def br = new Builder(document.createElement("br"))
  }
}
```

However, the Scala compiler is unable to optimize repeated parameters, as a result, the output JavaScript from Scala.js would look like the below code.

``` javascript
var $$this$1 = $m_Lorg_scalajs_dom_package$().document__Lorg_scalajs_dom_raw_HTMLDocument().createElement("div");
var this$3 = $m_LScalaFiddle$xml$attributes$();
var jsx$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, value) {
  return (function(x$1$2) {
    x$1$2.setAttribute("title", value)
  })
})(this$3, "my-title"));
var $$this = $m_Lorg_scalajs_dom_package$().document__Lorg_scalajs_dom_raw_HTMLDocument().createElement("br");
var array = [jsx$1, "line1", $$this, "line2"];
var i = 0;
var len = $uI(array.length);
while ((i < len)) {
  var index = i;
  var arg1 = array[index];
  if ($is_T(arg1)) {
    var x2 = $as_T(arg1);
    $$this$1.appendChild($m_Lorg_scalajs_dom_package$().document__Lorg_scalajs_dom_raw_HTMLDocument().createTextNode(x2))
  } else if ($uZ((arg1 instanceof $g.Node))) {
    $$this$1.appendChild(arg1)
  } else if ($is_F1(arg1)) {
    var x4 = $as_F1(arg1);
    x4.apply__O__O($$this$1)
  } else {
    throw new $c_s_MatchError().init___O(arg1)
  };
  i = ((1 + i) | 0)
};
```

Despite of the type safety issue due to the usage of `Any`, the above code are inefficient: 

1. Unnecessary temporary object for the `xml.attributes.title(xml.text("my-title"))`.
2. Unnecessary temporary `Seq` to hold repeated parameters.
3. Unnecessary runtime type check for each argument.

The similar issues can be found in many other usage of repeated parameters. For example, Scala string interpolation is inefficient due to its internal vararg function call, unless implementing it in a macro; Scala collection initializers (e.g. `List(1, 2, 3)`) create unnecessary temporary `Seq` before creating the desired collection.

## Design

This proposal introduces a new type `Curried` defined as following:

``` scala
trait Curried extends Any
```

When a function call `f(p1, p2, p3, ... pn)` is being type checked, the compiler will firstly look for `apply` method on `f`. If an applicable `apply` method is not found and `f` is a subtype of `Curried`, the compiler will convert the function call to curried form `f.applyBegin.applyNext(p1).applyNext(p2).applyNext(p3) ... .applyNext(pn).applyEnd`, and continue type checking the translated call.

### Expanding sequence argument

Optionally, some arguments to a `Curried` call may be a sequence argument marked as  `_*`.

Given a call `f(p1, p2, p3, s1: _*, p4, p5, p6)`, when translating it to curried form, the sequence argument will becomes a `foldLeft` call.

``` scala
s1.foldLeft(f.applyBegin
  .applyNext(p1)
  .applyNext(p2)
  .applyNext(p3)
)(_.applyNext(_))
  .applyNext(p4)
  .applyNext(p5)
  .applyNext(p6)
.applyEnd
```

Unlike traditional repeated parameters, which restrict the sequence argument at the last position, sequence arguments in a curried call are allowed at any position.

### Builder type shifting

The type of partially applied function might be changed during applying each argument. Given the following type signature:

``` scala
class ListBuilder[A] {
  def applyNext[B >: A](b: B): ListBuilder[B] = ???
  def applyEnd: List[A] = ???
}
object List extends Curried {
  def applyBegin[A]: ListBuilder[A] = ???
}
```

`List(42, "a")` should be translated to `List.applyBegin.applyNext(42).applyNext("a").applyEnd`. Then, the typer will infer type parameters as `List.applyBegin[Nothing].applyNext[Int](42).applyNext[Any]("a").applyEnd`, therefore the final return type of `applyEnd` will be `List[Any]`.

### Explicit type parameters

When a `Curried` is invoked with some type arguments, those type arguments will be moved to the `applyBegin` method. Therefore, `List[Int](1 to 3: _*)` should be translated to `(1 to 3).foldLeft(List.applyBegin[Int])(_.applyNext(_)).applyEnd`.

### Implicit parameters

A more common form of curried function call would be like `f(a)(b)(c)`. We prefer the explicit named method calls to `applyNext` instead of the common form, in order to support implicit parameters in `applyNext`. Therefore, each explicit parameter might come with an implicit parameter list, resolving the infamous [multiple type parameter lists](https://github.com/scala/bug/issues/4719) issue.

### Multiple curried vararg parameter lists

When a `Curried` is invoked with multiple parameter lists, for example:
``` scala
f(a, b, c)(d, e)
```

Then the first parameter list should be translated to a curried call:

``` scala
f.applyBegin
  .applyNext(a)
  .applyNext(b)
  .applyNext(c)
.applyEnd(d, e)
```

`(d, e)` is translated to the curried form only if `applyEnd` returns a `Curried`.

### Overloaded curried calls

Curried varargs enables overloaded functions for each parameter. Parameters will not be erased to their common supertype.

## Implementation

This proposal can be implemented either in the Scala compiler or in a whitebox macro. [Curried.scala](https://github.com/Atry/Curried.scala) is an implementation of the proposal in a whitebox macro.

## Drawbacks

`List(1 to 3: _*)` should be translated to `(1 to 3).foldLeft(List.applyBegin)(_.applyNext(_)).applyEnd`. Unfortunately, it does not type check in Scala 2 because the `nsc` compiler cannot infer the type parameter for `List.applyBegin`. As a result, in Scala 2, the explicit type parameter, like `List[Int](1 to 3: _*)`, is required for sequence arguments.

Fortunately, the problem will be solved in Scala 3, as `dotc` is able to infer the type parameter for `List.applyBegin` of the above example.

## Alternatives

### Repeated parameters

Repeated parameters are packed into a `Seq`, which is then passed to the callee.

#### Pros

* Interoperable with Java 

#### Cons

* Always boxing value class parameters
* Unable to inline function parameters
* Unable to inline call-by-name parameters
* Unable to perform implicit conversion for each parameter
* Unable to infer context bound for each parameter  
* Erasing all parameters to their common super type

## Reference
* [Existing Implementation (Curried.scala)](https://github.com/Atry/Curried.scala)
* [Discussion on Scala Contributors forum](https://contributors.scala-lang.org/t/pre-sip-curried-varargs/3608)
* [Pre SIP: name based XML literals](https://contributors.scala-lang.org/t/pre-sip-name-based-xml-literals/2175)
* [Scala Language Specification - Repeated Parameters](https://scala-lang.org/files/archive/spec/2.13/04-basic-declarations-and-definitions.html#repeated-parameters)
