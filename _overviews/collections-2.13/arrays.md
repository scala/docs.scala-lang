---
layout: multipage-overview
title: Arrays

discourse: true

partof: collections-213
overview-name: Collections

num: 10
previous-page: concrete-mutable-collection-classes
next-page: strings

permalink: /overviews/collections-2.13/:title.html
---

[Array](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/Array.html) is a special kind of collection in Scala. On the one hand, Scala arrays correspond one-to-one to Java arrays. That is, a Scala array `Array[Int]` is represented as a Java `int[]`, an `Array[Double]` is represented as a Java `double[]` and a `Array[String]` is represented as a Java `String[]`. But at the same time, Scala arrays offer much more than their Java analogues. First, Scala arrays can be _generic_. That is, you can have an `Array[T]`, where `T` is a type parameter or abstract type. Second, Scala arrays are compatible with Scala sequences - you can pass an `Array[T]` where a `Seq[T]` is required. Finally, Scala arrays also support all sequence operations. Here's an example of this in action:

    scala> val a1 = Array(1, 2, 3)
    a1: Array[Int] = Array(1, 2, 3)
    scala> val a2 = a1 map (_ * 3)
    a2: Array[Int] = Array(3, 6, 9)
    scala> val a3 = a2 filter (_ % 2 != 0)
    a3: Array[Int] = Array(3, 9)
    scala> a3.reverse
    res0: Array[Int] = Array(9, 3)

Given that Scala arrays are represented just like Java arrays, how can these additional features be supported in Scala? The Scala array implementation makes systematic use of implicit conversions. In Scala, an array does not pretend to _be_ a sequence. It can't really be that because the data type representation of a native array is not a subtype of `Seq`. Instead there is an implicit "wrapping" conversion between arrays and instances of class `scala.collection.mutable.ArraySeq`, which is a subclass of `Seq`. Here you see it in action:

    scala> val seq: collection.Seq[Int] = a1
    seq: scala.collection.Seq[Int] = ArraySeq(1, 2, 3)
    scala> val a4: Array[Int] = seq.toArray
    a4: Array[Int] = Array(1, 2, 3)
    scala> a1 eq a4
    res1: Boolean = false

The interaction above demonstrates that arrays are compatible with sequences, because there's an implicit conversion from arrays to `ArraySeq`s. To go the other way, from an `ArraySeq` to an `Array`, you can use the `toArray` method defined in `Iterable`. The last REPL line above shows that wrapping and then unwrapping with `toArray` produces a copy of the original array.

There is yet another implicit conversion that gets applied to arrays. This conversion simply "adds" all sequence methods to arrays but does not turn the array itself into a sequence. "Adding" means that the array is wrapped in another object of type `ArrayOps` which supports all sequence methods. Typically, this `ArrayOps` object is short-lived; it will usually be inaccessible after the call to the sequence method and its storage can be recycled. Modern VMs often avoid creating this object entirely.

The difference between the two implicit conversions on arrays is shown in the next REPL dialogue:

    scala> val seq: collection.Seq[Int] = a1
    seq: scala.collection.Seq[Int] = ArraySeq(1, 2, 3)
    scala> seq.reverse
    res2: scala.collection.Seq[Int] = ArraySeq(3, 2, 1)
    scala> val ops: collection.ArrayOps[Int] = a1
    ops: scala.collection.ArrayOps[Int] = scala.collection.ArrayOps@2d7df55
    scala> ops.reverse
    res3: Array[Int] = Array(3, 2, 1)

You see that calling reverse on `seq`, which is an `ArraySeq`, will give again a `ArraySeq`. That's logical, because arrayseqs are `Seqs`, and calling reverse on any `Seq` will give again a `Seq`. On the other hand, calling reverse on the ops value of class `ArrayOps` will give an `Array`, not a `Seq`.

The `ArrayOps` example above was quite artificial, intended only to show the difference to `ArraySeq`. Normally, you'd never define a value of class `ArrayOps`. You'd just call a `Seq` method on an array:

    scala> a1.reverse
    res4: Array[Int] = Array(3, 2, 1)

The `ArrayOps` object gets inserted automatically by the implicit conversion. So the line above is equivalent to

    scala> intArrayOps(a1).reverse
    res5: Array[Int] = Array(3, 2, 1)

where `intArrayOps` is the implicit conversion that was inserted previously. This raises the question how the compiler picked `intArrayOps` over the other implicit conversion to `ArraySeq` in the line above. After all, both conversions map an array to a type that supports a reverse method, which is what the input specified. The answer to that question is that the two implicit conversions are prioritized. The `ArrayOps` conversion has a higher priority than the `ArraySeq` conversion. The first is defined in the `Predef` object whereas the second is defined in a class `scala.LowPriorityImplicits`, which is inherited by `Predef`. Implicits in subclasses and subobjects take precedence over implicits in base classes. So if both conversions are applicable, the one in `Predef` is chosen. A very similar scheme works for strings.

