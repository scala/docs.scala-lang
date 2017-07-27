---
layout: tour
title: Operadores

discourse: false

partof: scala-tour

num: 17
language: es

next-page: higher-order-functions
previous-page: automatic-closures
---

En Scala, cualquier método el cual reciba un solo parámetro puede ser usado como un *operador de infijo (infix)*. Aquí se muestra la definición de la clase `MyBool`, la cual define tres métodos `and`, `or`, y `negate`.

    class MyBool(x: Boolean) {
      def and(that: MyBool): MyBool = if (x) that else this
      def or(that: MyBool): MyBool = if (x) this else that
      def negate: MyBool = new MyBool(!x)
    }

Ahora es posible utilizar `and` y `or` como operadores de infijo:

    def not(x: MyBool) = x negate; // punto y coma necesario aquí
    def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)

Como muestra la primera linea del código anterior, es también posible utilizar métodos nularios (que no reciban parámetros) como operadores de postfijo. La segunda linea define la función `xor` utilizando los métodos `and`y `or` como también la función `not`. En este ejemplo el uso de los _operadores de postfijo_ ayuda a crear una definición del método `xor` más fácil de leer.

Para demostrar esto se muestra el código correspondiente a las funciones anteriores pero escritas en una notación orientada a objetos más tradicional:

    def not(x: MyBool) = x.negate; // punto y coma necesario aquí
    def xor(x: MyBool, y: MyBool) = x.or(y).and(x.and(y).negate)
