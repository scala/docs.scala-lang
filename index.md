---
layout: default
title: Working on a place to put Scala documentation...
---
Figuring it out with Github Pages and Jekyll.

Woohoo!

# Test! #

Here is an example of some code.

    def testFixedPool(parArray: ParArray[Int]) {
      //Thread.sleep(5000)  // so we can see this thread pool in jvisualvm
    
      val fixedPool = TaskRunners.makeFixedThreadPool(2)
      parArray.taskRunner = fixedPool
    
      val mapped = parArray.map( (x: Int) => x*2)
      assertSeq(mapped)

      fixedPool.shutdown()
    }

# SIPs #

Check out the [SIP documents](sips/index.html)

