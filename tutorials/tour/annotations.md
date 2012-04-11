---
layout: tutorial
title: Annotations

disqus: true

tutorial: scala-tour
num: 3
---

Annotations associate meta-information with definitions.

A simple annotation clause has the form `@C` or `@C(a1, .., an)`. Here, `C` is a constructor of a class `C`, which must conform to the class `scala.Annotation`. All given constructor arguments `a1, .., an` must be constant expressions (i.e., expressions on numeral literals, strings, class literals, Java enumerations and one-dimensional arrays of them).

An annotation clause applies to the first definition or declaration following it. More than one annotation clause may precede a definition and declaration. The order in which these clauses are given does not matter.

The meaning of annotation clauses is _implementation-dependent_. On the Java platform, the following Scala annotations have a standard meaning.

|           Scala           |           Java           |
|           ------          |          ------          |
|  [`scala.SerialVersionUID`](http://www.scala-lang.org/api/2.9.1/scala/SerialVersionUID.html)   |  [`serialVersionUID`](http://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html#navbar_bottom) (field)  |
|  [`scala.cloneable`](http://www.scala-lang.org/api/2.9.1/scala/cloneable.html)   |  [`java.lang.Cloneable`](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/Cloneable.html) |
|  [`scala.deprecated`](http://www.scala-lang.org/api/2.9.1/scala/deprecated.html)   |  [`java.lang.Deprecated`](http://java.sun.com/j2se/1.5.0/docs/api/java/lang/Deprecated.html) |
|  [`scala.inline`](http://www.scala-lang.org/api/2.9.1/scala/inline.html) (since 2.6.0)  |  no equivalent |
|  [`scala.native`](http://www.scala-lang.org/api/2.9.1/scala/native.html) (since 2.6.0)  |  [`native`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.remote`](http://www.scala-lang.org/api/2.9.1/scala/remote.html) |  [`java.rmi.Remote`](http://java.sun.com/j2se/1.5.0/docs/api/java/rmi/Remote.html) |
|  [`scala.serializable`](http://www.scala-lang.org/api/2.9.1/index.html#scala.annotation.serializable) |  [`java.io.Serializable`](http://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html) |
|  [`scala.throws`](http://www.scala-lang.org/api/2.9.1/scala/throws.html) |  [`throws`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.transient`](http://www.scala-lang.org/api/2.9.1/scala/transient.html) |  [`transient`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.unchecked`](http://www.scala-lang.org/api/2.9.1/scala/unchecked.html) (since 2.4.0) |  no equivalent |
|  [`scala.volatile`](http://www.scala-lang.org/api/2.9.1/scala/volatile.html) |  [`volatile`](http://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (keyword) |
|  [`scala.reflect.BeanProperty`](http://www.scala-lang.org/api/2.9.1/scala/reflect/BeanProperty.html) |  [`Design pattern`](http://docs.oracle.com/javase/tutorial/javabeans/writing/properties.html) |

In the following example we add the `throws` annotation to the definition of the method `read` in order to catch the thrown exception in the Java main program.

> A Java compiler checks that a program contains handlers for [checked exceptions](http://docs.oracle.com/javase/specs/jls/se5.0/html/exceptions.html) by analyzing which checked exceptions can result from execution of a method or constructor. For each checked exception which is a possible result, the **throws** clause for the method or constructor _must_ mention the class of that exception or one of the superclasses of the class of that exception.
> Since Scala has no checked exceptions, Scala methods _must_ be annotated with one or more `throws` annotations such that Java code can catch exceptions thrown by a Scala method.

    package examples
    import java.io._
    class Reader(fname: String) {
      private val in = new BufferedReader(new FileReader(fname))
      @throws(classOf[IOException])
      def read() = in.read()
    }

The following Java program prints out the contents of the file whose name is passed as the first argument to the `main` method.

    package test;
    import examples.Reader;  // Scala class !!
    public class AnnotaTest {
        public static void main(String[] args) {
            try {
                Reader in = new Reader(args[0]);
                int c;
                while ((c = in.read()) != -1) {
                    System.out.print((char) c);
                }
            } catch (java.io.IOException e) {
                System.out.println(e.getMessage());
            }
        }
    }

Commenting out the `throws` annotation in the class Reader produces the following error message when compiling the Java main program:

    Main.java:11: exception java.io.IOException is never thrown in body of
    corresponding try statement
            } catch (java.io.IOException e) {
              ^
    1 error

### Java Annotations ###

**Note:** Make sure you use the `-target:jvm-1.5` option with Java annotations.

Java 1.5 introduced user-defined metadata in the form of [annotations](http://java.sun.com/j2se/1.5.0/docs/guide/language/annotations.html). A key feature of annotations is that they rely on specifying name-value pairs to initialize their elements. For instance, if we need an annotation to track the source of some class we might define it as

    @interface Source {
      public String URL();
      public String mail();
    }

And then apply it as follows

    @Source(URL = "http://coders.com/",
            mail = "support@coders.com")
    public class MyClass extends HisClass ...

An annotation application in Scala looks like a constructor invocation, for instantiating a Java annotation one has to use named arguments:

    @Source(URL = "http://coders.com/",
            mail = "support@coders.com")
    class MyScalaClass ...

This syntax is quite tedious if the annotation contains only one element (without default value) so, by convention, if the name is specified as `value` it can be applied in Java using a constructor-like syntax:

    @interface SourceURL {
        public String value();
        public String mail() default "";
    }

And then apply it as follows

    @SourceURL("http://coders.com/")
    public class MyClass extends HisClass ...

In this case, Scala provides the same possibility

    @SourceURL("http://coders.com/")
    class MyScalaClass ...

The `mail` element was specified with a default value so we need not explicitly provide a value for it. However, if we need to do it we can not mix-and-match the two styles in Java:

    @SourceURL(value = "http://coders.com/",
               mail = "support@coders.com")
    public class MyClass extends HisClass ...

Scala provides more flexibility in this respect

    @SourceURL("http://coders.com/",
               mail = "support@coders.com")
        class MyScalaClass ...

This extended syntax is consistent with .NET's annotations and can accomodate their full capabilites.





