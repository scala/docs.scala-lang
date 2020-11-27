---
layout: tour
title: Introduction
partof: scala-tour

num: 1
language: fr
next-page: basics

---

## Bienvenue au tour
Ce tour contient une introduction morceaux par morceaux aux fonctionnalités les plus fréquemment
utilisées en Scala. Il est adressé aux novices de Scala.

Ceci est un bref tour du language, non pas un tutoriel complet.
Si vous recherchez un guide plus détaillé, il est préférable d'opter pour [un livre](/books.html) ou de consulter
[d'autres ressources](/learn.html).

## Qu'est-ce que le Scala ?
Scala est un langage de programmation à multiples paradigmes désigné pour exprimer des motifs de programmation communs de
façon concise, élégante et robuste. Il intègre sans problème les fonctionnalités des langages orientés objet et des
langages fonctionnels.

## Scala est orienté objet ##
Scala est un langage purement orienté objet dans le sens où [toute valeur est un objet](unified-types.html).
Les types et les comportements de ces objets sont décrits par des [classes](classes.html) et des trait [traits](traits.html).
Les classes peuvent être étendues à travers des sous-classes et grâce à un système flexible de [composition de classes](mixin-class-composition.html).

## Scala est fonctionnel ##
Scala est également un langage fonctionnel dans le sen où [toute fonction est une valeur](unified-types.html).
Scala propose une [syntaxe légère](basics.html) pour définir des fonctions anonymes, supporte des
[fonctions de haut niveau](higher-order-functions.html), autorise les fonctions [imbriquées](nested-functions.html) et
supporte le [currying](multiple-parameter-lists.html).
Les [case class](case-classes.html) de Scala et leur système intégré de [reconnaissance de motifs](pattern-matching.html)
permettent de construire des types algébriques utilisés dans de nombreux langages de programmation.
Les [objets singleton](singleton-objects.html) fournissent une façon pratique de regrouper des fonctions qui ne sont pas
membres d'une classe.

De plus, la notion de reconnaissance de motifs de Scala s'étend naturellement au 
[traitement des données XML](https://github.com/scala/scala-xml/wiki/XML-Processing) avec l'aide des
[patrons d'expressions régulières](regular-expression-patterns.html), grâce à une extension générale via des
[objets extracteurs](extractor-objects.html). Dans ce contexte, les [for comprehensions](for-comprehensions.html) sont
utiles pour formuler des requêtes. Ces fonctionnalités font de Scala un langage idéal pour développer des applications
comme des services Web.

## Scala est fortement typé ##
A la compilation, le système de type expressif de Scala renforce l'utilisation des abstractions d'une manière
sécurisée et cohérente. En particulier, ce système de type supporte :

* Les [classes génériques](generic-classes.html)
* Les [annotations variables](variances.html)
* Les limites de type [supérieures](upper-type-bounds.html) and [inférieures](lower-type-bounds.html)
* Les [classes internes](inner-classes.html) et les membres d'objets de [types abstraits](abstract-type-members.html)
* Les [types composés](compound-types.html)
* Les [auto-références explicitement typées](self-types.html)
* Les [paramètres](implicit-parameters.html) et les [conversions](implicit-conversions.html) implicites
* Les [méthodes polymorphiques](polymorphic-methods.html)

L'[inférence de type](type-inference.html) signifie que l'utilisateur n'est pas obligé d'annoter son code avec des
informations redondantes. Rassemblées, toutes ces fonctionnalités fournissent une base solide pour la ré-utilisation
sécurisée d'abstractions de programmation et pour une extension sûre au niveau des types de programme.

## Scala est extensible ##

En pratique, le développement d'applications dans un domaine spécifique demande souvent des extensions de langage propre
à ce domaine. Scala fournit une combinaison de mécaniques de langage unique qui rend simple l'ajout de nouvelles
constructions de langage avec l'importation de nouvelles librairies.

Dans beaucoup de cas, cela peut être fait sans utiliser des outils de méta-programmation, comme les macros.
En voici quelques exemples :

* Les [classes implicites](/overviews/core/implicit-classes.html) permettent d'ajouter des méthodes supplémentaires à des types existants.
* L'[interpolation de String](/overviews/core/string-interpolation.html) est extensible par l'utilisateur avec des interpolateurs personnalisés.

## Scala interagit ##

Scala est conçu pour interagir proprement avec le populaire Java Runtime Environment (JRE). En particulier, l'interaction
avec le langage de programmation orienté objet le plus populaire du moment, Java, est la plus transparente possible.
Les nouvelles fonctionnalités Java comme les SAMs, les [lambdas](higher-order-functions.html), les [annotations](annotations.html),
et les [classes génériques](generic-classes.html) ont des équivalents directs en Scala.

Il existe des fonctionnalités Scala sans équivalent Java, comme les [valeurs par défaut](default-parameter-values.html) et les
[paramètres nommés](named-arguments.html), qui se compilent d'une façon la plus proche de Java possible. Scala possède le
même modèle de compilation que Java (compilation séparée, chargement dynamique des classes) et permet d'avoir accès à des
milliers de librairies de haute qualité.

## Bon tour !

Merci de continuer à la [page suivante](basics.html) pour en savoir plus.
