---
layout: tour
title: Uvod
language: ba

discourse: true

partof: scala-tour

num: 1

next-page: basics

---

Scala je moderan programski jezik koji spaja više paradigmi,
dizajniran da izrazi česte programske šablone kroz precizan, elegantan i tipski bezbjedan način.
Scala elegantno objedinjuje mogućnosti objektno orijentisanih i funkcionalnih jezika.

## Scala je objektno orijentisana ##
Scala je čisto objektno orijentisan jezik u smislu da je [svaka vrijednost objekt](unified-types.html).
Tipovi i ponašanja objekata se opisuju kroz [klase](classes.html) i [trejtove](traits.html).
Klase se proširuju nasljeđivanjem i fleksibilnim mehanizmom [kompozicije mixina](mixin-class-composition.html)
kao čistom zamjenom za višestruko nasljeđivanje.

## Scala je funkcionalna ##
Scala je također funkcionalni jezik u smislu da je [svaka funkcija vrijednost](unified-types.html).
Scala ima lahku sintaksu za definisanje anonimnih funkcija,
i podržava [funkcije višeg reda](higher-order-functions.html), omogućuje [ugnježdavanje funkcija](nested-functions.html),
i podržava [curry-jevanje](multiple-parameter-lists.html).
Scaline [case klase](case-classes.html) i njen mehanizam [podudaranja uzoraka](pattern-matching.html) modeluju algebarske tipove
koji se koriste u dosta funkcionalnih programskih jezika.
[Singlton objekti](singleton-objects.html) omogućuju pogodan način za grupisanje funkcija koje nisu članovi klase.

Nadalje, Scalin mehanizam podudaranja uzoraka (pattern-matching) prirodno podržava procesiranje XML podataka
pomoću [desno-ignorišućih uzoraka sekvenci](regular-expression-patterns.html),
i generalnim proširivanjem s [ekstraktor objektima](extractor-objects.html).
U ovom kontekstu, komprehensije sekvenci su korisne za izražavanje upita (query).
Ove mogućnosti čine Scalu idealnom za razvijanje aplikacija kao što su web servisi.

## Scala je statički tipizirana (statically typed) ##
Scala je opremljena ekspresivnim sistemom tipova koji primorava da se apstrakcije koriste na bezbjedan i smislen način.
Konkretno, sistem tipova podržava sljedeće:

* [generičke klase](generic-classes.html)
* [anotacije varijanse](variances.html)
* [gornje](upper-type-bounds.html) i [donje](lower-type-bounds.html) granice tipa,
* [unutarnje klase](inner-classes.html) i [apstraktne tipove](abstract-types.html) kao članove objekta
* [složene tipove](compound-types.html)
* [eksplicitno tipizirane samo-reference](self-types.html)
* implicitne [parametre](implicit-parameters.html) i [konverzije](implicit-conversions.html)
* [polimorfne metode](polymorphic-methods.html)

Mehanizam za [lokalno zaključivanje tipova](type-inference.html) se brine da korisnik ne mora pisati tipove varijabli
više nego što je potrebno.
U kombinaciji, ove mogućnosti su jaka podloga za bezbjedno ponovno iskorištenje programskih apstrakcija
i za tipski bezbjedno proširenje softvera.

## Scala je proširiva ##

U praksi, razvijanje domenski specifičnih aplikacija često zahtijeva i domenski specifične ekstenzije jezika.
Scala omogućuje jedinstvenu kombinaciju mehanizama jezika koji olakšavaju elegantno dodavanje novih
jezičkih konstrukcija u formi biblioteka.

Zajedničkom upotrebom obje mogućnosti olakšava definisanje novih izraza bez proširenja sintakse samog Scala jezika i bez
korištenja olakšica u vidu macro-a ili meta-programiranja.

Scala je dizajnirana za interoperabilnost s popularnim Java Runtime Environment (JRE).
Konkretno, interakcija s popularnim objektno orijentisanim Java programskim jezikom je prirodna.
Novije mogućnosti Jave kao [anotacije](annotations.html) i Javini generički tipovi imaju direktnu analogiju u Scali.
Scaline mogućnosti bez analogija u Javi, kao što su [podrazumijevani](default-parameter-values.html) i [imenovani parametri](named-arguments.html),
se kompajliraju što približnije Javi.
Scala ima isti kompilacijski model (posebno kompajliranje, dinamičko učitavanje klasa)
kao Java i time omogućuje pristupanje hiljadama postojećih visoko kvalitetnih biblioteka.

Molimo nastavite sa sljedećom stranicom za više informacija.
