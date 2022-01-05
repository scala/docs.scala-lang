---
layout: tour
title: Higher-order Functions
partof: scala-tour

num: 10

language: fr

next-page: nested-functions
previous-page: mixin-class-composition
---

Les fonctions d'ordre supérieur prennent d'autres fonctions en paramètres ou retournent une fonction en résultat. 
C'est possible car les fonctions sont des valeurs de première classe en Scala.
La terminologie peut devenir une peu confuse à ce point, et nous utilisons l'expression "fonction d'ordre supérieur" à la fois pour les méthodes et les fonctions qui prennent d'autres fonctions en paramètres ou retournent une fonction en résultat. 

Dans le monde du pur orienté objet, une bonne pratique est d'éviter d'exposer des méthodes paramétrées avec des fonctions qui pourraient exposer l'état interne de l'objet. Le fait d’exposer l'état interne de l'objet pourrait casser les invariants de l'objet lui-même ce qui violerait l'encapsulation.

Un des exemples les plus communs est la fonction d'ordre supérieur `map` qui est diponible pour les collections en Scala.

```scala mdoc
val salaries = Seq(20000, 70000, 40000)
val doubleSalary = (x: Int) => x * 2
val newSalaries = salaries.map(doubleSalary) // List(40000, 140000, 80000)
```

`doubleSalary` est une fonction qui prend un seul entier, `x` et retourne `x * 2`. La partie à gauche de la flèche `=>` est la liste de paramètres, et la valeur de l'expression à droite est ce qui est retourné. Sur la ligne 3, la fonction `doubleSalary` est appliquée à chaque élément dans la liste des salariés.

Pour réduire le code, nous pouvons faire une fonction anonyme et la passer directement en argument de `map` :

```scala:nest
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(x => x * 2) // List(40000, 140000, 80000)
```

Notez comment `x` n'est pas déclaré comme un Int dans l'exemple ci-dessus. C'est parce que le compilateur peut inférrer le type en se basant sur le type que le fonction map souhaiterait. (voir [Currying](/tour/multiple-parameter-lists.html)). Une autre façon d'écrire le même morceau de code encore plus idiomatique serait : 

```scala mdoc:nest
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(_ * 2)
```

Sachant que le compilateur Scala sait déjà quel est le type des paramètres (un seul `Int`), vous pouvez fournir uniquement la partie de droite de la fonction.
La seule contrepartie c'est que vous devez utiliser `_` à la place du nom du paramètre (c'était `x` dans l'exemple précédent).

## Convertir les méthodes en fonctions

Il est aussi possible de passer des méthodes comme arguments aux fonctions d'ordre supérieur, parce que le compilateur Scala va convertir la méthode en fonction.

```scala mdoc
case class WeeklyWeatherForecast(temperatures: Seq[Double]) {

  private def convertCtoF(temp: Double) = temp * 1.8 + 32

  def forecastInFahrenheit: Seq[Double] = temperatures.map(convertCtoF) // <-- passing the method convertCtoF
}
```

Ici la méthode `convertCtoF` est passée à la fonction d'ordre supérieur `map`. C'est possible car le compilateur convertit `convertCtoF` vers la fonction `x => convertCtoF(x)` (note : `x` sera un nom généré qui sera garanti d'être unique dans le scope).

## Les fonction qui acceptent des fonctions

Une raison d'utiliser les fonctions d'ordre supérieur est de réduire le code redondant. Suposons que vous souhaitez des méthodes qui augmentent le salaire de quelqu'un en fonction de différents facteurs. Sans créer de fonction d'ordre supérieur, cela ressemblerait à ça :

```scala mdoc
object SalaryRaiser {

  def smallPromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * 1.1)

  def greatPromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * math.log(salary))

  def hugePromotion(salaries: List[Double]): List[Double] =
    salaries.map(salary => salary * salary)
}
```

Notez comment chacunes de ces trois méthodes ne changent que par le facteur de multiplication.
Pour simplifier, vous pouvez extraire et répéter le code dans une fonction d'ordre supérieur comme ceci :

```scala mdoc:nest
object SalaryRaiser {

  private def promotion(salaries: List[Double], promotionFunction: Double => Double): List[Double] =
    salaries.map(promotionFunction)

  def smallPromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * 1.1)

  def greatPromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * math.log(salary))

  def hugePromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * salary)
}
```

La nouvelle méthode, `promotion`, prend les salaires plus une fonction du type `Double => Double` (càd. une fonction qui prend un Double et retourne un Double) et retourne le produit.

Les méthodes et les fonctions expriment généralement des comportements ou des transformations de données, donc avoir des fonctions qui composent en se basant sur d'autres fonctions peut aider à construire des mécanismes génériques. Ces opérations génériques reportent le verrouillage de l'intégralité du comportement de l'opération, donnant aux clients un moyen de contrôler ou de personnaliser davantage certaines parties de l'opération elle-même.

## Les fonctions qui retournent des fonctions

Il y a certains cas ou vous voulez générer une fonction. Voici un exemple de méthode qui retourne une fonction.

```scala mdoc
def urlBuilder(ssl: Boolean, domainName: String): (String, String) => String = {
  val schema = if (ssl) "https://" else "http://"
  (endpoint: String, query: String) => s"$schema$domainName/$endpoint?$query"
}

val domainName = "www.example.com"
def getURL = urlBuilder(ssl=true, domainName)
val endpoint = "users"
val query = "id=1"
val url = getURL(endpoint, query) // "https://www.example.com/users?id=1": String
```

Notez le type de retour de urlBuilder `(String, String) => String`. Cela veut dire que la fonction anonyme retournée prend deux Strings et retourne une String. Dans ce cas, la fonction anonyme retournée est `(endpoint: String, query: String) => s"https://www.example.com/$endpoint?$query"`

Traduit par Antoine Pointeau.