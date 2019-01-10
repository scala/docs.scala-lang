---
layout: tour
title: Аннотации

discourse: true

partof: scala-tour

num: 32
language: ru
next-page: default-parameter-values
previous-page: by-name-parameters

---

Мета-информация ассоциируется с объявлениями через аннотации. Например, аннотация `@deprecated` перед объявлением метода, заставит компилятор вывести предупреждение, если этот метод будет использован.
```
object DeprecationDemo extends App {
  @deprecated("deprecation message", "release # which deprecates method")
  def hello = "hola"

  hello  
}
```
Это скомпилируется, но компилятор выдаст предупреждение: "there was one deprecation warning".

Аннотация применяется к первому следующему за ней объявлению или определению. Допускается использование сразу нескольких аннотаций следующих друг за другом. Порядок, в котором приводятся эти аннотации, не имеет значения.

## Аннотации, обеспечивающие корректность работы кода
Некоторые аннотации приводят к невозможности компиляции, если условие (условия) не выполняется. Например, аннотация `@tailrec` гарантирует, что метод является [хвостовой рекурсией](https://en.wikipedia.org/wiki/Tail_call). Хвостовая рекурсия помогает держать потребление памяти на постоянном уровне. Вот как она используется в методе, который вычисляет факториал:

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
Метод `factorialHelper` имеет аннотацию `@tailrec`, которая гарантирует, что метод действительно является хвостовой рекурсией. Если бы мы изменили реализацию `factorialHelper` так как указано далее, то компиляция бы провалилась:
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
Мы бы получили сообщение "Recursive call not in tail position"(Рекурсивный вызов не в хвостовой позиции).


## Аннотации, влияющие на генерацию кода
Некоторые аннотации типа `@inline` влияют на сгенерированный код (т.е. ваш jar-файл может иметь другой код, чем если бы вы не использовали аннотацию). Такая аннотация означает вставку всего кода в тело метода вместо вызова. Полученный байт-код длиннее, но, надеюсь, работает быстрее. Использование аннотации `@inline` не гарантирует, что метод будет встроен, но заставит компилятор сделать это, если и только если будут соблюдены некоторые практические требования к размеру сгенерированного кода.

### Java аннотации ###
Есть некоторые отличий синтаксиса аннотаций, если пишется Scala код, который взаимодействует с Java.

**Примечание:**Убедитесь, что вы используете опцию `-target:jvm-1.8` с аннотациями Java.

Java имеет определяемые пользователем метаданные в виде [аннотаций](https://docs.oracle.com/javase/tutorial/java/annotations/). Ключевой особенностью аннотаций является то, что они полагаются на указание пар ключ-значение для инициализации своих элементов. Например, если нам нужна аннотация для отслеживания источника какого-то класса, мы можем определить её как

```
@interface Source {
  public String URL();
  public String mail();
}
```

А затем использовать следующим образом

```
@Source(URL = "http://coders.com/",
        mail = "support@coders.com")
public class MyClass extends HisClass ...
```

Использование аннотации в Scala похоже на вызов конструктора, для создания экземпляра из Java аннотации необходимо использовать именованные аргументы:

```
@Source(URL = "http://coders.com/",
        mail = "support@coders.com")
class MyScalaClass ...
```

Этот синтаксис достаточно перегруженный, если аннотация содержит только один элемент (без значения по умолчанию), поэтому, если имя указано как `value`, оно может быть применено в Java с помощью конструктора-подобного синтаксиса:

```
@interface SourceURL {
    public String value();
    public String mail() default "";
}
```

А затем использовать следующим образом

```
@SourceURL("http://coders.com/")
public class MyClass extends HisClass ...
```

В этом случае Scala предоставляет такую же возможность

```
@SourceURL("http://coders.com/")
class MyScalaClass ...
```

Элемент `mail` был указан со значением по умолчанию, поэтому нам не нужно явно указывать его значение. Однако, если нам нужно это сделать, мы не можем смешивать эти два стиля в Java:

```
@SourceURL(value = "http://coders.com/",
           mail = "support@coders.com")
public class MyClass extends HisClass ...
```

Scala обеспечивает большую гибкость в этом отношении

```
@SourceURL("http://coders.com/",
           mail = "support@coders.com")
    class MyScalaClass ...
```
