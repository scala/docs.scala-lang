---
layout: singlepage-overview
title: Tutoriel Scala pour développeurs Java

partof: scala-for-java-programmers
language: fr
---

Par Michel Schinz and Philipp Haller.

Traduction et arrangements par Agnès Maury.

## Introduction

Ce document présente une introduction rapide au langage Scala et à son compilateur.
Il est destiné aux personnes ayant une expérience de programmation et qui souhaitent 
un aperçu de ce qu'ils peuvent faire avec Scala. On part du principe que le lecteur possède
des connaissances de base sur la programmation orientée objet, particulièrement sur Java.


## Un premier exemple

Commençons par écrire le célèbre programme *Hello world*. 
Bien que simple, il permet de découvrir plusieurs fonctionnalités du language
avec peu de connaissance préalable de Scala. Voilà à quoi il ressemble :

    object HelloWorld {
      def main(args: Array[String]): Unit = {
        println("Hello, world!")
      }
    }

La structure de ce programme devrait être familière pour les développeurs Java :
il consiste en une méthode appelée `main` qui prend les arguments de la ligne de commande,
une array de String, comme paramètre ; le corps de cette méthode consiste en un simple appel de la méthode
prédéfinie `println` avec le salut amical comme argument. Cette méthode `main` ne retourne pas de valeur.
Pourtant, son type de retour est déclaré comme `Unit`.

Ce qui est moins familier pour les développeurs Java est la déclaration `object` qui contient la méthode
`main`. Une telle déclaration introduit ce qui est communément connu comme un *objet singleton*, qui est une classe
avec une seule instance. La déclaration ci-dessus déclare à la fois une classe nommée `HelloWorld`
et une instance de cette classe, aussi nommée `HelloWorld`. Cette instance est créée sur demande, c'est-à-dire,
la première fois qu'elle est utilisée.

Le lecteur avisé a pu remarquer que la méthode `main` n'est pas déclarée en tant que `static`.
C'est parce que les membres statiques (membres ou champs) n'existent pas en Scala. Plutôt que de définir des
membres statiques, le développeur Scala déclare ces membres dans un objet singleton.

### Compiler l'exemple

Pour compiler cet exemple, nous utilisons `scalac`, le compilateur Scala.
`scalac` fonctionne comme la plupart des compilateurs : il prend comme argument un fichier source,
potentiellement certaines options, et produit un ou plusieurs fichiers objets.
Les fichiers objets produits sont des fichiers classes de Java classiques. 

Si nous sauvegardons le programme ci-dessus dans un fichier appelé `HelloWorld.scala`,
nous pouvons le compiler en exécutant la commande suivante (le symbole supérieur `>` représente 
l'invité de commandes et ne doit pas être écrit) :

    > scalac HelloWorld.scala

Cette commande va générer un certain nombre de fichiers class dans le répertoire courant.
L'un d'entre eux s'appellera `HelloWorld.class` et contiendra une classe qui pourra être directement exécutée
en utilisant la commande `scala`, comme décrit dans la section suivante.

### Exécuter l'exemple

Une fois compilé, le programme Scala peut être exécuté en utilisant la commande `scala`.
Son utilisation est très similaire à la commande `java` utilisée pour exécuter les programmes Java,
et qui accepte les mêmes options. L'exemple ci-dessus peut être exécuté en utilisant la commande suivante,
ce qui produit le résultat attendu :

    > scala -classpath . HelloWorld

    Hello, world!

## Interaction avec Java

L'une des forces du Scala est qu'il rend très facile l'interaction avec le code Java.
Toutes les classes du paquet `java.lang` sont importées par défaut, alors que les autres
doivent être importées explicitement.

Prenons l'exemple suivant. Nous voulons obtenir et formater la date actuelle
par rapport aux conventions utilisées dans un pays spécifique, par exemple la France.

Les librairies de classes Java définissent des classes utilitaires très puissantes, comme `Date`
et `DateFormat`. Comme Scala interagit avec Java, il n'y a pas besoin de ré-implémenter ces classes en Scala 
--nous pouvons simplement importer les classes des paquets correspondants de Java :

    import java.util.{Date, Locale}
    import java.text.DateFormat._

    object DateFrancaise {
      def main(args: Array[String]): Unit = {
        val maintenant = new Date
        val df = getDateInstance(LONG, Locale.FRANCE)
        println(df format maintenant)
      }
    }

Les déclarations d'import de Scala sont très similaires à celle de Java, cependant,
elles sont bien plus puissantes. Plusieurs classes peuvent être importées du même paquet en les plaçant
dans des accolades comme démontré dans la première ligne. Une autre différence notable est de pouvoir
importer tous les noms d'un paquet ou d'une classe en utilisant le symbole underscore (`_`) au lieu de
l'astérisque (`*`). C'est parce que l'astérisque est un identifiant valide en Scala (par exemple pour
un nom de méthode), comme nous le verrons plus tard.

