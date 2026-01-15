---
layout: singlepage-overview
title: Démarrage
partof: getting-started
language: fr
includeTOC: true
---

Les instructions ci-dessous couvrent à la fois Scala 2 et Scala 3.

## Essayer Scala sans installation

Pour commencer à expérimenter Scala sans plus attendre, utilisez <a href="https://scastie.scala-lang.org/pEBYc5VMT02wAGaDrfLnyw" target="_blank">“Scastie” dans votre navigateur</a> _Scastie_ est un environnement "bac à sable" en ligne, où vous pouvez tester Scala, afin de comprendre comment fonctionne le langage et avec un accès à tous les compilateurs Scala et les librairies publiées.

> Scastie supporte à la fois Scala 2 et Scala 3, en proposant Scala 3 par défaut.
> Si vous cherchez à tester un morceau de code avec Scala 2
> [cliquez ici](https://scastie.scala-lang.org/MHc7C9iiTbGfeSAvg8CKAA).

## Installer Scala sur votre ordinateur

Installer Scala veut dire installer différents outils en ligne de commande, comme le compilateur Scala et les outils de build.
Nous recommandons l'utilisation de l'outil d'installation "Coursier" qui va automatiquement installer toutes les dépendances, mais vous pouvez aussi installer chaque outil à la main.

### Utilisation de l'installateur Scala (recommandé)

L'installateur Scala est un outil nommé [Coursier](https://get-coursier.io/docs/cli-overview), la commande principale de l'outil est `cs`.
Il s'assure que la JVM est les outils standards de Scala sont installés sur votre système.
Installez-le sur votre système avec les instructions suivantes.

<!-- Display tabs for each OS -->
{% tabs install-cs-setup-tabs class=platform-os-options %}

<!-- macOS -->
{% tab macOS for=install-cs-setup-tabs %}
{% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-brew %}
{% altDetails cs-setup-macos-nobrew  "Alternativement, si vous n'utilisez pas Homebrew:" %}
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.macOS-x86-64 %}
{% endaltDetails %}
{% endtab %}
<!-- end macOS -->

<!-- Linux -->
{% tab Linux for=install-cs-setup-tabs %}
  {% include code-snippet.html language='bash' codeSnippet=site.data.setup-scala.linux-x86-64 %}
{% endtab %}
<!-- end Linux -->

