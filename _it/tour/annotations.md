---
layout: tour
title: Annotations
partof: scala-tour

num: 34
next-page: packages-and-imports
previous-page: by-name-parameters
language: it
---
Traduzione a cura di: Andrea Mucciarelli (https://github.com/IowU)

Le annotazioni associano meta-informazioni alle definizioni. Per esempio l'annotazione `@deprecated` prima di un metodo porta il compilatore a stampare un avvertimento se quel metodo è usato.

```
object DeprecationDemo extends App {
  @deprecated("deprecation message", "release # which deprecates method")
  def hello = "hola"

  hello
}
```
Il codice verrà comunque compilato, ma il compilatore ci restituirà un avvertimento: "there was one deprecation warning".

Una clausola di annotazione si applica alla prima definizione, o dichiarazione, che la segue. Più di un'annotazione può precedere una definizione e/o dichiarazione. L'ordine con le quali appaiono non è rilevante.

## Annotazioni che assicurano la correttezza del codice
Alcune annotazioni faranno si che ci venga restituito un errore di compilazione se una o più condizioni non sono rispettate. Ad esempio, l'annotazione `@tailrec` assicura che il metodo che la segue sarà [tail-recursive](https://en.wikipedia.org/wiki/Tail_call). La tail-recursion può far si che i requisiti di memoria siano tenuti costanti. Di seguito un esempio in cui viene usata su un metodo che calcola il fattoriale di un numero:

```tut
import scala.annotation.tailrec

def factorial(x: Int): Int = {

  @tailrec
  def factorialHelper(x: Int, accumulator: Int): Int = {
    if (x == 1) accumulator else factorialHelper(x - 1, accumulator * x)
  }
  factorialHelper(x, 1)
}
```

Il metodo `factorialHelper` è annotato con `@tailrec`, che ci assicura il suo essere tail-recursive. Se cambiassimo l'implementazione del metodo come di seguito, avremmo un errore:

```
import scala.annotation.tailrec

def factorial(x: Int): Int = {
  @tailrec
  def factorialHelper(x: Int): Int = {
    if (x == 1) 1 else x * factorialHelper(x - 1)
  }
  factorialHelper(x)
}
```
Otterremmo il messaggio "Recursive call not in tail position".


## Annotazioni che influenzano la generazione del codice
Alcune annotazioni come `@inline` influenzano il codice generato (ad esempio il tuo file jar potrebbe avere dei byte diversi se non fosse stata usata l'annotazione). Effettuare un azione di inline vuol dire inserire il codice nel corpo del metodo al momento della chiamata. Il bytecode risultante è più lungo, ma potrebbe portare ad un'esecuzione più rapida. Usare l'annotazione `@inline` non assicura però che il metodo sarà di tipo inline, ma porterà il compilatore a renderlo tale se e solo se saranno rispettate alcune condizioni sulla dimensione del codice generato.

### Annotazioni Java ###
Bisogna porre attenzione alla sintassi delle annotazioni quando si scrive del codice Scala che si interfaccia con codice Java.
**Nota:** Assicurati di usare l'opzione `-target:jvm-1.8` con le annotazioni Java.

Java possiede dei metadati, dichiarati dagli utenti, sotto forma di [annotazioni](https://docs.oracle.com/javase/tutorial/java/annotations/). Una caratteristica chiave delle annotazioni è che esse hanno bisogno di specificare delle coppie nome-valore per inizializzare i propri elementi. Per esempio, se necessitiamo che un'annotazione tracci la sorgente di una certa classem possiamo definirla come segue:

```
@interface Source {
  public String URL();
  public String mail();
}
```

E successivamente applicarla:

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
public class MyClass extends TheirClass ...
```

Usare un'annotazione in Scala è simile all'invocazione di un costruttore, poichè per istanziare un'annotazione Java bisogna specificare il nome degli argomenti e i loro valori:

```
@Source(URL = "https://coders.com/",
        mail = "support@coders.com")
class MyScalaClass ...
```

Questa sintassi può essere fastidiosa se l'annotazione contiene un solo elemento (senza che abbia un valore di default), pertanto, per convenzione, se il nome è sepcificato come `value` può essere applicato in Java usando una sintassi simile a quella dei costruttori:

```
@interface SourceURL {
    public String value();
    public String mail() default "";
}
```

E successivamente applicarla come segue

```
@SourceURL("https://coders.com/")
public class MyClass extends TheirClass ...
```

In questo caso, Scala fornisce la stessa opzione

```
@SourceURL("https://coders.com/")
class MyScalaClass ...
```

L'elemento `mail` è stat specificato con un valore di dafault in modo che non dobbiamo per forza fornirne esplicitamente uno. Se però ci servisse di fornire tale valore non possiamo mixare i due stili in Java:

```
@SourceURL(value = "https://coders.com/",
           mail = "support@coders.com")
public class MyClass extends TheirClass ...
```

Scala fornisce più flessibilità a riguardo:

```
@SourceURL("https://coders.com/",
           mail = "support@coders.com")
    class MyScalaClass ...
```
