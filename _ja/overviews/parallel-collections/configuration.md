---
layout: multipage-overview
title: 並列コレクションの設定

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 7
language: ja
---

## タスクサポート

並列コレクションは、演算のスケジューリングに関してモジュール化されている。
全ての並列コレクションはタスクサポートというオブジェクトによりパラメータ化されており、これがタスクのスケジューリングとプロセッサへの負荷分散 (load balancing) を担当する。

タスクサポートは内部にスレッドプールの実装への参照を持っており、タスクをより小さいタスクにいつどのように分割するかを決定している。
この内部の振る舞いに関してより詳しく知りたい場合はこのテクノロジーレポートを参照してほしい \[[1][1]\]。

現行の並列コレクションにはいくつかのタスクサポートの実装がある。
JVM 1.6 以上でデフォルトで使われるのは、`ForkJoinTaskSupport` で、これは内部でフォーク/ジョインプールを使う。
JVM 1.5 とその他のフォーク/ジョインプールをサポートしない JVM はより効率の劣る `ThreadPoolTaskSupport` を使う。
また、`ExecutionContextTaskSupport` は `scala.conccurent` にあるデフォルトの実行コンテクスト (execution context) の実装を使い、`scala.concurrent` で使われるスレッドプールを再利用する（これは JVM のバージョンによってフォーク/ジョインプールか `ThreadPoolExecutor` が使われる）。それぞれの並列コレクションは、デフォルトで実行コンテクストのタスクサポートに設定されているため、並列コレクションは、Future API で使われるのと同じフォーク/ジョインプールが再利用されている。

以下に並列コレクションのタスクサポートを変更する具体例をみてみよう:

    scala> import scala.collection.parallel._
    import scala.collection.parallel._

    scala> val pc = mutable.ParArray(1, 2, 3)
    pc: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 2, 3)

    scala> pc.tasksupport = new ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(2))
    pc.tasksupport: scala.collection.parallel.TaskSupport = scala.collection.parallel.ForkJoinTaskSupport@4a5d484a

    scala> pc map { _ + 1 }
    res0: scala.collection.parallel.mutable.ParArray[Int] = ParArray(2, 3, 4)

上の例では、並列コレクションに対して並列度2のフォーク/ジョインプールを使うように設定した。
並列コレクションを `ThreadPoolExecutor` を使うように設定する場合は:

    scala> pc.tasksupport = new ThreadPoolTaskSupport()
    pc.tasksupport: scala.collection.parallel.TaskSupport = scala.collection.parallel.ThreadPoolTaskSupport@1d914a39

    scala> pc map { _ + 1 }
    res1: scala.collection.parallel.mutable.ParArray[Int] = ParArray(2, 3, 4)

並列コレクションがシリアライズされるとき、タスクサポートフィールドはシリアライゼーションから省かれる。
並列コレクションがデシリアライズされるとき、タスクサポートはデフォルトの値である実行コンテクストタスクサポートに設定される。

カスタムのタスクサポートを実装するには、`TaskSupport` トレイトを拡張して以下のメソッドを実装する:

    def execute[R, Tp](task: Task[R, Tp]): () => R

    def executeAndWaitResult[R, Tp](task: Task[R, Tp]): R

    def parallelismLevel: Int

`execute` メソッドはタスクを非同期的にスケジューリングし、計算の結果をフューチャー値として返す。
`executeAndWait` メソッドは同じことを行うがタスクが完了してから結果を返す。
`parallelismLevel` はタスクサポートがタスクのスケジューリングをするのに用いる対象コア数を返す。

## 参照

1. [On a Generic Parallel Collection Framework, June 2011][1]

  [1]: http://infoscience.epfl.ch/record/165523/files/techrep.pdf "parallel-collections"
