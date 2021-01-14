---
layout: tour
title: 패키지와 임포트
partof: scala-tour

num: 35
language: ko

previous-page: named-arguments
next-page: package-objects
---

# 패키지와 임포트

스칼라는 패키지를 사용하여 프로그램을 모듈화할 수 있는 네임스페이스를 만든다.

## 패키지 만들기

패키지는 스칼라 파일 맨 위에 하나 이상의 패키지 이름을 선언하여 만들어진다.

```
package users

class User
```

패키지의 이름을 스칼라 파일을 담고 있는 디렉토리와 같게 하는 규칙이 있다. 하지만, 스칼라는 파일 레이아웃에 한정되지 않는다. `package users`를 위한 sbt 프로젝트의 디렉토리 구조의 한 예이다. 

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

`users` 디렉토리가 `scala` 디렉토리 안에 위치하고 여러 스칼라 파일이 패키지 안에 위치하는지에 대해 주목해야 한다. 패키지 안 각 스칼라 파일은 같은 패키지 선언을 가질 수 있다. 패키지를 선언하는 다른 방법은 중괄호를 사용하는 것이다.

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

보다시피 패키지 중첩을 허용하고 스코프와 캡슐화를 더 잘 제어한다.

패키지 이름은 모두 소문자여야 하고 웹사이트를 가진 조직에서 개발된 코드라면 `<상위 도메인>.<도메인 이름>.<프로젝트 이름>` 과 같은 형식을 따라야 한다. 예를 들어, 구글에게 `SelfDrigingCar`라는 프로젝트가 있다면 패키지 이름은 아래와 같을 것이다.

```
package com.google.selfdrivingcar.camera

class Lens
```

디렉토리 구조는 `SelfDrivingCar/src/main/scala/com/google/selfdrivingcar/camera/Lens.scala`와 같을 것이다.

## 임포트

`import` 절은 다른 패키지의 멤버(클래스, 트레이트, 함수 등)에 접근하기 위해서고 같은 패키지의 멤버에 접근할 때는 필요하지 않다. 한마디로 임포트 절은 선택적이다.

```
import users._  // users 패키지 전부를 임포트한다
import users.User  // User 클래스를 임포트한다
import users.{User, UserPreferences}  // 선택된 멤버만 임포트한다
import users.{UserPreferences => UPrefs}  // 편의를 위해 이름을 바꾸고 임포트한다
```

스칼라가 자바와 한가지 다른 점은 어디서든 임포트를 할 수 있다는 것이다.

```scala mdoc
def sqrtplus1(x: Int) = {
  import scala.math.sqrt
  sqrt(x) + 1.0
}
```

네이밍이 중복되거나 프로젝트의 루트에서 무언가 임포트해야 할 때, 패키지 이름 앞에 `_root_`를 붙이면 된다.

```
package accounts

import _root_.users._
```

`scala` 및 `java.lang` 패키지와 `object Predef` 는 기본적으로 임포트된다.

공병국 옮김
