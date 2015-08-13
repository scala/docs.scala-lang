---
layout: overview-large
title: Introdução
by: Douglas José

disqus: true

partof: collections
num: 1

about: Este documento foi traduzido por <a href="http://douglasjose.com">Douglas José</a>. Licensed by Douglas José under a CC-BY-SA 3.0 license.
languages: [ja, pt-br]
---

**Martin Odersky, and Lex Spoon**

###### Contribuição de {{ page.by }}

Para muitos, o novo framework de coleções é a novidade mais significante da release Scala 2.8. Scala tinha coleções antes (e na verdade o novo framework é amplamente compatível com o antigo), mas apenas a versão 2.8 é que provê um framework único, uniforme e compreensivo para tipos de coleções.

Embora as novidades das coleções sejam sutis à primeira vista, as mudanças que elas podem provocar em seu estilo de programar podem ser profundas. Na verdade, é como se você trabalhasse em um nível mais alto, com os blocos de construção básicos de de um programa sendo coleções inteiras, ao invés de seus elementos. Este novo estilo de programar requer alguma adaptação. Felizmente, a adaptação é facilitada através de várias propriedades interessantes das coleções Scala. Elas são fáceis de usar, concisas, seguras, rápidas e universais.

**Fáceis de usar:** Um pequeno vocabulário de 20 a 50 métodos é o suficiente para resolver a maioria dos problemas envolvendo coleções em poucas operações. Não é preciso aplicar estruturas de iteração ou recursão complicadas. Coleções persistentes e operações sem efeitos colaterais fazem com que você não precise se preocupar com corromper acidentalmente coleções existentes com dados novos. Interferência entre _iterators_ e atualizações de coleções são eliminadas.

**Concisas:** Você pode fazer com apenas uma palavra o que levaria um ou vários loops. Você pode expressar operações funcionais com sintaxe leve e combinar operações sem esforço, de forma que o resultado se parece com uma álgebra adaptada.

**Seguras:** Esta tem que ser experimentada para ser absorvida. A natureza estaticamente tipada e funcional das coleções Scala faz com que a vasta maioria dos erros que você pode vir a cometer seja capturada durante a compilação. A motivo disso é que (1) as operações das coleções em si são amplamente usadas e portanto bem testadas, (2) os usos das operações de coleções tem entradas e saídas explícitas na forma de parâmetros e retornos de funções, e (3) estas entradas e saídas explícitas são sujetas à verificação estática de tipo. Em síntese, a grande maioria dos usos incorretos se manifestam como erros de tipo. Não é totalmente incomum ver programas de centenas de linhas executar na primeira tentativa.

**Rápidas:** Operações de coleções são ajustadas e otimizadas em suas bibliotecas. E o resultado é que o uso de coleções é normalmente bastante eficiente. Talvez você consiga resultados um pouco melhores com estruturas de dados e operações cuidadosamente ajustadas, mas você também pode ter um resultado muito pior se tomar decisões de implementação não tão ideais durante este processo. Além disso, recentemente as coleções foram adaptadas para execução paralela em _cores_ múltiplos. Coleções paralelas suportam as mesmas operações que as seqüenciais, de forma que não é necessário aprender novas operações e o código não precisa ser reescrito. Você pode converter uma coleção seqüencial em uma paralela simplesmente invocando o método `par`.

**Universal:** Coleções proveem as mesmas operações sobre qualquer tipo onde faz sentido que elas existam, de forma que você possa construir muitas coisas com um vocabulário de operações relativamente pequeno. Por exemplo, uma _string_ é conceitualmente uma seqüência de caracteres. Consequentemente, em coleções Scala, _strings_ suportam todas as operações de seqüências. O mesmo vale para _arrays_.

**Exemplo:** Aqui está uma linha de código que demonstra muitas das vantagens das coleções Scala.

	val (menores, adultos) = pessoas partition (_.idade < 18)

Fica claro o que esta operação faz: ela particiona uma coleção de `pessoas` em `menores` e `adultos`, dependendo de sua idade. Como o método `partition` está definido no tipo de coleção raiz `TraversableLike`, este código funciona com qualquer tipo de coleção, incluindo _arrays_. As coleções resultantes `menores` e `adultos` vai ser do mesmo tipo da coleção `pessoas`.

Este código é muito mais conciso do que quando de um a três loops são necessários para o processamento tradicional de coleções (três loops para um _array_, porque o resultado intermediário precisa ser armazenado em outro lugar). Uma vez que você aprendeu o vocabulário básico das coleções você vai também perceber que usar este código é muito mais fácil e seguro que escrever loops explicitamente. Além disso, a operação `partition` é bem eficiente, e executa ainda mais rápido em coleções paralelas em múltiplos _cores_ (coleções paralelas são parte da versão Scala 2.9).

Este documento exibe uma discussão aprofundada das APIs das classes das coleções Scala a partir da perspectiva do usuário. Ele te leva por um tour de todas as as classes e métodos fundamentais que definem.