So now you know how arrays can be compatible with sequences and how they can support all sequence operations. What about genericity? In Java you cannot write a `T[]` where `T` is a type parameter. How then is Scala's `Array[T]` represented? In fact a generic array like `Array[T]` could be at run-time any of Java's eight primitive array types `byte[]`, `short[]`, `char[]`, `int[]`, `long[]`, `float[]`, `double[]`, `boolean[]`, or it could be an array of objects. The only common run-time type encompassing all of these types is `AnyRef` (or, equivalently `java.lang.Object`), so that's the type to which the Scala compiler maps `Array[T]`. At run-time, when an element of an array of type `Array[T]` is accessed or updated there is a sequence of type tests that determine the actual array type, followed by the correct array operation on the Java array. These type tests slow down array operations somewhat. You can expect accesses to generic arrays to be three to four times slower than accesses to primitive or object arrays. This means that if you need maximal performance, you should prefer concrete over generic arrays. Representing the generic array type is not enough, however, there must also be a way to create generic arrays. This is an even harder problem, which requires a little bit of help from you. To illustrate the problem, consider the following attempt to write a generic method that creates an array.

    // this is wrong!
    def evenElems[T](xs: Vector[T]): Array[T] = {
      val arr = new Array[T]((xs.length + 1) / 2)
      for (i <- 0 until xs.length by 2)
        arr(i / 2) = xs(i)
      arr
    }

The `evenElems` method returns a new array that consist of all elements of the argument vector `xs` which are at even positions in the vector. The first line of the body of `evenElems` creates the result array, which has the same element type as the argument. So depending on the actual type parameter for `T`, this could be an `Array[Int]`, or an `Array[Boolean]`, or an array of some of the other primitive types in Java, or an array of some reference type. But these types have all different runtime representations, so how is the Scala runtime going to pick the correct one? In fact, it can't do that based on the information it is given, because the actual type that corresponds to the type parameter `T` is erased at runtime. That's why you will get the following error message if you compile the code above:

    error: cannot find class manifest for element type T
      val arr = new Array[T]((arr.length + 1) / 2)
                ^

What's required here is that you help the compiler out by providing some runtime hint what the actual type parameter of `evenElems` is. This runtime hint takes the form of a class manifest of type `scala.reflect.ClassTag`. A class manifest is a type descriptor object which describes what the top-level class of a type is. Alternatively to class manifests there are also full manifests of type `scala.reflect.Manifest`, which describe all aspects of a type. But for array creation, only class manifests are needed.

The Scala compiler will construct class manifests automatically if you instruct it to do so. "Instructing" means that you demand a class manifest as an implicit parameter, like this:

    def evenElems[T](xs: Vector[T])(implicit m: ClassTag[T]): Array[T] = ...

Using an alternative and shorter syntax, you can also demand that the type comes with a class manifest by using a context bound. This means following the type with a colon and the class name `ClassTag`, like this:

    import scala.reflect.ClassTag
    // this works
    def evenElems[T: ClassTag](xs: Vector[T]): Array[T] = {
      val arr = new Array[T]((xs.length + 1) / 2)
      for (i <- 0 until xs.length by 2)
        arr(i / 2) = xs(i)
      arr
    }

The two revised versions of `evenElems` mean exactly the same. What happens in either case is that when the `Array[T]` is constructed, the compiler will look for a class manifest for the type parameter T, that is, it will look for an implicit value of type `ClassTag[T]`. If such a value is found, the manifest is used to construct the right kind of array. Otherwise, you'll see an error message like the one above.

Here is some REPL interaction that uses the `evenElems` method.

    scala> evenElems(Vector(1, 2, 3, 4, 5))
    res6: Array[Int] = Array(1, 3, 5)
    scala> evenElems(Vector("this", "is", "a", "test", "run"))
    res7: Array[java.lang.String] = Array(this, a, run)

In both cases, the Scala compiler automatically constructed a class manifest for the element type (first, `Int`, then `String`) and passed it to the implicit parameter of the `evenElems` method. The compiler can do that for all concrete types, but not if the argument is itself another type parameter without its class manifest. For instance, the following fails:

    scala> def wrap[U](xs: Vector[U]) = evenElems(xs)
    <console>:6: error: No ClassTag available for U.
         def wrap[U](xs: Vector[U]) = evenElems(xs)
                                               ^

What happened here is that the `evenElems` demands a class manifest for the type parameter `U`, but none was found. The solution in this case is, of course, to demand another implicit class manifest for `U`. So the following works:

    scala> def wrap[U: ClassTag](xs: Vector[U]) = evenElems(xs)
    wrap: [U](xs: Vector[U])(implicit evidence$1: scala.reflect.ClassTag[U])Array[U]

This example also shows that the context bound in the definition of `U` is just a shorthand for an implicit parameter named here `evidence$1` of type `ClassTag[U]`.

In summary, generic array creation demands class manifests. So whenever creating an array of a type parameter `T`, you also need to provide an implicit class manifest for `T`. The easiest way to do this is to declare the type parameter with a `ClassTag` context bound, as in `[T: ClassTag]`.
