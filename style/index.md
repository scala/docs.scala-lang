---
layout: index
title: Scala Style Guide
---

<div class="span8">
  <div class="page-header-index">
    <h1>Contents</h1>
  </div>

  <!-- We have to hard-code the comments until Jekyll can deal with liquid raw tags.
  {% for pg in site.pages %}
    {% if pg.partof == "style-guide" and pg.outof %}
      {% assign totalPages = pg.outof %}  
    {% endif %}
  {% endfor %}

  {% if totalPages %}
    <ul>
    {% for i in (1..totalPages) %}
      {% for pg in site.pages %}
        {% if pg.partof == "style-guide" and pg.num and pg.num == i %}
          <li class="tour-of-scala"><a href="{{ pg.url }}">{{ pg.title }}</a></li> 
        {% endif %}
      {% endfor %}
    {% endfor %}
    </ul>
  {% else %} <b>ERROR</b>. Couldn't find the total number of pages in this set of tutorial articles. Have you declared the `outof` tag in your YAML front matter?
  {% endif %}
  -->

  <ul>
    <li><a href="{{ site.baseurl }}/style/overview.html">Overview</a></li>
    <li><a href="{{ site.baseurl }}/style/indentation.html">Indentation</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/indentation.html#line_wrapping">Line Wrapping</a></li>
        <li><a href="{{ site.baseurl }}/style/indentation.html#methods_with_numerous_arguments">Methods with Numerous Arguments</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/naming-conventions.html">Naming Conventions</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#classestraits">Classes/Traits</a></li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#objects">Objects</a></li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#packages">Packages</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/naming-conventions.html#versions_prior_to_28">Versions Prior to 2.8</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#methods">Methods</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/naming-conventions.html#accessorsmutators">Accessors/Mutators</a></li>
            <li><a href="{{ site.baseurl }}/style/naming-conventions.html#parentheses">Parentheses</a></li>
            <li><a href="{{ site.baseurl }}/style/naming-conventions.html#symbolic_method_names">Symbolic Method Names</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#values_variable_and_methods">Values, Variables, and Methods</a></li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#type_parameters_generics">Type Parameters (Generics)</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/naming-conventions.html#higherkinds_and_parameterized_type_parameters">Higher-Kinds and Parameterized Type Parameters</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#annotations">Annotations</a></li>
        <li><a href="{{ site.baseurl }}/style/naming-conventions.html#special_note_on_brevity">Special Note on Brevity</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/types.html">Types</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/types.html#inference">Inference</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/types.html#function_values">Function Values</a></li>
            <li><a href="{{ site.baseurl }}/style/types.html#void_methods">"Void" Methods</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/types.html#annotations">Annotations</a></li>
        <li><a href="{{ site.baseurl }}/style/types.html#ascription">Ascription</a></li>
        <li><a href="{{ site.baseurl }}/style/types.html#functions">Functions</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/types.html#arity1">Arity-1</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/types.html#structural_types">Structural Types</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/nested-blocks.html">Nested Blocks</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/nested-blocks.html#curly_braces">Curly Braces</a></li>
        <li><a href="{{ site.baseurl }}/style/nested-blocks.html#parentheses">Parentheses</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/declarations.html">Declarations</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/declarations.html#classes">Classes</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/declarations.html#ordering_of_class_elements">Ordering of Class Elements</a></li>
            <li><a href="{{ site.baseurl }}/style/declarations.html#methods">Methods</a>
              <ul>
                <li><a href="{{ site.baseurl }}/style/declarations.html#modifiers">Modifiers</a></li>
                <li><a href="{{ site.baseurl }}/style/declarations.html#body">Body</a></li>
                <li><a href="{{ site.baseurl }}/style/declarations.html#multiple_parameter_lists">Multiple Parameter Lists</a></li>
                <li><a href="{{ site.baseurl }}/style/declarations.html#higherorder_functions">Higher-Order Functions</a></li>
              </ul>
            </li>
            <li><a href="{{ site.baseurl }}/style/declarations.html#fields">Fields</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/declarations.html#function_values">Function Values</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/declarations.html#spacing">Spacing</a></li>
            <li><a href="{{ site.baseurl }}/style/declarations.html#multiexpression_functions">Multi-Expression Functions</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/control-structures.html">Control Structures</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/control-structures.html#curlybraces">Curly-Braces</a></li>
        <li><a href="{{ site.baseurl }}/style/control-structures.html#comprehensions">Comprehensions</a></li>
        <li><a href="{{ site.baseurl }}/style/control-structures.html#trivial_conditionals">Trivial Conditionals</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/method-invocation.html">Method Invocation</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/method-invocation.html#arity0">Arity-0</a></li>
          <ul>
            <li><a href="{{ site.baseurl }}/style/method-invocation.html#suffix_notation">Suffix Notation</a></li>
          </ul>
        <li><a href="{{ site.baseurl }}/style/method-invocation.html#arity1">Arity-1</a></li>
          <ul>
            <li><a href="{{ site.baseurl }}/style/method-invocation.html#higherorder_functions">Higher-Order Functions</a></li>
          </ul>
        <li><a href="{{ site.baseurl }}/style/method-invocation.html#symbolic_methodsoperators">Symbolic Methods / Operators</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/files.html">Files</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/files.html#multiunit_files">Multi-Unit Files</a></li>
      </ul>
    </li>
    <li><a href="{{ site.baseurl }}/style/scaladoc.html">Scaladoc</a>
      <ul>
        <li><a href="{{ site.baseurl }}/style/scaladoc.html#general_style">General Style</a></li>
        <li><a href="{{ site.baseurl }}/style/scaladoc.html#packages">Packages</a></li>
        <li><a href="{{ site.baseurl }}/style/scaladoc.html#classes_objects_and_traits">Classes, Objects, and Traits</a>
          <ul>
            <li><a href="{{ site.baseurl }}/style/scaladoc.html#classes">Classes</a></li>
            <li><a href="{{ site.baseurl }}/style/scaladoc.html#objects">Objects</a></li>
            <li><a href="{{ site.baseurl }}/style/scaladoc.html#traits">Traits</a></li>
          </ul>
        </li>
        <li><a href="{{ site.baseurl }}/style/scaladoc.html#methods_and_other_members">Methods and Other Members</a></li>
      </ul>
    </li>
  </ul>

</div>

<div class="span8">

  <div class="page-header-index">
    <h1>About</h1>
  </div>

  <p>This document is intended to outline some basic Scala stylistic guidelines which should be followed with more or less fervency. Wherever possible, this guide attempts to detail why a particular style is encouraged and how it relates to other alternatives. As with all style guides, treat this document as a list of rules to be broken. There are certainly times when alternative styles should be preferred over the ones given here.</p>

<h3>Thanks to</h3>
<p><a href="http://www.codecommit.com/">Daniel Spiewak</a> and <a href="http://www.naildrivin5.com/">David Copeland</a> for putting this style guide together, and Simon Ochsenreither for converting it to Markdown.</p>

</div>
