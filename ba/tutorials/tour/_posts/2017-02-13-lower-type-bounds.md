---
layout: inner-page-no-masthead
title: Donja granica tipa

disqus: true

tutorial: scala-tour
categories: tour
num: 20
outof: 33
language: ba
---

Dok [gornja granica tipa](upper-type-bounds.html) limitira tip na podtip nekog drugog tipa,
*donja granica tipa* limitira tip da bude nadtip nekog drugog tipa.
Izraz `T >: A` izražava tipski parametar `T` ili apstraktni tip `T` koji je nadtip tipa `A`.

Kroz slj. primjer vidjećemo zašto je ovo korisno:

    case class ListNode[T](h: T, t: ListNode[T]) {
      def head: T = h
      def tail: ListNode[T] = t
      def prepend(elem: T): ListNode[T] =
        ListNode(elem, this)
    }

Gornji program implementira povezanu listu s operacijom nadovezivanja (na početak liste).
Nažalost, ovaj tip je invarijantan u tipskom parametru `T`, klase `ListNode`;
tj. `ListNode[String]` nije podtip `ListNode[Any]`.
Pomoću [anotacija varijansi](variances.html) možemo izraziti navedeno:

    case class ListNode[+T](h: T, t: ListNode[T]) { ... }

Nažalost, ovaj program se ne može kompajlirati, jer anotacija za kovarijansu je jedino moguća ako se varijabla tipa koristi na kovarijantnoj poziciji (u ovom slučaju kao povratni tip).
Pošto je varijabla tipa `T` tipski parametar metode `prepend`, ovo pravilo je prekršeno.
Pomoću *donje granice tipa*, možemo implementirati operaciju nadovezivanja gdje se `T` pojavljuje samo u kovarijantnoj poziciji.

Ovo je odgovarajući kod:

    case class ListNode[+T](h: T, t: ListNode[T]) {
      def head: T = h
      def tail: ListNode[T] = t
      def prepend[U >: T](elem: U): ListNode[U] =
        ListNode(elem, this)
    }

_Napomena:_ nova `prepend` metoda ima manje restriktivan tip.
Ona dozvoljava, naprimjer, da se nadoveže objekt nadtipa na postojeću listu.
Rezultujuća lista biće lista ovog nadtipa.

Ovo je kod koji to ilustrira:

    object LowerBoundTest extends App {
      val empty: ListNode[Null] = ListNode(null, null)
      val strList: ListNode[String] = empty.prepend("hello")
                                           .prepend("world")
      val anyList: ListNode[Any] = strList.prepend(12345)
    }

