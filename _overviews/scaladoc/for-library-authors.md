---
layout: multipage-overview
title: Scaladoc for Library Authors
partof: scaladoc
overview-name: Scaladoc

num: 3

permalink: /overviews/scaladoc/:title.html
redirect_from:
  - /overviews/scaladoc/basics.html
---

Scaladoc is a documentation system that lives in the comments of Scala source code
and is related to the code structure within which it is written. It is based on
other comment based documentation systems like Javadoc, but with some extensions
such as:

- Markup may be used in the comments.
- Extended @ tags (e.g. `@tparam`, `@see`, `@note`, `@example`, `@usecase`,
  `@since`, etc.)
- Macro definitions (defined values to be substituted in scaladoc).
- Automatic inheritance of comments from a super-class/trait (may be used
  effectively in combination with macro definitions).

## Where to put Scaladoc

Scaladoc comments go before the items they pertain to in a special comment block
that starts with a `/**` and ends with a `*/`, like this:

    /** Start the comment here
      * and use the left star followed by a
      * white space on every line.
      *
      * Even on empty paragraph-break lines.
      *
      * Note that the * on each line is aligned
      * with the second * in /** so that the
      * left margin is on the same column on the
      * first line and on subsequent ones.
      *
      * The closing Scaladoc tag goes on its own,
      * separate line. E.g.
      *
      * Calculate the square of the given number
      *
      * @param d the Double to square
      * @return the result of squaring d
      */
     def square(d: Double): Double = d * d

In the example above, this Scaladoc comment is associated with the method
`square` since it is right before it in the source code.

Scaladoc comments can go before fields, methods, classes, traits, objects and
even (especially) package objects. Scaladoc comments for package objects make
a great place to put an overview of a specific package or API.

For class _primary constructors_ which in Scala coincide with the definition
of the class itself, a `@constructor` tag is used to target a comment to be
put on the primary constructor documentation rather than the class overview.

## Tags

Scaladoc uses `@` tags to provide specific detail fields in the comments. These
include:

### Class specific tags

- `@constructor` placed in the class comment will describe the primary constructor.

### Method specific tags

- `@return` detail the return value from a method (one per method).

### Method, Constructor and/or Class tags

- `@throws` what exceptions (if any) the method or constructor may throw.
- `@param` detail a value parameter for a method or constructor, provide one
  per parameter to the method/constructor.
- `@tparam` detail a type parameter for a method, constructor or class. Provide
  one per type parameter.

### Usage tags

- `@see` reference other sources of information like external document links or
  related entities in the documentation.
- `@note` add a note for pre- or post-conditions, or any other notable restrictions
  or expectations.
- `@example` for providing example code or related example documentation.
- `@usecase` provide a simplified method definition for when the full method
  definition is too complex or noisy. An example is (in the collections API),
  providing documentation for methods that omit the implicit `canBuildFrom`.

### Member grouping tags

These tags are well-suited to larger types or packages, with many members.
They allow you to organize the Scaladoc page into distinct sections, with
each one shown separately, in the order that you choose.

These tags are _not_ enabled by default! You must pass the `-groups`
flag to Scaladoc in order to turn them on. Typically, the sbt for this
will look something like:

```
scalacOptions in (Compile, doc) ++= Seq(
  "-groups"
)
```

Each section should have a single-word identifier that is used in all of
these tags, shown as `<group>` below. By default, that identifier is
shown as the title of that documentation section, but you can use
`@groupname` to provide a longer title.

Typically, you should put `@groupprio` (and optionally `@groupname` and
`@groupdesc`) in the Scaladoc for the package/trait/class/object itself,
describing what all the groups are, and their order. Then put `@group`
in the Scaladoc for each member, saying which group it is in.

Members that do not have a `@group` tag will be listed as "Ungrouped" in
the resulting documentation.

- `@group <group>` - mark the entity as a member of the `<group>` group.
- `@groupname <group> <name>` - provide an optional name for the group. `<name>` is displayed as the group header
  before the group description.
- `@groupdesc <group> <description>` - add optional descriptive text to display under the group name. Supports multiline
  formatted text.
- `@groupprio <group> <priority>` - control the order of the group on the page. Defaults to 0. Ungrouped elements have
  an implicit priority of 1000. Use a value between 0 and 999 to set a relative position to other groups. Low values
  will appear before high values.

### Diagram tags

- `@contentDiagram` - use with traits and classes to include a content hierarchy diagram showing included types.
  The diagram content can be fine-tuned with additional specifiers taken from `hideNodes`, `hideOutgoingImplicits`,
  `hideSubclasses`, `hideEdges`, `hideIncomingImplicits`, `hideSuperclasses` and `hideInheritedNode`.
  `hideDiagram` can be supplied to prevent a diagram from being created if it would be created by default. Packages
  and objects have content diagrams by default.
- `@inheritanceDiagram` - TODO

### Other tags

- `@author` provide author information for the following entity
- `@version` the version of the system or API that this entity is a part of.
- `@since` like `@version` but defines the system or API that this entity was
  _first_ defined in.
- `@todo` for documenting unimplemented features or unimplemented aspects of
  an entity.
- `@deprecated` marks the entity as deprecated, **providing both** the
  replacement implementation that should be used and the version/date at which
  this entity was deprecated.
- `@inheritdoc` take comments from a superclass as defaults if comments are not
  provided locally.
