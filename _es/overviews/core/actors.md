---
layout: singlepage-overview
title: API de actores en Scala

partof: actors

language: es
---

**Philipp Haller and Stephen Tu**

**Traducción e interpretación: Miguel Ángel Pastor Olivar**

## Introducción

La presente guía describe el API del paquete `scala.actors` de Scala 2.8/2.9. El documento se estructura en diferentes grupos lógicos. La jerarquía de "traits" es tenida en cuenta para llevar a cabo la estructuración de las secciones individuales. La atención se centra en el comportamiento exhibido en tiempo de ejecución por varios de los métodos presentes en los traits anteriores, complementando la documentación existente en el Scaladoc API.

## Traits de actores: Reactor, ReplyReactor, y Actor

### The Reactor trait

`Reactor` es el padre de todos los traits relacionados con los actores. Heredando de este trait podremos definir actores con una funcionalidad básica de envío y recepción de mensajes.

El comportamiento de un `Reactor` se define mediante la implementación de su método `act`. Este método es ejecutado una vez el `Reactor` haya sido iniciado mediante la invocación del método `start`, retornando el `Reactor`. El método `start`es *idempotente*, lo cual significa que la invocación del mismo sobre un actor que ya ha sido iniciado no surte ningún efecto.

El trait `Reactor` tiene un parámetro de tipo `Msg` el cual determina el tipo de mensajes que un actor es capaz de recibir.

La invocación del método `!` de un `Reactor` envía un mensaje al receptor. La operación de envío de un mensaje mediante el operador `!` es asíncrona por lo que el actor que envía el mensaje no se bloquea esperando a que el mensaje sea recibido sino que su ejecución continua de manera inmediata. Por ejemplo, `a ! msg` envia `msg` a `a`. Todos los actores disponen de un *buzón* encargado de regular los mensajes entrantes hasta que son procesados.

El trait `Reactor` trait también define el método `forward`. Este método es heredado de `OutputChannel` y tiene el mismo efecto que el método `!`. Aquellos traits que hereden de `Reactor`, en particular el trait `ReplyActor`, sobreescriben este método para habilitar lo que comunmente se conocen como *"implicit reply destinations"* (ver a continuación)

Un `Reactor` recibe mensajes utilizando el método `react`. Este método espera un argumento de tipo `PartialFunction[Msg, Unit]` el cual define cómo los mensajes de tipo `Msg` son tratados una vez llegan al buzón de un actor. En el siguiente ejemplo, el actor espera recibir la cadena "Hello", para posteriomente imprimir un saludo:

    react {
      case "Hello" => println("Hi there")
    }

La invocación del método `react` nunca retorna. Por tanto, cualquier código que deba ejecutarse tras la recepción de un mensaje deberá ser incluido dentro de la función parcial pasada al método `react`. Por ejemplo, dos mensajes pueden ser recibidos secuencialmente mediante la anidación de dos llamadas a `react`:

    react {
      case Get(from) =>
        react {
          case Put(x) => from ! x
        }
    }

El trait `Reactor` también ofrece una serie de estructuras de control que facilitan la programación utilizando el mecanismo de `react`.

#### Terminación y estados de ejecución

La ejecución de un `Reactor` finaliza cuando el cuerpo del método `act` ha sido completado. Un `Reactor` también pueden terminarse a si mismo de manera explícita mediante el uso del método `exit`. El tipo de retorno de `exit` es `Nothing`, dado que `exit` siempre dispara una excepción. Esta excepción únicamente se utiliza de manera interna y nunca debería ser capturada.

Un `Reactor` finalizado pueden ser reiniciado mediante la invocación de su método `restart`. La invocación del método anterior sobre un `Reactor` que no ha terminado su ejecución lanza una excepción de tipo `IllegalStateException`. El reinicio de un actor que ya ha terminado provoca que el método `act` se ejecute nuevamente.

El tipo `Reactor` define el método `getState`, el cual retorna, como un miembro de la enumeración `Actor.State`, el estado actual de la ejecución del actor. Un actor que todavía no ha sido iniciado se encuentra en el estado `Actor.State.New`. Si el actor se está ejecutando pero no está esperando por ningún mensaje su estado será `Actor.State.Runnable`. En caso de que el actor haya sido suspendido mientras espera por un mensaje estará en el estado `Actor.State.Suspended`. Por último, un actor ya terminado se encontrará en el estado `Actor.State.Terminated`.

