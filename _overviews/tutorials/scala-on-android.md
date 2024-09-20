---
layout: singlepage-overview
title: A Tutorial on writing Scala apps on Android

partof: scala-on-android

permalink: /tutorials/:title.html
---

By Maciej Gorywoda

## Introduction
The Android platform runs on Android Runtime which is a virtual machine based on JVM and, although not identical, [it's very similar to it](https://www.baeldung.com/java-jvm-vs-dvm). As a consequence, it is possible to write Android apps in Scala, and in fact it's possible to do it in more than one way. Here, in this document, we will focus on how to write a modern Android app with Scala that uses GraalVM Native Image and JavaFX. At the end of this tutorial, you will find links to materials discussing other options. 

## How to build an Android app with GraalVM Native Image 

#### Requirements

We will use Linux. On Windows, it is possible to follow this tutorial and get a working Android app [if you use WSL2](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux). For building, we will use Maven. 

Download the latest GraalVM, Community Edition based on Java 11, from [here](https://github.com/graalvm/graalvm-ce-builds/releases). Set it up as your JVM by creating an environment variable `GRAALVM_HOME` pointing to the GraalVM home directory, by setting the environment variable `JAVA_HOME` to `${GRAALVM_HOME}`, and by adding  `${GRAALVM_HOME}/bin` to your `PATH`. If you are using Bash, add the following lines to your `~/.bash_profile`:

```
export GRAALVM_HOME=<path to GraalVM home directory>
export JAVA_HOME=$GRAALVM_HOME
export PATH=$GRAALVM_HOME/bin:$PATH
```

When you type in `java -version` it should display something like this now:

```
> java -version
openjdk version "11.0.10" 2021-01-19
OpenJDK Runtime Environment GraalVM CE 21.0.0 (build 11.0.10+8-jvmci-21.0-b06)
OpenJDK 64-Bit Server VM GraalVM CE 21.0.0 (build 11.0.10+8-jvmci-21.0-b06, mixed mode, sharing)
```

(The GraalVM version may differ)

 Type `native-image` to check if it’s already there on the path. If not, install it with:

```
gu install native-image
```

`gu` should be available now in your console because of `$GRAALVM_HOME/bin` in your `PATH`. Also, [read this](https://www.graalvm.org/reference-manual/native-image/#prerequisites) and install whatever you need.

You will need `adb`, “Android Debug Bridge”, to connect to your Android device and install the app on it. [Here you can find more on how to do it](https://www.fosslinux.com/25170/how-to-install-and-setup-adb-tools-on-linux.htm).

Make sure your `gcc` is at least version 6. [You can try following these steps](https://tuxamito.com/wiki/index.php/Installing_newer_GCC_versions_in_Ubuntu). On top of that, you will need some specific C libraries (like GTK) to  build the native image, and it varies from one computer to another, so I  can’t tell you exactly what to do. But it shouldn’t be a big problem.  Just follow error messages saying that you lack something and google how to install them. In my case this was the list:

```
  libasound2-dev (for pkgConfig alsa)
  libavcodec-dev (for pkgConfig libavcodec)
  libavformat-dev (for pkgConfig libavformat)
  libavutil-dev (for pkgConfig libavutil)
  libfreetype6-dev (for pkgConfig freetype2)
  libgl-dev (for pkgConfig gl)
  libglib2.0-dev (for pkgConfig gmodule-no-export-2.0)
  libglib2.0-dev (for pkgConfig gthread-2.0)
  libgtk-3-dev (for pkgConfig gtk+-x11-3.0)
  libpango1.0-dev (for pkgConfig pangoft2)
  libx11-dev (for pkgConfig x11)
  libxtst-dev (for pkgConfig xtst)
```



#### The example app

if you reached this point and everything seems to work, it means you  probably should be able to compile and run the example app called [HelloScala](https://github.com/makingthematrix/scalaonandroid/tree/main/helloscala). HelloScala is based on [HelloGluon](https://github.com/gluonhq/gluon-samples/tree/master/HelloGluon) from [Gluon samples](https://github.com/gluonhq/gluon-samples). Gluon is a company that maintains JavaFX and provides libraries that give us a layer of abstraction between our code and the device — be it desktop, Android, or iOS.  It has some interesting implications: for example, you will see in the code that we check if we are  on the desktop instead of Android, because if yes then we need to  provide window size for our app. If we are on Android, we can just let  the app’s window take the whole screen. If you decide to write something more complex with this tech stack, you will quickly see that you can  use Gluon’s libraries and JavaFX (maybe together with [ScalaFX](https://scalafx.github.io/)) to achieve the same results other developers get by tinkering with  Android SDK, while you are writing code that can be easily re-used on  other platforms as well.

In the `pom.xml` of HelloScala you will find a list of plugins and dependencies our example app uses. Let’s take a look at some of them.

- We will use Java 16 and Scala 2.13. 
- [A tiny Scala library](https://mvnrepository.com/artifact/org.scalameta/svm-subs) which resolves [this problem](https://github.com/scala/bug/issues/11634) in the interaction between Scala 2.13 and GraalVM Native Image.
- For the GUI we will use JavaFX 16.  
- We will use two Gluon libraries:  [Glisten](https://docs.gluonhq.com/charm/javadoc/6.0.6/com.gluonhq.charm.glisten/module-summary.html) and [Attach](https://gluonhq.com/products/mobile/attach/). Glisten enriches JavaFX with additional functionality specifically  designed for mobile applications. Attach is an abstraction layer over  the underlying platform. For us, it means we should be able to use it to  access everything on Android from the local storage to permissions to  push notifications.
- [scala-maven-plugin](https://github.com/davidB/scala-maven-plugin) lets us  use Scala in Maven builds *(well, d’oh)*. Thank you, David!
- [gluonfx-maven-plugin](https://github.com/gluonhq/gluonfx-maven-plugin) lets us compile Gluon dependencies and JavaFX code into a native image. In its configuration you will find the `attachList` with Gluon Attach modules we need: `device`, `display`, `storage`, `util`, `statusbar`, and `lifecycle`. From those we will use directly only `display` (to set the dimensions of the app's windows in case we run the app on a desktop and not in the full-screen mode on a mobile) and `util` (to check if we run the app on a desktop or a mobile), but the others are needed by these two and by Gluon Glisten.   
- [javafx-maven-plugin](https://github.com/openjfx/javafx-maven-plugin) which is a requirement for gluonfx-maven-plugin.

### The code

[HelloScala](https://github.com/makingthematrix/scalaonandroid/tree/main/helloscala) is just a simple example app — the actual Scala code only sets up a few widgets and displays them. The [`Main`](https://github.com/makingthematrix/scalaonandroid/blob/main/helloscala/src/main/scala/helloscala/Main.scala) class extends  `MobileApplication` from the Glisten library and then construct the main view programmatically, in two methods: `init()` for creating the widgets, and `postInit(Scene)` for decorating them. Since we want to test the app on our laptop before we install it on a mobile, we use `postInit` also to check on which platform the app is being run, and if it's a desktop, we set the dimensions on the app's window. In the case of a mobile it's not necessary — our app will take the whole available space on the screen. 

Another way to set up and display widgets in JavaFX is to use a WYSIWYG editor called [Scene Builder](https://gluonhq.com/products/scene-builder/) which generates FXML files, a version of XML, that you can then load into your app. You can see how it is done in another example: [HelloFXML](https://github.com/makingthematrix/scalaonandroid/tree/main/HelloFXML). For more complex  applications, you will probably mix those two approaches: FXML for  more-or-less static views and programmatically set up widgets in places  where the UI within one view changes in reaction to events (think, for  example, of a scrollable list of incoming messages). 

### How to run the app

Building an  Android native image takes time, so we want to avoid doing it too often. Even before running the app for the first time, you should invest some  time in unit, component, and integration tests, so that if you change  something in your app you could still be sure it works correctly even  before any manual testing. Then, to check how your GUI looks like and  works, use:

```
mvn gluonfx:run
```

If everything looks fine, build the native image… but first, for your desktop:

```
mvn gluonfx:build gluonfx:nativerun
```

After all, we work on a cross-platform solution here. Unless you want to test features of your app that will only work on a  mobile device, you can first run it as a standalone desktop application. This will again let you test some layers of the app without actually  running it on an Android device. And then, if all looks good, or if you  decide to skip this step:

```
mvn -Pandroid gluonfx:build gluonfx:package
```

Successful execution of this command will create an APK file in the` target/client/aarch64-android/gvm` directory. Connect your Android phone to the computer with a USB cable, give the computer permission to send files to the phone, and type `adb devices` to check if your phone is recognized. It should display something like this in the console:

```
> adb devices
List of devices attached
16b3a5c8	device
```

Now you should be able to install the app on the connected device with `adb install <path to APK>` and a moment later you should see a new icon on your device’s main  screen. When you click on the icon, it should open approximately the  same screen as the desktop version of your app.

Installation might not work for a  number of reasons, one of the most popular being that your Android  simply does not allow installing apps this way. Go to Settings, find  “Developers options”, and there enable “USB debugging” and “Install via  USB”. 

If everything works, and you see the app’s screen on your device, type `adb logcat | grep GraalCompiled` to see the log output. Now you can click the button with the magnifying glass icon on the app’s screen, and you should see `"log something from Scala"`  printed to the console. Of course, before you write a more complex app, please  look into plugins in the IDE of your choice that can display logs from  `adb logcat` in a better way. For example

* [Logcat in Android Studio](https://developer.android.com/studio/debug/am-logcat)
* [Log Viewer for Android Studio and IntelliJ](https://plugins.jetbrains.com/plugin/10015-log-viewer)
* [Logcat plugin for VSCode](https://marketplace.visualstudio.com/items?itemName=abhiagr.logcat)

Here's a [screenshot](https://github.com/makingthematrix/scalaonandroid/blob/main/helloscala/helloscala.png) of what the app looks like when you open it.

## Next Steps and Other Useful Reading

If you managed to build one of the  example apps and want to code something more complex, there are at least a few ways you can learn how to do it:

* Take a look at these articles about the history of Scala on Android and a discussion of other ways to write Android apps: [#1](https://makingthematrix.wordpress.com/2021/03/17/scala-on-android/), [#2](https://www.scalawilliam.com/scala-android-opportunity/).

- Read more and experiment with [JavaFX](https://openjfx.io/). You can start with its official documentation and with [this huge list of tutorials by Jacob Jenkov](http://tutorials.jenkov.com/javafx/index.html).
- Install [Scene Builder](https://gluonhq.com/products/scene-builder/) and learn how to build GUI with it. Apart from the docs, you can find a lot of tutorials about it on YouTube.
- Look through [Gluon’s documentation of Glisten and Attach](https://docs.gluonhq.com/) to learn how to make your app look better on a mobile device, and how to get access to your device’s features.
- Download an example from [Gluon’s list of samples](https://docs.gluonhq.com/) and rewrite it to Scala. And when you do, let me know! 
- Look into [ScalaFX](https://scalafx.github.io/) — a more declarative, Scala-idiomatic wrapper over JavaFX.
- Download some other examples from [the “Scala on Android” repository on GitHub](https://github.com/makingthematrix/scalaonandroid). Contact me, if you write an example app of your own and want me to include it.
- Join us on the official Scala discord — we have a [#scala-android channel](https://discord.gg/UuDawpq7) there.
- There is also an [#android channel](https://discord.gg/XHMt6Yq4) on the “Learning Scala” discord.
- Finally, if you have any questions, [you can always find me on Twitter](https://twitter.com/makingthematrix).

