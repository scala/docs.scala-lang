---
title: Scaladoc settings compatibility between Scala2 and Scala3
type: section
description: This chapter lists all options from Scala2 and Scala3 scaladocs and explain relations between them.
num: 24
previous-page: options-new
next-page: plugin-intro
---

The current page is stating status of scaladoc settings. The related Github issue can be found here for [discussion](https://github.com/lampepfl/dotty/issues/11907)


| Scala2 | Scala3 | Description | Comment | Is implemented?
| ------------- | ------------- | --- | --- | --- |
| -doc-format | _ | Selects in which format documentation is rendered. | Actually old scaladoc supports only html, so it is in some way coherent with new scaladoc, which provides only html | <i class="fa fa-times fa-lg"></i> | 
| -doc-title | -project | The overall name of the Scaladoc site | Aliased in [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> | 
| -doc-version | -project-version | | Aliased in [#11965](https://github.com/lampepfl/dotty/issues/11965)  | <i class="fa fa-check fa-lg"></i> | 
| -doc-footer | _ | A footer on every Scaladoc page, by default the EPFL/Lightbend copyright notice. Can be overridden with a custom footer. | Fixed by [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> | 
| -doc-no-compile | _ | A directory containing sources which should be parsed for docstrings without compiling (e.g. AnyRef.scala) | We don't need this as we have completely different approach to that issue using -Ydocument-synthetic-types flag for synthetic types | <i class="fa fa-check fa-lg"></i> | 
| -doc-source-url | -source-links | A URL pattern used to link to the source file, with some variables supported... | Scala3 implementation provides richer syntax. | <i class="fa fa-check fa-lg"></i> |
| -doc-external-doc | -external-mappings | Comma-separated list of classpath_entry_path#doc_URL pairs describing external dependencies. | Scala3 implementation provides richer syntax. | <i class="fa fa-check fa-lg"></i> |
| -jdk-api-doc-base | -external-mappings | URL used to link Java API references. | You can specify jdk via -external-mappings since they are generalized setting. | <i class="fa fa-check fa-lg"></i> |
| -doc-generator | _ | The fully qualified name of a doclet class, which will be used to generate the documentation | We don't need this in Scala3 |  <i class="fa fa-check fa-lg"></i> |
| -doc-root-content | -doc-root-content | The file from which the root package documentation should be imported. | |  <i class="fa fa-check fa-lg"></i> |
| -implicits | _ |  | We don't need this in Scala3 | <i class="fa fa-check fa-lg"></i> |
| -implicits-debug | _ |  | We don't need this in Scala3 | <i class="fa fa-check fa-lg"></i> |
| -implicits-show-all | _ |  | We don't need this in Scala3 |  <i class="fa fa-check fa-lg"></i> |
| -implicits-sound-shadowing | _ |  | We don't need this in Scala3 |  <i class="fa fa-check fa-lg"></i> |
| -implicits-hide | _ |  | We don't need this in Scala3 |  <i class="fa fa-check fa-lg"></i> |
| -diagrams | _ |  | We don't need this in Scala3? | <i class="fa fa-check fa-lg"></i> |
| -diagrams-debug | _ |  | We don't need this in Scala3? | <i class="fa fa-check fa-lg"></i> |
| -diagrams-dot-path | _ |  | We don't need this in Scala3? |  <i class="fa fa-check fa-lg"></i> |
| -diagrams-max-classes | _ |  | We don't need this in Scala3? |  <i class="fa fa-check fa-lg"></i> |
| -diagrams-max-implicits | _ |  | We don't need this in Scala3? | <i class="fa fa-check fa-lg"></i> |
| -diagrams-dot-timeout | _ |  | We don't need this in Scala3? | <i class="fa fa-check fa-lg"></i> |
| -diagrams-dot-restart | _ |  | We don't need this in Scala3? |  <i class="fa fa-check fa-lg"></i> |
| -author | _ |  | Fixed by [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> | 
| -raw-output | _ |  | We don't need this in Scala3 | <i class="fa fa-check fa-lg"></i> |
| -no-prefixes | _ |  | We don't need this in Scala3 | <i class="fa fa-check fa-lg"></i> |
| -skip-packages | -skip-packages |  |  | <i class="fa fa-check fa-lg"></i> |
| -no-link-warnings | _ | | | <i class="fa fa-check fa-lg"></i> |
| -expand-all-types | _ | | Setting should be removed from Scala2 scaladoc | <i class="fa fa-check fa-lg"></i> |
| -groups | _ | | ~~Implement grouping as it is in Scala3. #11909~~ Actually we support grouping, e. g. [Future](https://scala3doc.virtuslab.com/pr-master/scala3/api/scala/concurrent/Future.html). Since one is using `@group` to actually group his methods, we should consider whether this flag is necessary. Fixed by [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> | 
| -no-java-comments | _ |  | We don't need this in Scala3 |  <i class="fa fa-check fa-lg"></i> |
| -doc-canonical-base-url | _ |  A base URL to use as prefix and add `canonical` URLs to all pages. The canonical URL may be used by search engines to choose the URL that you want people to see in search results. If unset no canonical URLs are generated. | Fixed by [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> | 
| -private | _ | Show all types and members. Unless specified, show only public and protected types and members. | Fixed by [#11965](https://github.com/lampepfl/dotty/issues/11965) | <i class="fa fa-check fa-lg"></i> | 
| _ | -siteroot | | We don't migrate it | <i class="fa fa-check fa-lg"></i> |
| _ | -project-logo | | Should we migrate it? | <i class="fa fa-check fa-lg"></i> |
| _ | -comment-syntax | | We don't migrate it | <i class="fa fa-check fa-lg"></i> |
| _ | -revision | | Should we migrate it? | <i class="fa fa-check fa-lg"></i> |
| _ | -social-links | | Should we migrate it? | <i class="fa fa-check fa-lg"></i> |
| _ | -skip-by-id | | We don't migrate it | <i class="fa fa-check fa-lg"></i> |
| _ | -skip-by-regex | | We don't migrate it | <i class="fa fa-check fa-lg"></i> |
| _ | -snippet-compiler-args | | We don't migrate it | <i class="fa fa-check fa-lg"></i> |
| _ | -Ydocument-synthetic-types | Documents intrinsic types e. g. Any, Nothing. Setting is useful only for stdlib  |  | <i class="fa fa-check fa-lg"></i> | 