#### Manejo de excepciones

El miembro `exceptionHandler` permite llevar a cabo la definición de un manejador de excepciones que estará habilitado durante toda la vida del `Reactor`:

    def exceptionHandler: PartialFunction[Exception, Unit]

Este manejador de excepciones (`exceptionHandler`) retorna una función parcial que se utiliza para gestionar excepciones que no hayan sido tratadas de ninguna otra manera. Siempre que una excepción se propague fuera del método `act` de un `Reactor` el manejador anterior será aplicado a dicha excepción, permitiendo al actor ejecutar código de limpieza antes de que se termine. Nótese que la visibilidad de `exceptionHandler` es `protected`.

El manejo de excepciones mediante el uso de `exceptionHandler` encaja a la perfección con las estructuras de control utilizadas para programas con el método `react`. Siempre que una excepción es manejada por la función parcial retornada por `excepctionHandler`, la ejecución continua con la "closure" actual:

    loop {
      react {
        case Msg(data) =>
          if (cond) // process data
          else throw new Exception("cannot process data")
      }
    }

Assumiendo que `Reactor` sobreescribe el atributo `exceptionHandler`, tras el lanzamiento de una excepción en el cuerpo del método `react`, y una vez ésta ha sido gestionada, la ejecución continua con la siguiente iteración del bucle.

### The ReplyReactor trait

El trait `ReplyReactor` extiende `Reactor[Any]` y sobrescribe y/o añade los siguientes métodos:

- El método `!` es sobrescrito para obtener una referencia al actor
  actual (el emisor). Junto al mensaje actual, la referencia a dicho
  emisor es enviada al buzón del actor receptor. Este último dispone de
  acceso al emisor del mensaje mediante el uso del método `sender` (véase más abajo).

- El método `forward` es sobrescrito para obtener una referencia al emisor
  del mensaje que actualmente está siendo procesado. Junto con el mensaje
  actual, esta referencia es enviada como el emisor del mensaje actual.
  Como consuencia de este hecho, `forward` nos permite reenviar mensajes
  en nombre de actores diferentes al actual.

- El método (añadido) `sender` retorna el emisor del mensaje que está siendo
  actualmente procesado. Puesto que un mensaje puede haber sido reenviado,
  `sender` podría retornar un actor diferente al que realmente envió el mensaje.

- El método (añadido) `reply` envía una respuesta al emisor del último mensaje.
  `reply` también es utilizado para responder a mensajes síncronos o a mensajes
  que han sido enviados mediante un "future" (ver más adelante).

- El método (añadido) `!?` ofrece un *mecanismo síncrono de envío de mensajes*.
  La invocación de `!?` provoca que el actor emisor del mensaje se bloquee hasta
  que se recibe una respuesta, momento en el cual retorna dicha respuesta. Existen
  dos variantes sobrecargadas. La versión con dos parámetros recibe un argumento
  adicional que representa el tiempo de espera (medido en milisegundos) y su tipo
  de retorno es `Option[Any]` en lugar de `Any`. En caso de que el emisor no
  reciba una respuesta en el periodo de espera establecido, el método `!?` retornará
  `None`; en otro caso retornará la respuesta recibida recubierta con `Some`.

- Los métodos (añadidos) `!!` son similares al envío síncrono de mensajes en el sentido de
  que el receptor puede enviar una respuesta al emisor del mensaje. Sin embargo, en lugar
  de bloquear el actor emisor hasta que una respuesta es recibida, retornan una instancia de
  `Future`. Esta última puede ser utilizada para recuperar la respuesta del receptor una
  vez se encuentre disponible; asimismo puede ser utilizada para comprobar si la respuesta
  está disponible sin la necesidad de bloquear el emisor. Existen dos versiones sobrecargadas.
  La versión que acepta dos parámetros recibe un argumento adicional de tipo
  `PartialFunction[Any, A]`. Esta función parcial es utilizada para realizar el post-procesado de
  la respuesta del receptor. Básicamente, `!!` retorna un "future" que aplicará la anterior
  función parcial a la repuesta (una vez recibida). El resultado del "future" es el resultado
  de este post-procesado.

