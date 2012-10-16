---
layout: overview-large
title: Introducción

disqus: true

partof: collections
num: 1
---

**Martin Odersky, and Lex Spoon**
  
Para muchos, el nuevo framework de colecciones es el cambio más representativo de Scala 2.8.
Scala ya disponía de colecciones en versiones anteriores (de hecho el nuevo framework es en gran parte
compatible con las versiones anteriores). Sin embargo, solo la versión 2.8 ofrece un framework común, 
uniforme y global para los diferentes tipos de colecciones.

A pesar de que las nuevas adiciones a las colecciones pueden resultar sutiles a primera vista,
los cambios efectuados pueden provocar profundos cambios en nuestro estilo de programación. De hecho,
a menudo se trabaja en un nivel de abstracción más alto, donde las piezas básicas que utilizamos
para escribir los programas son las propias colecciones en lugar de sus elementos. Este nuevo estilo
de programación necesita llevar a cabo ciertas adaptaciones. Afortunadamente, el proceso de adaptación
es más sencillo de lo esperado gracias a varias características de las colecciones. Son fáciles de utilizar,
concisas, seguras, rápidas y universales.


**Fáciles de utilizar:** Un pequeño vocabulario de 20-50 métodos es suficiente para 
resolvar la mayor parte de los problemas de colecciones en un par de operaciones. No
es necesario complicarse con bucles imposibles o recursiones. Las colecciones persistentes
y las operaciones libres de efectos secundarios nos permiten olvidarnos de las posibles
corrupciones cuando añadimos nuevos elementos. Las interferencias entre los iteradores y las operaciones 
de actualización han sido eleminadas.

**Concisas:** Una simple palabra puede expresar todo aquello que habitualmente llevamos a cabo con
uno o múltiples bucles. Pueden expresarse operaciones funcionales con una sintaxis ligera y combinar
las operaciones sin ningún tipo de esfuerzo, de manera que el resultado obtenido es una especie de
álgebra personalizado.

**Seguras:** Esto tiene que ser experimentado por uno mismo para darse cuenta. El tipado estático
y la naturaleza funcional de las colecciones en Scala implican que la mayor parte de los errores más
abrumadores que podamos cometer serán detectados en tiempo de compilación. El motivo es que (1) las
operaciones sobre colecciones son usadas de manera extensiva, y por tanto están bien probadas. (2) los
usos de las operaciones sobre las colecciones explicitan sus argumentos y retornos como parámetros de función
y resultados. (3) Estas entradas y salidas explícitas están sujetas a comprobaciones de tipo estáticas.
El elemento común es que la mayor parte de los usos incorrectos serán mostrados como errores de tipo. No es
nada raro tener programas de varios cientos de líneas que funcionan en el primer intento.

**Rápidas:** Las operaciones sobre las colecciones están tuneadas y optimizadas en las librerías. Como resultado,
el uso de las colecciones suele ser bastante eficiente. Podríamos ser capaces de hacerlo un poquito mejor con un conjunto
de operaciones y estructuras tuneadas a mano, aunque también podríamos hacerlo peor, tomando decisiones de implementación
subóptimas. Además, las colecciones han sido adaptadas recientemente a la ejecución paralela en múltiples núcleos.
Las colecciones paralelas soportan el mismo conjunto de operaciones que las secuenciales, por lo que no es necesario
aprender a utilizar nuevas operaciones ni necesitamos reescribir nuestro código. Podemos convertir una colección
secuencial en su versión paralela mediante la invocación del método `par`

**Universales:** Las colecciones ofrecen las mismas operaciones en cualquier tipo donde tiene sentido hacerlo. Por tanto, 
podemos llevar a cabo mucho trabajo con un conjunto reducido de operaciones. Por ejemplo, una cadena es, conceptualmente,
una secuencia de caracteres. Consecuentemente, en las colecciones de Scala, los string soportan todos las operaciones de las
secuencias. Lo mismo aplica para los arrays.

**Ejemplo:** A continuación figura una línea que demuestra muchas de las ventajas de las colecciones de Scala.

    val (minors, adults) = people partition (_.age < 18)

Está claro de manera inmediata lo que hace esta operación: divide la colección `people` en dos partes
`minors` y `adults` en función de su edad. Dado que el método `partition` está definido en el tipo `TraversableLike`,
raíz de toda la jerarquía de colecciones, el código anterior funciona para cualquier tipo de colección, incluidos
los arrays. Las colecciones resultantes `minors` y `adults` serán del mismo tipo que la colección `people`

El código anterior es mucho más conciso que la versión tradicional que utiliza tres bucles (tres bucles para un array, puesto que los resultados intermedios necesitan ser almacenados en alguna parte). Una vez aprendido el vocabulario básico de las colecciones, el código anterior nos resultará más sencillo y seguro que la versión "tradicional" equivalente. Además, la operación `partition` es bastante rápida, incluso un poco más en las colecciones paralelas sobre procesadores con múltiples núcleos. (Las colecciones paralelas han sido publicadas como parte de Scala 2.9) 

Este documento ofrece una discusión detallada del API de colecciones de Scala desde una perspectiva de usuario. Un paseo
por las clases fundamentales y los métodos definidos en las mismas.