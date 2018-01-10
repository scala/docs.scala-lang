---
layout: cheatsheet
title: Scalacheat

partof: cheatsheet

by: Reginaldo Russinholi
about: Agradecimentos a  <a href="http://brenocon.com/">Brendan O'Connor</a>, este 'cheatsheet' se destina a ser uma referência rápida às construções sintáticas de Scala. Licenciado por Brendan O'Connor sobre a licença CC-BY-SA 3.0.

language: pt-br
---

###### Contribuição de {{ page.by }}
{{ page.about }}

|  <span id="variables" class="h2">variáveis</span>                                                                       |                     |
|  `var x = 5`                                                                                             |  variável           |
|  <span class="label success">Bom</span> `val x = 5`<br> <span class="label important">Ruim</span> `x=6`  |  constante          |
|  `var x: Double = 5`                                                                                     |  tipo explícito     |
|  <span id="functions" class="h2">funções</span>                                                                       |                     |
|  <span class="label success">Bom</span> `def f(x: Int) = { x*x }`<br> <span class="label important">Ruim</span> `def f(x: Int)   { x*x }` |  define uma função <br> erro omitido: sem = é uma procedure que retorna Unit; causa dano |
|  <span class="label success">Bom</span> `def f(x: Any) = println(x)`<br> <span class="label important">Ruim</span> `def f(x) = println(x)` |  define uma função <br> erro de sintaxe: necessita tipos para todos os argumentos. |
|  `type R = Double`                                                                                       |  alias de tipo    |
|  `def f(x: R)` vs.<br> `def f(x: => R)`                                                                  |  chamada-por-valor <br> chamada-por-nome (parâmetros 'lazy') |
|  `(x:R) => x*x`                                                                                          |  função anônima  |
|  `(1 to 5).map(_*2)` vs.<br> `(1 to 5).reduceLeft( _+_ )`                                                |  função anônima: 'underscore' está associado a posição do argumento. |
|  `(1 to 5).map( x => x*x )`                                                                              |  função anônima: para usar um argumento duas vezes, tem que dar nome a ele. |
|  <span class="label success">Bom</span> `(1 to 5).map(2*)`<br> <span class="label important">Ruim</span> `(1 to 5).map(*2)` |  função anônima: método infixo encadeado. Use `2*_` para ficar mais claro. |
|  `(1 to 5).map { val x=_*2; println(x); x }`                                                             |  função anônima: estilo em bloco retorna a última expressão. |
|  `(1 to 5) filter {_%2 == 0} map {_*2}`                                                                  |  função anônima: estilo 'pipeline'. (ou também parênteses). |
|  `def compose(g:R=>R, h:R=>R) = (x:R) => g(h(x))` <br> `val f = compose({_*2}, {_-1})`                   |  função anônima: para passar múltiplos blocos é necessário colocar entre parênteses. |
|  `val zscore = (mean:R, sd:R) => (x:R) => (x-mean)/sd`                                                   |  currying, sintáxe óbvia. |
|  `def zscore(mean:R, sd:R) = (x:R) => (x-mean)/sd`                                                       |  currying, sintáxe óbvia |
|  `def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd`                                                           |  currying, sintáxe 'sugar'. mas então: |
|  `val normer = zscore(7, 0.4)_`                                                                          |  precisa de 'underscore' no final para obter o parcial, apenas para a versão 'sugar'. |
|  `def mapmake[T](g:T=>T)(seq: List[T]) = seq.map(g)`                                                     |  tipo genérico. |
|  `5.+(3); 5 + 3` <br> `(1 to 5) map (_*2)`                                                               |  sintáxe 'sugar' para operadores infixos. |
|  `def sum(args: Int*) = args.reduceLeft(_+_)`                                                            |  varargs. |
|  <span id="packages" class="h2">pacotes</span>                                                                         |                 |
|  `import scala.collection._`                                                                             |  caracter coringa para importar tudo de um pacote. |
|  `import scala.collection.Vector` <br> `import scala.collection.{Vector, Sequence}`                      |  importação seletiva. |
|  `import scala.collection.{Vector => Vec28}`                                                             |  renomear uma importação. |
|  `import java.util.{Date => _, _}`                                                                       |  importar tudo de java.util exceto Date. |
|  `package pkg` _no início do arquivo_ <br> `package pkg { ... }`                                             |  declara um pacote. |
|  <span id="data_structures" class="h2">estruturas de dados</span>                                                           |                 |
|  `(1,2,3)`                                                                                               |  literal de tupla. (`Tuple3`) |
|  `var (x,y,z) = (1,2,3)`                                                                                 |  atribuição desestruturada: desempacotando uma tupla através de "pattern matching". |
|  <span class="label important">Ruim</span>`var x,y,z = (1,2,3)`                                           |  erro oculto: cada variável é associada a tupla inteira. |
|  `var xs = List(1,2,3)`                                                                                  |  lista (imutável). |
|  `xs(2)`                                                                                                 |  indexação por parênteses. ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/27)) |
|  `1 :: List(2,3)`                                                                                        |  concatenação. |
|  `1 to 5` _o mesmo que_ `1 until 6` <br> `1 to 10 by 2`                                                      |  sintáxe 'sugar' para intervalo. |
|  `()` _(parênteses vazio)_                                                                                   |  um membro do tipo Unit (igual ao void de C/Java). |
|  <span id="control_constructs" class="h2">estruturas de controle</span>                                                     |                 |
|  `if (check) happy else sad`                                                                             |  condicional. |
|  `if (check) happy` _o mesmo que_ <br> `if (check) happy else ()`                                            |  condicional 'sugar'. |
|  `while (x < 5) { println(x); x += 1}`                                                                   |  while. |
|  `do { println(x); x += 1} while (x < 5)`                                                                |  do while. |
|  `import scala.util.control.Breaks._`<br>`breakable {`<br>`    for (x <- xs) {`<br>`        if (Math.random < 0.1) break`<br>`    }`<br>`}`|  break. ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/21)) |
|  `for (x <- xs if x%2 == 0) yield x*10` _o mesmo que_ <br>`xs.filter(_%2 == 0).map(_*10)`                    |  for: filter/map |
|  `for ((x,y) <- xs zip ys) yield x*y` _o mesmo que_ <br>`(xs zip ys) map { case (x,y) => x*y }`              |  for: associação desestruturada |
|  `for (x <- xs; y <- ys) yield x*y` _o mesmo que_ <br>`xs flatMap {x => ys map {y => x*y}}`                  |  for: produto cruzado |
|  `for (x <- xs; y <- ys) {`<br>    `println("%d/%d = %.1f".format(x, y, x/y.toFloat))`<br>`}`                     |  for: estilo imperativo<br>[sprintf-style](http://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax) |
|  `for (i <- 1 to 5) {`<br>    `println(i)`<br>`}`                                                        |  for: itera incluindo o limite superior |
|  `for (i <- 1 until 5) {`<br>    `println(i)`<br>`}`                                                     |  for: itera omitindo o limite superior |
|  <span id="pattern_matching" class="h2">pattern matching</span>                                                         |                 |
|  <span class="label success">Bom</span> `(xs zip ys) map { case (x,y) => x*y }`<br> <span class="label important">Ruim</span> `(xs zip ys) map( (x,y) => x*y )` |  use 'case' nos argumentos de funções para fazer a associação via 'pattern matching'. |
|  <span class="label important">Ruim</span><br>`val v42 = 42`<br>`Some(3) match {`<br>`  case Some(v42) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  "v42" é interpretado como um nome que será comparado com qualquer valor Int, e "42" é impresso. |
|  <span class="label success">Bom</span><br>`val v42 = 42`<br>`Some(3) match {`<br>``    case Some(`v42`) => println("42")``<br>`case _ => println("Not 42")`<br>`}`  |  "\`v42\`" entre crases é interpretado como existindo o valor `v42`, e "Not 42" é impresso. |
|  <span class="label success">Bom</span><br>`val UppercaseVal = 42`<br>`Some(3) match {`<br>`  case Some(UppercaseVal) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  `UppercaseVal` é tratado como um valor existente, mais do que uma nova variável de padrão, porque ele inicia com uma letra maiúscula. Assim, o valor contido em `UppercaseVal` é checado contra `3`, e "Not 42" é impresso. |
|  <span id="object_orientation" class="h2">orientação a objetos</span>                                                     |                 |
|  `class C(x: R)` _o mesmo que_ <br>`class C(private val x: R)`<br>`var c = new C(4)`                         |  parâmetros do construtor - privado |
|  `class C(val x: R)`<br>`var c = new C(4)`<br>`c.x`                                                      |  parâmetros do construtor - público |
|  `class C(var x: R) {`<br>`assert(x > 0, "positive please")`<br>`var y = x`<br>`val readonly = 5`<br>`private var secret = 1`<br>`def this = this(42)`<br>`}`|<br>o construtor é o corpo da classe<br>declara um membro público<br>declara um membro que pode ser obtido mas não alterado<br>declara um membro privado<br>construtor alternativo|
|  `new{ ... }`                                                                                            |  classe anônima |
|  `abstract class D { ... }`                                                                              |  define uma classe abstrata. (que não pode ser instanciada) |
|  `class C extends D { ... }`                                                                             |  define uma classe com herança. |
|  `class D(var x: R)`<br>`class C(x: R) extends D(x)`                                                     |  herança e parâmetros do construtor. (lista de desejos: automaticamente passar parâmetros por 'default')
|  `object O extends D { ... }`                                                                            |  define um 'singleton'. (module-like) |
|  `trait T { ... }`<br>`class C extends T { ... }`<br>`class C extends D with T { ... }`                  |  traits.<br>interfaces-com-implementação. sem parâmetros de construtor. [mixin-able]({{ site.baseurl }}/tutorials/tour/mixin-class-composition.html).
|  `trait T1; trait T2`<br>`class C extends T1 with T2`<br>`class C extends D with T1 with T2`             |  multiplos traits. |
|  `class C extends D { override def f = ...}`	                                                           |  é necessário declarar a sobrecarga de métodos. |
|  `new java.io.File("f")`                   	                                                           |  cria/instancia um objeto. |
|  <span class="label important">Ruim</span> `new List[Int]`<br> <span class="label success">Bom</span> `List(1,2,3)` |  erro de tipo: tipo abstrato<br>ao invés, por convenção: a 'factory' chamada já aplica o tipo implicitamente |
|  `classOf[String]`                                                                                       |  literal de classe. |
|  `x.isInstanceOf[String]`                                                                                |  checagem de tipo (em tempo de execução) |
|  `x.asInstanceOf[String]`                                                                                |  conversão/'cast' de tipo (em tempo de execução) |
|  `x: String`                                                                                             |  atribuição de tipo (em tempo de compilação) |