- El método (añadido) `reactWithin` permite llevar a cabo la recepción de mensajes en un periodo
  determinado de tiempo. En comparación con el método `react`, recibe un parámetro adicional,
  `msec`, el cual representa el periodo de tiempo, expresado en milisegundos, hasta que el patrón `TIMEOUT`
  es satisfecho (`TIMEOUT` es un "case object" presente en el paquete `scala.actors`). Ejemplo:

    reactWithin(2000) {
      case Answer(text) => // process text
      case TIMEOUT => println("no answer within 2 seconds")
    }

- El método `reactWithin` también permite realizar accesos no bloqueantes al buzón. Si
  especificamos un tiempo de espera de 0 milisegundos, primeramente el buzón será escaneado
  en busca de un mensaje que concuerde. En caso de que no exista ningún mensaje concordante
  tras el primer escaneo, el patrón `TIMEOUT` será satisfecho. Por ejemplo, esto nos permite
  recibir determinado tipo de mensajes donde unos tienen una prioridad mayor que otros:

    reactWithin(0) {
      case HighPriorityMsg => // ...
      case TIMEOUT =>
        react {
          case LowPriorityMsg => // ...
        }
    }

  En el ejemplo anterior, el actor procesa en primer lugar los mensajes `HighPriorityMsg` aunque
  exista un mensaje `LowPriorityMsg` más antiguo en el buzón. El actor sólo procesará mensajes
  `LowPriorityMsg` en primer lugar en aquella situación donde no exista ningún `HighProrityMsg`
  en el buzón.

Adicionalmente, el tipo `ReplyActor` añade el estado de ejecución `Actor.State.TimedSuspended`. Un actor suspendido, esperando la recepción de un mensaje mediante el uso de `reactWithin` se encuentra en dicho estado.

### El trait Actor

El trait `Actor` extiende de `ReplyReactor` añadiendo y/o sobrescribiendo los siguientes miembros:

- El método (añadido) `receive` se comporta del mismo modo que `react`, con la excepción
  de que puede retornar un resultado. Este hecho se ve reflejado en la definición del tipo,
  que es polimórfico en el tipo del resultado: `def receive[R](f: PartialFunction[Any, R]): R`.
  Sin embargo, la utilización de `receive` hace que el uso del actor
  sea más pesado, puesto que el hilo subyacente es bloqueado mientras
  el actor está esperando por la respuesta. El hilo bloqueado no está
  disponible para ejecutar otros actores hasta que la invocación del
  método `receive` haya retornado.

- El método (añadido) `link` permite a un actor enlazarse y desenlazarse de otro
  actor respectivamente. El proceso de enlazado puede utilizarse para monitorizar
  y responder a la terminación de un actor. En particular, el proceso de enlazado
  afecta al comportamiento mostrado en la ejecución del método `exit` tal y como
  se escribe en el la documentación del API del trait `Actor`.

- El atributo `trapExit` permite responder a la terminación de un actor enlazado,
  independientemente de los motivos de su terminación (es decir, carece de importancia
  si la terminación del actor es normal o no). Si `trapExit` toma el valor cierto en
  un actor, este nunca terminará por culpa de los actores enlazados. En cambio, siempre
  y cuando uno de sus actores enlazados finalice, recibirá un mensaje de tipo `Exit`.
  `Exit` es una "case class" que presenta dos atributos: `from` referenciando al actor
  que termina y `reason` conteniendo los motivos de la terminación.

#### Terminación y estados de ejecución

Cuando la ejecución de un actor finaliza, el motivo de dicha terminación puede ser
establecida de manera explícita mediante la invocación de la siguiente variante
del método `exit`:

    def exit(reason: AnyRef): Nothing

Un actor cuyo estado de terminación es diferente del símbolo `'normal` propaga
los motivos de su terminación a todos aquellos actores que se encuentren enlazados
a él. Si el motivo de la terminación es una excepción no controlada, el motivo de
finalización será una instancia de la "case class" `UncaughtException`.

El trait `Actor` incluye dos nuevos estados de ejecución. Un actor que se encuentra
esperando la recepción de un mensaje mediante la utilización del método `receive` se
encuentra en el método `Actor.State.Blocked`. Un actor esperado la recepción de un
mensaje mediante la utilización del método `receiveWithin` se encuentra en el estado
`Actor.State.TimeBlocked`.

## Estructuras de control

El trait `Reactor` define una serie de estructuras de control que simplifican el mecanismo
de programación con la función sin retorno `react`. Normalmente, una invocación al método
`react` no retorna nunca. Si el actor necesita ejecutar código a continuación de la invocación
anterior, tendrá que pasar, de manera explícita, dicho código al método `react` o utilizar
algunas de las estructuras que encapsulan este comportamiento.