- `@documentable` Expand a type alias and abstract type into a full template page. - TODO: Test the "abstract type" claim - no examples of this in the Scala code base

### Macros

- `@define <name> <definition>` allows use of `$name` in other Scaladoc comments
  within the same source file which will be expanded to the contents of
  `<definition>`.

### 2.12 tags - TODO: Move these into the above groups with a 2.12 note

- `@shortDescription` ???
- `@hideImplicitConversion` ???

## Comment Inheritance

### Implicit

If a comment is not provided for an entity at the current inheritance level, but
is supplied for the overridden entity at a higher level in the inheritance
hierarchy, the comment from the super-class will be used.

Likewise, if `@param`, `@tparam`, `@return` and other entity tags are omitted
but available from a superclass, those comments will be used.

### Explicit

For explicit comment inheritance, use the `@inheritdoc` tag.

## Markup

It is still possible to embed HTML tags in Scaladoc (like with Javadoc), but
not necessary most of the time as markup may be used instead.

Some types of markup available:

    `monospace`
    ''italic text''
    '''bold text'''
    __underline__
    ^superscript^
    ,,subscript,,
    [[entity link]], e.g. [[scala.collection.Seq]]
    [[https://external.link External Link]],
      e.g. [[https://scala-lang.org Scala Language Site]]

### Other formatting notes

- **Paragraphs** are started with one (or more) blank lines. `*` in the margin
  for the comment is valid (and should be included) but the line should be
  blank otherwise.
- **Code blocks** are contained within `{{ "{{{` this " }}`}}}` and may be multi-line.
  Indentation is relative to the starting `*` for the comment.
- **Headings** are defined with surrounding `=` characters, with more `=` denoting
  subheadings. E.g. `=Heading=`, `==Sub-Heading==`, etc.
- **Tables** are defined using `|` to separate elements in a row,
  as described in the [blog](https://scala-lang.org/blog/2018/10/04/scaladoc-tables.html).
- **List blocks** are a sequence of list items with the same style and level,
  with no interruptions from other block styles. Unordered lists can be bulleted
  using `-`; numbered lists can be denoted using `1.`, `i.`, `I.`, or `a.` for the
  various numbering styles. In both cases, you must have extra space in front, and
  more space makes a sub-level.

The markup for list blocks looks like:

    /** Here is an unordered list:
      *
      *   - First item
      *   - Second item
      *     - Sub-item to the second
      *     - Another sub-item
      *   - Third item
      *
      * Here is an ordered list:
      *
      *   1. First numbered item
      *   1. Second numbered item
      *     i. Sub-item to the second
      *     i. Another sub-item
      *   1. Third item
      */

## General Notes for Writing Scaladoc Comments

- Concise is nice! Get to the point quickly, people have limited time to spend
  on your documentation, use it wisely.
- Omit unnecessary words. Prefer `returns X` rather than `this method returns X`,
  and `does X,Y & Z` rather than `this method does X, Y and Z`.
- DRY - don't repeat yourself. Resist duplicating the method description in the
  `@return` tag and other forms of repetitive commenting.

## Disambiguating Overloaded Methods

When linking to overloaded methods in Scaladoc, a simple reference such as
`[[foo]]` may be ambiguous. In such cases, the method signature must be
elaborated enough to uniquely identify the desired overload.

### Example

```scala
import scala.collection.mutable.ListBuffer

class Bar {
  def foo(x: Int): Boolean = ???
  def foo(x: ListBuffer[Int], y: String): Int = ???
}
```

Using `[[foo]]` here will result in an ambiguous reference. Instead, specify
(part of) the method signature.

### Rules for disambiguating overloads

- **No spaces** are allowed inside the signature. A space terminates the link.
- **Argument names must match exactly** as defined in the method.
- **Fully qualify all types**, as if no imports were present.
- End the signature with `*`, which acts as a wildcard once the reference
  becomes unambiguous.

### Valid and invalid examples

```md
[[Bar.foo(x:Int)*]] // valid
[[Bar.foo(x:Int*]] // valid (enough to disambiguate)

[[Bar.foo(Int)*]] // invalid (missing parameter name)
[[Bar.foo(x: Int)*]] // invalid (space in signature)
[[Bar.foo(x:Int):Boolean]] // invalid (missing `*`)
```

### Fully qualified types

When types are involved, dots inside parameter types must be escaped using `\.`:

```md
[[Bar.foo(x:scala\.collection\.mutable\.ListBuffer[Int],y:String)*]]
```

Only the prefix (package / class path) uses normal dots.

### Generic types

When using nested generics, additional brackets may be required to prevent
premature termination of the link:

```md
[[[baz(x:List[List[A]])\*]]]
```

### Term names vs type names

To disambiguate between term and type names:

- Append `$` for **term names** (`val`, `def`, `object`)
- Append `!` for **type names** (`class`, `trait`)

```md
[[scala.collection.immutable.List$.apply]] // object List
[[scala.collection.immutable.List!.apply]] // class List
```

### Known limitations

- `#` syntax is not supported for parameters or return types.
- Spaces cannot be escaped, so `implicit` parameters cannot be referenced.

## More details on writing Scaladoc

Further information on the formatting and style recommendations can be found in
[Scala-lang scaladoc style guide]({{ site.baseurl }}/style/scaladoc.html).
