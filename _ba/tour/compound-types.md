---
layout: tour
title: Složeni tipovi
language: ba
partof: scala-tour

num: 24
next-page: self-types
previous-page: abstract-type-members

---

Ponekad je potrebno izraziti da je tip objekta podtip nekoliko drugih tipova. 
U Scali ovo može biti izraženo pomoću *složenih tipova*, koji su presjeci tipova objekata.

Pretpostavimo da imamo dva trejta: `Cloneable` i `Resetable`:

```scala mdoc
trait Cloneable extends java.lang.Cloneable {
  override def clone(): Cloneable = {
    super.clone().asInstanceOf[Cloneable]
  }
}
trait Resetable {
  def reset: Unit
}
```

Pretpostavimo da želimo napisati funkciju `cloneAndReset` koja prima objekt, klonira ga i resetuje originalni objekt:

```
def cloneAndReset(obj: ?): Cloneable = {
  val cloned = obj.clone()
  obj.reset
  cloned
}
```

Postavlja se pitanje koji bi trebao biti tip parametra `obj`.
Ako je `Cloneable` onda objekt može biti `clone`-iran, ali ne i `reset`-ovan; 
ako je `Resetable` onda se može `reset`, ali ne i `clone`. 
Da bi izbjegli kastovanje tipa u ovoj situaciji, možemo navesti tip `obj` da bude oboje `Cloneable` i `Resetable`. 
Ovaj složeni tip u Scali se piše kao: `Cloneable with Resetable`.

Ovo je ažurirana funkcija:

```
def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
  //...
}
```

Složeni tipovi mogu se sastojati od više tipova i mogu imati jednu rafinaciju koja može biti korištena da suzi potpis postojećih članova objekta.
General forma je: `A with B with C ... { refinement }`

Primjer za upotrebu rafinacije dat je na stranici o [apstraktnim tipovima](abstract-type-members.html). 
