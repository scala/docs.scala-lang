---
layout: tour
title: Classes Case
partof: scala-tour

num: 10
next-page: pattern-matching
previous-page: multiple-parameter-lists
language: pt-br
---

Scala suporta o conceito de _classes case_. Classes case são classes regulares que são:

* Imutáveis por padrão
* Decompostas por meio de [correspondência de padrões](pattern-matching.html)
* Comparadas por igualdade estrutural ao invés de referência
* Sucintas para instanciar e operar

Aqui temos um exemplo de hierarquia de tipos para *Notification* que consiste em uma super classe abstrata `Notification` e três tipos concretos de notificação implementados com classes case `Email`, `SMS`, e `VoiceRecording`.

```scala mdoc
abstract class Notification
case class Email(sourceEmail: String, title: String, body: String) extends Notification
case class SMS(sourceNumber: String, message: String) extends Notification
case class VoiceRecording(contactName: String, link: String) extends Notification
```

Instânciar uma classe case é fácil: (Perceba que nós não precisamos da palavra-chave `new`)

```scala mdoc
val emailDeJohn = Email("john.doe@mail.com", "Saudações do John!", "Olá Mundo")
```

Os parâmetros do construtor de uma classe case são tratados como valores públicos e podem ser acessados diretamente.

```scala mdoc
val titulo = emailDeJohn.title
println(titulo) // prints "Saudações do John!"
```

Com classes case, você não pode alterar seus campos diretamente. (ao menos que você declare `var` antes de um campo, mas fazê-lo geralmente é desencorajado). 

```scala mdoc:fail
emailDeJohn.title = "Adeus do John!" // Erro the compilação. Não podemos atribuir outro valor para um campo que foi declarado como val, lembrando que todos os campos de classes case são val por padrão.
```

Ao invés disso, faça uma cópia utilizando o método `copy`. Como descrito abaixo, então você poderá substituir alguns dos campos:

```scala mdoc
val emailEditado = emailDeJohn.copy(title = "Estou aprendendo Scala!", body = "É muito legal!")

println(emailDeJohn) // prints "Email(john.doe@mail.com,Saudações do John!,Hello World!)"
println(emailEditado) // prints "Email(john.doe@mail.com,Estou aprendendo Scala,É muito legal!)"
```

Para cada classe case em Scala o compilador gera um método `equals` que implementa a igualdade estrutural e um método `toString`. Por exemplo:

```scala mdoc
val primeiroSMS = SMS("12345", "Hello!")
val segundoSMS = SMS("12345", "Hello!")

if (primeiroSMS == segundoSMS) {
  println("Somos iguais!")
}

println("SMS é: " + primeiroSMS)
```

Irá gerar como saída:

```
Somos iguais!
SMS é: SMS(12345, Hello!)
```

Com classes case, você pode utilizar **correspondência de padrões** para manipular seus dados. Aqui temos um exemplo de uma função que escreve como saída diferente mensagens dependendo do tipo de notificação recebida:

```scala mdoc
def mostrarNotificacao(notificacao: Notification): String = {
  notificacao match {
    case Email(email, title, _) =>
      "Você recebeu um email de " + email + " com o título: " + title
    case SMS(number, message) =>
      "Você recebeu um SMS de" + number + "! Mensagem: " + message
    case VoiceRecording(name, link) =>
      "Você recebeu uma Mensagem de Voz de " + name + "! Clique no link para ouvir: " + link
  }
}

val algumSMS = SMS("12345", "Você está aí?")
val algumaMsgVoz = VoiceRecording("Tom", "voicerecording.org/id/123")

println(mostrarNotificacao(algumSMS)) // Saída "Você recebeu um SMS de 12345! Mensagem: Você está aí?"
println(mostrarNotificacao(algumaMsgVoz)) // Saída "Você recebeu uma Mensagem de Voz de Tom! Clique no link para ouvir: voicerecording.org/id/123"
```

Aqui um exemplo mais elaborado utilizando a proteção `if`. Com a proteção `if`, o correspondência de padrão irá falhar se a condição de proteção retorna falso.

```scala mdoc:nest
def mostrarNotificacaoEspecial(notificacao: Notification, emailEspecial: String, numeroEspecial: String): String = {
  notificacao match {
    case Email(email, _, _) if email == emailEspecial =>
      "Você recebeu um email de alguém especial!"
    case SMS(numero, _) if numero == numeroEspecial =>
      "Você recebeu um SMS de alguém especial!"
    case outro =>
      mostrarNotificacao(outro) // Nada especial para mostrar, então delega para nossa função original mostrarNotificacao 
  }
}

val NumeroEspecial = "55555"
val EmailEspecial = "jane@mail.com"
val algumSMS = SMS("12345", "Você está aí?")
val algumaMsgVoz = VoiceRecording("Tom", "voicerecording.org/id/123")
val emailEspecial = Email("jane@mail.com", "Beber hoje a noite?", "Estou livre depois das 5!")
val smsEspecial = SMS("55555", "Estou aqui! Onde está você?")

println(mostrarNotificacaoEspecial(algumSMS, EmailEspecial, NumeroEspecial)) // Saída "Você recebeu um SMS de 12345! Mensagem: Você está aí?"
println(mostrarNotificacaoEspecial(algumaMsgVoz, EmailEspecial, NumeroEspecial)) // Saída "Você recebeu uma Mensagem de Voz de Tom! Clique no link para ouvir: voicerecording.org/id/123"
println(mostrarNotificacaoEspecial(smsEspecial, EmailEspecial, NumeroEspecial)) // Saída "Você recebeu um email de alguém especial!"
println(mostrarNotificacaoEspecial(smsEspecial, EmailEspecial, NumeroEspecial)) // Saída "Você recebeu um SMS de alguém especial!"
```

Ao programar em Scala, recomenda-se que você use classes case de forma pervasiva para modelar / agrupar dados, pois elas ajudam você a escrever código mais expressivo e passível de manutenção:

* Imutabilidade libera você de precisar acompanhar onde e quando as coisas são mutadas
* Comparação por valor permite comparar instâncias como se fossem valores primitivos - não há mais incerteza sobre se as instâncias de uma classe é comparada por valor ou referência
* Correspondência de padrões simplifica a lógica de ramificação, o que leva a menos bugs e códigos mais legíveis.
