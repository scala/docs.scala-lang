---
type: chapter
title: FAQ
num: 7
---

## Which should I use `Expr(...)` or `'{...}`?
If you can write your code using `Expr(...)`, you will evaluate more at compile time.
Only use `'{...}` if you really need to evaluate the code later at runtime, usually because it depends on runtime values.

## Which is better between `Expr(true)` or `'{true}`?
All quotes containing a value of a primitive type is optimised to an `Expr.apply`.
Choose one in your project and stick with a single notation to avoid confusion.

## How do I get a value out of an `Expr`?
If the expression represents a value, you can use `.value`, `.valueOrError` or `Expr.unapply`

## How can I get the precise type of an `Expr`?
We can get the precise type (`Type`) of an `Expr` using the following pattern match:
```scala
val x: Expr[X] = ...
x match
  case '{ $x: t } =>
    // `x: Expr[X & t]` where `t` is the precise type of `x`
```

## How do I summon all types of a tuple type?
If I have a type `(T1, T2, ...)` how do I generate the term for `(summon[T1], summon[T2], ...)` or get the individual expressions with the summoned values?

Depending on your use case the way you will summon them will vary.
In particular, the code you will need depends on the kind of output you want (`Expr[Tuple]`, `List[Expr[Any]]`, or something else) and how you need errors to be reported.
Here are two examples that should give you the basic skeleton for two different variant of this code.

```scala
  def summonAllInList[T](using Type[T])(using Quotes): List[Expr[Any]] = {
    Type.of[T] match
      case '[ head *: tail ] =>
        Expr.summon[head] match
          case Some(headExpr) => headExpr :: summonAllInList[tail]
          case _ => quotes.reflect.report.throwError(s"Could not summon ${Type.show[head]}")
      case '[ EmptyTuple ] => Nil
      case _ => quotes.reflect.report.throwError(s"Could not `summonAllInList` of tuple with unknown size: ${Type.show[T]}")
  }
```

```scala
  def summonAll[T](using Type[T])(using Quotes): Option[Expr[Tuple]]] = {
    Type.of[T] match
      case '[ head *: tail ] =>
        for headExpr <- Expr.summon[head]
            tailExpr <- summonAll[tail]
        yield '{ headExpr *: tailExpr }
      case '[ EmptyTuple ] => Some('{ EmptyTuple })
      case _ => None
  }
```

## How do I summon an expression for statically unknown types?

You can summon an expression from either a `TypeRepr` or a `Type` as shown below.

If you have a `TypeRepr` use:
```scala
val tpe: TypeRepr = ...
Implicits.search(tpe) match
  case result: ImplicitSearchSuccess => result.tree
  case _ =>
```

Instead, if you have a `Type[_]` use:
```scala
val tpe: Type[_] = ...
tpe match
  // (1) Use `a` as the name of the unknown type and (2) bring a given `Type[a]` into scope
  case '[a] => Expr.summon[a]
```
