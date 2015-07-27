[paulp's feelings about Booleans, extracted from a code review comment]

There's no reason to nest boolean conditionals far enough to use the word "nest": it should always be flat and either &&-centric or ||-centric. Here is how I might write this one. Note the use of parentheses rather than curly braces. This is an important difference, which might be hard to appreciate until you have had to track down bugs introduced when someone left a bit of a boolean expression hanging off the side as a no-op. This is also (part of) why the && and ||s should be as I have positioned them here - it is far more difficult to make an error of that kind.
```scala
      private def isOmittable = (
           sym.isParamAccessor && sym.isPrivateLocal
        || sym.isOuterAccessor && sym.owner.isEffectivelyFinal && !sym.isOverridingSymbol
      )
      def maybeOmittable(sym: Symbol) = (
           !isDelayedInitSubclass
        && sym.owner == clazz
        && isOmittable
      )
```
When the logic is presented cleanly, redundant parentheses become noise. In order to work on the compiler you are required to know that && binds more tightly than ||. If that knowledge isn't enough to easily see what an expression means, then the expression is too complicated, poorly formatted, or both.