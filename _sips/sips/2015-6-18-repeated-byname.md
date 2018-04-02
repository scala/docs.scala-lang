---
layout: sip
title: SIP-24 - Repeated By Name Parameters
discourse: true

vote-status: dormant
vote-text: Looking for a new owner. This proposal needs to be updated according to the <a href="https://www.youtube.com/watch?v=hrxp4PGbi6s">SIP meeting in November 2016</a>.
permalink: /sips/:title.html
redirect_from: /sips/pending/repeated-byname.html

---

**By: Martin Odersky**

## Motivation

Scala so far does not allow by-name repeated parameters. But I can't see a good reason why this combination should be disallowed. Also, the combination is necessary to allow vararg parameters that are passed as expressions to inline methods (instead of being lifted out).

## Syntax

The syntax for `ParamType` becomes

      ParamType         ::=  [`=>'] ParamValueType
      ParamValueType    ::=  Type [`*']              

The syntax implies that a type such as `=> T*`, which is both by-name and repeated is interpreted as `=> (T*)`, that is, as a by-name type of a repeated type.

## Translation Rules

If a parameter has a by-name repeated type `=> T*` it matches an arbitrary number of actual arguments of type `T`. As usual for by-name parameters, the arguments are not evaluated at the point of call. Instead, all arguments are evaluated each time the parameter is referenced in the called method.

The same holds for an vararg argument of the form `e: _*`. The argument expression `e` is evaluated each time the parameter is referenced in the called method.

## See also

[Dotty Issue #499](https://github.com/lampepfl/dotty/issues/499)
