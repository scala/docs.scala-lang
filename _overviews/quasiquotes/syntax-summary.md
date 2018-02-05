---
layout: multipage-overview
title: Syntax summary

discourse: true

partof: quasiquotes
overview-name: Quasiquotes

num: 7

permalink: /overviews/quasiquotes/:title.html
---
**Denys Shabalin** <span class="tag" style="float: right;">EXPERIMENTAL</span>

## Expressions


                         | Quasiquote                                                       | Type
-------------------------|------------------------------------------------------------------|-------------------------
 [Empty][101]            | `q""`                                                            | EmptyTree
 [Literal][102]          | `q"$value"`                                                      | Literal
 [Identifier][103]       | `q"$tname"` or `q"name"`                                         | Ident
 [Selection][103]        | `q"$expr.$tname"`                                                | Select
 [Super Selection][104]  | `q"$tpname.super[$tpname].$tname"`                               | Select
 [This][104]             | `q"$tpname.this"`                                                | This
 [Application][105]      | `q"$expr(...$exprss)"`                                           | Apply
 [Type Application][105] | `q"$expr[..$tpts]"`                                              | TypeApply
 [Assign][106]           | `q"$expr = $expr"`                                               | Assign, AssignOrNamedArg
 [Update][106]           | `q"$expr(..$exprs) = $expr"`                                     | Tree
 [Return][107]           | `q"return $expr"`                                                | Return
 [Throw][108]            | `q"throw $expr"`                                                 | Throw
 [Ascription][109]       | `q"$expr: $tpt"`                                                 | Typed
 [Annotated][110]        | `q"$expr: @$annot"`                                              | Annotated
 [Tuple][111]            | `q"(..$exprs)"`                                                  | Tree
 [Block][112]            | `q"{ ..$stats }"`                                                | Block
 [If][113]               | `q"if ($expr) $expr else $expr"`                                 | If
 [Pattern Match][114]    | `q"$expr match { case ..$cases }"`                               | Match
 [Try][115]              | `q"try $expr catch { case ..$cases } finally $expr"`             | Try
 [Function][116]         | `q"(..$params) => $expr"`                                        | Function
 [Partial Function][117] | `q"{ case ..$cases }"`                                           | Match
 [While Loop][118]       | `q"while ($expr) $expr"`                                         | LabelDef
 [Do-While Loop][118]    | `q"do $expr while ($expr)"`                                      | LabelDef
 [For Loop][119]         | `q"for (..$enums) $expr"`                                        | Tree
 [For-Yield Loop][119]   | `q"for (..$enums) yield $expr"`                                  | Tree
 [New][120]              | `q"new { ..$earlydefns } with ..$parents { $self => ..$stats }"` | Tree
 XML Literal             | Not natively supported                                           | Tree


[101]: expression-details.html#empty
[102]: expression-details.html#literal
[103]: expression-details.html#identifier-and-selection
[104]: expression-details.html#super-and-this
[105]: expression-details.html#application-and-type-application
[106]: expression-details.html#assign-and-update
[107]: expression-details.html#return
[108]: expression-details.html#throw
[109]: expression-details.html#ascription
[110]: expression-details.html#annotation
[111]: expression-details.html#tuple
[112]: expression-details.html#block
[113]: expression-details.html#if
[114]: expression-details.html#pattern-match
[115]: expression-details.html#try
[116]: expression-details.html#function
[117]: expression-details.html#partial-function
[118]: expression-details.html#while-and-do-while-loops
[119]: expression-details.html#for-and-for-yield-loops
[120]: expression-details.html#new

## Types

                             | Quasiquote                            | Type
-----------------------------|---------------------------------------|---------------------
 [Empty Type][201]           | `tq""`                                | TypeTree
 [Type Identifier][202]      | `tq"$tpname"` or `tq"Name"`           | Ident
 [Singleton Type][203]       | `tq"$ref.type"`                       | SingletonTypeTree
 [Type Projection][204]      | `tq"$tpt#$tpname"`                    | SelectFromTypeTree
 [Type Selection][204]       | `tq"$ref.$tpname"`                    | Select
 [Super Type Selection][204] | `tq"$tpname.super[$tpname].$tpname"`  | Select
 [This Type Selection][204]  | `tq"this.$tpname"`                    | Select
 [Applied Type][205]         | `tq"$tpt[..$tpts]"`                   | AppliedTypeTree
 [Annotated Type][206]       | `tq"$tpt @$annots"`                   | Annotated
 [Compound Type][207]        | `tq"..$parents { ..$defns }"`         | CompoundTypeTree
 [Existential Type][208]     | `tq"$tpt forSome { ..$defns }"`       | ExistentialTypeTree
 [Tuple Type][209]           | `tq"(..$tpts)"`                       | Tree
 [Function Type][210]        | `tq"(..$tpts) => $tpt"`               | Tree

[201]: type-details.html#empty-type
[202]: type-details.html#type-identifier
[203]: type-details.html#singleton-type
[204]: type-details.html#type-projection
[205]: type-details.html#applied-type
[206]: type-details.html#annotated-type
[207]: type-details.html#compound-type
[208]: type-details.html#existential-type
[209]: type-details.html#tuple-type
[210]: type-details.html#function-type

## Patterns

                            | Quasiquote             | Type
