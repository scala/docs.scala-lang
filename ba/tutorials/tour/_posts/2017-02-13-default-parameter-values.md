---
layout: inner-page-no-masthead
title: Podrazumijevane vrijednosti parametara

disqus: true

tutorial: scala-tour
categories: tour
num: 32
outof: 33
language: ba
---

Scala omogućuje davanje podrazumijevanih vrijednosti parametrima koje dozvoljavaju korisniku metode da izostavi te parametre.

U Javi, postoje mnoge preopterećene (overloaded) metode koje samo služe da bi obezbijedile podrazumijevane vrijednosti za neke parametre velike metode.
Ovo je posebno tačno kod konstruktora:

    public class HashMap<K,V> {
      public HashMap(Map<? extends K,? extends V> m);	  
      /** Kreiraj novu HashMap s podrazumijevanim kapacitetom (16)
        * i loadFactor-om (0.75)
        */
      public HashMap();
	  
      /** Kreiraj novu HashMap s podrazumijevanim loadFactor-om (0.75) */
      public HashMap(int initialCapacity);
      public HashMap(int initialCapacity, float loadFactor);
    }

Ovdje postoje samo dva konstruktora ustvari; jedan koji prima drugu mapu, i jedan koji prima kapacitet i faktor opterećenja.
Treći i četvrti konstruktor su tu samo da dozvole korisnicima <code>HashMap</code>-e da kreiraju instance s vjerovatno-dobrim podrazumijevanim parametrima
za kapacitet i faktor opterećenja.

Problematičnije je to da su podrazumijevane vrijednosti i u Javadoc-u *i* u kodu.
Održavanje ovih vrijednosti sinhronizovanim se lahko zaboravi.
Tipičan način zaobilaženja ovog problema je dodavanje javnih konstanti čije vrijednosti se pojavljuju u Javadoc:

    public class HashMap<K,V> {
      public static final int DEFAULT_CAPACITY = 16;
      public static final float DEFAULT_LOAD_FACTOR = 0.75;

      public HashMap(Map<? extends K,? extends V> m);
      /** Kreiraj novu HashMap s podrazumijevanim kapacitetom (16)
        * i loadFactor-om (0.75)
        */
      public HashMap();
      /** Kreiraj novu HashMap s podrazumijevanim loadFactor-om (0.75) */
      public HashMap(int initialCapacity);
      public HashMap(int initialCapacity, float loadFactor);
    }

Ovaj pristup umanjuje ponavljanje koda, ali je manje ekspresivan.

Scala ima direktnu podršku za ovaj problem:

    class HashMap[K,V](initialCapacity:Int = 16, loadFactor:Float = 0.75f) {
    }

    // Koristi podrazumijevane vrijednosti
    val m1 = new HashMap[String,Int]

    // initialCapacity 20, podrazumijevani loadFactor
    val m2 = new HashMap[String,Int](20)

    // prosljeđivanje obje vrijednosti
    val m3 = new HashMap[String,Int](20, 0.8f)

    // prosljeđivanje samo loadFactor preko
    // imenovanih parametara
    val m4 = new HashMap[String,Int](loadFactor = 0.8f)

Ovako možemo iskoristiti prednost *bilo koje* podrazumijevane vrijednosti korištenjem [imenovanih parametara]({{ site.baseurl }}/tutorials/tour/named-parameters.html).
