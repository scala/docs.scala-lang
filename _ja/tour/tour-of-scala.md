---
layout: tour
title: 前書き
language: ja

discourse: true

partof: scala-tour

num: 1

next-page: basics

redirect_from: "/tutorials/tour/tour-of-scala.html"
---

## ようこそツアーへ
このツアーはScalaで最もよく使う機能を一口サイズで紹介をしています。
これらはScala初心者を対象としています。

これはほんの短いツアーで、完全な言語のチュートリアルではありません。
もしそれを望むなら、[こちらの本](/books.html) を手に入れるか、
[その他の解決手段](/learn.html) での相談を検討してください。

## Scalaとは？
Scalaは一般的なプログラミング方法を簡潔かつエレガントかつ型安全な方法で表現するために設計されたモダンなマルチパラダイム言語です。
それはオブジェクト指向言語と関数型言語の機能をスムーズに統合しています。

## Scalaはオブジェクト指向 ##
Scalaは[全ての値がオブジェクトである](unified-types.html) という意味では純粋オブジェクト指向言語です。
型とオブジェクトの振る舞いは[クラス](classes.html) と[トレイト](traits.html) によって記述されます。
クラスはサブクラス化と、多重継承を巧みに置き換える柔軟な[ミックスインを基にした合成](mixin-class-composition.html) 機構により拡張されます。

## Scalaは関数型 ##
Scalaは[すべての関数が値である](unified-types.html) という意味で関数型言語でもあります。
Scalaは無名関数を定義するために[軽量な構文](basics.html#関数)を提供し、
[高階関数](higher-order-functions.html) をサポートし、関数の[ネスト](nested-functions.html) を許可し、[カリー化](multiple-parameter-lists.html) をサポートします。  
Scalaの[ケースクラス](case-classes.html)と[パターンマッチング](pattern-matching.html)が組み込まれていることにより、多くの関数型プログラミング言語で使われる代数型を作ることができます。
[シングルトンオブジェクト](singleton-objects.html) はクラスのメンバーではない関数をグループ化する便利な方法を提供します。

さらに、Scalaのパターンマッチングの概念は、[抽出子オブジェクト](extractor-objects.html) による一般的な拡張として、[右無視シーケンスパターン](regular-expression-patterns.html)の働きにより、自然に[XMLデータの処理](https://github.com/scala/scala-xml/wiki/XML-Processing) にまで拡張されています。  
（訳者註：現在のバージョンでは右無視シーケンスパターンの説明は正規表現のページから除かれています。[→古いバージョン](https://www.scala-lang.org/old/node/122)）  
この文脈では、For内包表記はクエリの設計に役立ちます。
これらの機能により、ScalaはWebサービスのようなアプリケーション開発に理想的なものとなっています。

## Scalaは静的型付け ##
Scalaは抽象化が安全で首尾一貫した方法で使われることをコンパイル時に強制する、表現力豊かな型システムを備えています。
特にその型システムは以下をサポートします:

* [ジェネリッククラス](generic-classes.html) 
* [変位指定アノテーション](variances.html) 
* [上限](upper-type-bounds.html) と [下限](lower-type-bounds.html) 型境界
* [内部クラス](inner-classes.html) とオブジェクトメンバーとしての[抽象型メンバー](abstract-type-members.html) 
* [複合型](compound-types.html) 
* [明示的に型指定された自己参照](self-types.html) 
* [暗黙パラメーター](implicit-parameters.html) と [暗黙の変換](implicit-conversions.html) 
* [多態性メソッド](polymorphic-methods.html) 

[型推論](type-inference.html) はユーザーはコードに冗長な型情報の注釈をつける必要はないことを意味します。
これらの機能を組み合わせることにより、プログラミングの抽象化を安全に再利用でき、ソフトウェアを型安全に拡張できる強力な基盤となります。

## Scalaは拡張可能 ##

実際に、ドメイン固有のアプリケーションの開発ではよくドメイン固有の言語拡張が必要となります。
Scalaは言語メカニズムのユニークな組み合わせを提供します。それはライブラリの形での円滑な新しい言語構成の追加を簡単にします。

多くのケースで、これはマクロのようなメタプログラミングの機能を使わずに実現できます。例えば、

* [暗黙のクラス](http://docs.scala-lang.org/overviews/core/implicit-classes.html) で既存の型に拡張メソッドを追加できます。

* [文字列補間](/ja/overviews/core/string-interpolation.html) はカスタム補間を使ってユーザー拡張可能です。

## Scalaの相互運用

Scalaは一般的なJava実行環境 (JRE) と相互運用するように設計されています。
特に、主流であるオブジェクト指向のJavaプログラミング言語とのやり取りはできるだけスムーズになっています。
ScalaではSAMs、[ラムダ](higher-order-functions.html) 、[アノテーション](annotations.html) 、[ジェネリクス](generic-classes.html) のようなJavaの新しい機能には直接の類似物があります。

[デフォルト引数](default-parameter-values.html) 、[名前付きパラメータ](named-arguments.html)
といった、Javaに類似物がないScalaの機能はできるだけ適切でJavaに近い形にコンパイルされます。
ScalaはJavaのような同じコンパイルモデル(分割コンパイル、動的クラス読み込み) を持っており、数千の既存の高品質なライブラリにアクセスができます。

## ツアーを楽しんで!

もっと読むには、目次メニューの[次のページ](basics.html) に進んでください。

