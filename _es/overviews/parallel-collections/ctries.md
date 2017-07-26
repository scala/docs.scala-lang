---
layout: multipage-overview
title: Tries Concurrentes

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 4
language: es
---

La mayoría de las estructuras de datos no garantizan un recorrido consistente
si la estructura es modificada durante el recorrido de la misma. De hecho,
esto también sucede en la mayor parte de las colecciones mutables. Los "tries"
concurrentes presentan una característica especial, permitiendo la modificación
de los mismos mientras están siendo recorridos. Las modificaciones solo son visibles
en los recorridos posteriores a las mismas. Ésto aplica tanto a los "tries" secuenciales
como a los paralelos. La única diferencia entre ambos es que el primero de ellos
recorre todos los elementos de la estructura de manera secuencial mientras que
el segundo lo hace en paralelo.

Esta propiedad nos permite escribir determinados algoritmos de un modo mucho más
sencillo. Por lo general, son algoritmos que procesan un conjunto de elementos de manera
iterativa y diferentes elementos necesitan distinto número de iteraciones para ser
procesados.

El siguiente ejemplo calcula la raíz cuadrada de un conjunto de números. Cada iteración
actualiza, de manera iterativa, el valor de la raíz cuadrada. Aquellos números cuyas
raíces convergen son eliminados del mapa.

    case class Entry(num: Double) {
      var sqrt = num
    }

    val length = 50000

	// prepare the list
    val entries = (1 until length) map { num => Entry(num.toDouble) }
    val results = ParTrieMap()
    for (e <- entries) results += ((e.num, e))

	// compute square roots
    while (results.nonEmpty) {
      for ((num, e) <- results) {
        val nsqrt = 0.5 * (e.sqrt + e.num / e.sqrt)
        if (math.abs(nsqrt - e.sqrt) < 0.01) {
          results.remove(num)
        } else e.sqrt = nsqrt
      }
    }

Fíjese que en el anterior método de cálculo de la raíz cuadrada (método Babylonian)
(\[[3][3]\]) algunos números pueden converger mucho más rápidamente que otros. Por esta razón,
queremos eliminar dichos números de la variable `results` de manera que solo aquellos
elementos sobre los que realmente necesitamos trabajar son recorridos.

Otro ejemplo es el algoritmo de búsqueda en anchura, el cual iterativamente expande el "nodo cabecera"
hasta que encuentra un camino hacia el objetivo o no existen más nodos a expandir. Definamos
un nodo en mapa 2D como una tupla de enteros (`Int`s). Definamos un `map` como un array de
booleanos de dos dimensiones el cual determina si un determinado slot está ocupado o no. Posteriormente,
declaramos dos "concurrent tries maps" -- `open` contiene todos los nodos que deben ser expandidos
("nodos cabecera") mientras que `close` continene todos los nodos que ya han sido expandidos. Comenzamos
la búsqueda desde las esquinas del mapa en busca de un camino hasta el centro del mismo --
e inicializamos el mapa `open` con los nodos apropiados. Iterativamamente, y en paralelo,
expandimos todos los nodos presentes en el mapa `open` hasta que agotamos todos los elementos
que necesitan ser expandidos. Cada vez que un nodo es expandido, se elimina del mapa `open` y se
añade en el mapa `closed`. Una vez finalizado el proceso, se muestra el camino desde el nodo
destino hasta el nodo inicial.

	val length = 1000

	// define the Node type
    type Node = (Int, Int);
    type Parent = (Int, Int);

	// operations on the Node type
    def up(n: Node) = (n._1, n._2 - 1);
    def down(n: Node) = (n._1, n._2 + 1);
    def left(n: Node) = (n._1 - 1, n._2);
    def right(n: Node) = (n._1 + 1, n._2);

    // create a map and a target
    val target = (length / 2, length / 2);
    val map = Array.tabulate(length, length)((x, y) => (x % 3) != 0 || (y % 3) != 0 || (x, y) == target)
    def onMap(n: Node) = n._1 >= 0 && n._1 < length && n._2 >= 0 && n._2 < length

    // open list - the nodefront
    // closed list - nodes already processed
    val open = ParTrieMap[Node, Parent]()
    val closed = ParTrieMap[Node, Parent]()

    // add a couple of starting positions
    open((0, 0)) = null
    open((length - 1, length - 1)) = null
    open((0, length - 1)) = null
    open((length - 1, 0)) = null

    // greedy bfs path search
    while (open.nonEmpty && !open.contains(target)) {
      for ((node, parent) <- open) {
        def expand(next: Node) {
          if (onMap(next) && map(next._1)(next._2) && !closed.contains(next) && !open.contains(next)) {
            open(next) = node
          }
        }
        expand(up(node))
        expand(down(node))
        expand(left(node))
        expand(right(node))
        closed(node) = parent
        open.remove(node)
      }
    }

    // print path
    var pathnode = open(target)
    while (closed.contains(pathnode)) {
      print(pathnode + "->")
      pathnode = closed(pathnode)
    }
    println()


