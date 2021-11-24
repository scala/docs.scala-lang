---
title: コンパイラオプション
type: chapter
description: この章ではScala 2.13とScala 3間のコンパイラオプションの違いについて示します
num: 21
previous-page: incompat-type-inference
next-page: options-lookup
language: ja
---

Scala 3コンパイラは0から書き直されたため、Scala 2.13コンパイラと同じオプションは提供されません。
別の名前で利用できるオプションもあれば、まだ実装されていないオプションもあります。

Scala 2.13プロジェクトをScala 3に移植した時、コンパイラオプションのリストを適用させる必要があるでしょう
適用させるために[ルックアップテーブル](options-lookup.html)を参照してください。

> 利用できないオプションをScala 3コンパイラーに渡しても、失敗することはありません。
> WARNINGを出力し、指定したオプションを無視します。

[新しいコンパイラオプション](options-new.html)のページで、Scala 2.13にはないScala 3の新しいオプションを見つけることができます。

scaladoc設定のリファレンスとScala2scaladocとの互換性については、[ScaladocについてScala2とScala3間における互換性設定](scaladoc-settings-compatibility.html)ページをご覧ください。
