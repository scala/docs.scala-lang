---
layout: tutorial
title: Defaultne vrijednosti parametara

disqus: true

tutorial: scala-tour
num: 32
outof: 33
language: ba
---

Scala omogućuje davanje defaultnih vrijednosti parametrima koje dozvoljavaju korisniku metode da izostavi te parametre.

U Javi, postoje mnoge preklopljene(overloaded) metode koje samo služe da bi obezbijedile defaultne vrijednosti za neke parametre velike metode.
Ovo je posebno tačno kod konstruktora:

    public class HashMap<K,V> {
      public HashMap(Map<? extends K,? extends V> m);
	  
      /** Kreiraj novu HashMap s defaultnim kapacitetom (16)
	    i loadFactor-om (0.75) */
      public HashMap();
	  
      /** Kreiraj novu HashMap s defaultnim loadFactor (0.75) */
      public HashMap(int initialCapacity);
      public HashMap(int initialCapacity, float loadFactor);
    }

Ovdje postoje samo dva konstruktora ustvari; jedan koji prima drugu mapu, i jedan koji prima kapacitet i faktor opterećenja.
Treći i četvrti konstruktor su tu samo da dozvole korisnicima <code>HashMap</code>-e da kreiraju instance s vjerovatno-dobrim default parametrima
za kapacitet i faktor opterećenja.

Problematičnije je to da su defaultne vrijednosti i u Javadocu *i* u kodu.
Održavanje ovih vrijednosti sinhronizovanim se lahko zaboravi.
Tipičan način zaobilaženja ovog problema je dodavanje javnih konstanti čije vrijednosti se pojavljuju u Javadoc:

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

Ovo umanjuje ponavljanje koda, ali je manje ekspresivno.

Scala ima direktnu podršku za ovo:

    class HashMap[K,V](initialCapacity:Int = 16, loadFactor:Float = 0.75f) {
    }

    // Uses the defaults
    val m1 = new HashMap[String,Int]

    // initialCapacity 20, default loadFactor
    val m2= new HashMap[String,Int](20)

    // overriding both
    val m3 = new HashMap[String,Int](20, 0.8f)

    // override only the loadFactor via
    // named arguments
    val m4 = new HashMap[String,Int](loadFactor = 0.8f)

Ovako možemo iskoristiti prednost *bilo koje* defaultne vrijednosti korištenjem [imenovanih parametara]({{ site.baseurl }}/tutorials/tour/named-parameters.html).
