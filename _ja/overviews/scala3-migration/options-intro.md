---
title: コンパイラオプション
type: chapter
description: この章は Scala 2.13 と Scala 3 間のコンパイラオプションの違いについて示します
num: 21
previous-page: incompat-type-inference
next-page: options-lookup
language: ja
---

Scala 3 コンパイラはゼロから書き直されたため、Scala 2.13 コンパイラと同じオプションは提供されない。
別の名前で利用できるオプションもあれば、まだ実装されていないオプションもある。

Scala 2.13 プロジェクトを Scala 3 に移植した際、コンパイラオプションのリストを適用させる必要がある。
適用させるために[ルックアップテーブル](options-lookup.html)を参照してください。

> 利用できないオプションを Scala 3 コンパイラーに渡しても、失敗することはない。
> 警告を出力し、指定したオプションを無視します。

[新しいコンパイラオプション](options-new.html)のページで、Scala 2.13 にはない Scala 3 の新しいオプションを見つけることができる。

scaladoc 設定のリファレンスと Scala2scaladoc との互換性については、[ScaladocについてScala2とScala3間における互換性設定](scaladoc-settings-compatibility.html)ページをご覧ください。
