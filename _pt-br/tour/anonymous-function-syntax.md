---
layout: tour
title: Sintaxe de Função Anônima

discourse: false

partof: scala-tour

num: 6
next-page: higher-order-functions
previous-page: mixin-class-composition
language: pt-br
---

Scala fornece uma sintaxe relativamente leve para definir funções anônimas. A expressão a seguir cria uma função sucessor para inteiros:

```tut
(x: Int) => x + 1
```

Isso é uma abreviação para a definição de classe anônima a seguir:

```tut
new Function1[Int, Int] {
  def apply(x: Int): Int = x + 1
}
```

Também é possível definir funções com múltiplos parâmetros:

```tut
(x: Int, y: Int) => "(" + x + ", " + y + ")"
```

ou sem parâmetros:

```tut
() => { System.getProperty("user.dir") }
```

Há também uma forma muito simples de escrever tipos de funções. Aqui estão os tipos da três funções acima definidas:

```
Int => Int
(Int, Int) => String
() => String
```

Essa sintaxe é uma abreviação para os seguintes tipos:

```
Function1[Int, Int]
Function2[Int, Int, String]
Function0[String]
```