Par conséquent, la déclaration d'importation dans la seconde ligne importe tous les membres de la classe 
`DateFormat`. Cela rend la méthode statique `getDateInstance` et le champ statique `LONG` 
directement visibles. 

Dans la méthode `main`, nous avons tout d'abord créé une instance de la classe Java `Date`
qui contient par défaut la date actuelle. Ensuite, nous définissons un format de date en utilisant la
méthode statique `getDateInstance` que nous avons importée précédemment. Enfin, nous imprimons
la date actuelle selon l'instance de `DateFormat` localisée. Cette dernière ligne montre une 
propriété intéressante de la syntaxe Scala. Les méthodes qui ne prennent en entrée qu'un seul argument
peuvent être utilisées avec une syntaxe infixe. C'est-à-dire que l'expression

    df format maintenant

est juste une autre façon moins verbeuse d'écrire l'expression

    df.format(maintenant)

Cela peut paraître comme un détail syntaxique mineur, mais il entraîne des conséquences importantes,
dont l'une va être explorée dans la section suivante.

Pour conclure cette section sur l'intégration avec Java, il faut noter qu'il est possible
d'hériter de classes Java et d'implémenter des interfaces Java directement en Scala.

## Tout est objet

Scala est un langage purement orienté objet dans le sens où *tout* est un objet,
y compris les nombres ou les fonctions. Cela diffère du Java dans cet aspect, car Java
distingue les types primitifs (comme `boolean` et `int`) des types référentiels.

### Les nombres sont des objets

Étant donné que les nombres sont des objets, ils ont aussi des méthodes.
De fait, une expression arithmétique comme la suivante :

    1 + 2 * 3 / x

