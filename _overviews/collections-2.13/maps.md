---
layout: multipage-overview
title: Maps
partof: collections-213
overview-name: Collections

num: 7
previous-page: sets
next-page: concrete-immutable-collection-classes

languages: [ru]
permalink: /overviews/collections-2.13/:title.html
---

A [Map](https://www.scala-lang.org/api/current/scala/collection/Map.html) is an [Iterable](https://www.scala-lang.org/api/current/scala/collection/Iterable.html) consisting of pairs of keys and values (also named _mappings_ or _associations_). Scala's [Predef](https://www.scala-lang.org/api/current/scala/Predef$.html) object offers an implicit conversion that lets you write `key -> value` as an alternate syntax for the pair `(key, value)`. For instance `Map("x" -> 24, "y" -> 25, "z" -> 26)` means exactly the same as `Map(("x", 24), ("y", 25), ("z", 26))`, but reads better.

The fundamental operations on maps are similar to those on sets. They are summarized in the following table and fall into the following categories:

* **Lookup** operations `apply`, `get`, `getOrElse`, `contains`, and `isDefinedAt`. These turn maps into partial functions from keys to values. The fundamental lookup method for a map is: `def get(key): Option[Value]`. The operation `m.get(key)` tests whether the map contains an association for the given `key`. If so, it returns the associated value in a `Some`. If no key is defined in the map, `get` returns `None`. Maps also define an `apply` method that returns the value associated with a given key directly, without wrapping it in an `Option`. If the key is not defined in the map, an exception is raised.
* **Additions and updates** `+`, `++`, `updated`, which let you add new bindings to a map or change existing bindings.
* **Removals** `-`, `--`, which remove bindings from a map.
* **Subcollection producers** `keys`, `keySet`, `keysIterator`, `values`, `valuesIterator`, which return a map's keys and values separately in various forms.
* **Transformations** `filterKeys` and `mapValues`, which produce a new map by filtering and transforming bindings of an existing map.

### Operations in Class Map ###

| WHAT IT IS                | WHAT IT DOES                                   |
| ------                    | ------                                         |
|  **Lookups:**             |                                                |
|  `ms.get(k)`              |The value associated with key `k` in map `ms` as an option, `None` if not found.|
|  `ms(k)`  	            |(or, written out, `ms.apply(k)`) The value associated with key `k` in map `ms`, or exception if not found.|
|  `ms.getOrElse(k, d)`     |The value associated with key `k` in map `ms`, or the default value `d` if not found.|
|  `ms.contains(k)`         |Tests whether `ms` contains a mapping for key `k`.|
|  `ms.isDefinedAt(k)`      |Same as `contains`.                             |
|   **Subcollections:**     |                                                |
|  `ms.keys`  	            |An iterable containing each key in `ms`.        |
|  `ms.keySet`              |A set containing each key in `ms`.              |
|  `ms.keysIterator`        |An iterator yielding each key in `ms`.          |
|  `ms.values`      	    |An iterable containing each value associated with a key in `ms`.|
|  `ms.valuesIterator`      |An iterator yielding each value associated with a key in `ms`.|
|   **Transformation:**     |                                                |
|  `ms.view.filterKeys(p)`  |A map view containing only those mappings in `ms` where the key satisfies predicate `p`.|
|  `ms.view.mapValues(f)`   |A map view resulting from applying function `f` to each value associated with a key in `ms`.|

Immutable maps support in addition operations to add and remove mappings by returning new `Map`s, as summarized in the following table.

### Operations in Class immutable.Map ###

| WHAT IT IS                | WHAT IT DOES                                   |
| ------                    | ------                                         |
| **Additions and Updates:**|                                                |
|  `ms.updated(k, v)`<br>or `ms + (k -> v)`  |The map containing all mappings of `ms` as well as the mapping `k -> v` from key `k` to value `v`.|
| **Removals:**             |                                                |
|  `ms.removed(k)`<br>or `ms - k`             |The map containing all mappings of `ms` except for any mapping of key `k`.|
|  `ms.removedAll(ks)`<br>or `ms -- ks`       |The map containing all mappings of `ms` except for any mapping with a key in `ks`.|

Mutable maps support in addition the operations summarized in the following table.


### Operations in Class mutable.Map ###

| WHAT IT IS                  | WHAT IT DOES                                  |
| ------                      | ------                                        |
|  **Additions and Updates:** |                                               |
|  `ms(k) = v`                |(Or, written out, `ms.update(k, v)`). Adds mapping from key `k` to value `v` to map ms as a side effect, overwriting any previous mapping of `k`.|
|  `ms.addOne(k -> v)`<br>or `ms += (k -> v)`     |Adds mapping from key `k` to value `v` to map `ms` as a side effect and returns `ms` itself.|
|  `ms.addAll(kvs)`<br>or `ms ++= kvs`             |Adds all mappings in `kvs` to `ms` as a side effect and returns `ms` itself.|
|  `ms.put(k, v)`             |Adds mapping from key `k` to value `v` to `ms` and returns any value previously associated with `k` as an option.|
|  `ms.getOrElseUpdate(k, d)` |If key `k` is defined in map `ms`, return its associated value. Otherwise, update `ms` with the mapping `k -> d` and return `d`.|
|  **Removals:**              |                                                |
|  `ms.subtractOne(k)`<br>or `ms -= k`            |Removes mapping with key `k` from ms as a side effect and returns `ms` itself.|
|  `ms.subtractAll(ks)`<br>or `ms --= ks`         |Removes all keys in `ks` from `ms` as a side effect and returns `ms` itself.|
|  `ms.remove(k)`             |Removes any mapping with key `k` from `ms` and returns any value previously associated with `k` as an option.|
|  `ms.filterInPlace(p)`      |Keeps only those mappings in `ms` that have a key satisfying predicate `p`.|
|  `ms.clear()`               |Removes all mappings from `ms`.                 |
|  **Transformation:**        |                                                |
|  `ms.mapValuesInPlace(f)`   |Transforms all associated values in map `ms` with function `f`.|
|  **Cloning:**               |                                                |
|  `ms.clone`                 |Returns a new mutable map with the same mappings as `ms`.|

The addition and removal operations for maps mirror those for sets. A mutable map `m` is usually updated in place, using the two variants `m(key) = value` or `m += (key -> value)`. There is also the variant `m.put(key, value)`, which returns an `Option` value that contains the value previously associated with `key`, or `None` if the `key` did not exist in the map before.

The `getOrElseUpdate` is useful for accessing maps that act as caches. Say you have an expensive computation triggered by invoking a function `f`:

{% tabs expensive-computation-reverse class=tabs-scala-version %}

{% tab 'Scala 2' for=expensive-computation-reverse %}
```scala
scala> def f(x: String): String = {
          println("taking my time."); Thread.sleep(100)
          x.reverse
        }
f: (x: String)String
```
{% endtab %}

{% tab 'Scala 3' for=expensive-computation-reverse %}
```scala
scala> def f(x: String): String =
         println("taking my time."); Thread.sleep(100)
         x.reverse

def f(x: String): String
```
{% endtab %}

{% endtabs %}

Assume further that `f` has no side-effects, so invoking it again with the same argument will always yield the same result. In that case you could save time by storing previously computed bindings of argument and results of `f` in a map and only computing the result of `f` if a result of an argument was not found there. One could say the map is a _cache_ for the computations of the function `f`.

{% tabs cache-creation %}
{% tab 'Scala 2 and 3' for=cache-creation %}
```scala
scala> val cache = collection.mutable.Map[String, String]()
cache: scala.collection.mutable.Map[String,String] = Map()
```
{% endtab %}
{% endtabs %}

You can now create a more efficient caching version of the `f` function:

{% tabs cache-usage %}
{% tab 'Scala 2 and 3' for=cache-usage %}
```scala
scala> def cachedF(s: String): String = cache.getOrElseUpdate(s, f(s))
cachedF: (s: String)String
scala> cachedF("abc")
taking my time.
res3: String = cba
scala> cachedF("abc")
res4: String = cba
```
{% endtab %}
{% endtabs %}

Note that the second argument to `getOrElseUpdate` is by-name, so the computation of `f("abc")` above is only performed if `getOrElseUpdate` requires the value of its second argument, which is precisely if its first argument is not found in the `cache` map. You could also have implemented `cachedF` directly, using just basic map operations, but it would take more code to do so:

{% tabs cacheF class=tabs-scala-version %}

{% tab 'Scala 2' for=cacheF %}
```scala
def cachedF(arg: String): String = cache.get(arg) match {
  case Some(result) => result
  case None =>
    val result = f(x)
    cache(arg) = result
    result
}
```
{% endtab %}

{% tab 'Scala 3' for=cacheF %}
```scala
def cachedF(arg: String): String = cache.get(arg) match
  case Some(result) => result
  case None =>
    val result = f(x)
    cache(arg) = result
    result
```
{% endtab %}

{% endtabs %}
