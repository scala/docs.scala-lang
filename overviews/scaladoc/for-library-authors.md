---
layout: overview-large
title: Scaladoc for Library Authors

disqus: true

partof: scaladoc
num: 2
outof: 3
languages: [ko]
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

For class *primary constructors* which in Scala coincide with the definition
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
- `@note` add a note for pre or post conditions, or any other notable restrictions
  or expectations.
- `@example` for providing example code or related example documentation.
- `@usecase` provide a simplified method definition for when the full method
  definition is too complex or noisy. An example is (in the collections API),
  providing documentation for methods that omit the implicit `canBuildFrom`.


### Member grouping tags
- `@group <group>` - mark the entity as a member of the `<group>` group.
- `@groupname <group> <name>` - provide an optional name for the group. `<name>` is displayed as the group header
-  before the group description.
- `@groupdesc <group> <description>` - add optional descriptive text to display under the group name. Supports multiline
   formatted text.
- `@groupprio` <priority> - control the order of the group on the page. Defaults to 0. Ungrouped elements have
  an implicit priority of 1000. Use a value between 0 and 999 to set a relative position to other groups. Low values
  will appear before high values.


### Diagram tags
- `@contentDiagram` - use with traits and classes to include a content hierarchy diagram showing included types.
   The diagram content can be fine tuned with additional specifiers taken from `hideNodes`, `hideOutgoingImplicits`,
   `hideSubclasses`, `hideEdges`, `hideIncomingImplicits`, `hideSuperclasses` and `hideInheritedNode`.
   `hideDiagram` can be supplied to prevent a diagram from being created if it would be created by default. Packages
   and objects have content diagrams by default.
- `@inheritanceDiagram` - TODO

### Other tags
- `@author` provide author information for the following entity
- `@version` the version of the system or API that this entity is a part of.
- `@since` like `@version` but defines the system or API that this entity was
  *first* defined in.
- `@todo` for documenting unimplemented features or unimplemented aspects of
  an entity.
- `@deprecated` marks the entity as deprecated, **providing both** the
  replacement implementation that should be used and the version/date at which
  this entity was deprecated.
- `@migration` like deprecated but provides advanced warning of planned changes
  ahead of deprecation. Same fields as `@deprecated`.
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

Likewise if `@param`, `@tparam`, `@return` and other entity tags are omitted
but available from a superclass, those comments will be used.

### Explicit
For explicit comment inheritance, use the `@inheritdoc` tag.


## Markup

It is still possible to embed HTML tags in Scaladoc (like with Javadoc), but
not necessary most of the time as markup may be used instead.

Some of the standard markup available:

    `monospace`
    ''italic text''
    '''bold text'''
    __underline__
    ^superscript^
    ,,subscript,,
    [[entity link]], e.g. [[scala.collection.Seq]]
    [[http://external.link External Link]],
      e.g. [[http://scala-lang.org Scala Language Site]]

### Other formatting notes

- **Paragraphs** are started with one (or more) blank lines. `*` in the margin
  for the comment is valid (and should be included) but the line should be
  blank otherwise.
- **Code blocks** are contained within `{{ "{{{` this " }}`}}}` and may be multi-line.
  Indentation is relative to the starting `*` for the comment.
- **Headings** are defined with surrounding `=` characters, with more `=` denoting
  subheadings. E.g. `=Heading=`, `==Sub-Heading==`, etc.
- **List blocks** are a sequence of list items with the same style and level,
  with no interruptions from other block styles. Unordered lists can be bulleted
  using `-`, while numbered lists can be denoted using `1.`, `i.`, `I.`, `a.` for
  the various numbering styles.

## General Notes for Writing Scaladoc Comments ##

- Concise is nice! Get to the point quickly, people have limited time to spend
  on your documentation, use it wisely.
- Omit unnecessary words. Prefer `returns X` rather than `this method returns X`,
  and `does X,Y & Z` rather than `this method does X, Y and Z`.
- DRY - don't repeat yourself. Resist duplicating the method description in the
  `@return` tag and other forms of repetitive commenting.

## More details on writing Scaladoc

Further information on the formatting and style recommendations can be found in
[Scala-lang scaladoc style guide](http://docs.scala-lang.org/style/scaladoc.html)
and on the
[Scala Wiki](https://wiki.scala-lang.org/display/SW/Writing+Documentation).
