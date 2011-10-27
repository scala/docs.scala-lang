---
layout: overview-large
title: Performance Characteristics

disqus: true

partof: collections
num: 12
outof: 12
---

The previous explanations have made it clear that different collection types have different performance characteristics. That's often the primary reason for picking one collection type over another. You can see the performance characteristics of some common operations on collections summarized in the following two tables.

|               | head | tail | apply | update| prepend | append | insert |
| --------      | ---- | ---- | ----  | ----  | ----    | ----   | ----   |
| **immutable** |      |      |       |       |         |        |        |
| `List`        | C    | C    | L     | L     |  C      | L      |  -     |
| `Stream`      | C    | C    | L     | L     |  C      | L      |  -     |
| `Vector`      | eC   | eC   | eC    | eC    |  eC     | eC     |  -     |
| `Stack`       | C    | C    | L     | L     |  C      | C      |  L     |
| `Queue`       | aC   | aC   | L     | L     |  L      | C      |  -     |
| `Range`       | C    | C    | C     | -     |  -      | -      |  -     |
| `String`      | C    | L    | C     | L     |  L      | L      |  -     |
| **mutable**   |      |      |       |       |         |        |        |
| `ArrayBuffer` | C    | L    | C     | C     |  L      | aC     |  L     |
| `ListBuffer`  | C    | L    | L     | L     |  C      | C      |  L     |
|`StringBuilder`| C    | L    | C     | C     |  L      | aC     |  L     |
| `MutableList` | C    | L    | L     | L     |  C      | C      |  L     |
| `Queue`       | C    | L    | L     | L     |  C      | C      |  L     |
| `ArraySeq`    | C    | L    | C     | C     |  -      | -      |  -     |
| `Stack`       | C    | L    | L     | L     |  C      | L      |  L     |
| `ArrayStack`  | C    | L    | C     | C     |  aC     | L      |  L     |
| `Array`       | C    | L    | C     | C     |  -      | -      |  -     |
<center>Performance characteristics of sequence types.</center>


|                    | lookup | add | remove | min           |
| --------           | ----   | ---- | ----  | ----          |
| **immutable**      |        |      |       |               |
| `HashSet`/`HashMap`| eC     | eC   | eC    | L             |
| `TreeSet`/`TreeMap`| Log    | Log  | Log   | Log           |
| `BitSet`           | C      | L    | L     | eC<sup>1</sup>|
| `ListMap`          | L      | L    | L     | L             |
| **mutable**        |        |      |       |               |
| `HashSet`/`HashMap`| eC     | eC   | eC    | L             |
| `WeakHashMap`      | eC     | eC   | eC    | L             |
| `BitSet`           | C      | aC   | C     | eC<sup>2</sup>|    
<center>Performance characteristics of set and map types.</center>
