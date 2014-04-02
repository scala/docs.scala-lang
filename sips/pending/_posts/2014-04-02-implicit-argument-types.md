---
layout: sip
disqus: true
title: SIP-23 - Implicit argument types

---

**By: Mikael Mayer**

## Abstract ##

This SIP describes a change in the type argument syntax by providing constructs to remove argument types. Automatic type inference is available in `val` and `var` declarations, but no language construct has been created to have type inference on arguments for classes and methods. The newly proposed syntax allows implicit type checking of arguments, thus allowing quicker prototyping when creating new classes.

## Example ##

Argument names are often redundant with their type. In short, we propose the following constructs to have automatic type inference on argument:

    
    
    object Test {
	    import pkg.{customName: ClassName}
        // Do something with customName of type ClassName
        def method1(customName) = ???
        
        import pkg.{Class2Name => personnalizedName: CN}
        // def method2(className: ClassName, className2: ClassName, personnalizedName: CN)
        def method2(className, className2, personnalizedName) = ???
        
        // case class Innerclass(customName: ClassName)
        case class InnerClass(customName)
        
        //              (className: ClassName) => className.methodInClassName()
        val anonymous = className => className.methodInClassName()

        // Declares an implicit type for variable cname in scope.
        implicit type cname: ClassName
        
        // Use of variable name cname.
        def method3(cname, i: Int) = cname.methodInClassName(i)
    }

## Case 1: Implicit argument type based on name ##

When arguments are named the same way their type is, with another case format, we can infer the type. For example, it is common to encounter constructs such as:

    def drawEvent(canvas: Canvas, event: Event) ...
    def convert(vec: Vec2) ...
    def call(leonView: LeonView) ...
    def takeBest(dag: Dag) ...

Without removing clarity, if the name matches exactly the name of a class in scope, then the compiler directly infers the type:

    def drawEvent(canvas, event) ... // Compiled as def drawEvent(canvas: Canvas, event: Event)
    def call(leonView) ...           // Compiled as def call(leonView: LeonView) ...
    def takeBest(dag) ...            // Compiled as def takeBest(dag: Dag) ...

If the name is the name of the class plus a suffix, this could also be guessed:

    def linkEvents(event1, event2) = .... // Compiled as def linkEvents(event1: Event, event2: Event) ...
    def call(leonViewTemporary) = ....    // Compiled as def call(leonViewTemporary: LeonView) ...

If there are multiple classes available, e.g. `EventPrimary` and `EventSecondary`, then the user should fix the ambiguity himself by adding the corresponding type.

### Parametrized types ###

With parametrized types, there would be another challenge. This can be overcome by checking if the longest prefix subtype is a parameterizable type, such as List, and then continue with the remaining variable.

    def concatenate(listString) = ... // Compiled as def concatenate(listString: List[String])

### Anonymous functions ###
    
This would especially work well with anonymous functions. For example, compare:

    (list: List[Int], int1: Int, int2: Int) => list.drop(int1).take(int2)

with:

    (listInt, int1, int2) => listInt.drop(int1).take(int2)

We are saving 15 chars out of 69, so more than 20%.

## Case 2: Implicit variable value ##

Because variables are often abbreviated, it would be easier to have a typical variable name declaration for a type. The syntax could be in the import clause with a colon:

    import ch.epfl.lara.synthesis.{evt: Event, lView: LeonView}
    class Test(lView) {
      def call(evt) = lView.makeHappen(evt)
    }

We could even have class renaming at the same time, e.g.:

    import ch.epfl.lara.synthesis.{Event => evt: Evt, LeonView => lView: LView}
    class Test(lView) {
      def call(evt) = lView.makeHappen(evt)
    }

This implicit variable implicit type checking does not break any current syntax I am aware of.
    
In order to accommodate common variable names such as i or j, we could also have the following declarations at class or object level:

    object Test {
      implicit type i: Int, j: Int
      implicit type evt: Evt = Event, lView: LView = LeonView
      def add(i, j) = i + j
      def div(i, j) = i / j
      def mult(i, j) = i * j
      def copyEvent(lView, evt, i, j) = lView.events(add(i, j)).copy(evt)
    }
	
### Parametrized types ###

Similarly, we could create variable aliases for types and use them in scope:

    implicit type lStr: List[String]
    def concatenate(lStr) = ... // Compiled as def concatenate(lStr: List[String])

### Anonymous functions ###
    
Similarly, the declaration of anonymous functions could be more explicit.

    implicit type lstInt: List[Int], i: Int, j: Int
   
    val subList = (lstInt, i, j) => lstInt.drop(i).take(j)
    val ovrList = (lstInt, i, j) => lstInt.take(i) + lstInt.drop(i+j)