<!-- Windows -->
{% tab Windows for=install-cs-setup-tabs %}
  Téléchargez et exécutez [l'intallateur Scala pour Windows]({{site.data.setup-scala.windows-link}}) basé sur Coursier.
{% endtab %}
<!-- end Windows -->

<!-- Other -->
{% tab Other for=install-cs-setup-tabs defaultTab %}
  <noscript>
    <p><span style="font-style:italic;">JavaScript est désacivé. Cliquez sur l'onglet correspondant à votre système d'exploitation.</span></p>
  </noscript>
  Suivez 
    [les instructions pour installer la commande `cs`](https://get-coursier.io/docs/cli-installation)
    puis exécutez `./cs setup`.
{% endtab %}
<!-- end Other -->

{% endtabs %}
<!-- End tabs -->

En plus de gérer les JVMs, `cs setup` installe aussi des utilitaires en ligne de commande :

- Un JDK (si vous n'en avez pas déjà un)
- L'outil de construction de package [sbt](https://www.scala-sbt.org/)
- [Ammonite](https://ammonite.io/), un REPL amélioré
- [scalafmt](https://scalameta.org/scalafmt/), le formatteur de code Scala
- `scalac` (le compilateur Scala 2)
- `scala` (le REPL et le lanceur de script Scala 2).

Pour plus d'informations à propos de `cs`, vous pouvez lire la page suivante :
[coursier-cli documentation](https://get-coursier.io/docs/cli-overview).

> Actuellement, `cs setup` installe le compilateur Scala 2 et le lanceur
> (les commandes `scalac` et `scala` respectivement). Ce n'est pas un problème,
> car la plupart des projets utilisent un outil de contruction
> de package qui fonctionne à la fois pour Scala 2 et Scala 3.
> Cependant, vous pouvez installer le compilateur et le lanceur Scala 3 en ligne de commande,
> en exécutant les commandes suivantes :
> ```
> $ cs install scala3-compiler
> $ cs install scala3
> ```

### ...ou manuellement

Vous avez seulement besoin de deux outils pour compiler, lancer, tester et packager un projet Scala: Java 8 ou 11, et sbt.
Pour les installer manuellement :

1. Si vous n'avez pas Java 8 ou 11 installé, téléchargez
   Java depuis [Oracle Java 8](https://www.oracle.com/java/technologies/javase-jdk8-downloads.html), [Oracle Java 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html),
   ou [AdoptOpenJDK 8/11](https://adoptopenjdk.net/). Référez-vous à la page [JDK Compatibility](/overviews/jdk-compatibility/overview.html) pour les détails de compatibilité entre Java et Scala.
1. Installez [sbt](https://www.scala-sbt.org/download/)

## Créer un projet "Hello World" avec sbt

Une fois que vous avez installé sbt, vous pouvez créer un projet Scala, comme expliqué dans la section suivante.

Pour créer un projet, vous pouvez soit utiliser la ligne de commande, soit un IDE.
Si vous êtes habitué à la ligne de commande, nous recommandons cette approche.

### Utiliser la ligne de commande

sbt est un outil de construction de package pour Scala, sbt compile, lance et teste votre code Scala.
(Il peut aussi publier les librairies et faire beaucoup d'autres tâches.)

Pour créer un nouveau projet Scala avec sbt :

1. `cd` dans un répertoire vide.
1. Lancez la commande `sbt new scala/scala3.g8` pour créer un projet Scala 3, ou `sbt new scala/hello-world.g8` pour créer un projet Scala 2.
   Cela va télécharger un projet modèle depuis Github.
   Cela va aussi créer un dossier `target`, que vous pouvez ignorer.
1. Quand cela vous est demandé, nommez votre application `hello-world`. Cela va créer un projet appelé "hello-world".
1. Voyons ce que nous vennons de générer :

```
- hello-world
    - project (sbt utilise ce dossier pour ses propres fichiers)
        - build.properties
    - build.sbt (fichier de définition de la construction du package pour sbt)
    - src
        - main
            - scala (tout votre code Scala doit être placé ici)
                - Main.scala (Point d'entrée du programme) <-- c'est tout ce dont nous avons besoin pour le moment
```

Vous pouvez trouver plus de documentation à propos de sbt dans le [Scala Book](/scala3/book/tools-sbt.html) ([Lien](/overviews/scala-book/scala-build-tool-sbt.html) vers la version Scala 2) et sur la [documentation](https://www.scala-sbt.org/1.x/docs/index.html) officielle de sbt.

### Avec un IDE

Vous pouvez ignorer le reste de cette page et aller directement sur [Building a Scala Project with IntelliJ and sbt](/getting-started/intellij-track/building-a-scala-project-with-intellij-and-sbt.html).


## Ouvrir le projet hello-world

Utilisons un IDE pour ouvrir le projet. Les plus populaires sont IntelliJ et VSCode.
Il proposent tout deux des fonctionnalités avancées. D'[autres éditeurs](https://scalameta.org/metals/docs/editors/overview.html) sont également disponibles.

### Avec IntelliJ

1. Téléchargez et installez [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)
1. Installez l'extension Scala en suivant [les instruction IntelliJ pour installer des extensions](https://www.jetbrains.com/help/idea/managing-plugins.html)
1. Ouvrez le fichier `build.sbt` puis choisissez *Open as a project*

### Avec VSCode et metals

1. Téléchargez [VSCode](https://code.visualstudio.com/Download)
1. Installez l'extension Metals depuis [la marketplace](https://marketplace.visualstudio.com/items?itemName=scalameta.metals)
1. Ensuite, ouvrez le répertoire contenant le fichier `build.sbt` (cela doit être le dossier `hello-world` si vous avez suivi les instructions précédentes). Choisissez *Import build* lorsque cela vous est demandé.

> [Metals](https://scalameta.org/metals) est un "Serveur de langage Scala" qui fournit une aide pour écrire du code Scala dans VSCode et d'autres éditeurs [Atom, Sublime Text, autres ...](https://scalameta.org/metals/docs/editors/overview.html), en utilisant le [Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/).
> En arrière plan, Metals communique avec l'outil de construction de package en utilisant
> le [Build Server Protocol (BSP)](https://build-server-protocol.github.io/).
> Pour plus de détails sur le fonctionnement de Metals, suivez [“Write Scala in VS Code, Vim, Emacs, Atom and Sublime Text with Metals”](https://www.scala-lang.org/2019/04/16/metals.html).

### Essayer avec le code source

Ouvrez ces deux fichiers dans votre IDE :

- _build.sbt_
- _src/main/scala/Main.scala_

Quand vous lancerez votre projet à l'étape suivante, la configuration dans _build.sbt_ sera utilisée pour lancer le code dans _src/main/scala/Main.scala_.

## Lancer Hello Word

Si vous êtes habitué à votre IDE, vous pouvez lancer le code dans _Main.scala_ depuis celui-ci.

Sinon, vous pouvez lancer l'application depuis le terminal avec ces étapes :

1. `cd` vers `hello-world`.
1. Lancez `sbt`. Cela va ouvrir la console sbt.
1. Ecrivez `~run`. Le symbole `~` est optionnel, il va relancer l'application à chaque sauvegarde de fichier.
   Cela permet un cyle rapide de modification/relance/debug. sbt va aussi générer un dossier `target` que vous pouvez ignorer.

Quand vous avez fini d'expérimenter avec ce projet, appuyez sur `[Entrée]` pour interrompre la commande `run`.
Puis saisissez `exit` ou appuyez sur `[Ctrl+D]` pour quitter sbt et revenir à votre invite de commande.

## Prochaines étapes

Une fois que vous avez terminé le tutoriel ce dessus, vous pouvez consulter :

* [The Scala Book](/scala3/book/introduction.html) ([Lien](/overviews/scala-book/introduction.html) vers la version Scala 2), qui fournit un ensemble de courtes leçons et introduit les fonctionnalités principales de Scala.
* [The Tour of Scala](/tour/tour-of-scala.html) pour une introduction des fonctionnalités Scala.
* [Learning Courses](/online-courses.html), qui contient des tutoriels et des cours interactifs.
* [Our list of some popular Scala books](/books.html).
* [The migration guide](/scala3/guides/migration/compatibility-intro.html) pour vous aider à migrer votre code Scala 2 vers Scala 3.

## Obtenir de l'aide
Il y a plusieurs listes de diffusion et canaux de discussions instantanés si vous souhaitez rencontrer rapidement d'autres utilisateurs de Scala. Allez faire un tour sur notre page [community](https://scala-lang.org/community/) pour consulter la liste des ces ressources et obtenir de l'aide.

Traduction par Antoine Pointeau.
