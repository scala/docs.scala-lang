---
title: Scaladoc settings compatibility between Scala2 and Scala3
type: section
description: This chapter lists all the scaladoc options for Scala 2 and Scala 3, and explains the relations between them.
num: 24
previous-page: options-new
next-page: plugin-intro
---

The current page is stating the status of scaladoc settings. The related Github issue can be found here for [discussion](https://github.com/lampepfl/dotty/issues/11907)


| Scala2 | Scala3 | Description | Comment | Is implemented?
| ------------- | ------------- | --- | --- | --- |
| -doc-format | _ | Selects in which format documentation is rendered. | Actually, old scaladoc supports only html, so it is in some way consistent with new scaladoc, which provides only html | <i class="fa fa-times fa-lg"></i> |  
| -doc-title | -project | The overall name of the Scaladoc site | Aliased in [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> | 
| -doc-version | -project-version | | Aliased in [#11965](https://github.com/lampepfl/dotty/issues/11965)  | <i class="fa fa-check fa-lg"></i> | 
| -doc-footer | -project-footer | A footer on every Scaladoc page, by default the EPFL/Lightbend copyright notice. Can be overridden with a custom footer. | Fixed by [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> |  
| -doc-no-compile | _ | A directory containing sources which should be parsed for docstrings without compiling (e.g. AnyRef.scala) | We don't need this as we have completely different approach to that issue using -Ydocument-synthetic-types flag for synthetic types | <i class="fa fa-check fa-lg"></i> | 
| -doc-source-url | -source-links | A URL pattern used to link to the source file, with some variables supported... | Scala3 implementation provides richer syntax. You can find migration steps below this [table](#source-links). | <i class="fa fa-check fa-lg"></i> |
| -doc-external-doc | -external-mappings | Links describing locations of external dependencies' documentations. | Scala3 implementation provides richer syntax. You can find migration steps below this [table](#external-mappings). | <i class="fa fa-check fa-lg"></i> |
| -jdk-api-doc-base | -external-mappings | URL used to link Java API references. | You can specify jdk via -external-mappings since they are generalized setting. You can find migration steps below this [table](#external-mappings) | <i class="fa fa-check fa-lg"></i> |
| -doc-generator | _ | The fully qualified name of a doclet class, which will be used to generate the documentation. | We don't need this in Scala3 |  <i class="fa fa-check fa-lg"></i> |
| -doc-root-content | -doc-root-content | The file from which the root package documentation should be imported. | |  <i class="fa fa-check fa-lg"></i> |
| -implicits | _ |  | We don't need this in Scala3 - Contextual extension methods are always documented in Scala 3 | <i class="fa fa-times fa-lg"></i> |
| -implicits-debug | _ |  | We don't need this in Scala3 | <i class="fa fa-times fa-lg"></i> |
| -implicits-show-all | _ |  | We don't need this in Scala3 |  <i class="fa fa-times fa-lg"></i> |
| -implicits-sound-shadowing | _ | | We don't need this in Scala3 |  <i class="fa fa-times fa-lg"></i> |
| -implicits-hide | _ |  | We don't need this in Scala3 |  <i class="fa fa-times fa-lg"></i> |
| -diagrams | _ |  | We don't need this in Scala3 | <i class="fa fa-times fa-lg"></i> |
| -diagrams-debug | _ |  | We don't need this in Scala3 | <i class="fa fa-times fa-lg"></i> |
| -diagrams-dot-path | _ |  | We don't need this in Scala3 |  <i class="fa fa-times fa-lg"></i> |
| -diagrams-max-classes | _ |  | We don't need this in Scala3 |  <i class="fa fa-times fa-lg"></i> |
| -diagrams-max-implicits | _ |  | We don't need this in Scala3 | <i class="fa fa-times fa-lg"></i> |
| -diagrams-dot-timeout | _ |  | We don't need this in Scala3 | <i class="fa fa-times fa-lg"></i> |
| -diagrams-dot-restart | _ |  | We don't need this in Scala3 |  <i class="fa fa-times fa-lg"></i> |
| -author | -author |  | Fixed by [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> | 
| -raw-output | _ |  | We don't need this in Scala3 | <i class="fa fa-check fa-lg"></i> |
| -no-prefixes | _ |  | We don't need this in Scala3 | <i class="fa fa-check fa-lg"></i> |
| -skip-packages | -skip-packages |  |  | <i class="fa fa-check fa-lg"></i> |
| -no-link-warnings | _ | | Not implemented yet | <i class="fa fa-times fa-lg"></i> |
| -expand-all-types | _ | | Setting has been removed | <i class="fa fa-times fa-lg"></i> |
| -groups | -groups | | | <i class="fa fa-check fa-lg"></i> | 
| -no-java-comments | _ |  | We don't need this in Scala3 |  <i class="fa fa-check fa-lg"></i> |
| -doc-canonical-base-url | -doc-canonical-base-url |  A base URL to use as prefix and add `canonical` URLs to all pages. The canonical URL may be used by search engines to choose the URL that you want people to see in search results. If unset no canonical URLs are generated. | Fixed by [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> | 
| -private | -private | Show all types and members. Unless specified, show only public and protected types and members. | Fixed by [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> | 
| _ | -siteroot | | We don't backport it to old scaladoc | N/A |
| _ | -project-logo | | Should we backport it to the old scaladoc? | N/A |
| _ | -comment-syntax | | We don't backport it to the old scaladoc | N/A |
| _ | -revision | | Should we backport it to the old scaladoc? | N/A |
| _ | -social-links | | Should we backport it to the old scaladoc? | N/A |
| _ | -skip-by-id | | We don't backport it to the old scaladoc | N/A |
| _ | -skip-by-regex | | We don't backport it to the old scaladoc | N/A |
| _ | -snippet-compiler-args | | We don't backport it to the old scaladoc | N/A |
| _ | -Ydocument-synthetic-types | Documents intrinsic types e. g. Any, Nothing. Setting is useful only for stdlib  |  | <i class="fa fa-check fa-lg"></i> | 

## Source links

Source links are used to point to source code at some remote repository like github or bitbucket.
Hopefully, the new syntax is almost superset of the old syntax. 
To migrate to the new scaladoc syntax, make sure that you don't use any of these variables:
`€{TPL_OWNER}` or `€{FILE_PATH_EXT}`. Otherwise you have to rewrite your source link, using either other `variables` or you can use new
syntax, about which you can read more at [dotty docs](https://dotty.epfl.ch/docs/usage/scaladoc/settings.html) 
Note that new syntax let you specify prefixes of your files paths to match specific url in case your sources are scattered in different
directories or even different repositories.


## External mappings

This setting is a generalized form of the old settings for javadoc/scaladoc.

Example external mapping is:
```
-external-mappings:.*scala.*::scaladoc3::https://scala-lang.org/api/3.x/,.*java.*::javadoc::https://docs.oracle.com/javase/8/docs/api/
```

A mapping is of the form '\<regex>::\[scaladoc3|scaladoc|javadoc]::\<path>'. You can supply several mappings, separated by commas, as shown in the example.

Given that the old syntaxes were:
- for scaladoc - `prefix#url`
- for javadoc - just URL

one must take the regex that will match fq name (for javadoc, it can be wildcard like `java.*`), then concatenate it using double colons `::`
with one of the 3 available documentation formats, then again append `::` and then provide url for where the extednal documentation is hosted. 
