---
layout: style-guide
title: Scala Style Guide
partof: style
overview-name: "&nbsp;"
---

This document is intended to outline some basic Scala stylistic guidelines which should be followed with more or less fervency. Wherever possible, this guide attempts to detail why a particular style is encouraged and how it relates to other alternatives. As with all style guides, treat this document as a list of rules to be broken. There are certainly times when alternative styles should be preferred over the ones given here.
<div class="span8">

  <ul>
    <li><a href="{{ site.baseurl }}/style/indentation.html">Indentation</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/indentation.html#line-wrapping">Line Wrapping</a></li>
        <li><a href="{{ site.baseurl }}/style/indentation.html#methods-with-numerous-arguments">Methods with Numerous Arguments</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/naming-conventions.html">Naming Conventions</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#classestraits">Classes/Traits</a></li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#objects">Objects</a></li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#packages">Packages</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/naming-conventions.html#root">root</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#methods">Methods</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/naming-conventions.html#accessorsmutators">Accessors/Mutators</a></li>
            <li><a href="{{ site.baseurl }}/style/naming-conventions.html#parentheses">Parentheses</a></li>
            <li><a href="{{ site.baseurl }}/style/naming-conventions.html#symbolic-method-names">Symbolic Method Names</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#constants-values-variable-and-methods">Constants, Values, Variable and Methods</a></li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#type-parameters-generics">Type Parameters (generics)</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/naming-conventions.html#higher-kinds-and-parameterized-type-parameters">Higher-Kinds and Parameterized Type parameters</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#annotations">Annotations</a></li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#special-note-on-brevity">Special Note on Brevity</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/types.html">Types</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/types.html#inference">Inference</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/types.html#function-values">Function Values</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/types.html#annotations">Annotations</a></li>
        <li><a href="{{ site.baseurl }}/style/types.html#ascription">Ascription</a></li>
        <li><a href="{{ site.baseurl }}/style/types.html#functions">Functions</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/types.html#arity-1">Arity-1</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/types.html#structural-types">Structural Types</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/nested-blocks.html">Nested Blocks</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/nested-blocks.html#curly-braces">Curly Braces</a></li>
        <li><a href="{{ site.baseurl }}/style/nested-blocks.html#parentheses">Parentheses</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/declarations.html">Declarations</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/declarations.html#classes">Classes</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/declarations.html#ordering-of-class-elements">Ordering Of Class Elements</a></li>
            <li><a href="{{ site.baseurl }}/style/declarations.html#methods">Methods</a>
              <ul>
                <li><a href="{{ site.baseurl }}/style/declarations.html#modifiers">Modifiers</a></li>
                <li><a href="{{ site.baseurl }}/style/declarations.html#body">Body</a></li>
                <li><a href="{{ site.baseurl }}/style/declarations.html#multiple-parameter-lists">Multiple Parameter Lists</a></li>
                <li><a href="{{ site.baseurl }}/style/declarations.html#higher-order-functions">Higher-Order Functions</a></li>
              </ul>
            </li>
            <li><a href="{{ site.baseurl }}/style/declarations.html#fields">Fields</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/declarations.html#function_values">Function Values</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/declarations.html#spacing">Spacing</a></li>
            <li><a href="{{ site.baseurl }}/style/declarations.html#multi-expression-functions">Multi-Expression Functions</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/control-structures.html">Control Structures</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/control-structures.html#curly-braces">Curly-Braces</a></li>
        <li><a href="{{ site.baseurl }}/style/control-structures.html#comprehensions">Comprehensions</a></li>
        <li><a href="{{ site.baseurl }}/style/control-structures.html#trivial-conditionals">Trivial Conditionals</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/method-invocation.html">Method Invocation</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/method-invocation.html#arity-0">Arity-0</a></li>
          <ul>
            <li><a href="{{ site.baseurl }}/style/method-invocation.html#suffix-notation">Suffix Notation</a></li>
          </ul>
        <li><a href="{{ site.baseurl }}/style/method-invocation.html#arity-1">Arity-1</a></li>
          <ul>
            <li><a href="{{ site.baseurl }}/style/method-invocation.html#higher-order-functions">Higher-Order Functions</a></li>
          </ul>
        <li><a href="{{ site.baseurl }}/style/method-invocation.html#symbolic-methodsoperators">Symbolic methods/Operators</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/files.html">Files</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/files.html#multi-unit-files">Multi-Unit Files</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/scaladoc.html">Scaladoc</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/scaladoc.html#general-style">General Style</a></li>
        <li><a href="{{ site.baseurl }}/style/scaladoc.html#packages">Packages</a></li>
        <li><a href="{{ site.baseurl }}/style/scaladoc.html#classes-objects-and-traits">Classes, Objects, and Traits</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/scaladoc.html#classes">Classes</a></li>
            <li><a href="{{ site.baseurl }}/style/scaladoc.html#objects">Objects</a></li>
            <li><a href="{{ site.baseurl }}/style/scaladoc.html#traits">Traits</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/scaladoc.html#methods-and-other-members">Methods and Other Members</a></li>
      </ul>
    </li>
  </ul>

</div>

<div class="span8">

<h3>Thanks to</h3>
<p><a href="http://www.codecommit.com/">Daniel Spiewak</a> and <a href="http://www.naildrivin5.com/">David Copeland</a> for putting this style guide together, and Simon Ochsenreither for converting it to Markdown.</p>

</div>
