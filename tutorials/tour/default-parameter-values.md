---
layout: tutorial
title: Default Parameter values

disqus: true

tutorial: scala-tour
num: 34
---

Scala provides the ability to give parameters default values that can be used to allow a caller to omit those parameters.

In Java, one tends to see a lot of overloaded methods that only serve to provide default values for certain parameters of a large method.  This is especially true with constructors:

    public class HashMap<K,V> {
      public HashMap(Map<? extends K,? extends V> m);
      /** Create a new HashMap with default capacity (16) 
        * and loadFactor (0.75) 
        */
      public HashMap();
      /** Create a new HashMap with default loadFactor (0.75) */
      public HashMap(int initialCapacity);
      public HashMap(int initialCapacity, float loadFactor);
    }

There's really only two constructors here; one that takes another map, and one that takes a capacity and load factor.  The third and fourth constructors are there to allow users of <code>HashMap</code> to create instances with the probably-good-for-most-cases defaults of both load factor and capacity.

More problematic is that the values used for defaults are in both the Javadoc *and* the code.  Keeping this up to date is easily forgotten.  A typical pattern around this would be to add public constants whose values will show up in the Javadoc:

    public class HashMap<K,V> {
      public static final int DEFAULT_CAPACITY = 16;
      public static final float DEFAULT_LOAD_FACTOR = 0.75;

      public HashMap(Map<? extends K,? extends V> m);
      /** Create a new HashMap with default capacity (16) 
        * and loadFactor (0.75) 
        */
      public HashMap();
      /** Create a new HashMap with default loadFactor (0.75) */
      public HashMap(int initialCapacity);
      public HashMap(int initialCapacity, float loadFactor);
    }

While this keeps us from repeating ourselves, it's less than expressive.  

Scala adds direct support for this:

    class HashMap[K,V](initialCapacity:Int = 16, loadFactor:Float = 0.75) {
    }

    // Uses the defaults
    val m1 = new HashMap[String,Int]

    // initialCapacity 20, default loadFactor
    val m2= new HashMap[String,Int](20)

    // overriding both
    val m3 = new HashMap[String,Int](20,0.8)

    // override only the loadFactory via
    // named arguments
    val m4 = new HashMap[String,Int](loadFactor = 0.8)

Note how we can take advantage of *any* default value by using [named parameters]({{ site.baseurl }}/tutorials/tour/named-parameters.html).

