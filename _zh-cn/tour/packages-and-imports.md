---
layout: tour
title: 包和导入
partof: scala-tour

num: 33

language: zh-cn

previous-page: named-arguments
next-page: package-objects
---

# 包和导入
Scala 使用包来创建命名空间，从而允许你创建模块化程序。

## 创建包
通过在 Scala 文件的头部声明一个或多个包名称来创建包。

```
package users

class User
```
一个惯例是将包命名为与包含 Scala 文件的目录名相同。 但是，Scala 并未对文件布局作任何限制。 在一个 sbt 工程中，`package users` 的目录结构可能如下所示：
```
- ExampleProject
  - build.sbt
  - project
  - src
    - main
      - scala
        - users
          User.scala
          UserProfile.scala
          UserPreferences.scala
    - test
```
注意 `users` 目录是包含在 `scala` 目录中的，该包中包含有多个 Scala 文件。 包中的每个 Scala 文件都可以具有相同的包声明。 声明包的另一种方式是使用大括号：
```
package users {
  package administrators {
    class NormalUser
  }
  package normalusers {
    class NormalUser
  }
}
```
如你所见，这允许包嵌套并提供了对范围和封装的更好控制。

包名称应全部为小写，如果代码是在拥有独立网站的组织内开发的，则应采用以下的约定格式：`<top-level-domain>.<domain-name>.<project-name>`。 例如，如果 Google 有一个名为 `SelfDrivingCar` 的项目，则包名称将如下所示：
```
package com.google.selfdrivingcar.camera

class Lens
```
这可以对应于以下目录结构：`SelfDrivingCar/src/main/scala/com/google/selfdrivingcar/camera/Lens.scala`

## 导入
`import` 语句用于导入其他包中的成员（类，特质，函数等）。 使用相同包的成员不需要 `import` 语句。 导入语句可以有选择性：
```
import users._  // 导入包 users 中的所有成员
import users.User  // 导入类 User
import users.{User, UserPreferences}  // 仅导入选择的成员
import users.{UserPreferences => UPrefs}  // 导入类并且设置别名
```

Scala 不同于 Java 的一点是 Scala 可以在任何地方使用导入：

```scala mdoc
def sqrtplus1(x: Int) = {
  import scala.math.sqrt
  sqrt(x) + 1.0
}
```
如果存在命名冲突并且你需要从项目的根目录导入，请在包名称前加上 `_root_`：
```
package accounts

import _root_.users._
```


注意：包 `scala` 和 `java.lang` 以及 `object Predef` 是默认导入的。
