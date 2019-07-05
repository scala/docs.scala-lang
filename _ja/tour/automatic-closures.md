---
layout: tour
title: 型依存クロージャの自動構築
language: ja

discourse: true

partof: scala-tour
---

Scalaはメソッドのパラメータとしてパラメータ無しの関数名を渡せます。そのようなメソッドが呼ばれると、パラメータ無しの関数名は実際に評価されず、代わりに、対応するパラメーターの処理をカプセル化した、引数無しの関数が渡されます(いわゆる *名前渡し*評価です)。

以下のコードはこの仕組みを説明しています。

    object TargetTest1 extends Application {
      def whileLoop(cond: => Boolean)(body: => Unit): Unit =
        if (cond) {
          body
          whileLoop(cond)(body)
        }
      var i = 10
      whileLoop (i > 0) {
        println(i)
        i -= 1
      }
    }

関数 whileLoop は2つのパラメータ`cond`と`body`を受け取ります。関数が適用される時、実際のパラメータは評価されません。しかし形式上のパラメータが`whileLoop`の本体内で使われる度に、暗黙に生成された引数の無い関数が代わりに評価されます。このようにメソッド`whileLoop`はJavaのようなwhileループを再帰的な方法で実装しています。

[中置/後置 演算子](operators.html)とこのメカニズムを組み合わせて利用し、より複雑な命令文を(より良い構文で)作れます。

こちらがloop-unless式の実装です。

    object TargetTest2 extends Application {
      def loop(body: => Unit): LoopUnlessCond =
        new LoopUnlessCond(body)
      protected class LoopUnlessCond(body: => Unit) {
        def unless(cond: => Boolean) {
          body
          if (!cond) unless(cond)
        }
      }
      var i = 10
      loop {
        println("i = " + i)
        i -= 1
      } unless (i == 0)
    }
この`loop`関数はループ処理の本体を受け取り、クラス`LoopUnlessCond`(この処理の本体をカプセル化する)のインスタンスを返すだけです。処理の本体はまだ評価されていないことに気をつけてください。クラス`LoopUnlessCond`は *中置演算子* として使えるメソッド`unless`を持ちます。このように、新しいループ処理: `loop { < stats > } unless ( < cond > )`のとても自然な構文を作れます。

こちらが`TargetTest2`を実行した時の出力です。

    i = 10
    i = 9
    i = 8
    i = 7
    i = 6
    i = 5
    i = 4
    i = 3
    i = 2
    i = 1
