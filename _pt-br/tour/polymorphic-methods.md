---
layout: tour
title: Métodos Polimórficos
partof: scala-tour

num: 27

next-page: type-inference
previous-page: implicit-conversions
language: pt-br
---

Os métodos em Scala podem ser parametrizados com valores e tipos. Como no nível de classe, os parâmetros de valor são declarados entre parênteses, enquanto os parâmetros de tipo são declarados entre colchetes.

Por exemplo:

```scala mdoc
def dup[T](x: T, n: Int): List[T] = {
  if (n == 0)
    Nil
  else
    x :: dup(x, n - 1)
}

println(dup[Int](3, 4)) // primeira chamada
println(dup("three", 3)) // segunda chamada
```

O método `dup` é parametrizado com o tipo `T` e com os parâmetros de valor `x: T` e `n: Int`. Na primeira chamada de `dup`, o programador fornece os parâmetros necessários, mas como mostra a seguinte linha, o programador não é obrigado a fornecer explicitamente os parâmetros de tipos. O sistema de tipos de Scala pode inferir tais tipos sem problemas. Isso é feito observando-se os tipos dos parâmetros de valor fornecidos ao método e qual o contexto que o mesmo é chamado.
