---
layout: tour
title: 케이스 클래스
partof: scala-tour

num: 11
language: ko

next-page: pattern-matching
previous-page: multiple-parameter-lists
---

스칼라는 _케이스 클래스_ 개념을 지원한다. 케이스 클래스는 아래와 같은 특징을 가지는 일반 클래스이다.

* 기본적으로 불변
* [패턴 매칭](pattern-matching.html)을 통해 분해가능
* 레퍼런스가 아닌 구조적인 동등성으로 비교됨
* 초기화와 운영이 간결함

추상 상위 클래스 Notification과 세개의 특정 Notification 타입들(케이스 클래스 Email, SMS, VoiceRecording으로 구현됨)로 구성된 Notification타입 계층구조를 위한 예제가 하나 있다.

    abstract class Notification
    case class Email(sourceEmail: String, title: String, body: String) extends Notification
    case class SMS(sourceNumber: String, message: String) extends Notification
    case class VoiceRecording(contactName: String, link: String) extends Notification

케이스클래스를 인스턴스화 하는 것은 쉽다 (new 키워드를 사용할 필요가 없음을 주목하자.)

    val emailFromJohn = Email("john.doe@mail.com", "Greetings From John!", "Hello World!")

케이스 클래스의 생성자 파라미터들은 public 값으로 다뤄지며, 직접 접근이 가능하다.

    val title = emailFromJohn.title
    println(title) // prints "Greetings From John!"

여러분은 케이스 클래스의 필드를 직접 수정할 수 없다. (필드 앞에 var를 넣으면 가능하지만, 권장되지는 않는다.)

    emailFromJohn.title = "Goodbye From John!" // 이것은 컴파일시에 에러가 난다. 우리는 val인 필드에 다른 값을 할당할수 없으며, 모든 케이스 클래스 필드는 기본적으로 val이다.
    
대신에, 당신은 copy메서드를 사용해서 복사본을 만들수 있다. 아래에서 보듯, 당신은 몇몇 필드를 대체할수 있다.

    val editedEmail = emailFromJohn.copy(title = "I am learning Scala!", body = "It's so cool!")
    println(emailFromJohn) // prints "Email(john.doe@mail.com,Greetings From John!,Hello World!)"
    println(editedEmail) // prints "Email(john.doe@mail.com,I am learning Scala,It's so cool!)"

모든 케이스 클래스에 대해서 스칼라 컴파일러는 구조적 동등성을 구현한 equals 메서드와, toString 메서드를 생성한다.

    val firstSms = SMS("12345", "Hello!")
    val secondSms = SMS("12345", "Hello!")

    if (firstSms == secondSms) {
        println("They are equal!")
    }
    
    println("SMS is: " + firstSms)

위 코드는 아래과 같이 출력한다

    They are equal!
    SMS is: SMS(12345, Hello!)
    
케이스 클래스를 통해, 데이터와 함께 동작하는 패턴매칭을 사용할수 있다. 어떤Notification 타입을 받느냐에 따라 다른 메시지를 출력하는 함수가 있다.

    def showNotification(notification: Notification): String = {
      notification match {
        case Email(email, title, _) =>
          "You got an email from " + email + " with title: " + title
        case SMS(number, message) =>
          "You got an SMS from " + number + "! Message: " + message
        case VoiceRecording(name, link) =>
          "you received a Voice Recording from " + name + "! Click the link to hear it: " + link
      }
    }
    
    val someSms = SMS("12345", "Are you there?")
    val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")
    
    println(showNotification(someSms))
    println(showNotification(someVoiceRecording))
    
    // prints:
    // You got an SMS from 12345! Message: Are you there?
    // you received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123
    
아래에 if 방어구문을 사용한 다른 예제가 있다. if 방어구문을 통해, 패턴이 일치하는 분기문은 방어구문안의 조건이 false를 리턴하면 실패한다.

    def showNotificationSpecial(notification: Notification, specialEmail: String, specialNumber: String): String = {
      notification match {
        case Email(email, _, _) if email == specialEmail =>
          "You got an email from special someone!"
        case SMS(number, _) if number == specialNumber =>
          "You got an SMS from special someone!"
        case other =>
          showNotification(other) // nothing special, delegate to our original showNotification function   
      }
    }
    
    val SPECIAL_NUMBER = "55555"
    val SPECIAL_EMAIL = "jane@mail.com"
    val someSms = SMS("12345", "Are you there?")
    val someVoiceRecording = VoiceRecording("Tom", "voicerecording.org/id/123")
    val specialEmail = Email("jane@mail.com", "Drinks tonight?", "I'm free after 5!")
    val specialSms = SMS("55555", "I'm here! Where are you?")
    
    println(showNotificationSpecial(someSms, SPECIAL_EMAIL, SPECIAL_NUMBER))
    println(showNotificationSpecial(someVoiceRecording, SPECIAL_EMAIL, SPECIAL_NUMBER))
    println(showNotificationSpecial(specialEmail, SPECIAL_EMAIL, SPECIAL_NUMBER))
    println(showNotificationSpecial(specialSms, SPECIAL_EMAIL, SPECIAL_NUMBER))
    
    // prints: 
    // You got an SMS from 12345! Message: Are you there?
    // you received a Voice Recording from Tom! Click the link to hear it: voicerecording.org/id/123
    // You got an email from special someone!
    // You got an SMS from special someone!

스칼라 프로그래밍에 있어서, 보통 model/group 데이터에 케이스 클래스를 사용하도록 권장되는데, 당신이 더욱 표현적이거나 유지보수가능한 코드를 작성할 때 도움이 된다.

* 불변성은 당신이 언제 어디서 그것들이 수정되는지 신경쓸 필요 없게 만들어 준다.
* 값을 통한 비교는 여러분이 인스턴스들을 원시 값들인 것처럼 비교할수 있게 만들어 준다 - 클래스의 인스턴스들이 값 또는 참조를 통해 비교되는지와 같은 불확실성을 제거
* 패턴매칭은 로직의 분기를 심플하게 만들어주며, 결국 적은 버그와 가독성 높은 코드로 이어진다.

고광현 옮김
