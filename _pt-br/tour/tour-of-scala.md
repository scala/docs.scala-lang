---
layout: tour
title: Introdução

discourse: false

partof: scala-tour

num: 1

next-page: unified-types
language: pt-br
---

Scala é uma linguagem de programação moderna e multi-paradigma desenvolvida para expressar padrões de programação comuns em uma forma concisa, elegante e com tipagem segura. Integra facilmente características de linguagens orientadas a objetos e funcional.

## Scala é orientada a objetos ##
Scala é uma linguagem puramente orientada a objetos no sentido que [todo valor é um objeto](unified-types.html). Tipos e comportamentos de objetos são descritos por [classes](classes.html) e [traits](traits.html). Classes são estendidas por subclasses e por um flexível mecanismo [de composição mesclada](mixin-class-composition.html) como uma alternativa para herança múltipla.

## Scala é funcional ##
Scala é também uma linguagem funcional no sentido que [toda função é um valor](unified-types.html). Scala fornece uma sintaxe leve para definir funções anônimas, suporta [funções de primeira ordem](higher-order-functions.html), permite funções [aninhadas](nested-functions.html), e suporta [currying](multiple-parameter-lists.html). As [case classes](case-classes.html) da linguagem Scala e o suporte embutido para [correspondência de padrões](pattern-matching.html) modelam tipos algébricos utilizados em muitas linguagens de programação funcional. [Objetos Singleton](singleton-objects.html) fornecem uma alternativa conveniente para agrupar funções que não são membros de uma classe.

Além disso, a noção de correspondência de padrões em Scala se estende naturalmente ao processamento de dados de um XML com a ajuda de [expressões regulares](regular-expression-patterns.html), por meio de uma extensão via [objetos extratores](extractor-objects.html). Nesse contexto, compreensões de sequência são úteis para formular consultas. Essas funcionalidades tornam Scala ideal para desenvolver aplicações como serviços web.

## Scala é estaticamente tipada ##
Scala é equipada com um expressivo sistema de tipos que reforça estaticamente que abstrações são utilizadas de uma forma segura e coerente. Particularmente, o sistema de tipos suporta:

* [Classes genéricas](generic-classes.html)
* [Anotações variáveis](variances.html)
* [Limites de tipos superiores](upper-type-bounds.html) e [limites de tipos inferiores](lower-type-bounds.html),
* [Classes internas](inner-classes.html) e [tipos abstratos](abstract-types.html) como membros de um objeto
* [Tipos compostos](compound-types.html)
* [Auto referências explicitamente tipadas](self-types.html)
* [parâmetros implícitos](implicit-parameters.html) e [conversões implícitas](implicit-conversions.html)
* [métodos polimórficos](polymorphic-methods.html)

Um [mecanismo de inferência de tipo local](type-inference.html) se encarrega para que o usuário não seja obrigado a anotar o programa com informações reduntante de tipos. Combinados, esses recursos fornecem uma base poderosa para a reutilização segura de abstrações de programação e para a extensão de tipos seguro do software.

## Scala é extensível ##

Na prática, o desenvolvimento de aplicações de um determinado domínio geralmente requer uma linguagem de domínio específico. Scala fornece uma combinação única de mecanismos de linguagem que facilitam a adição suave de novas construções de linguagem na forma de bibliotecas:

* qualquer método pode ser utilizado como um [operador infix ou postfix](operators.html)
* [closures são construídas automaticamente dependendo do tipo esperado](automatic-closures.html) (tipo alvo).

Uma utilização conjunta de ambos os recursos facilita a definição de novas instruções sem estender a sintaxe e sem usar meta-programação como macros.

Scala é projetada para interoperar bem com o popular Java 2 Runtime Environment (JRE). Em particular, a interação com a linguagem de programação orientada a objetos Java é o mais suave possível. Funcionalidades novas do Java como [annotations](annotations.html) e Java generics têm correspondentes diretos em Scala. Esses recursos Scala sem correspondentes Java, como [valor default de parâmetros](default-parameter-values.html) e [parâmetros nomeados](named-arguments.html), compilam de forma semelhante ao Java. Scala tem o mesmo modelo de compilação que Java (compilação separada, carregamento de classe dinâmica) e permite o acesso a milhares de bibliotecas de alta qualidade existentes.

Continue na próxima página para ler mais.