La estructura de control más basica es `andThen`. Permite registrar una `closure` que será
ejecutada una vez el actor haya terminado la ejecución de todo lo demas.

    actor {
      {
        react {
          case "hello" => // processing "hello"
        }: Unit
      } andThen {
        println("hi there")
      }
    }

Por ejemplo, el actor anterior imprime un saludo tras realizar el procesado
del mensaje `hello`. Aunque la invocación del método `react` no retorna,
podemos utilizar `andThen` para registrar el código encargado de imprimir
el saludo a continuación de la ejecución del actor.

Nótese que existe una *atribución de tipo* a continuación de la invocación
de `react` (`:Unit`). Básicamente, nos permite tratar el resultado de
`react` como si fuese de tipo `Unit`, lo cual es legal, puesto que el resultado
de una expresión siempre se puede eliminar. Es necesario llevar a cabo esta operación
dado que `andThen` no puede ser un miembro del tipo `Unit`, que es el tipo del resultado
retornado por `react`. Tratando el tipo de resultado retornado por `react` como
`Unit` permite llevar a cabo la aplicación de una conversión implícita la cual
hace que el miembro `andThen` esté disponible.

El API ofrece unas cuantas estructuras de control adicionales:

- `loop { ... }`. Itera de manera indefinidia, ejecutando el código entre
las llaves en cada una de las iteraciones. La invocación de `react` en el
cuerpo del bucle provoca que el actor se comporte de manera habitual ante
la llegada de un nuevo mensaje. Posteriormente a la recepción del mensaje,
la ejecución continua con la siguiente iteración del bucle actual.

- `loopWhile (c) { ... }`. Ejecuta el código entre las llaves mientras la
condición `c` tome el valor `true`. La invocación de `react` en el cuerpo
del bucle ocasiona el mismo efecto que en el caso de `loop`.

- `continue`. Continua con la ejecución de la closure actual. La invocación
de `continue` en el cuerpo de un `loop`o `loopWhile` ocasionará que el actor
termine la iteración en curso y continue con la siguiente. Si la iteración en
curso ha sido registrada utilizando `andThen`, la ejecución continua con la
segunda "closure" pasada como segundo argumento a `andThen`.

Las estructuras de control pueden ser utilizadas en cualquier parte del cuerpo
del método `act` y en los cuerpos de los métodos que, transitivamente, son
llamados por `act`. Aquellos actores creados utilizando la sintáxis `actor { ... }`
pueden importar las estructuras de control desde el objeto `Actor`.

#### Futures

Los traits `RepyActor` y `Actor` soportan operaciones de envío de mensajes
(métodos `!!`) que, de manera inmediata, retornan un *future*. Un *future*,
es una instancia del trait `Future` y actúa como un manejador que puede
ser utilizado para recuperar la respuesta a un mensaje "send-with-future".

El emisor de un mensaje "send-with-future" puede esperar por la respuesta del
future *aplicando* dicha future. Por ejemplo, el envío de un mensaje mediante
`val fut = a !! msg` permite al emisor esperar por el resultado del future
del siguiente modo: `val res = fut()`.

Adicionalmente, utilizando el método `isSet`, un `Future` puede ser consultado
de manera no bloqueante para comprobar si el resultado está disponible.

Un mensaje "send-with-future" no es el único modo de obtener una referencia a
un future. Estos pueden ser creados utilizando el método `future`. En el siguiente
ejemplo, `body` se ejecuta de manera concurrente, retornando un future como
resultado.

    val fut = Future { body }
    // ...
    fut() // wait for future

Lo que hace especial a los futures en el contexto de los actores es la posibilidad
de recuperar su resultado utilizando las operaciones estándar de actores de
recepción de mensajes como `receive`, etc. Además, es posible utilizar las operaciones
basadas en eventos `react`y `reactWithin`. Esto permite a un actor esperar por el
resultado de un future sin la necesidad de bloquear el hilo subyacente.

Las operaciones de recepción basadas en actores están disponibles a través del
atributo `inputChannel` del future. Dado un future de tipo `Future[T]`, el tipo
de `inputChannel` es `InputChannel[T]`. Por ejemplo:

    val fut = a !! msg
    // ...
    fut.inputChannel.react {
      case Response => // ...
    }