Los "tries" concurrentes también soportan una operación atómica, no bloqueante y de
tiempo constante conocida como `snapshot`. Esta operación genera un nuevo `trie`
concurrente en el que se incluyen todos los elementos es un instante determinado de
tiempo, lo que en efecto captura el estado del "trie" en un punto específico.
Esta operación simplemente crea una nueva raíz para el "trie" concurrente. Posteriores
actualizaciones reconstruyen, de manera perezosa, la parte del "trie" concurrente que se
ha visto afectada por la actualización, manteniendo intacto el resto de la estructura.
En primer lugar, esto implica que la propia operación de `snapshot` no es costosa en si misma
puesto que no necesita copiar los elementos. En segundo lugar, dado que la optimización
"copy-and-write" solo copia determinadas partes del "trie" concurrente, las sucesivas
actualizaciones escalan horizontalmente. El método  `readOnlySnapshot` es ligeramente
más efeciente que el método `snapshot`, pero retorna un mapa en modo solo lectura que no
puede ser modificado. Este tipo de estructura de datos soporta una operación atómica y en tiempo
constante llamada `clear` la cual está basada en el anterior mecanismo de `snapshot`.

Si desea conocer en más detalle cómo funcionan los "tries" concurrentes y el mecanismo de
snapshot diríjase a \[[1][1]\] y \[[2][2]\].

Los iteradores para los "tries" concurrentes están basados en snapshots. Anteriormente a la creación
del iterador se obtiene un snapshot del "trie" concurrente, de modo que el iterador solo recorrerá
los elementos presentes en el "trie" en el momento de creación del snapshot. Naturalmente,
estos iteradores utilizan un snapshot de solo lectura.

La operación `size` también está basada en el mecanismo de snapshot. En una sencilla implementación,
la llamada al método `size` simplemente crearía un iterador (i.e., un snapshot) y recorrería los
elementos presentes en el mismo realizando la cuenta. Cada una de las llamadas a `size` requeriría
tiempo lineal en relación al número de elementos. Sin embargo, los "tries" concurrentes han sido
optimizados para cachear los tamaños de sus diferentes partes, reduciendo por tanto la complejidad
del método a un tiempo logarítmico amortizado. En realidad, esto significa que tras la primera
llamada al método `size`, las sucesivas llamadas requerirán un esfuerzo mínimo, típicamente recalcular
el tamaño para aquellas ramas del "trie" que hayan sido modificadas desde la última llamada al método
`size`. Adicionalmente, el cálculo del tamaño para los "tries" concurrentes y paralelos se lleva a cabo
en paralelo.

## Referencias

1. [Cache-Aware Lock-Free Concurrent Hash Tries][1]
2. [Concurrent Tries with Efficient Non-Blocking Snapshots][2]
3. [Methods of computing square roots][3]

  [1]: http://infoscience.epfl.ch/record/166908/files/ctries-techreport.pdf "Ctries-techreport"
  [2]: http://lampwww.epfl.ch/~prokopec/ctries-snapshot.pdf "Ctries-snapshot"
  [3]: http://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method "babylonian-method"
