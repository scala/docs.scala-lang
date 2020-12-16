---
layout: tour
title: Conversões Implícitas
partof: scala-tour

num: 26
next-page: polymorphic-methods
previous-page: implicit-parameters
language: pt-br
---

Uma conversão implícita do tipo `S` para o tipo `T` é definida por um valor implícito que tem o tipo de função `S => T`, ou por um método implícito convertível em um valor de tal tipo.

As conversões implícitas são aplicadas em duas situações:

* Se uma expressão `e` for do tipo `S` e `S` não estiver em conformidade com o tipo esperado `T` da expressão.
* Em uma seleção `e.m` com `e` do tipo `T`, se o seletor `m` não representar um membro de `T`.

No primeiro caso, é procurada uma conversão `c` que seja aplicável a `e` e cujo tipo de resultado esteja em conformidade com `T`.

No segundo caso, é procurada uma conversão `c` que seja aplicável a `e` e cujo resultado contém um membro chamado `m`.

A seguinte operação nas duas listas xs e ys do tipo `List[Int]` é válida:

```
xs <= ys
```

Assuma que os métodos implícitos `list2ordered` e` int2ordered` definidos abaixo estão no mesmo escopo:

```
implicit def list2ordered[A](x: List[A])
    (implicit elem2ordered: A => Ordered[A]): Ordered[List[A]] =
  new Ordered[List[A]] { /* .. */ }

implicit def int2ordered(x: Int): Ordered[Int] =
  new Ordered[Int] { /* .. */ }
```

O objeto implicitamente importado `scala.Predef` declara vários tipos predefinidos (por exemplo, `Pair`) e métodos (por exemplo, `assert`), mas também várias conversões implícitas.

Por exemplo, ao chamar um método Java que espera um `java.lang.Integer`, você está livre para passar um `scala.Int` em vez disso. Isso ocorre porque `Predef` inclui as seguintes conversões implícitas:

```scala mdoc
import scala.language.implicitConversions

implicit def int2Integer(x: Int) =
  java.lang.Integer.valueOf(x)
```

Para definir suas próprias conversões implícitas, primeiro você deve importar `scala.language.implicitConversions` (ou invocar o compilador com a opção `-language: implicitConversions`). Tal recurso deve ser explicitamente habilitado porque pode se tornar complexo se usado indiscriminadamente.
