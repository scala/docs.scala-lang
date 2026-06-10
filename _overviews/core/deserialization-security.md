---
layout: singlepage-overview
title: Deserialization Security and Gadget Chains

partof: deserialization-security

permalink: /overviews/core/:title.html
---

Deserializing untrusted data with Java's built-in serialization is a common source of remote code execution and other vulnerabilities on the JVM.
This guide explains how *gadget chains* work, shows examples involving the Scala standard library, and describes the Scala team's position on them.

> **The short version:** Never deserialize data you do not fully trust with `java.io.ObjectInputStream`.
> No validation *after* deserialization can make this safe.
> To exchange data with untrusted parties, use a format with an explicit schema (such as JSON or Protobuf) and a library that does not instantiate arbitrary classes.

## Why deserialization runs code

A `Serializable` class can define a custom `readObject` method (and similar callbacks `readResolve`, `readExternal`, `validateObject`):

```scala
private def readObject(in: java.io.ObjectInputStream): Unit = ...
```

`ObjectInputStream` calls these automatically while reconstructing an object, running logic that depends on the field values read from the stream.
Many standard library classes define such methods.
For example, lazy and concurrent collections restore internal state in a custom `readObject`.

Crucially, the attacker controls the byte stream: they choose **which classes are instantiated** and **what their fields contain**.
The usable classes are everything on the application's classpath.

## How gadget chains work

A *gadget* is a class that does something interesting while an object graph is deserialized: its `readObject` calls a method on a field, or one of its methods is invoked as the graph is rebuilt (a `Comparator`/`Ordering` comparison, a `hashCode`/`equals` map lookup).
A *gadget chain* connects gadgets so that deserializing a crafted object graph triggers a sequence of calls ending in a dangerous sink.
The typical Scala pattern is an entry-point class whose `readObject` routes control flow into invoking a `Function0`.
The attacker chooses **which** `Function0` runs by including its serialized instance in the stream.

`Function0` is the common target because arguments to by-name parameters (`x: => T`) compile to `Function0`, so they are everywhere.

Two misconceptions are worth dispelling:

- **"I only deserialize a `String`, so I'm safe."** No.
  If the application does `ois.readObject().asInstanceOf[String]`, the attacker can put a different class (say `java.util.PriorityQueue`) in the stream.
  Its `readObject` runs first, so the damage is done before the cast fails.
- **"`LambdaMetafactory` lambdas can't be gadgets."** No.
  An attacker can craft a `java.lang.invoke.SerializedLambda` targeting an existing LMF lambda body method with chosen captured arguments.

## Entry points in the standard library

**CVE-2022-36944 — `LazyList`.**
The entry point `scala.collection.immutable.LazyList` could be steered into evaluating an attacker-chosen `Function0`.
It was assigned [CVE-2022-36944](https://nvd.nist.gov/vuln/detail/CVE-2022-36944) (requested by the reporter, not by the Scala team) and addressed in [scala/scala#10118](https://github.com/scala/scala/pull/10118).

**`PriorityQueue` / `TrieMap`.**
A later report used an entry point in the JDK: `java.util.PriorityQueue.readObject` calls `Comparator.compare`, which can be a Scala `Ordering` derived from a function, which invokes a `Function0`.
`scala.collection.concurrent.TrieMap.readObject` was reported as a second entry point.

## `Function0` gadgets in the standard library

The Scala standard library contains `Function0` classes that perform interesting actions such as I/O, for example in `scala.sys.process`:

```scala
class IStreamBuilder(stream: => InputStream, label: String)
class URLInput(url: URL) extends IStreamBuilder(url.openStream(), url.toString)
```

The by-name `stream` becomes a `Function0` calling `url.openStream()`, with the attacker-controlled `URL` captured in the serialized instance.

## The Scala team's position

We expect new gadget chains through standard library classes to be discovered.
We do not believe such discoveries merit any further CVEs.
Removing individual gadgets does not make an application that deserializes untrusted data safe; it only forces the attacker to pick a different gadget.

We therefore treat deserialization gadget chains as an **application-side vulnerability**: the real defect is doing Java deserialization on untrusted data.
That is what application authors and security researchers should target.

We still might address known entry points, but only if the cost (compatibility, complexity) is not too high.
The `Function0` gadgets themselves will not change: making existing classes non-serializable is a breaking change.

## Mitigations

The primary defense is to never deserialize untrusted data: don't feed attacker-influenced bytes to `ObjectInputStream`.
To exchange data with untrusted parties, use a schema-based format instead, such as JSON or Protobuf.

## Further reading

- [OWASP: Deserialization of Untrusted Data](https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data)
- [JEP 290: Filter Incoming Serialization Data](https://openjdk.org/jeps/290)
- [Scala Security Policy](https://www.scala-lang.org/security/)
