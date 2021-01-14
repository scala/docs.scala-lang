---
layout: tour
title: Objetos Singleton
partof: scala-tour

num: 12

next-page: regular-expression-patterns
previous-page: pattern-matching
language: pt-br
---

Métodos e valores que não são associados com instâncias individuais de uma [classe](classes.html) são considerados *objetos singleton*, denotados através da palavra-chave `object` ao invés de `class`.

```
package test

object Blah {
  def sum(l: List[Int]): Int = l.sum
}
```

O método `sum` é disponível globalmente, e pode ser referenciado ou importado como `test.Blah.sum`.

Objetos Singleton são um tipo de mescla e abreviação para definir uma classe de uso único, a qual não pode ser diretamente instanciada, e um membro `val` durante a definição do `object`. De fato, como `val`, objetos singleton podem ser definidos como membros de uma [trait](traits.html) ou [classe](classes.html), porém isso não é comum.

Um objeto singleton pode estender classes e traits. Já uma [case class](case-classes.html) sem [parâmetros com tipo](generic-classes.html) por padrão irá criar um objeto singleton como o mesmo nome e com uma [`Função*`](https://www.scala-lang.org/api/current/scala/Function1.html) trait implementada.

## Acompanhantes ##

A maioria dos objetos singleton não estão sozinhos, mas sim associados com uma classe de mesmo nome. O “objeto singleton de mesmo nome” que uma classe case, acima mencionado, é um exemplo disso. Quando isso acontece, o objeto singleton é chamado de *objeto acompanhante* de uma classe e, a classe é chamada de *classe acompanhante* de um objeto.

[Scaladoc](/style/scaladoc.html) possui um recurso especial para navegar entre classes e seus acompanhantes: se o grande círculo contendo “C” ou “O” possui sua extremidade superior dobrada para baixo, você pode clicar no círculo para acessar o acompanhante.

Se houver um objeto acompanhante para uma classe, ambos devem ser definidos no mesmo aquivo fonte. Por exemplo:

```scala mdoc
class IntPair(val x: Int, val y: Int)

object IntPair {
  import math.Ordering

  implicit def ipord: Ordering[IntPair] =
    Ordering.by(ip => (ip.x, ip.y))
}
```

É comum ver instâncias de classes de tipo como [valores implícitos](implicit-parameters.html), como `ipord` acima, definido no objeto acompanhante quando se segue o padrão da *typeclass*. Isso ocorre porque os membros do objeto acompanhante são incluídos por padrão na busca de valores implícitos.

## Nota para programadores Java ##

`static` não é uma palavra-chave em Scala. Ao invés disso, todos os membros que devem ser estáticos, incluindo classes, devem ser declarados no objeto singleton. Eles podem ser referenciados com a mesma sintaxe, importados gradativamente ou como um grupo, e assim por diante.

Frequentemente, os programadores Java definem membros estáticos, talvez `private`, como auxiliares de implementação para seus membros de instância. Estes são movidos para o acompanhante também; Um padrão comum é importar os membros do objeto acompanhante na classe, da seguinte forma:
```
class X {
  import X._

  def blah = foo
}

object X {
  private def foo = 42
}
```

Isso demonstra outra característica: no contexto `private`, as classes e seus acompanhantes são amigos. `object X` pode acessar membro privados da `class X`, e vice versa. Para fazer com que um membro seja *realmente* para um ou outro, utilize `private[this]`.

Por uma melhor interoperabilidade com Java, métodos, incluindo `var`s e `val`s, definidos diretamente em um objeto singleton também têm um método estático definido na classe acompanhante, chamado *encaminhadores estáticos*. Outros membros são acessíveis por meio de campos estáticos `X$.MODULE$` para o `object X`.

Se você mover tudo para um objeto acompanhante e descobrir que tudo o que resta é uma classe que você não deseja que seja instanciada, simplesmente exclua a classe. Encaminhadores estáticos ainda serão criados.