## Canales

Los canales pueden ser utilizados para simplificar el manejo de mensajes
que presentan tipos diferentes pero que son enviados al mismo actor. La
jerarquía de canales se divide en `OutputChannel` e `InputChannel`.

Los `OutputChannel` pueden ser utilizados para enviar mensajes. Un
`OutputChannel` `out` soporta las siguientes operaciones:

- `out ! msg`. Envía el mensaje `msg` a `out` de manera asíncrona. Cuando `msg`
  es enviado directamente a un actor se incluye un referencia al actor emisor
  del mensaje.

- `out forward msg`. Reenvía el mensaje `msg` a `out` de manera asíncrona.
  El actor emisor se determina en el caso en el que `msg` es reenviado a
  un actor.

- `out.receiver`. Retorna el único actor que está recibiendo mensajes que están
  siendo enviados al canal `out`.

- `out.send(msg, from)`. Envía el mensaje `msg` a `out` de manera asíncrona,
  proporcionando a `from` como el emisor del mensaje.

Nótese que el trait `OutputChannel` tiene un parámetro de tipo que especifica el
tipo de los mensajes que pueden ser enviados al canal (utilizando `!`, `forward`,
y `send`). Este parámetro de tipo es contra-variante:

    trait OutputChannel[-Msg]

Los actores pueden recibir mensajes de un `InputChannel`. Del mismo modo que
`OutputChannel`, el trait `InputChannel` presenta un parámetro de tipo que
especifica el tipo de mensajes que pueden ser recibidos por el canal. En este caso,
el parámetro de tipo es covariante:

    trait InputChannel[+Msg]

Un `InputChannel[Msg]` `in`  soportal las siguientes operaciones.

- `in.receive { case Pat1 => ... ; case Patn => ... }` (y de manera similar,
  `in.receiveWithin`) recibe un mensaje proveniente de `in`. La invocación
  del método `receive` en un canal de entrada presenta la misma semántica
  que la operación estándar de actores `receive`. La única diferencia es que
  la función parcial pasada como argumento tiene tipo `PartialFunction[Msg, R]`
  donde `R` es el tipo de retorno de `receive`.

- `in.react { case Pat1 => ... ; case Patn => ... }` (y de manera similar,
  `in.reactWithin`). Recibe un mensaje de `in` utilizando la operación basada en
  eventos `react`. Del mismo modo que la operación `react` en actores, el tipo
  de retorno es `Nothing`, indicando que las invocaciones de este método nunca
  retornan. Al igual que la operación `receive` anterior, la función parcial
  que se pasa como argumento presenta un tipo más específico:

    PartialFunction[Msg, Unit]

### Creando y compartiendo canales

Los canales son creados utilizando la clase concreta `Channel`. Esta clase extiende
de `InputChannel` y `OutputChannel`. Un canal pueden ser compartido haciendo dicho
canal visible en el ámbito de múltiples actores o enviándolo como mensaje.

El siguiente ejemplo muestra la compartición mediante publicación en ámbitos:

    actor {
      var out: OutputChannel[String] = null
      val child = actor {
        react {
          case "go" => out ! "hello"
        }
      }
      val channel = new Channel[String]
      out = channel
      child ! "go"
      channel.receive {
        case msg => println(msg.length)
      }
    }

La ejecución de este ejemplo imprime la cadena "5" en la consola. Nótese que el
actor `child` únicamente tiene acceso a `out`, que es un `OutputChannel[String]`.
La referencia al canal, la cual puede ser utilizada para llevar a cabo la recepción
de mensajes, se encuentra oculta. Sin embargo, se deben tomar precauciones y
asegurarse que el canal de salida es inicializado con un canal concreto antes de que
`child` le envíe ningún mensaje. En el ejemplo que nos ocupa, esto es llevado a cabo
mediante el mensaje "go". Cuando se está recibiendo de `channel` utilizando el método
`channel.receive` podemos hacer uso del hecho que `msg` es de tipo `String`, y por
lo tanto tiene un miembro `length`.

Una alternativa a la compartición de canales es enviarlos a través de mensajes.
El siguiente fragmento de código muestra un sencillo ejemplo de aplicación:

    case class ReplyTo(out: OutputChannel[String])

    val child = actor {
      react {
        case ReplyTo(out) => out ! "hello"
      }
    }

    actor {
      val channel = new Channel[String]
      child ! ReplyTo(channel)
      channel.receive {
        case msg => println(msg.length)
      }
    }

