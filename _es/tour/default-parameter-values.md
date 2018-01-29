---
layout: tour
title: Valores de parámetros por defecto

discourse: false

partof: scala-tour

num: 34
language: es

next-page: named-arguments
previous-page: implicit-conversions
---

Scala tiene la capacidad de dar a los parámetros valores por defecto que pueden ser usados para permitir a quien invoca el método o función que omita dichos parámetros.

En Java, uno tiende a ver muchos métodos sobrecargados que solamente sirven para proveer valores por defecto para ciertos parámetros de un método largo. En especial se ve este comportamiento en constructores:

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

Existen realmente dos constructores aquí; uno que toma otro mapa y uno que toma una capacidad y un factor de carga. Los constructores tercero y cuarto están ahí para premitir a los usuarios de la clase <code>HashMap</code> crear instancias con el valor por defecto que probablemente sea el mejor para ambos, el factor de carga y la capacidad.

Más problemático es que los valores usados para ser por defecto están tanto en la documentación (Javadoc) como en el código. Mantener ambos actualizado es dificil. Un patrón típico utilizado para no cometer estos errores es agregar constantes públicas cuyo valor será mostrado en el Javadoc:

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

Mientras esto evita repetirnos una y otra vez, es menos que expresivo.

Scala cuenta con soporte directo para esto:

    class HashMap[K,V](initialCapacity:Int = 16, loadFactor:Float = 0.75) {
    }

    // Usa los parametros por defecto
    val m1 = new HashMap[String,Int]

    // initialCapacity 20, default loadFactor
    val m2= new HashMap[String,Int](20)

    // sobreescribe ambos
    val m3 = new HashMap[String,Int](20,0.8)

    // sobreescribe solamente loadFactor
    // mediante parametros nombrados
    val m4 = new HashMap[String,Int](loadFactor = 0.8)

Nótese cómo podemos sacar ventaja de cualquier valor por defecto al utilizar [parámetros nombrados]({{ site.baseurl }}/tutorials/tour/named-arguments.html).