----------------------------|------------------------|-------------------
 [Wildcard Pattern][301]    | `pq"_"`                | Ident
 [Literal Pattern][302]     | `pq"$value"`           | Literal
 [Binding Pattern][303]     | `pq"$name @ $pat"`     | Bind
 [Extractor Pattern][304]   | `pq"$ref(..$pats)"`    | Apply, UnApply
 [Type Pattern][305]        | `pq"_: $tpt"`          | Typed
 [Alternative Pattern][306] | `pq"$first │ ..$rest"` | Alternative
 [Tuple Pattern][307]       | `pq"(..$pats)"`        | Apply, UnApply
 XML Pattern                | Not natively supported | Tree

[301]: pattern-details.html#wildcard-pattern
[302]: pattern-details.html#literal-pattern
[303]: pattern-details.html#binding-pattern
[304]: pattern-details.html#extractor-pattern
[305]: pattern-details.html#type-pattern
[306]: pattern-details.html#alternative-pattern
[307]: pattern-details.html#tuple-pattern

## Definitions

                              | Quasiquote                                                                                                                  | Type
------------------------------|-----------------------------------------------------------------------------------------------------------------------------|-----------
 [Val][401]                   | `q"$mods val $tname: $tpt = $expr"` or `q"$mods val $pat = $expr"`                                                          | ValDef
 [Var][401]                   | `q"$mods var $tname: $tpt = $expr"` or `q"$mods val $pat = $expr"`                                                          | ValDef
 [Val Pattern][403]           | `q"$mods val $pat: $tpt = $expr"`                                                                                           | Tree
 [Var Pattern][404]           | `q"$mods var $pat: $tpt = $expr"`                                                                                           | Tree
 [Method][403]                | `q"$mods def $tname[..$tparams](...$paramss): $tpt = $expr"`                                                                | DefDef
 [Secondary Constructor][404] | `q"$mods def this(...$paramss) = this(..$argss)"`                                                                           | DefDef
 [Type][405]                  | `q"$mods type $tpname[..$tparams] = $tpt"`                                                                                  | TypeDef
 [Class][406]                 | `q"$mods class $tpname[..$tparams] $ctorMods(...$paramss) extends { ..$earlydefns } with ..$parents { $self => ..$stats }"` | ClassDef
 [Trait][407]                 | `q"$mods trait $tpname[..$tparams] extends { ..$earlydefns } with ..$parents { $self => ..$stats }"`                        | TraitDef
 [Object][408]                | `q"$mods object $tname extends { ..$earlydefns } with ..$parents { $self => ..$body }"`                                     | ModuleDef
 [Package][409]               | `q"package $ref { ..$topstats }"`                                                                                           | PackageDef
 [Package Object][410]        | `q"package object $tname extends { ..$earlydefns } with ..$parents { $self => ..$stats }"`                                  | PackageDef

[401]: definition-details.html#val-and-var-definitions
[402]: definition-details.html#pattern-definitions
[403]: definition-details.html#method-definition
[404]: definition-details.html#secondary-constructor-definition
[405]: definition-details.html#type-definition
[406]: definition-details.html#class-definition
[407]: definition-details.html#trait-definition
[408]: definition-details.html#object-definition
[409]: definition-details.html#package-definition
[410]: definition-details.html#package-object-definition

## Auxiliary

                                    | Quasiquote                  | Type
------------------------------------|-----------------------------|--------
 [Import][501]                      | `q"import $ref.{..$sels}"`  | Import
 [Case Clause][502]                 | `cq"$pat if $expr => $expr"`| CaseDef
 [Generator Enumerator][503]        | `fq"$pat <- $expr"`         | Tree
 [Value Definition Enumerator][503] | `fq"$pat = $expr"`          | Tree
 [Guard Enumerator][503]            | `fq"if $expr"`              | Tree


[501]: expression-details.html#import
[502]: expression-details.html#pattern-match
[503]: expression-details.html#for-and-for-yield-loops

## Abbreviations

Prefixes of unquotees imply the following:

* `name: Name`, `tname: TermName`, `tpname: TypeName`
* `value: T` where `T` is value type that corresponds to given literal (e.g. `Int`, `Char`, `Float` etc)
* `expr: Tree` an [expression tree](#expressions)
* `tpt: Tree` a [type tree](#types)
* `pat: Tree` a [pattern tree](#patterns)
* `defn: Tree` a [definition tree](#definitions)
* `earlydefn: Tree` an early definion tree ([val](definition-details.html#val-and-var-definitions) or [type definition](definition-details.html#type-definition))
* `self: Tree` a self definition tree (i.e. [val definition](definition-details.html#val-and-var-definitions))
* `stat: Tree` a statement tree ([definition](#definitions), [expression](#expressions) or an [import](expression-details.html#import))
* `topstat: Tree` a top-level statement tree ([class](definition-details.html#class-definition), [trait](definition-details.html#trait-definition), [package](definition-details.html#package-definition), [package object](definition-details.html#package-object-definition) or [import](expression-details.html#import))
* `enum: Tree` a [for loop](expression-details.html#for-and-for-yield-loops) enumerator
* `param: Tree` a value parameter tree (i.e. [val definition](definition-details.html#val-and-var-definitions))
* `tparam: Tree` a type paremeter tree (i.e. [type definition](definition-details.html#type-definition))
* `parent: Tree` a [template](definition-details.html#templates) parent
* `sel: Tree` an [import](expression-details.html#import) selector tree

Whenever a name has suffix `s` it means that it is a `List` of something. `ss` means List of Lists. So for example `exprss` means a `List` of `List`s of expressions.
