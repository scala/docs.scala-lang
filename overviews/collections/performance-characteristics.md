---
layout: overview-large
title: Performance Characteristics

disqus: true

partof: collections
num: 12
languages: [ja]
---

The previous explanations have made it clear that different collection types have different performance characteristics. That's often the primary reason for picking one collection type over another. You can see the performance characteristics of some common operations on collections summarized in the following two tables.

Performance characteristics of sequence types:

|               | head | tail | apply | update| prepend | append | insert |
| --------      | ---- | ---- | ----  | ----  | ----    | ----   | ----   |
| **immutable** |      |      |       |       |         |        |        |
| `List`        | O(1) | O(1) | O(n)  | O(n)  |  O(1)   | O(n)   |  N/A   |
| `Stream`      | O(1) | O(1) | O(n)  | O(n)  |  O(1)   | O(n)   |  N/A   |
| `Vector`      | O(1)<sup>hash dep.</sup>| O(1)<sup>hash dep.</sup>| O(1)<sup>hash dep.</sup> | O(1)<sup>hash dep.</sup> |  O(1)<sup>hash dep.</sup>  | O(1)<sup>hash dep.</sup>  |  N/A   |
| `Stack`       | O(1) | O(1) | O(n)  | O(n)  |  O(1)   | O(1)   |  O(n)  |
| `Queue`       | O(1)<sup>amortized</sup>| O(1)<sup>amortized</sup>| O(n)  | O(n)  |  O(n)   | O(1)   |  N/A   |
| `Range`       | O(1) | O(1) | O(1)  | N/A   |  N/A    | N/A    |  N/A   |
| `String`      | O(1) | O(n) | O(1)  | O(n)  |  O(n)   | O(n)   |  N/A   |
| **mutable**   |      |      |       |       |         |        |        |
| `ArrayBuffer` | O(1) | O(n) | O(1)  | O(1)  |  O(n)   | O(1)<sup>amortized</sup>  |  O(n)  |
| `ListBuffer`  | O(1) | O(n) | O(n)  | O(n)  |  O(1)   | O(1)   |  O(n)  |
|`StringBuilder`| O(1) | O(n) | O(1)  | O(1)  |  O(n)   | O(1)<sup>amortized</sup>  |  O(n)  |
| `MutableList` | O(1) | O(n) | O(n)  | O(n)  |  O(1)   | O(1)   |  O(n)  |
| `Queue`       | O(1) | O(n) | O(n)  | O(n)  |  O(1)   | O(1)   |  O(n)  |
| `ArraySeq`    | O(1) | O(n) | O(1)  | O(1)  |  N/A    | N/A    |  N/A   |
| `Stack`       | O(1) | O(n) | O(n)  | O(n)  |  O(1)   | O(n)   |  O(n)  |
| `ArrayStack`  | O(1) | O(n) | O(1)  | O(1)  |  O(1)<sup>amortized</sup> | O(n)   |  O(n)  |
| `Array`       | O(1) | O(n) | O(1)  | O(1)  |  N/A    | N/A    |  N/A   |

Performance characteristics of set and map types:

|                    | lookup | add | remove | min           |
| --------           | ----   | ---- | ----  | ----          |
| **immutable**      |        |      |       |               |
| `HashSet`/`HashMap`| O(1)<sup>hash dep.</sup>     | O(1)<sup>hash dep.</sup>   | O(1)<sup>hash dep.</sup>    | O(n)          |
| `TreeSet`/`TreeMap`| O(log n)    | O(log n)  | O(log n)   | O(log n)      |
| `BitSet`           | O(1)   | O(n) | O(n)  | O(1)<sup>hash dep.</sup>|
| `ListMap`          | O(n)   | O(n) | O(n)  | O(n)          |
| **mutable**        |        |      |       |               |
| `HashSet`/`HashMap`| O(1)<sup>hash dep.</sup>     | O(1)<sup>hash dep.</sup>   | O(1)<sup>hash dep.</sup>    | O(n)          |
| `WeakHashMap`      | O(1)<sup>hash dep.</sup>     | O(1)<sup>hash dep.</sup>   | O(1)<sup>hash dep.</sup>    | O(n)          |
| `BitSet`           | O(1)   | O(1)<sup>2</sup> | O(1)  | O(1)<sup>1</sup>|
| `TreeSet`          | O(log n)    | O(log n)  | O(log n)   | O(log n)      |

####Footnotes:
<sup>1</sup> Assuming bits are densely packed.

<sup>2</sup> The operation takes amortized constant time. Some invocations of the operation might take longer, but if many operations are performed on average only constant time per operation is taken.

The first table treats sequence types--both immutable and mutable--with the following operations:

|     |                                                     |
| --- | ----                                                |
| **head**   | Selecting the first element of the sequence. |
| **tail**   | Producing a new sequence that consists of all elements except the first one. |
| **apply**  | Indexing. |
| **update** | Functional update (with `updated`) for immutable sequences, side-effecting update (with `update` for mutable sequences. |
| **prepend**| Adding an element to the front of the sequence. For immutable sequences, this produces a new sequence. For mutable sequences it modified the existing sequence. |
| **append** | Adding an element and the end of the sequence. For immutable sequences, this produces a new sequence. For mutable sequences it modified the existing sequence. |
| **insert** | Inserting an element at an arbitrary position in the sequence. This is only supported directly for mutable sequences. |

The second table treats mutable and immutable sets and maps with the following operations:

|     |                                                     |
| --- | ----                                                |
| **lookup** | Testing whether an element is contained in set, or selecting a value associated with a key. |
| **add**    | Adding a new element to a set or key/value pair to a map. |
| **remove** | Removing an element from a set or a key from a map. |
| **min**    | The smallest element of the set, or the smallest key of a map. |

