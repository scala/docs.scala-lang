---
layout: overview-large
title: Syntax summary

disqus: true

partof: quasiquotes
num: 6
outof: 12
---
**Denys Shabalin** <span class="label warning" style="float: right;">EXPERIMENTAL</span>

## Expressions {:#exprs}


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


[101]: /overviews/quasiquotes/expression-details.html#empty
[102]: /overviews/quasiquotes/expression-details.html#literal
[103]: /overviews/quasiquotes/expression-details.html#ref
[104]: /overviews/quasiquotes/expression-details.html#super-this
[105]: /overviews/quasiquotes/expression-details.html#application
[106]: /overviews/quasiquotes/expression-details.html#assign-update
[107]: /overviews/quasiquotes/expression-details.html#return
[108]: /overviews/quasiquotes/expression-details.html#throw
[109]: /overviews/quasiquotes/expression-details.html#ascription
[110]: /overviews/quasiquotes/expression-details.html#annotated
[111]: /overviews/quasiquotes/expression-details.html#tuple
[112]: /overviews/quasiquotes/expression-details.html#block
[113]: /overviews/quasiquotes/expression-details.html#if
[114]: /overviews/quasiquotes/expression-details.html#match
[115]: /overviews/quasiquotes/expression-details.html#try
[116]: /overviews/quasiquotes/expression-details.html#function
[117]: /overviews/quasiquotes/expression-details.html#partial-function
[118]: /overviews/quasiquotes/expression-details.html#while
[119]: /overviews/quasiquotes/expression-details.html#for
[120]: /overviews/quasiquotes/expression-details.html#new

## Types {:#types}

                             | Quasiquote                            | Type
-----------------------------|---------------------------------------|---------------------
 [Empty Type][201]           | `tq""`                                | TypeTree
 [Type Identifier][202]      | `tq"$tpname"` or `tq"Name"`           | Ident
 [Singleton Type][203]       | `tq"$ref.type"`                       | SingletonType
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

[201]: /overviews/quasiquotes/type-details.html#empty
[202]: /overviews/quasiquotes/type-details.html#ident
[203]: /overviews/quasiquotes/type-details.html#singleton
[204]: /overviews/quasiquotes/type-details.html#projection
[205]: /overviews/quasiquotes/type-details.html#applied
[206]: /overviews/quasiquotes/type-details.html#annotated
[207]: /overviews/quasiquotes/type-details.html#compound
[208]: /overviews/quasiquotes/type-details.html#existential
[209]: /overviews/quasiquotes/type-details.html#tuple
[210]: /overviews/quasiquotes/type-details.html#function

## Patterns {:#pats}

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

[301]: /overviews/quasiquotes/pattern-details.html#wildcard
[302]: /overviews/quasiquotes/pattern-details.html#literal
[303]: /overviews/quasiquotes/pattern-details.html#binding
[304]: /overviews/quasiquotes/pattern-details.html#extractor
[305]: /overviews/quasiquotes/pattern-details.html#type
[306]: /overviews/quasiquotes/pattern-details.html#alternative
[307]: /overviews/quasiquotes/pattern-details.html#tuple

## Definitions {:#defns}

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

[401]: /overviews/quasiquotes/definition-details.html#val-var
[402]: /overviews/quasiquotes/definition-details.html#pattern
[403]: /overviews/quasiquotes/definition-details.html#method
[404]: /overviews/quasiquotes/definition-details.html#ctor
[405]: /overviews/quasiquotes/definition-details.html#type
[406]: /overviews/quasiquotes/definition-details.html#class
[407]: /overviews/quasiquotes/definition-details.html#trait
[408]: /overviews/quasiquotes/definition-details.html#object
[409]: /overviews/quasiquotes/definition-details.html#package
[410]: /overviews/quasiquotes/definition-details.html#package-object

## Auxiliary {:#aux}

                                    | Quasiquote                  | Type
------------------------------------|-----------------------------|--------
 [Import][501]                      | `q"import $ref.{..$sels}"`  | Import
 [Case Clause][502]                 | `cq"$pat if $expr => expr"` | CaseDef
 [Generator Enumerator][503]        | `fq"$pat <- $expr"`         | Tree
 [Value Definition Enumerator][503] | `fq"$pat = $expr"`          | Tree
 [Guard Enumerator][503]            | `fq"if $expr"`              | Tree


[501]: /overviews/quasiquotes/expression-details.html#import
[502]: /overviews/quasiquotes/expression-details.html#match
[503]: /overviews/quasiquotes/expression-details.html#for

## Abbreviations {:#abbrev}

Prefixes of unquotees imply the following:

* `name: Name`, `tname: TermName`, `tpname: TypeName`
* `value: T` where `T` is value type that corresponds to given literal (e.g. `Int`, `Char`, `Float` etc)
* `expr: Tree` an [expression tree](#exprs)
* `tpt: Tree` a [type tree](#types)
* `pat: Tree` a [pattern tree](#pats)
* `defn: Tree` a [definition tree](#defns)
* `earlydefn: Tree` an early definion tree ([val](/overviews/quasiquotes/definition-details.html#val-var) or [type definition](/overviews/quasiquotes/definition-details.html#type))
* `self: Tree` a self definition tree (i.e. [val definition](/overviews/quasiquotes/definition-details.html#val-var))
* `stat: Tree` a statement tree ([definition](#defns), [expression](#exprs) or an [import](/overviews/quasiquotes/expression-details.html#import))
* `topstat: Tree` a top-level statement tree ([class](/overviews/quasiquotes/definition-details.html#class), [trait](/overviews/quasiquotes/definition-details.html#trait), [package](/overviews/quasiquotes/definition-details.html#package), [package object](/overviews/quasiquotes/definition-details.html#package-object) or [import](/overviews/quasiquotes/expression-details.html#import))
* `enum: Tree` a [for loop](/overviews/quasiquotes/expression-details.html#for) enumerator
* `param: Tree` a value parameter tree (i.e. [val definition](/overviews/quasiquotes/definition-details.html#val-var))
* `tparam: Tree` a type paremeter tree (i.e. [type definition](/overviews/quasiquotes/definition-details.html#type))
* `parent: Tree` a [template](/overviews/quasiquotes/definition-details.html#templates) parent
* `sel: Tree` an [import](/overviews/quasiquotes/expression-details.html#import) selector tree

Whenever a name has suffix `s` it means that it is a List of something. `ss` means List of Lists. So for example `exprss` means a List of Lists of expressions.