La "case class" `ReplyTo` es un tipo de mensajes que utilizamos para distribuir
una referencia a un `OutputChannel[String]`. Cuando el actor `child` recibe un
mensaje de tipo `ReplyTo` éste envía una cadena a su canal de salida. El segundo
actor recibe en el canal del mismo modo que anteriormente.

## Planificadores

Un `Reactor`(o una instancia de uno de sus subtipos) es ejecutado utilizando un
*planificador*. El trait `Reactor` incluye el miembro `scheduler` el cual retorna el
planificador utilizado para ejecutar sus instancias:

    def scheduler: IScheduler

La plataforma de ejecución ejecuta los actores enviando tareas al planificador mediante
el uso de los métodos `execute` definidos en el trait `IScheduler`. La mayor parte
del resto de métodos definidos en este trait únicamente adquieren cierto protagonismo
cuando se necesita implementar un nuevo planificador desde cero; algo que no es necesario
en muchas ocasiones.

Los planificadores por defecto utilizados para ejecutar instancias de `Reactor` y
`Actor` detectan cuando los actores han finalizado su ejecución. En el momento que esto
ocurre, el planificador se termina a si mismo (terminando con cualquier hilo que estuviera
en uso por parte del planificador). Sin embargo, algunos planificadores como el
`SingleThreadedScheduler` (definido en el paquete `scheduler`) necesita ser terminado de
manera explícita mediante la invocación de su método `shutdown`).

La manera más sencilla de crear un planificador personalizado consisten en extender la clase
`SchedulerAdapter`, implementando el siguiente método abstracto:

    def execute(fun: => Unit): Unit

Por norma general, una implementación concreata utilizaría un pool de hilos para llevar a cabo
la ejecución del argumento por nombre `fun`.

## Actores remotos

Esta sección describe el API de los actores remotos. Su principal interfaz es el objecto
`RemoteActor` definido en el paquete `scala.actors.remote`. Este objeto facilita el conjunto
de métodos necesarios para crear y establecer conexiones a instancias de actores remotos. En los
fragmentos de código que se muestran a continuación se asume que todos los miembros de
`RemoteActor` han sido importados; la lista completa de importaciones utilizadas es la siguiente:

    import scala.actors._
    import scala.actors.Actor._
    import scala.actors.remote._
    import scala.actors.remote.RemoteActor._

### Iniciando actores remotos

Un actore remot es identificado de manera unívoca por un `Symbol`. Este símbolo
es único para la instancia de la máquina virual en la que se está ejecutando un
actor. Un actor remoto identificado con el nombre `myActor` puede ser creado del
siguiente modo.

    class MyActor extends Actor {
      def act() {
        alive(9000)
        register('myActor, self)
        // ...
      }
    }

Nótese que el nombre únicamente puede ser registrado con un único actor al mismo tiempo.
Por ejemplo, para registrar el actor *A* como `'myActor` y posteriormente registrar otro
actor *B* como `'myActor`, debería esperar hasta que *A* haya finalizado. Este requisito
aplica a lo largo de todos los puertos, por lo que registrando a *B* en un puerto diferente
no sería suficiente.

### Connecting to remote actors

Establecer la conexión con un actor remoto es un proceso simple. Para obtener una referencia remota
a un actor remoto que está ejecutándose en la máquina `myMachine` en el puerto 8000 con el nombre
`'anActor`, tendremos que utilizar `select`del siguiente modo:

    val myRemoteActor = select(Node("myMachine", 8000), 'anActor)

El actor retornado por `select` es de tipo `AbstractActor`, que proporciona esencialmente el mismo
interfaz que un actor normal, y por lo tanto es compatible con las habituales operaciones de envío
de mensajes:

    myRemoteActor ! "Hello!"
    receive {
      case response => println("Response: " + response)
    }
    myRemoteActor !? "What is the meaning of life?" match {
      case 42   => println("Success")
      case oops => println("Failed: " + oops)
    }
    val future = myRemoteActor !! "What is the last digit of PI?"

Nótese que la operación `select` es perezosa; no inicializa ninguna conexión de red. Simplemente crea
una nueva instancia de `AbstractActor` que está preparada para iniciar una nueva conexión de red en el
momento en que sea necesario (por ejemplo cuando el método '!' es invocado).
