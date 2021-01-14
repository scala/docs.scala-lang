---
layout: tour
title: Funkcje wyższego rzędu
partof: scala-tour

num: 10
language: pl
next-page: nested-functions
previous-page: mixin-class-composition
---

Scala pozwala na definiowanie funkcji wyższego rzędu.
Są to funkcje, które przyjmują funkcje jako parametry lub których wynik również jest funkcją. 
Jest to możliwe, ponieważ w Scali funkcje są wartościami pierwszej kategorii (first-class values).
Terminologia może w tym momencie wydawać się niejasna, pojęcie "funkcja wyższego rzędu" będzie używane zarówno dla metod jak i funkcji przyjmujących jako parametry funkcje lub zwracających inne funkcje.

Jednym z najczęściej spotykanych przykładów funkcji wyższego rzędu jest funkcja `map`, która dostępna jest dla kolekcji w Scali. 

```scala mdoc
val salaries = Seq(20000, 70000, 40000)
val doubleSalary = (x: Int) => x * 2
val newSalaries = salaries.map(doubleSalary) // List(40000, 140000, 80000)
```

Funkcja `doubleSalary` przyjmuje jako parametr wartość `x` typu `Int` i zwraca `x * 2`.
Ogólnie mówiąc, krotka po lewej stronie strzałki `=>` jest listą parametrów, a wartość wyrażenia po prawej stronie jest tym, co zostanie zwrócone.
W trzecim wierszu funkcja `doubleSalary` zostaje zastosowana na każdym elemencie listy `salaries`.

Aby zredukować trochę kod, możemy dodatkowo użyć funkcji anonimowej i przekazać ją bezpośrednio jako argument do funkcji `map`:

```
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(x => x * 2) // List(40000, 140000, 80000)
```

Zauważ, że w powyższym przykładzie `x` nie jest zadeklarowane jako typ `Int`.
Dzieje się tak, ponieważ kompilator może wywnioskować typ, bazując na typie funkcji oczekiwanej przez `map`.
Poniżej jeszcze bardziej idiomatyczny sposób napisania tego kodu:

```scala mdoc:nest
val salaries = Seq(20000, 70000, 40000)
val newSalaries = salaries.map(_ * 2)
```

Ponieważ kompilator Scali zna typ parametru (pojedynczy Int), wystarczy jedynie dostarczyć prawą stronę funkcji.
Jedyne zastrzeżenie jest takie, że należy użyć `_` zamiast nazwy parametru (w poprzednim przykładzie było to `x`).

## Konwertowanie metod w funkcje
Możliwe jest, aby przekazać metody jako argumenty do funkcji wyższego rzędu.
Kompilator automatycznie przekonwertuje metodę w funkcję.

```
case class WeeklyWeatherForecast(temperatures: Seq[Double]) {

  private def convertCtoF(temp: Double) = temp * 1.8 + 32

  def forecastInFahrenheit: Seq[Double] = temperatures.map(convertCtoF) // <-- przekazanie metody convertCtoF
}
```

W tym przykładzie metoda `convertCtoF` jest przekazana do funkcji `forecastInFahrenheit`.
Jest to możliwe, ponieważ kompilator konwertuje metodę `convertCtoF` w funkcję `x => convertCtoF(x)` (uwaga: `x` będzie tutaj wygenerowaną nazwą, która na pewno będzie unikalna w swoim zakresie).

## Funkcje przyjmujące inne funkcje

Jednym z powodów użycia funkcji wyższego rzędu jest zredukowanie nadmiarowego kodu.
Powiedzmy, że chcemy stworzyć metody, które potrafią zwiększyć czyjeś wynagrodzenie wg. jakiegoś współczynnika.
Bez użycia funkcji wyższego rzędu mogłoby to wyglądać w następujący sposób:

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

Zauważ, że każda z trzech metod różni się jedynie współczynnikiem z jakim zmienia wynagrodzenie.
Aby to uprościć, możemy wydzielić powtórzony kod do funkcji wyższego rzędu:

```scala mdoc:nest
object SalaryRaiser {

  private def promotion(salaries: List[Double], promotionFunction: Double => Double): List[Double] =
    salaries.map(promotionFunction)

  def smallPromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * 1.1)

  def bigPromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * math.log(salary))

  def hugePromotion(salaries: List[Double]): List[Double] =
    promotion(salaries, salary => salary * salary)
}
```

Nowa metoda, `promotion`, przyjmuje jako parametr listę wynagrodzeń oraz funkcję typu `Double => Double` (funkcję, która przyjmuje jako parametr Double i zwraca Double) oraz zwraca produkt.

## Funkcje zwracające inne funkcje

Istnieją pewne sytuacje, kiedy chcemy wygenerować jakieś funkcje.
Oto przykład funkcji zwracającej inną funkcję.

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

Zwróć uwagę na typ zwracany funkcji `urlBuilder` - jest to `(String, String) => String`.
Oznacza to, że `urlBuilder` zwraca funkcję anonimową biorącą jako parametry dwie wartości typu String i zwracającą String.
W tym wypadku zwracaną funkcją jest `(endpoint: String, query: String) => s"https://www.example.com/$endpoint?$query"`.
