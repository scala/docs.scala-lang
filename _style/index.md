---
layout: style-guide
title: Scala Style Guide
partof: style
overview-name: "&nbsp;"
---

This document is intended to outline some basic Scala stylistic guidelines which should be followed with more or less fervency. Wherever possible, this guide attempts to detail why a particular style is encouraged and how it relates to other alternatives. As with all style guides, treat this document as a list of rules to be broken. There are certainly times when alternative styles should be preferred over the ones given here.


- [Indentation](indentation.html)
  - [Line Wrapping](indentation.html#line-wrapping)
  - [Methods with Numerous Arguments](indentation.html#methods-with-numerous-arguments)
- [Naming Conventions](naming-conventions.html)
  - [Classes/Traits](naming-conventions.html#classestraits)
  - [Objects](naming-conventions.html#objects)
  - [Packages](naming-conventions.html#packages)
    - [root](naming-conventions.html#root)
  - [Methods](naming-conventions.html#methods)
    - [Accessors/Mutators](naming-conventions.html#accessorsmutators)
    - [Parentheses](naming-conventions.html#parentheses)
    - [Symbolic Method Names](naming-conventions.html#symbolic-method-names)
  - [Constants, Values, Variable and Methods](naming-conventions.html#constants-values-variable-and-methods)
  - [Type Parameters (generics)](naming-conventions.html#type-parameters-generics)
    - [Higher-Kinds and Parameterized Type parameters](naming-conventions.html#higher-kinds-and-parameterized-type-parameters)
  - [Annotations](naming-conventions.html#annotations)
  - [Special Note on Brevity](naming-conventions.html#special-note-on-brevity)
- [Types](types.html)
  - [Inference](types.html#inference)
    - [Function Values](types.html#function-values)
  - [Annotations](types.html#annotations)
  - [Ascription](types.html#ascription)
  - [Functions](types.html#functions)
    - [Arity-1](types.html#arity-1)
  - [Structural Types](types.html#structural-types)
- [Nested Blocks](nested-blocks.html)
  - [Curly Braces](nested-blocks.html#curly-braces)
  - [Parentheses](nested-blocks.html#parentheses)
- [Declarations](declarations.html)
  - [Classes](declarations.html#classes)
    - [Ordering Of Class Elements](declarations.html#ordering-of-class-elements)
    - [Methods](declarations.html#methods)
      - [Procedure Syntax](declarations.html#procedure-syntax)
      - [Modifiers](declarations.html#modifiers)
      - [Body](declarations.html#body)
      - [Multiple Parameter Lists](declarations.html#multiple-parameter-lists)
      - [Higher-Order Functions](declarations.html#higher-order-functions)
    - [Fields](declarations.html#fields)
  - [Function Values](declarations.html#function-values)
    - [Spacing](declarations.html#spacing)
    - [Multi-Expression Functions](declarations.html#multi-expression-functions)
- [Control Structures](control-structures.html)
  - [Curly-Braces](control-structures.html#curly-braces)
  - [Comprehensions](control-structures.html#comprehensions)
  - [Trivial Conditionals](control-structures.html#trivial-conditionals)
- [Method Invocation](method-invocation.html)
  - [Arity-0](method-invocation.html#arity-0)
  - [Arity-1 (Infix Notation)](method-invocation.html#arity-1-infix-notation)
    - [Symbolic Methods/Operators](method-invocation.html#symbolic-methodsoperators)
    - [Higher-Order Functions](method-invocation.html#higher-order-functions)
- [Files](files.html)
  - [Multi-Unit Files](files.html#multi-unit-files)
- [Scaladoc](scaladoc.html)
  - [General Style](scaladoc.html#general-style)
  - [Packages](scaladoc.html#packages)
  - [Classes, Objects, and Traits](scaladoc.html#classes-objects-and-traits)
    - [Classes](scaladoc.html#classes)
    - [Objects](scaladoc.html#objects)
    - [Traits](scaladoc.html#traits)
  - [Methods and Other Members](scaladoc.html#methods-and-other-members)

### Thanks to ###

[Daniel Spiewak](https://www.codecommit.com/) and [David Copeland](https://www.naildrivin5.com/) for putting this style guide together, and Simon Ochsenreither for converting it to Markdown.
