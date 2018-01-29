---
layout: tour
title: 기본 파라미터 값

discourse: false

partof: scala-tour

num: 32
language: ko

next-page: named-arguments
previous-page: annotations
---

스칼라는 파라미터에 기본 값을 부여해서 호출자가 해당 파라미터를 생략할 수 있는 편리함을 제공한다.

자바에선 거대한 메소드의 특정 파라미터에 기본 값을 제공하기 위해 수 많은 메소드를 오버로드하는 상황을 어렵지 않게 찾을 수 있다. 이는 특히 생성자의 경우에 그러하다.

    public class HashMap<K,V> {
      public HashMap(Map<? extends K,? extends V> m);
      /** 기본 크기가 (16)이고 로드 팩터가 (0.75)인 새로운 HashMap의 생성 */
      public HashMap();
      /** 기본 로드 팩터가 (0.75)인 새로운 HashMap의 생성 */
      public HashMap(int initialCapacity);
      public HashMap(int initialCapacity, float loadFactor);
    }

여기선 실제론 다른 맵을 받는 생성자와 크기와 로드 팩터를 받는 생성자, 단지 이 두 생성자가 있을 뿐이다. 세 번째와 네 번째 생성자는 <code>HashMap</code>의 사용자가 대부분의 경우에서 아마도 유용하게 사용할 기본 값으로 로드 팩터와 크기를 설정해 인스턴스를 생성할 수 있도록 해준다.

더 큰 문제는 기본으로 사용되는 값이 자바독과 코드 *모두*에 존재한다는 점이다. 이를 최신으로 유지하는 일은 쉽게 잊어버리게 된다. 이런 문제를 피하기 위해선 자바독에 해당 값이 표시될 퍼블릭 상수를 추가하는 접근을 주로 사용한다.

    public class HashMap<K,V> {
      public static final int DEFAULT_CAPACITY = 16;
      public static final float DEFAULT_LOAD_FACTOR = 0.75;

      public HashMap(Map<? extends K,? extends V> m);
      /** 기본 크기가 (16)이고 로드 팩터가 (0.75)인 HashMap을 생성 */
      public HashMap();
      /** 기본 로드 팩터가 (0.75)인 새로운 HashMap의 생성 */
      public HashMap(int initialCapacity);
      public HashMap(int initialCapacity, float loadFactor);
    }

이 때문에 우리가 계속 반복하는 상황은 줄지만, 표현력은 더욱 줄어든다.

스칼라는 이에 관한 직접적인 지원을 추가했다.

    class HashMap[K,V](initialCapacity:Int = 16, loadFactor:Float = 0.75) {
    }

    // 기본 값을 사용
    val m1 = new HashMap[String,Int]

    // 초기 크기는 20, 로드 팩터는 기본 값
    val m2= new HashMap[String,Int](20)

    // 둘 모드를 오버라이드
    val m3 = new HashMap[String,Int](20,0.8)

    // 이름을 지정한 인수를 통해 로드 팩터만을 오버라이드
    val m4 = new HashMap[String,Int](loadFactor = 0.8)

*모든* 기본 값에 [이름을 지정한 파라미터]({{ site.baseurl }}/tutorials/tour/named-arguments.html)를 활용할 수 있음을 기억하자.

윤창석, 이한욱 옮김
