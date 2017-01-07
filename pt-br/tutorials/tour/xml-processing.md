---
layout: tutorial
title: Processando arquivos XML 

disqus: true

tutorial: scala-tour
num: 13
tutorial-next: regular-expression-patterns
tutorial-previous: singleton-objects
language: pt-br
---

Scala pode ser utilizado para facilmente criar, parsear e processar documentos XML. Os dados de um XML podem ser representados em Scala utilizando uma representação de dados genérica ou específica. A última abordagem é suportada através da ferramenta de *data-binding* `schema2src`.

### Representação em Tempo de Execução ###
Um XML é representado como uma árvore de rótulos. A partir de Scala 1.2 (versões anteriores é necessário utilizar a opção -Xmarkupoption), você pode convenientemente criar esses nós rotulados usando a sintaxe XML padrão.

Considere o seguinte documento XML:

```html
<html>
  <head>
    <title>Olá mundo XHTML</title>
  </head>
  <body>
    <h1>Olá mundo</h1>
    <p><a href="http://scala-lang.org/">Scala</a> fala XHTML</p>
  </body>
</html>
```

Tal documento pode ser criado através do seguinte código:

```tut
object XMLTest1 extends App {
  val pagina = 
  <html>
    <head>
      <title>Olá mundo XHTML</title>
    </head>
    <body>
      <h1>Olá mundo</h1>
      <p><a href="scala-lang.org">Scala</a> fala XHTML</p>
    </body>
  </html>;
  println(pagina.toString())
}
```

É também possível combinar expressões Scala e sintaxe XML:

```tut
object XMLTest2 extends App {
  import scala.xml._
  val df = java.text.DateFormat.getDateInstance()
  val stringData = df.format(new java.util.Date())
  def data(nome: String) = 
    <msgData enderecadoA={ nome }>
      Olá, { nome }! Hoje é { stringData }
    </msgData>;
  println(data("John Doe").toString())
}
```

### Data Binding ###
Em muitos casos você tem um DTD para os documentos XMLs que você quer processar. Você poderá precisar criar classes especiais em Scala com código para parsear e salvar tais documentos. Para isso, Scala fornece uma ferramenta elegante que converte seus DTDs em coleções de definições de classes Scala, que fazem todo o trabalho para você.
A documentação e exemplos sobre a ferramenta `schema2src` podem ser encontrados no livro de Burak's [draft scala xml book](http://burak.emir.googlepages.com/scalaxbook.docbk.html).

