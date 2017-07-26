---
layout: multipage-overview
title: Conversiones en colecciones paralelas
discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 3
language: es
---

## Conversiones entre colecciones secuenciales y paralelas

Cada una de las colecciones secuenciales puede convertirse es su versión
paralela mediante la utilización del método `par`. Determinadas colecciones
secuenciales disponen de una versión homóloga paralela. Para estas colecciones el
proceso de conversión es eficiente -- ocurre en tiempo constante dado que ambas
versiones utilizan la misma estructura de datos interna. Una excepción al caso
anterior es el caso de los hash maps y hash sets mutables, donde el proceso de
conversión es un poco más costoso la primera vez que el método `par` es llamado,
aunque las posteriores invocaciones de dicho método ofrecerán un tiempo de ejecución
constante. Nótese que en el caso de las colecciones mutables, los cambios en la
colección secuencial son visibles en su homóloga paralela en el caso de que compartan
la estructura de datos subyacente.

| Secuencial    | Paralelo       |
| ------------- | -------------- |
| **mutable**   |                |
| `Array`       | `ParArray`     |
| `HashMap`     | `ParHashMap`   |
| `HashSet`     | `ParHashSet`   |
| `TrieMap`     | `ParTrieMap`   |
| **inmutable** |                |
| `Vector`      | `ParVector`    |
| `Range`       | `ParRange`     |
| `HashMap`     | `ParHashMap`   |
| `HashSet`     | `ParHashSet`   |

Otro tipo de colecciones, como las listas, colas o `streams`, son inherentemente
secuenciales en el sentido de que los elementos deben ser accedidos uno tras otro.
La versión paralela de estas estructuras se obtiene mediante la copia de los elementos
en una colección paralela. Por ejemplo, una lista funcional es convertida en una
secuencia paralela inmutable; un vector paralelo.

Cada colección paralela puede ser convertida a su variante secuencial mediante el uso
del método `seq`. La conversión de una colección paralela a su homóloga secuencial es
siempre un proceso eficiente -- tiempo constante. La invocación del método `seq` sobre
una colección paralela mutable retorna una colección secuencial cuya representación interna
es la misma que la de la versión paralela, por lo que posibles actualizaciones en una de las
colecciones serán visibles en la otra.

## Conversiones entre diferentes tipo de colecciones

Ortogonal a la conversión entre colecciones secuenciales y paralelas, las colecciones
pueden convertirse entre diferentes tipos. Por ejemplo, la llamada al método `toSeq`
convierte un conjunto secuencial en una secuencia secuencial, mientras que si invocamos
dicho método sobre un conjunto paralelo obtendremos una secuencia paralela. La regla
general is que si existe una versión paralela de `X`, el método `toX` convierte la colección
en una colección `ParX`

A continuación se muestra un resumen de todos los métodos de conversión:

| método     	 | Tipo de Retorno|
| -------------- | -------------- |
| `toArray`      | `Array`        |
| `toList`       | `List`         |
| `toIndexedSeq` | `IndexedSeq`   |
| `toStream`     | `Stream`       |
| `toIterator`   | `Iterator`     |
| `toBuffer`     | `Buffer`       |
| `toTraversable`| `GenTraverable`|
| `toIterable`   | `ParIterable`  |
| `toSeq`        | `ParSeq`       |
| `toSet`        | `ParSet`       |
| `toMap`        | `ParMap`       |