consiste exclusivement en des appels de méthodes, parce qu'il est équivalent à l'expression 
suivante, comme nous l'avons vu dans la section précédente :

    1.+(2.*(3)./(x)

Cela veut aussi dire que `+`, `*`, etc. sont des identifiants valides en Scala.

### Les fonctions sont des objets

Les fonctions sont aussi des objets en Scala. C'est pourquoi il est possible de passer
des fonctions en arguments, de les stocker dans des variables et de les retourner depuis d'autres
fonctions. Cette capacité à manipuler les fonctions en tant que valeurs est l'une des
pierres angulaires d'un paradigme de programmation très intéressant nommé *programmation fonctionnelle*.

Pour illustrer à quel point il est peut être utile d'utiliser des fonctions en tant que valeurs,
considérons une fonction minuteur qui vise à performer une action toutes les secondes. Comment faire
pour passer au minuteur une action à performer ? En toute logique, comme une fonction. Ce concept de
passer une fonction devrait être familier à beaucoup de développeurs : il est souvent utilisé dans
le code d'interface utilisateur pour enregistrer des fonctions de rappel qui sont invoquées lorsque
certains évènements se produisent.

Dans le programme suivant, la fonction minuteur est appelée `uneFoisParSeconde` et prend comme argument
une fonction de rappel. Le type de cette fonction est écrit `() => Unit`. C'est le type de toutes les
fonctions qui ne prennent aucun argument et ne renvoie rien (le type `Unit` est similaire à `void` en C/C++).
La principale fonction de ce programme est d'appeler la fonction minuteur avec une fonction de rappel
qui imprime une phrase dans le terminal. Dans d'autres termes, ce programme imprime à l'infini la phrase
"le temps passe comme une flèche".

    object Minuteur {
      def uneFoisParSeconde(retour: () => Unit): Unit = {
        while (true) {
          retour()
          Thread sleep 1000
        }
      }
      
      def leTempsPasse(): Unit = {
        println("le temps passe comme une flèche")
      }
      
      def main(args: Array[String]): Unit = {
        uneFoisParSeconde(leTempsPasse)
      }
    }

Notez que pour imprimer la String, nous utilisons la méthode prédéfinie `println` au lieu
d'utiliser celle du paquet `System.out`.

#### Fonctions anonymes

Bien que ce programme soit facile à comprendre, il peut être affiné un peu plus.
Premièrement, notez que la fonction `leTempsPasse` est définie uniquement dans le but d'être
passée plus tard dans la fonction `uneFoisParSeconde`. Devoir nommer cette fonction qui ne va 
être utilisée qu'une fois peut sembler superflu et il serait plus agréable de pouvoir construire
cette fonction juste au moment où elle est passée à `uneFoisParSeconde`. C'est possible en Scala 
en utilisant des *fonctions anonymes*, ce qui correspond exactement à ça : des fonctions sans nom.
La version revisitée de notre programme minuteur en utilisant une fonction anonyme à la place de 
*leTempsPasse* ressemble à ça :

    object MinuteurAnonyme {
      def uneFoisParSeconde(retour: () => Unit): Unit = {
        while (true) {
          retour()
          Thread sleep 1000
        }
      }
      
      def main(args: Array[String]): Unit = {
        uneFoisParSeconde(
          () => println("le temps passe comme une flèche")
        )
      }
    }

La présence d'une fonction anonyme dans cet exemple est reconnaissable par la flèche pointant à droite
`=>` qui sépare la liste des arguments de la fonction de son corps. Dans cet exemple, la liste des
arguments est vide, comme en témoigne la paire de parenthèses vide à gauche de la flèche. Le corps
de cette fonction est le même que celui de `leTempsPasse` décrit plus haut.

## Classes

Comme nous l'avons vu plus tôt, Scala est un langage orienté objet et de ce fait, possède le concept de classe
(pour être plus exact, il existe certains langages orientés objet qui ne possèdent pas le concept de classe 
mais Scala n'en fait pas partie). Les classes en Scala sont déclarées en utilisant une syntaxe proche de
celle de Java. Une différence notable est que les classes en Scala peuvent avoir des paramètres.
Ceci est illustré dans la définition suivante des nombres complexes.

    class Complexe(reel: Double, imaginaire: Double) {
      def re() = reel
      def im() = imaginaire
    }

La classe `Complexe` prend en entrée deux arguments : la partie réelle et la partie imaginaire du
nombre complexe. Ces arguments peuvent être passés lors de la création d'une instance de `Complexe` comme
ceci :

    new Complexe(1.5, 2.3)  

La classe contient deux méthodes, appelées `re` et `im` qui donnent accès à ces deux parties.

Il faut noter que le type de retour de ces méthodes n'est pas explicitement donné. Il sera inféré
automatiquement par le compilateur, qui regarde la partie droite de ces méthodes et en déduit que chacune
de ces fonctions renvoie une valeur de type `Double`.

Le compilateur n'est pas toujours capable d'inférer des types comme il le fait ici et il n'y a 
malheureusement aucune règle simple pour savoir dans quel cas il est capable de le faire. En pratique,
ce n'est pas généralement un problème car le compilateur se plaint quand il n'est pas capable d'inférer
un type qui n'a pas été donné explicitement. Une règle simple que les développeurs débutant en Scala
devraient suivre est d'essayer d'omettre les déclarations de type qui semblent être faciles à
déduire et voir si le compilateur ne renvoie pas d'erreur. Après quelque temps, le développeur devrait
avoir une bonne idée de quand il peut omettre les types et quand il faut les spécifier explicitement.

### Les méthodes sans arguments

Un petit problème des méthodes `re` et `im` est qu'il faut mettre une paire de parenthèses vides après
leur nom pour les appeler, comme démontré dans l'exemple suivant :

    object NombresComplexes {
      def main(args: Array[String]): Unit = {
        val c = new Complexe(1.2, 3.4)
        println("partie imaginaire : " + c.im())
      }
    }

Il serait plus agréable de pouvoir accéder à la partie réelle et imaginaire comme si elles étaient des
champs, sans ajouter une paire de parenthèses vides. C'est parfaitement faisable en Scala, simplement en
les définissant comme des méthodes *sans argument*. De telles méthodes diffèrent des méthodes avec
aucun argument : elles n'ont pas de parenthèses après leur nom, que ce soit dans leur déclaration
ou lors de leur utilisation. Notre classe `Complexe` peut être réécrite de cette façon :

    class Complexe(reel: Double, imaginaire: Double) {
      def re = reel
      def im = imaginaire
    }


### Héritage et redéfinition

Toutes les classes en Scala héritent d'une super classe. Quand aucune super classe n'est spécifiée,
comme dans l'exemple `Complexe` de la section précédente, la classe `scala.AnyRef` est utilisée 
implicitement.

Il est possible de redéfinir les méthodes héritées d'une super classe en Scala. Cependant, il est 
obligatoire de spécifier explicitement qu'une méthode en redéfinit une autre en utilisant le 
modificateur `override` dans le but d'éviter les redéfinitions accidentelles. Dans notre exemple,
la classe `Complexe` peut être enrichie avec une redéfinition de la méthode `toString` héritée
de la classe `Object`.

    class Complexe(reel: Double, imaginaire: Double) {
      def re() = reel
      def im() = imaginaire
      override def toString() = "" + re + (if (im >= 0) "+" + im + "i" else "")
    }

Nous pouvons alors appeler la méthode `toString` redéfinie comme ci-dessus.

    object NombresComplexes {
      def main(args: Array[String]): Unit = {
        val c = new Complexe(1.2, 3.4)
        println("toString() redéfinie : " + c.toString)
      }
    }

## Les case class et le pattern matching

L'arbre est un type de structure de données qui revient souvent.
Par exemple, les interpréteurs et les compilateurs représentent généralement en interne les programmes
comme des arbres ; les documents XML sont des arbres ; et beaucoup de conteneurs sont basés sur des 
arbres, comme les arbres bicolores.

Nous allons maintenant examiner comment de tels arbres sont représentés et manipulés en Scala à travers
d'un petit programme de calculatrice. Le but de ce programme est de manipuler des expressions arithmétiques
simples composées de sommes, de constantes numériques et de variables. Deux exemples de telles expressions
sont `1+2` et `(x+x)+(7+y)`.

Nous devons d'abord décider d'une représentation pour de telles expressions.
La manière la plus naturelle est un arbre où chaque nœud représente une opération (ici, une addition) et
chaque feuille est une valeur (ici des constantes ou variables).

En Java, un tel arbre serait représenté par une super classe abstraite pour les arbres et une 
sous classe concrète pour chaque nœud et feuille. Dans un langage de programmation fonctionnelle,
on utiliserait plutôt un type de donnée algébrique pour faire la même chose. Scala fournit le concept de
*case class* qui est quelque part entre ces deux concepts. Voici comment elles peuvent être utilisées pour
définir le type des arbres pour notre exemple :

    abstract class Arbre
    case class Somme(l: Arbre, r: Arbre) extends Arbre
    case class Var(n: String) extends Arbre
    case class Const(v: Int) extends Arbre

Le fait que les classes `Somme`, `Var` et `Const` sont définies en tant que case class signifie qu'elles
différent des classes traditionnelles en différents points :

- le mot clé `new` n'est pas obligatoire lors de la création d'instance de ces classes (c'est-à-dire qu'on
  peut écrire `Const(5)` à la place de `new Const(5)`) ;
- les fonctions accesseurs sont automatiquement définies pour les paramètres du constructeur
  (c'est-à-dire qu'il est possible de récupérer la valeur du paramètre du constructeur `v` pour une instance `c` de 
  la classe `Const` en écrivant tout simplement `c.v`) ;
- une définition par défaut des méthodes `equals` et `hashCode` est fournie, qui se base sur la
  *structure* des instances et non pas leur identité ;
- une définition par défaut de la méthode `toString` est fournie et imprime la valeur "à la source"
  (par exemple, l'arbre pour l'expression `x+1` s'imprime comme `Somme(Var(x),Const(1))`) ;
- les instances de ces classes peuvent être décomposées avec un *pattern matching* (filtrage par motif)
  comme nous le verrons plus bas.
  
Maintenant que nous avons défini le type de données pour représenter nos expressions arithmétiques,
il est temps de définir des opérations pour les manipuler. Nous allons commencer par une fonction
pour évaluer une expression dans un certain *environnement*. Le but de cet environnement est de 
donner des valeurs aux variables. Par exemple, l'expression `x+1` évaluée dans un environnement qui
associe la valeur `5` à la variable `x`, écrit `{ x -> 5 }`, donne comme résultat `6`.

Il faut donc trouver un moyen de représenter ces environnements. Nous pouvons certes utiliser
une sorte de structure de données associatives comme une table de hashage, mais nous pouvons aussi
utiliser directement des fonctions ! Un environnement n'est ni plus ni moins qu'une fonction qui associe
une valeur à une variable. L'environnement `{ x -> 5 }` décrit plus tôt peut être écrit simplement comme
ceci en Scala :

    { case "x" => 5 }

Cette notation définit une fonction qui, quand on lui donne une String `"x"` en entrée, retourne l'entier
`5` et renvoie une exception dans les autres cas.

Avant d'écrire la fonction d'évaluation, donnons un nom au type de ces environnements.
Nous pouvons toujours utiliser le `String => Int` pour ces environnements mais cela simplifie
le programme si nous introduisons un nom pour ce type et rendra les modifications futures plus simples.
En Scala, on le réalise avec la notation suivante :

    type Environnement = String => Int

À partir de maintenant, le type `Environnement` peut être utilisé comme un alias comme
le type des fonctions de `String` à `Int`.

Maintenant, nous pouvons donner la définition de l'évaluation de fonction.
Théoriquement, c'est très simple : la valeur d'une somme de deux expressions
est tout simplement la somme des valeurs de ces expressions ; la valeur d'une 
variable est obtenue directement à partir de l'environnement ; la valeur d'une 
constante est la constante elle-même. Pour l'exprimer en Scala, ce n'est pas plus
compliqué :

    def eval(a: Arbre, env: Environnement): Int = a match {
      case Somme(l, r) => eval(l, env) + eval(r, env)
      case Var(n)      => env(n)
      case Const(v)    => v
    }

Cette fonction d'évaluation fonctionne en effectuant un pattern matching
sur l'arbre `a`. De façon intuitive, la signification de la définition ci-dessus
devrait être claire :

1. Tout d'abord, il vérifie si l'arbre `a` est une `Somme`. Si c'est le cas,
   il relie le sous arbre de gauche à une nouvelle variable appelée `l` et
   le sous arbre de gauche à une variable appelée `r`. Ensuite, il traite 
   l'expression à droite de la flèche : cette expression peut
   utiliser (dans notre exemple, c'est le cas) les deux variables `l` et `r` extraites dans le
   motif décrit à gauche de la flèche ;
2. Si la première vérification échoue, c'est-à-dire que l'arbre n'est pas une `Somme`,
   on continue et on vérifie si `a` est une `Var`. Si c'est le cas,
   il relie le nom contenu dans le nœud `Var` à une variable `n` et
   il traite l'expression à droite de la flèche ;  
3. Si la deuxième vérification échoue, c'est-à-dire que l'arbre n'est ni
   une `Somme` ni une `Var`, on vérifie si l'arbre est un `Const`. Si
   c'est le cas, il relie la valeur contenue dans le nœud `Const` à une
   variable `v` et il traite l'expression à droite de la flèche ;
4. Enfin, si toutes les vérifications échouent, une exception est levée pour signaler
   l'échec de l'expression. Dans notre cas, cela pourrait arriver si
   d'autres sous classes de `Arbre` étaient déclarées.
   
Nous observons que l'idée basique du pattern matching est de faire correspondre
une valeur à une série de motifs et dès qu'un motif correspond, extraire 
et nommer les différentes parties de la valeur pour enfin évaluer du
code qui, généralement, utilise ces parties nommées.

Un développeur orienté objet chevronné pourrait se demander pourquoi nous n'avions pas
défini `eval` comme une *méthode* de la classe `Arbre` et de ces
sous classes. En effet, nous aurions pu le faire, étant donné que Scala autorise
la définition de méthodes dans les case class tout comme dans les classes normales.
Décider d'utiliser un pattern matching ou des méthodes est donc une question de
goût mais a aussi des implications importantes sur l'extensibilité :

- quand on utilise des méthodes, il est facile d'ajouter un nouveau type de nœud en même temps
  qu'une nouvelle sous classe de `Arbre` est définie. Par contre,
  ajouter une nouvelle opération pour manipuler un arbre est
  fastidieux car il demande de modifier toutes les sous classes de `Arbre` ;
- quand on utilise un pattern matching, la situation est inversée : ajouter un
  nouveau type de nœud demande la modification de toutes les fonctions qui effectuent
  un pattern matching sur un arbre pour prendre en compte le nouveau nœud.
  Par contre, ajouter une nouvelle opération est facile en la définissant
  en tant que fonction indépendante.

Pour explorer plus loin dans le pattern matching, définissons une autre opération
sur les expressions arithmétiques : la dérivée de fonction. Le lecteur doit 
garder à l'esprit les règles suivantes par rapport à cette opération :

1. la dérivée d'une somme est la somme des dérivées ;
2. la dérivée d'une variable `v` est 1 si `v` est égale la
   variable utilisée pour la dérivation et zéro sinon ;
3. la dérivée d'une constante est zéro.

Ces règles peuvent presque être traduites littéralement en du code Scala
pour obtenir la définition suivante :

    def derivee(a: Arbres, v: String): Arbres = a match {
      case Somme(l, r) => Somme(derivee(l, v), derivee(r, v))
      case Var(n) if (v == n) => Const(1)
      case _ => Const(0)
    }

Cette fonction introduit deux nouveaux concepts reliés au pattern matching.

Premièrement, l'expression `case` qui peut être utilisé avec un *garde* qui suit le mot clé `if`.
Ce garde empêche le pattern matching de réussir à moins que l'expression soit vraie. Ici, il est utilisé
pour s'assurer qu'on retourne la constante `1` uniquement si le nom de 
la variable se faisant dériver est la même que la variable de dérivation
`v`. La seconde nouvelle fonctionnalité du pattern matching utilisée ici est 
le motif *joker*, représenté par `_`, qui est un motif correspondant à
n'importe quelle valeur sans lui donner un nom.

Nous n'avons pas encore exploré l'étendue du pouvoir du pattern matching, mais nous
nous arrêterons ici afin de garder ce document court. Nous voulons toujours
voir comment les deux fonctions ci-dessus fonctionnent dans un exemple réel. Pour se
faire, écrivons une fonction `main` simple qui effectue plusieurs opérations sur l'expression
`(x+x)+(7+y)` : elle évalue tout d'abord sa valeur dans l'environnement
`{ x -> 5, y -> 7 }` puis on la dérive par rapport à `x` et par rapport à `y`.

    def main(args: Array[String]): Unit = {
      val exp: Arbre = Somme(Somme(Var("x"),Var("x")),Somme(Const(7),Var("y")))
      val env: Environnement = { case "x" => 5 case "y" => 7 }
      println("Expression : " + exp)
      println("Évaluation avec x=5, y=7 : " + eval(exp, env))
      println("Dérivée par rapport à x :\n " + derivee(exp, "x"))
      println("Dérivée par rapport à y :\n " + derivee(exp, "y"))
    }

Vous devrez envelopper le type `Environnement` et les méthodes`eval`, `derivee` et `main`
dans un objet `Calc` avant de compiler. En exécutant ce programme, on obtient le résultat attendu :

    Expression : Somme(Somme(Var(x),Var(x)),Somme(Const(7),Var(y)))
    Évaluation avec x=5, y=7 : 24
    Dérivée par rapport à x :
     Somme(Somme(Const(1),Const(1)),Somme(Const(0),Const(0)))
    Dérivée par rapport à y :
     Somme(Somme(Const(0),Const(0)),Somme(Const(0),Const(1)))

En examinant la sortie, on voit que le résultat de la dérivée devrait être simplifiée avant
d'être présentée à l'utilisateur. Définir une simplification basique en utilisant
un pattern matching est un problème intéressant (mais curieusement délicat), laissé
comme exercice pour le lecteur.

## Traits

Hormis le fait d'hériter du code d'une super classe, une classe Scala peut aussi
importer du code d'un ou de plusieurs *traits*.

Peut-être que le moyen le plus simple pour un développeur Java de comprendre les traits
est de le voir comme une interface qui peut aussi contenir du code. En
Scala, quand une classe hérite d'un trait, elle implémente son interface et
hérite de tout le code contenu dans ce trait.

Notez que depuis Java 8, les interfaces Java peut aussi contenir du code, soit
en utilisant le mot clé `default` soit avec des méthodes statiques.

Pour s'apercevoir de l'utilité des traits, regardons un exemple classique :
les objets ordonnés. Il est souvent utile de pouvoir comparer des objets
d'une même classe, par exemple pour les trier. En Java,
les objets qui sont comparables implémentent l'interface `Comparable`.
En Scala, on peut faire un peu mieux qu'en Java en définissant
notre équivalent de `Comparable` en tant que trait, qu'on appellera
`Ord`.

Quand on compare des objets, six différents prédicats peuvent être utiles :
plus petit, plus petit ou égal, égal, inégal, plus grand, plus grand ou égal.
Cependant, tous les définir est fastidieux, surtout que quatre de ces six 
prédicats peuvent être exprimés en utilisant les deux restantes. En effet,
en utilisant les prédicats égal et plus petit (par exemple), on peut 
exprimer les autres. En Scala, toutes ces observations peuvent être
capturées dans la déclaration de trait suivante :

    trait Ord {
      def < (that: Any): Boolean
      def <=(that: Any): Boolean =  (this < that) || (this == that)
      def > (that: Any): Boolean = !(this <= that)
      def >=(that: Any): Boolean = !(this < that)
    }

Cette définition crée à la fois un nouveau type appelé `Ord`,
qui joue un rôle similaire à l'interface Java `Comparable`, et
des implémentations par défaut de trois prédicats par rapport à un
quatrième prédicat abstrait. Les prédicats d'égalité et d'inégalité n'apparaissent pas
ici vu qu'ils sont présents par défaut dans tous les objets.

Le type `Any` qui est utilisé plus haut est le type
qui est le super type de tous les autres types en Scala. Il peut être vu comme une
version plus générale du type Java `Object`, puisqu'il est aussi un
super type de types basic comme `Int`, `Float`, etc.

Pour rendre les objets d'une classes comparables, il est alors suffisant de
définir les prédicats qui testent l'égalité et l'infériorité, puis les mixer
dans la classe `Ord` ci-dessus. Comme exemple, définissons une
classe `Date` qui représente les dates dans le calendrier grégorien. Elles
sont composées d'un jour, un mois et une année, que nous allons
représenter avec des entiers. Nous commençons toutefois la définition de la
classe `Date` comme ceci :

    class Date(a: Int, m: Int, j: Int) extends Ord {
      def annee = a
      def mois = m
      def jour = j
      override def toString(): String = annee + "-" + mois + "-" + jour

La partie importante ici est la déclaration `extends Ord` qui
suit le nom de la classe et ses paramètres. Cela veut dire que la
classe `Date` hérite du trait `Ord`.

Ensuite, nous redéfinissons la méthode `equals`, héritée de `Object`,
pour comparer correctement les dates en comparant leur
champs individuels. L'implémentation par défaut de `equals` n'est pas
utilisable, car en Java, elle compare les objets physiquement. On arrive
à la définition suivante :

    override def equals(that: Any): Boolean =
      that.isInstanceOf[Date] && {
        val d = that.asInstanceOf[Date]
        d.jour == jour && d.mois == mois && d.annee == annee
      }

Cette méthode utilise les méthodes prédéfinies `isInstanceOf` et
`asInstanceOf`. La première méthode, `isInstanceOf` correspond à l'opérateur
Java `instanceof` et retourne true si et seulement si l'objet
sur lequel elle est appliquée est une instance du type donné.
La deuxième, `asInstanceOf`, correspond à l'opérateur de conversion de type :
si l'objet est une instance du type donné, il est vu en tant que tel,
sinon une `ClassCastException` est levée.

Enfin, la dernière méthode à définir est le prédicat qui teste l'infériorité
comme décrit plus loin. Elle utilise une autre méthode,
`error` du paquet `scala.sys`, qui lève une exception avec le message d'erreur donné.

    def <(that: Any): Boolean = {
      if (!that.isInstanceOf[Date])
        sys.error("on ne peut pas comparer " + that + " et une Date")

      val d = that.asInstanceOf[Date]
      (annee < d.annee) ||
      (annee == d.annee && (mois < d.mois ||
                         (mois == d.mois && jour < d.jour)))
    }

Cela complète la définition de la classe `Date`. Les instances de 
cette classe peuvent être vues soit comme des dates, soit comme des objets comparables.
De plus, elles définissent les six prédicats de comparaison mentionnés
ci-dessus : `equals` et `<` car elles apparaissent directement dans
la définition de la classe `Date`, ainsi que les autres qui sont directement héritées du trait `Ord`.

Bien sûr, les traits sont utiles dans d'autres situations que celle décrite ici,
mais discuter de leurs applications plus amplement est hors de la
portée de document.

## Généricité

La dernière caractéristique de Scala que nous allons explorer dans ce tutoriel est
la généricité. Les développeurs Java devraient être conscients des problèmes
posés par le manque de généricité dans leur langage, une lacune qui
a été compensée avec Java 1.5.

La généricité est la capacité d'écrire du code paramétrisé par des types. Par
exemple, un développeur qui écrit une librairie pour des listes liées fait face au
problème de décider quel type donner aux éléments de la liste.
Comme cette liste est destinée à être utilisée dans divers contextes, il n'est
pas possible de décider quel type doit avoir les éléments de liste, par exemple,
`Int`. Ce serait complètement arbitraire et excessivement restrictif.

Les développeurs Java se retrouvent à utiliser `Object`, le super type de 
tous les objets. Cependant, cette solution est loin d'être
idéale, puisqu'elle ne marche pas pour les types basiques (`int`,
`long`, `float`, etc.) et cela implique que le développeur
devra faire un certain nombre de conversions de types. 

Scala rend possible la définition de classes (et de méthodes) génériques pour
résoudre ce problème. Examinons ceci au travers d'un exemple d'une
classes conteneur la plus simple possible : une référence, qui peut être
vide ou pointer vers un objet typé. 

    class Reference[T] {
      private var contenu: T = _
      def set(valeur: T) { contenu = valeur }
      def get: T = contenu
    }

La classe `Reference` est paramétrisé par un type appelé `T`
qui est le type de son élément. Ce type est utilisé dans le corps de la
classe en tant que de la variable `contenu`, l'argument de la méthode
`set` et le type de retour de la méthode `get`.

L'échantillon de code ci-dessus introduit les variables en Scala, ce qui ne devrait pas
demander plus d'explications. Cependant, il est intéressant de voir que
la valeur initiale donnée à la variable est `_` qui représente 
une valeur par défaut. Cette valeur par défaut est 0 pour les types numériques,
`false` pour le type `Boolean`, `()` pour le type `Unit`
et `null` pour tous les types d'objet.

Pour utiliser cette classe `Reference`, il faut spécifier quel type utiliser
pour le type paramètre `T`, le type de l'élément contenu dans la cellule.
Par exemple, pour créer et utiliser une cellule contenant
un entier, on peut écrire :

    object ReferenceEntier {
      def main(args: Array[String]): Unit = {
        val cellule = new Reference[Int]
        cellule.set(13)
        println("La référence contient la moitié de " + (cellule.get * 2))
      }
    }

Comme on peut le voir dans l'exemple, il n'est pas nécessaire de convertir la valeur
retournée par la méthode `get` avant de pouvoir l'utiliser en tant qu'entier. Il
n'est pas possible de stocker autre chose d'un entier dans cette
cellule particulière, puisqu'elle a été déclarée comme portant un entier.

## Conclusion

Ce document donne un rapide aperçu du langage Scala et
présente quelques exemples basiques. Le développeur intéressé peut poursuivre sa lecture,
par exemple, en lisant le *[Tour of Scala](https://docs.scala-lang.org/tour/tour-of-scala.html)*
(document en anglais) et consulter la *spécification du langage Scala* si nécessaire.
