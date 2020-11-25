---
layout: tour
title: By-name Parameters
partof: scala-tour

num: 33
next-page: annotations
previous-page: operators
language: it
---
Traduzione a cura di: Andrea Mucciarelli (https://github.com/IowU)

I parametri _By-name parameters_ vengono calcolati ad ogni loro utilizzo. Non saranno calcolati affatto nel caso rimanessero inutilizzati. Questo processo è analogo al sostituire i parametri by-name con le espressioni fornite, e sono in opposizioni ai parametri _by-value parameters_. Per far si che un parametro diventi di tipo by-name basta inserire `=>` prima della dichiarazione del suo tipo.
```tut
def calculate(input: => Int) = input * 37
```
I parametri by-name hanno il vantaggio di non venire calcolati se non sono utilizzati nel corpo della funzione; d'altra parte i parametri by-value hanno invece il vantaggio di venire calcolati solo una volta.

Di seguito un esempio di implementazione di un loop while usando pararmetry by-name:

```tut
def whileLoop(condition: => Boolean)(body: => Unit): Unit =
  if (condition) {
    body
    whileLoop(condition)(body)
  }

var i = 2

whileLoop (i > 0) {
  println(i)
  i -= 1
}  // Mostrerà a schermo 2 1
```
Il metodo `whileLoop` utilizza diverse liste di parametri per ricevere una condizione, e un corpo che agirà da corpo del loop. Se `condition` è vera, allora `body` viene eseguito e verrà fatta una chiamata ricorsiva alla funzione whileLoop. Se `condition` dovesse essere falsa, `body` non verrà mai calcolato; questo perchè abbiamo anteposto `=>` al datatype di `body`.

Quando forniamo la condizione `i > 0` come `condition` e `println(i); i-=1` come `body`, la funzione si comporterà come un classico loop while presente in molti linguaggi di programmazione.

Questa caratteristica di ritardare il calcolo di un parametro finchè questo non viene effettivamente usato può aiutare ad ottimizzare le performance nel caso in cui il calcolo del parametro richiedesse molte risore, o se il codice venisse inserito in operazioni di lunga durata.
