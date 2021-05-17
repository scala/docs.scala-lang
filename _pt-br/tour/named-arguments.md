---
layout: tour
title: Parâmetros Nomeados
partof: scala-tour

num: 33
previous-page: default-parameter-values
language: pt-br
---

Ao chamar métodos e funções, você pode utilizar explicitamente o nome das variáveis nas chamadas, por exemplo:

```scala mdoc
def imprimeNome(nome:String, sobrenome:String) = {
  println(nome + " " + sobrenome)
}

imprimeNome("John","Smith") // Imprime "John Smith"
imprimeNome(nome = "John",sobrenome = "Smith") // Imprime "John Smith"
imprimeNome(sobrenome = "Smith",nome = "John") // Imprime "John Smith"
```

Perceba que a ordem não importa quando você utiliza parâmetros nomeados nas chamadas de métodos e funções, desde que todos os parâmetros sejam declarados.  Essa funcionalidade pode ser combinada com [parâmetros com valor padrão](default-parameter-values.html):

```scala mdoc:nest
def imprimeNome(nome:String = "John", sobrenome:String = "Smith") = {
  println(nome + " " + sobrenome)
}

imprimeNome(sobrenome = "Forbeck") // Imprime "John Forbeck"
```

Dado que é permitido declarar os parâmetros em qualquer ordem, você pode utilizar o valor padrão para parâmetros que aparecem primeiro na lista de parâmetros da função.
