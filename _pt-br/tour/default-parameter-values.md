---
layout: tour
title: Parâmetro com Valor Padrão
partof: scala-tour

num: 32
next-page: named-arguments
previous-page: annotations
language: pt-br
---

Scala provê a capacidade de fornecer parâmetros com valores padrão que podem ser usados para permitir que um usuário possa omitir tais parâmetros se preciso.

Em Java, é comum ver um monte de métodos sobrecarregados que servem apenas para fornecer valores padrão para determinados parâmetros de um método maior. Isso é especialmente verdadeiro com os construtores:

```java
public class HashMap<K,V> {
  public HashMap(Map<? extends K,? extends V> m);
  /** Cria um novo HashMap com a capacidade padrão (16)
    * and loadFactor (0.75)
    */
  public HashMap();
  /** Cria um novo HashMap com um fator de carga padrão (0.75) */
  public HashMap(int initialCapacity);
  public HashMap(int initialCapacity, float loadFactor);
}
```

Há realmente apenas dois construtores aqui; Um que recebe um map e outro que tem uma capacidade e um fator de carga. O terceiro e o quarto construtores estão lá para permitir que os usuários do <code>HashMap</code> criem instâncias com os valores padrões de fator de carga e capacidade, que provavelmente são bons para a maioria dos casos.

O maior problema é que os valores usados como padrões estão declarados no Javadoc *e* no código. Manter isso atualizado é complicado, pois pode ser esquecido facilmente. Um abordagem típica nesses casos seria adicionar constantes públicas cujos valores aparecerão no Javadoc:

```java
public class HashMap<K,V> {
  public static final int DEFAULT_CAPACITY = 16;
  public static final float DEFAULT_LOAD_FACTOR = 0.75;

  public HashMap(Map<? extends K,? extends V> m);
  /** Cria um novo HashMap com capacidade padrão (16)
    * e fator de carga padrão (0.75)
    */
  public HashMap();
  /** Cria um novo HashMap com um fator de carga padrão (0.75) */
  public HashMap(int initialCapacity);
  public HashMap(int initialCapacity, float loadFactor);
}
```

Enquanto isso nos impede de nos repetir, é menos do que expressivo.

Scala adiciona suporte direto para isso:

```scala mdoc
class HashMap[K,V](initialCapacity:Int = 16, loadFactor:Float = 0.75f) {
}

// Utiliza os valores padrões (16, 0.75f)
val m1 = new HashMap[String,Int]

// Inicial com capacidade 20, e fator de carga padrão
val m2= new HashMap[String,Int](20)

// Sobreescreve ambos os valores
val m3 = new HashMap[String,Int](20,0.8f)

// Sobreescreve somente o fator de carga
// parâmetro nomeado
val m4 = new HashMap[String,Int](loadFactor = 0.8f)
```

Observe como podemos tirar proveito de *qualquer* valor padrão usando [parâmetros nomeados](named-arguments.html).

