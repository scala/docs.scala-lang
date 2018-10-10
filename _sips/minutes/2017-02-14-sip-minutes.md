---
layout: sips
title: SIP Meeting Minutes - 14th February 2017

partof: minutes
---

# Minutes

The following agenda was distributed to attendees:

| Topic | Reviewer |
| --- | --- |
| [SIP-XX - Improving binary compatibility with @stableABI](http://docs.scala-lang.org/sips/binary-compatibility.html) | Dmitry Petrashko |
| [SIP-NN - Allow referring to other arguments in default parameters](http://docs.scala-lang.org/sips/refer-other-arguments-in-args.html) | Pathikrit Bhowmick |
| [SIP-30 - @static fields and methods in Scala objects(SI-4581)](http://docs.scala-lang.org/sips/static-members.html) | Dmitry Petrashko, Sébastien Doeraene and Martin Odersky |
| [SIP-33 - Match infix & prefix types to meet expression rules](http://docs.scala-lang.org/sips/priority-based-infix-type-precedence.html) | Oron Port |

Jorge Vicente Cantero was the Process Lead. Travis (@travissarles) was acting secretary of the meeting.

## Date, Time and Location

The meeting took place at 5:00pm Central European Time / 8:00am Pacific Daylight
Time on Tuesday, 14th February 2017 via Google Hangouts.

Minutes were taken by Travis Lee, acting secretary.

## Attendees

Attendees Present:

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Dmitry Petrashko ([@DarkDimius](https://github.com/DarkDimius)), EPFL
* Lukas Rytz (Taking Adriaan Moore's place) ([@lrytz](https://github.com/lrytz)), Lightbend
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Iulian Dragos ([@dragos](https://github.com/dragos)), Independent
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead

Absent:
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), Scala Center
* Josh Suereth ([jsuereth](https://github.com/jsuereth)), Independent

## Proceedings

### Opening Remarks

### SIP 30 - @static fields and methods in Scala objects (SI-4581)
Jorge asks Dmitry to explain the biggest changes since the last proposal.
The biggest changes were addressing the feedback of the reader.
**Dmitry** First, he covers whether the static annotation can behave like the tail recursive annotation, which doesn't actually impact compilation but only warns if it isn't possible to make something static. Dmitry doesn't think the static annotation should have the same semantics because it affects binary compatibility.

Also, it depends on the superclass. If the superclass defined a field with the same name, the subclass can't have it. If we decide to make something static, we only be able to do it if the superclass doesn't have the fields with the same name. If static is done automatically and not triggered by the user we will enforce very strong requirements on superclass objects which is no-go.

I proposed a scheme (which I elaborate more on the details frictions in the SIP). I present several examples of possible issues in this case.

The other question was clarify how does the static effect initialization order and also describe if it effects binary compatibility. In general, emitting fields as static changes when they get initialized. They get initialized when the class is being class-loaded. The SIP in the current state requires static fields to be the first field defined in the object which means that these fields will be initialized before the other fields (indepenently of whether they are marked static or not). This leads to the fact that inside the object itself it will be possible to observe if something is static or not. Unless you rely on some class loader magic or reflection. At the same time, it is still possible to observe whether a field is static or not using multiple classes. Let's say you have a superclass of the object. If the superclass tries to see if the static field is initialized. In the case the field is static, it will be initialized before the superclass constructor executes. In case it's not static, it won't be initialized.

In short, it can make initlization happen earlier but never later. By enforcing syntax restriction would make it harder to observe this. But still it is possible to observe initialization requirements. This is a sweet spot because static should be independent. The point is you want some fields to be initialized without the initialization of an entire object. There is a side-effect that an object is initialized and there are multiple ways to observe it somehow.

The current SIP tries to make it behave as expected by the users in common cases.

**Lukas** Let's take a simple example, you have an object with a static field and a non-static field. Now the user code, the program access the non=static field first. That means the module gets initialized, but the static field lives in the companion class, right? So the static field is not initialized necessary even though you access the module. Assuming the field initializers have side effects then you can observe the differences. Then the static field will only be initialized at some point later when you use the class and not when you access the module.

**Dmitry** The idea is that the module should force execution of static initializers of the fields of the companion class. Which means that you won't be able to observe the difference in the order. It will look like all of them initialized at the same time.

**Martin** How can that be done?

**Dmitry** Just refer to the class in bytecode. Just mention the signature.

**Martin** Does that mean we have to change the immediate code to enforce that?

**Dmitry** Yeah you need to make one reference. It's very easy to write an expression in Scala which returns a null but ____ (7:45)

**Martin** Sure but we can't do that right now.

**Dmitry** I wouldn't do it.

**Martin** Are there good reasons to do that anyway?

**Dmitry** Maintaining semantics. If we don't do it, you can observe the fact that some fields are initialized, some aren't.

**Martin** But we only have to do it for those companion objects that have both statics and fields. It doesn't leak into binary compatibility.

**Jorge** You mentioned syntactic restrictions. Which kind?

**Dmitry** Static fields should proceed any non-static fields. the fact that static fields can be initialized earlier but not later means that you won't be able to observe the fact ____ (8:40). If we were to allow non static fields to proceed, because static fields can be initialized earlier, you can see ____.

**Sébastien** What about non-field statements?

**Dmitry** They should also be after all the statics.

**Sébastien** That's not written in the SIP.

**Dmitry** Will update. The last question is whether it will effect binary compatibility. YES! The point is you should be able to call and access stuff which is static through a more efficient way on the JVM. So removing @static annotation will be a binary incompatible change. If we add forwarders, adding static won't be a binary incompatible change because you'll still have fowarders which forward to the static thing. Both methods and fields.

**Lukas** But static fields are emitted as just fields and there's not getters and setters?

**Dmitry** Yes, but all the static stuff is emitted in the class. The question would be whether we emit anything in the object. We can still emit getter and setter in the object which will allow us to maintian binary compatibility with stuff which was compiled before static annotation was added. By following this idea, adding static is binary compatible,removing isn't.

**Sébastien** There's also an accessory to implement abstract definitions coming from a superclass or even overriding.

**Dmitry** With current the current proposal static fields don't implement and don't override stuff. It's forbidden to define a static field or method if there is a thing with the same name defined in any of the superclasses.  

**Jorge** That would mean that you can't add static fields without hurting binary compatibility because if you cannot override, then you want to emit a static field which has a concrete name but that name is inherited from a super trait.

**Dmitry** It won't compile then. It doesn't follow the requirements. If it compiles, it will be binary compatible.

**Sébastien** What if the superclass of the object defines something with the same name? There's nothing that prevents me from implemnting or overriding something from the superclass of the object. I think that's fine.

**Dmitry** The question would be about the initialization order

**Sébastien** It's not a problem because if you call it via the super class it means you haven't initialized the object completely anyway already.

**Dmitry** First of all it will disallow us to emit the final flag simply because final static fields can only be initialized from the static constructor. So if you have a final static field it can't implement setters.

**Sébastien** But you can't have a getter and a setter that read and write the static field.

**Dmitry** You can't write a _static final_ field again. Static fields are fine. If the static initialization is final, the only place where instructions which are writing it are allowed by hotspot are static initializer. So a possible restriction would be to say static final fields can't implement super class signatures. It would be very good to emit real static final fields because hotspot includes optimizations of those. Let's say if you were to discover some configuration statically and then use this to decide whether your implementation will take one branch or another, JIT will be able to ____ (14:32) eliminate this stuff. If the field isn't static, isn't final you don't have this guarantee.

**Iulian** And do you need the setter even for vars? If you've marked it final only for vars would that work?

**Dmitry** If it implements a super-trait vals, traits still have setters, even for vals.

**Sébastien** Yes, but that's only if it's mixed in. If it's overridden in the object, you don't need the setter. And if it's mixed in from the interface it doesn't have the static annotation anyway because that's now how ____ (15:20).

**Martin** Does it even have setters anymore? In dotty it definitely doesn't. I thought in 2.12 they changed the scheme now as well for trait vals. I don't think they require setters anymore.

**Dmitry** We don't require them but I'm not sure about Scalac. Does Scalac use initializers or trait setters?

**Sébastien** Trait setters.

**Dmitry** For us, we can easily say that we support final but we're trying to take into account scalac. So is there some important use case where you want to have static fields implement not-static signatures.

**Sébastien** No.

**Dmitry** Would you be willing to lean on a conservative way in this case?

**Sébastien** I was just trying to understand why there is a restriction. There doesn't seem to be any reason to but if there is a reason to, I don't see a use case.

**Dmitry** I would propose to record this but not change the SIP. To summarize in short, static is an annotation which does affect the compilation scheme which enforces some requirements where it can be which try to hide the fact that semantic would have changed by making it hard to observe this. The assumption is that most common users won't be able to observe the difference in semantics because we've restricted the syntax so that it would be hard to observe it. At the same time, for advanced users, it would allow to emit static fields and methods which will help if someone wants to write highly optimized code or interact with Java. I think the SIP is good as is. Given the fact ____ proposed some suggestions and clarifications about actual changes.

**Jorge** The question is whether this should be accepted or not. The problem is we don't have any implementation for Scalac. Does someone at Lightbend plan to work on this sometime soon?

**Seth** I don't think that's something we've discussed as a team yet.

**Jorge** We have to pass here both on this proposal as is right now but I think this could be dangerous in the case where we don't have an implementation for Scalac because maybe the details change and assume something in Scalac that the SIP is not able to predict or guard against it. Let's wait until next month and I will double check whether this is possible or not. Then I will get in touch with the Lightbend team to see whether this can be implemented or not. We'll decide in a month whether it should be accepted.

**Sébastien** ScalaJS already implemented it under another name but it's supposed to be conservative with respect to the aesthetic SIP in the sense that things that are allowed now with @jsstatic will also be allowed with @static. @static might open up a little bit more.

**Conclusion**  The static SIP proposal has to be implemented in Scala, as it's already present in Dotty. Triplequote (Iulian Dragos and Mirco Dotta) has offered to provide an implementation targeting 2.12.3.

### SIP-NN - [Allow referring to other arguments in default parameters](https://github.com/scala/docs.scala-lang/pull/653) (22:30)
Sébastien is the reviewer of this proposal.

**Sébastien** The SIP is a generalization of why we can use in default values of parameters. Especially referring to other arguments. In current Scala we can refer to arguments in previous parameter lists. This SIP wants to open that up. The way it's currently written, any parameter whether it's in the same parameter list or a previous one, it's also allowed to refer to argument on the right. The text needs to be elaborated on use cases. Doesn't address implementation concerns. Jorge answered on the PR with analysis of feasibility. I'm convinced that the version where we can also refer to a parameter on the right is infeasible because you can have arbitrary cycles and you don't know _______ ( 24:55) and it's completely impossible.

Other than that, in principle the SIP looks reasonable. It's possible to implement but it will cause more bytecode because now the third parameter will always need to receive the first two parameters to decide its value. We cannot decide that whether based on the default value actually refers to the previous parameters because that would be unstable in respect to binary compatibility. You need to always give to the default accessor all the prior parameters and that means it can potentially increase bytecode size. That needs to be analyzed maybe with a prototype, compare with Scala library.

**Jorge** I implemented this. I did a study and analysis of whether referring to parameters on the right is visible and I've explained in a comment in the PR why it's not. Basically this is a change that would require breaking binary compatibility and this would be targeting 2.13 so we are not gonna see it any time soon. I think that it would be very useful to have a look at the numbers to see how it affects bytecode size. I'll run some benchmarks and [report the results in the PR](https://github.com/scala/scala/pull/5641).

**Sébastien** SIP addendum, Type Members: In current Scala in the same way that you can only refer to parameters on terms previous parameter lists you can also only refer to path-dependent types of parameters in previous parameter lists and there is a small section in the SIP that says in the same vein we should allow to refer to path-dependent types of parameters in the same parameter list probably on the left. But for that one I don't have a good intuition of what effects it would have on type inference because type inference works parameter list per parameter list. The fact that you cannot refer to path-dependent types from the same parameter list means you can complete type inference from one parameter list without juggling path-dependent types within the same thing. Then when you move to the next one it's already inferred from the previous parameters. So it seems simpler but it's just a guest. Martin, would that be problematic?

**Martin** It would be a completely sweeping change. It's one of the key types that suddenly becomes recursive. So you can imagine what that means. Every time we construct such a type we can't do it inductively anymore. So basically it's the difference between polytypes and method types. I'm not saying it's impossible but it would be a huge change the compiler to do that. It's probably beyond what we can do for Scalac and just for Dotty we could think about it but it would be a very big change.

**Conclusion** The proposal has been numbered as SIP-32. The reference to type members seems tricky in implementation and interaction and it may be removed as the analysis of this SIP continues. The reference to other arguments in the same parameter list has been implemented by Jorge in [scala/scala#5641](https://github.com/scala/scala/pull/5641).

### SIP-XX: Improving binary compatibility with @stableABI (33:30)
**Dmitry** This proposes annotations which does not change the compilation scheme. A bit of background, Scala is being released with versions which can be either minor or major. So 2.11 is major version compared to 2.10. 2.11.1 and 2.11.2 are minor versions. Scala currently guarantees binary-compatibility between minor versions. At the same time, big parts of the scala community live in different major versions of the compiler which require them to publish artifacts multiple times because the same artifact will be incompatible if used in a different compiler.

**Martin** Or write it in Java

**Dmitry** The current situations has several solutions. The first is write it in Java, the second is make it a source dependency, download the source, and compile it in runtime and the third one use your best judgement is to try to write Scala which you assume will be safe. At the same time there is a tool which is called MiMa which helps you to see whether you did it right. MiMa allows you to compare two already-compiled artifacts and say whether they're compatible or not. This SIP proposes something which will complement MiMa in indicating whether the thing will be compatible with the next version. So currently if you were to write a file in Scala compiled with 2.10 and then compile it to 2.11, MiMa can after-the-fact say that it's incompatible and previous version should have been more conservative with the features it used. It does it after the fact when 2.11 was already released. Your artifacts are already on Bintray and it's too late. stableABI augments this use case by allowing you to get a guarantee that this artifact will be reliably compiled by all the compilers which call themselves Scala, across all the major versions, and can be used by the code compiled by those compilers. The idea would be that stableABI classes can be either used for projects which need to survive multiple Scala major versions or for other languages which don't have such a strong binary API guarantee such as Java and Kotlin. And additionally it has a very strong use case of allowing to use features of future compilers and future language releases in libraries which try to support users who are still on the old versions.

There are multiple use cases covered by this SIP. I think the two most important ones which are coming now are the migration from Dotty to Scala and the fact that we'll have two major releases existing at the same time. It would be nice if there was a common language for two compilers where people can reliably be in the safe situation publishing wise. If they publish an artifact compiled by Dotty, it can be safely used by Scalac, even if internally they use DOT advanced features. At the same time they won't be sure that they can use some features of Scalac that Dotty doesn't support and they will be able to use them inside the classes as long as they don't leak. So stableABI adds a check to the compiler which more or less ensures that there is no leakage of advanced features being used which could affect binaryABI. The guarantee which is assumed to be provided is if the same class is compiled with stableABI and it succeeds compilation it can be a replacement for the previous class if compiled by a different compiler. If the class has been changed by the user, they should use MiMa to find that the change was binary incompatible.

**Eugene** The migration to Dotty is something that is highly anticipated in the community. Concrete proposals are hard to facilitate this change. It's gonna be a big change. Very welcome. How do you write stuff that's going to be used from Java reliably?

**Martin** What I didn't see in the proposal was, so to move this forward you need to specify a minimum set of features that will be under stableABI. So if I write stableABI, you have to specify at least which sort of features will be accepted by the compiler.

**Dmitry** Instead of specify which features will be accepted, I said that the ground truth will be the source code. So the rule that is currently written is if compiler changes the signature from the one written by the user, it shouldn't be stableABI. The current specification more or less says if something isn't de-sugared in a way that affects stableABI, it's supported. We can additionally list features which aren't affected by this. But I think that the actual implementation, true, should be a strong overestimation.

**Martin** But in the end because it's something that binds not just the current compilers but all future compilers, once you guarantee a feature of stableABI you have to keep it. You can't change it anymore. So it needs to have a very strong specification what this is and the minimal one too. We don't want to overcommit ourselves.

**Dmitry** stableABI says how do you consume the class if it's successfully compiled. So let's say a future compiler fails to compile it, it's perfectly fine. We're talking about stableABI, not stable source code. Similarly, one of the motivations is there is some use cases which are compiled by Scalac...

**Martin** You say I have stableABI and Scala 2.12 accepts it and then Scala 2.13 comes up and says now I changed this thing so I won't compile this anymore.

**Dmitry** But you can still use the artifact compiled by the previous one.

**Martin** So you can break it, but you have to tell the user that you broke it.

**Dmitry** There will be a compilation error that says doesn't compile.

**Martin** I guess there would be a strong normative thing to say, well once one compiler guarantees certain things are okay under stableABI, future compilers will try not to break that. Otherwise, it wouldn't be that useful.

**Dmitry** It would be a nice guarantee to have. But so far the SIP tries to ensure more or less safe publication on the maven so the artifact can be consumed reliably by the users. It's more providing safety for the users, not for the creator of the library.

**Martin** In the end the compiler will have to check it and I think we have to give guidance to compilers what they should accept under stableABI.

**Dmitry** Do you think there should be a minimal set of features which is accepted and there should be a warning if there is a feature used outside of this set?

**Martin** Yes. We want to start now. Because I use something that a future compiler will break and it's not very useful to find out I can't upgrade my stuff because it's no longer stableABI. It will be useful that the compiler tells me now, look this thing is not guaranteed to be maintained in all future versions. Don't use it if you want to have an abstraction that for interchange.

**Dmitry** The binary compatibility is if you've already compiled it, you can just give the compiled artifact to the future compiler which will safely consume it. It doesn't mean that the future compiler can compile it. But you can use the already compiled artifact.

**Martin** I would think it would be much more interesting if it were source as well. That the future compiler would guarantee to compile it to the same bytecodes. Why do people write stuff in Java instead of Scala? Because you can't recompile this thing in a future compiler. We don't know whether the layout is the same or not so that was the thing where we need an antidote and say no if you write stableABI then even a Scala compiler will guarantee that it will be the same in future versions. If the thing succeeds in source, then it will be mapped to the same binary signatures as previously. We need to define a feature set now where that will be the case. Otherwise how are you going to implement that?

**Dmitry** The current proposed criteria is it's the same signature written by the user. No de-sugarings for users. Let's say a user uses repeated arguments. Repeated arguments changes the binary signature. If the compiler can't add new members to stableABI classes and the compiler can't change the binary ____ for existing members. For vals, we synthesize a getter. You have a member of the class which was written by the user. Similarly for vars you also get a setter. Lazy vals gets the accessor which lazy vals synthesize two members which have funny signatures and they have funny names. Default methods is a thing which is checked explicitly here. It's the only thing.

**We need this both in spec and doc**.

**Dmitry** If you have a stableABI class, can it's arguments take a Scala Option or not? Currently Option is not a stableABI class which means you can be in a funny situation in which you succeed to call a method which takes an option, during the execution it fails  _____ (50:13). The current proposal says that if you take non-stableABI classes as arguments or return types it gives you a warning. There isn't an all-or nothing approach that gets implemented.  The proposal is that one day the library may decide to have some superclasses which it promises are stableABI for collections, for options, for all the types that are stable. This will be API to use those classes from stableABI classes and from other languages.

**Sébastien** The goal is to be able to reuse artifacts from another compiler version or from a different compiler entirely but what happens to the @scala annotations? Is the classfile API might be the same between the same between 2.11 and 2.12 but it doesn't mean that the serialized form of the Scala signature notation is the same and can be read by the other compiler. So if you compile you source code against the binary artifacts that was published on maven your compilation will fail potentially with a crash or something like that because it cannot read the Scala-specific information from the class.

**Dmitry** The proposal is not to emit stable Scala signatures.

**Sébastien** So it really looks like a Java class file. Needs to be mentioned in the proposal.

**Martin** If you don't emit a Scala signature then you can't have a co- or contravariant type parameter because they are only expressed in Scala signatures, in Java it's not there. I don't see how that follows from the current proposal. Also, isn't it platform dependent?

**Sébastien** We do have a Java signature. Scala-JS doesn't disable classfile emission. When you say quickly compile, it uses the classfiles to quickly compile. when you use macros, it will extend from those classfiles. When you use an IDE it reduces the classfiles to identify things. When you use sbt, it uses classfiles to detect the changes. However, they aren't used by the ScalaJS linker.

**Seth** Does this need to be part of the compiler or can it move forward as a plugin or just as a check performed in MiMa? MiMa just compares two different APIs. Can it have this other job as well: seeing if it does anything outside of the boundaries.

**Dmitry** It could be a plugin, but it's not the right responsibility. Whoever develops the pluin does not have a way to enforce its rules by future compilers. Even though it provides guarantees to users, people providing these guarantees should be the people building the future versions. MiMa would need to be come half compiler. It's possible but not practical. If we say we emit Scala signatures, it's a strong promise and we allow users more. If everyone agrees, I would be glad.

**Martin** Five years from now, do we even know whether Scala compilers will emit Java signatures? To put that in the spec seems too pre-implemention-oriented. We might need a minimum Scala signature, even if we don't emit a Java one. The way the signatures are treated should be an implemenation aspect which should be exactly orthogonal to what we do with stableABI that we want to have something that is stable across lots of implementations.

**Jorge** We could make an exception that if we change the platform, then this annotation wouldn't apply.

**Dmitry** The current proposal proposes only top-level classes by _____ (1:01:43).

**Martin** It just has to be the guarantee of the whole package. The compiler has to translate this somehow so that future compilers will be able to read it in all eternity. That's the contract of stableABI.

**Dmitry** Does this automatically mean that all future compilers should emit Scala signatures?

**Martin** No, they just have to read whatever the previous one produced that had this thing.

**Dmitry** So it means that the artifact compiled by Dotty that doesn't emit Scala signatures won't be able to consume it from Scalac.

**Martin** That is true. You want to make a rule that newer compilers can ____ (1:02:54) the older ones but not the other way around.

**Conclusion**:  This proposal has been numbered as SIP-34. This is a complicated proposal that needs synchronization between the Scala and Dotty team to decide which encodings are good enough to make binary compatible. When Dmitry, the author of this proposal, figures out which features should be binary compatible and has more information on the future implementation, the SIP Committee will start the review period.

### SIP-33 - Match infix & prefix types to meet expression rules (1:04:00)

**Jorge** Making a change to the parser to make types behave as expressions. The other part of the proposal is about prefix types. Just like unary operators, he wants to have unary prefixes for type. So you can create a unary operator for types.

**Iulian** Covariant and contravariant operators can cause confusion.

**Eugene** But at least it's not ambiguous.

**Sébastien** At least as long as we don't have Covariant type alias or abstract type members. If I could define `type +A`, what does that mean?

**Eugene** If it's on the lefthand side of the equals signs type member, then it's covariant. As long as it's in a binding position, unary infix, should work.

**Jorge** We will vote later.

**Conclusion** The vote took place outside the meeting and the proposal was numbered. All of the committee members (including those absent) have accepted the change.
