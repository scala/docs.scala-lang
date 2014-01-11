---
layout: page
title: Running the Test Suite
---

Partest is a custom parallel testing tool that we use to run the test suite for the Scala compiler and library. Go the scala project folder from your local checkout and run it via `ant` or standalone as follows.

## Using ant

The test suite can be run by using ant from the command line:

	$ ant test.suite

## Standalone
	
There are launch scripts `partest` and `partest.bat` in the `test` folder of the scala project. To have partest run failing tests only and print details about test failures to the console, you can use 
	
	./test/partest --show-diff --show-log --failed
	
You can get a summary of the usage by running partest without arguments.

* Most commonly you want to invoke partest with an option that tells it which part of the tests to run. For example `--all`, `--pos`, `--neg` or `--run`.
* You can test individual files by specifying individual test files (`.scala` files) as options. Several files can be tested if they are from the same category, e.g., `pos`.
* You can enable output of log and diff using the `-show-log` and `-show-diff` options.
* If you get into real trouble, and want to find out what partest does, you can run it with option `--verbose`. This info is useful as part of bug reports.
* Set custom path from where to load classes: `-classpath <path>` and `-buildpath <path>`.
* You can use the `SCALAC_OPTS` environment variable to pass command line options to the compiler.
* You can use the `JAVA_OPTS` environment variable to pass command line options to the runner (e.g., for `run/jvm` tests).
* The launch scripts run partest as follows:
	
		scala -cp <path to partest classes> scala.tools.partest.nest.NestRunner <options>
	
	Partest classes from a `quick` build, e.g., can be found in `./build/quick/classes/partest/`.
	
	Partest will tell you where it loads compiler/library classes from by adding the `partest.debug` property:
	
		scala -Dpartest.debug=true -cp <path to partest classes> scala.tools.partest.nest.NestRunner <options>



## ScalaCheck tests

Tests that depend on [ScalaCheck](https://github.com/rickynils/scalacheck) can be added under folder `./test/files/scalacheck`. A sample test:

	import org.scalacheck._
	import Prop._
	
	object Test {
		val prop_ConcatLists = property{ (l1: ListInt, l2: ListInt) =>
			l1.size + l2.size == (l1 ::: l2).size 
		}

		val tests = List(("prop_ConcatLists", prop_ConcatLists))
	}

## Troubleshooting

### Windows

Some tests might fail because line endings in the `.check` files and the produced results do not match. In that case, set either 

	git config core.autocrlf false 

or 

	git config core.autocrlf input 