---
layout: tour
title: Кортеж

discourse: true

partof: scala-tour

num: 6
language: ru
next-page: mixin-class-composition
previous-page: traits
topics: tuples

---

В Scala, a кортеж это класс контейнер содержащий упорядоченный набор элементов различного типа. 
Кортежи неизменяемы. 

Кортежи могут пригодиться, когда нам нужно вернуть сразу несколько значений из функции.

Кортеж может быть создан как:

```tut
val ingredient = ("Sugar" , 25):Tuple2[String, Int]
```
Такая запись создает кортеж размерности 2, содержащий пару элементов String и Int.

Кортежи в Скале - представлены серией классов: Tuple2, Tuple3 и т.д., до Tuple22.
Таким образом, создавая кортеж с n элементами (n лежащими между 2 и 22), Скала просто создает один из соответствующих классов, который параметризован типом входящих в состав элементов.

В нашем примере, составляющие тип Tuple2[String, Int].

## Доступ к элементам

Доступ к элементам кортежа осуществляется при помощи синтаксиса подчеркивания.
'tuple._n' дает n-ый элемент (до тех пор, сколько существует элементов).

```tut
println(ingredient._1) // Sugar

println(ingredient._2) // 25
```

## Разборка данных кортежа

Scala кортежи также поддерживают разборку.

```tut
val (name, quantity) = ingredient

println(name) // Sugar

println(quantity) // 25
```

Разборка данных кортежа может быть использована в [сопоставлении с примером](pattern-matching.html)

```tut
val planetDistanceFromSun = List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6 ), ("Mars", 227.9), ("Jupiter", 778.3))

planetDistanceFromSun.foreach{ tuple => {
  
  tuple match {
    
      case ("Mercury", distance) => println(s"Mercury is $distance millions km far from Sun")
      
      case p if(p._1 == "Venus") => println(s"Venus is ${p._2} millions km far from Sun")
      
      case p if(p._1 == "Earth") => println(s"Blue planet is ${p._2} millions km far from Sun")
      
      case _ => println("Too far....")
      
    }
    
  }
  
}
```

Или в ['for' представлении](for-comprehensions.html).

```tut
val numPairs = List((2, 5), (3, -7), (20, 56))

for ((a, b) <- numPairs) {

  println(a * b)
  
}
```

Значение () типа Unit по свой сути совпадает со значением () типа Tuple0. Может быть только одно значение такого типа, так как в нём нет элементов.

Иногда бывает трудно выбирать между кортежами и классами образцами. Как правило, классы образцы являются предпочтительным выбором, если сам класс-контейнер содержащий элементы сам по себе имеет значимый смысл.
