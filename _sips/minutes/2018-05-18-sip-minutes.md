---
layout: sips
title: SIP Meeting Minutes - 18th May 2018

partof: minutes
---

# Minutes

Open discussion about SIP role and transition with given evolution of Scala language, from Scala 2 to Scala 3. The conversation was prompted due to the wake of Martin Odersky's keynote at Scala Days, Berlin 2018 introducing the future of Scala - Scala 3 (link to the key note will be added once published by the organisers).

Jorge Vicente Cantero was the Process Lead and Darja Jovanovic was the secretary.


## Date and Location
The meeting took place on 18th May 2018 in Zalando offices in Berlin at 5 PM CET, Germany day after ScalaDays 2018 finished.
All the attendees were in the same room and it was broadcasted via Google HangOuts.

[Watch on Scala Center YouTube channel](https://youtu.be/q2LVmTe9qmU?t=3)

Minutes were taken by Darja Jovanovic.

## Attendees

* Martin Odersky ([@odersky](https://github.com/odersky)), EPFL
* Jorge Vicente Cantero ([@jvican](https://github.com/jvican)), Process Lead
* Seth Tisue ([@SethTisue](https://github.com/SethTisue)), Lightbend
* Heather Miller ([@heathermiller](https://github.com/heathermiller)), Scala Center
* Sébastien Doeraene ([@sjrd](https://github.com/sjrd)), EPFL
* Adriaan Moors ([@adriaanm](https://github.com/adriaanm)), Lightbend
* Miles Sabin ([@milessabin](https://github.com/milessabin)), Independent
* Darja Jovanovic ([@darjutak](https://github.com/darjutak)), Scala Center

## Not present

* Iulian Dragos ([@dragos](https://github.com/dragos)), Triplequote
* Eugene Burmako ([@xeno-by](https://github.com/xeno-by)), Twitter
* Josh Suereth ([@jsuereth](https://github.com/jsuereth)), Independent


## Proceedings
### Opening Remarks

Quorum was not met, but the meeting still took place in a form of an open discussion. 

The meeting was devoted to discussing how SIP Committee should handle the approval of Scala 3 changes into the specification and how it would organize during the next year, given that Scala 3 will be feature freeze by then.

Topics discussed:

1. SIP Committee role in the upcoming Scala 3 release. 

All present agreed that SIP Committee should continue its mandate in approving the Scala 3 changes. 

2. SIP Committee role in Scala 2

SIP Committee will focus on Scala 3 changes and creating the spec, **Martin** ([YouTube time: 6'54''](https://youtu.be/q2LVmTe9qmU?t=414)), Scala 2 SIP proposals will continue as before, but at a slower pace.

3. How to structure and organise the workflow

Given the short time and amount of decisions that need to be made, the Committee proposed and agreed about the following

*Structure*

a) Have a **list of changes**, grouped in batches that would be decided within the next year, meeting once a month
b) **Plan** - full and strucutured list of changes that need to be implemented consolidated between the Committee members using a shared a Google doc
c) **Public comments** - each batch should be published on the Contributors thread, for a month at a time in order to have community involved, share their opinion and contribute. Advise was proposed - each thread should clearly point out start and end date of collecting the comments/suggestions.

*Organisation*

**Jorge** will be in charge of posting the monthly batches on contributors thread. One of the Committee Members (SIP reviewer) or SIP author will be assigned/volunteer to follow the conversations, answer questions and finally summarize the discussion to be submitted to the Committee in order to make inclusive decision.
The first batch should be the removals as per list already prepared for 2.14 release.

The above mentioned structure and organisation was gathered throughout the meeting, here are the snippets:

- **Adriaan** suggests the batches, to be able to move faster ([YouTube time: 5'51''](https://youtu.be/q2LVmTe9qmU?t=351)) and gives a reason why ([YouTube time: 8'25''](https://youtu.be/q2LVmTe9qmU?t=505)).
- **Seth** suggests to put the changes up for public comment ([YouTube time: 7.12](https://youtu.be/q2LVmTe9qmU?t=432))
- At ([YouTube time: 24'04''](https://youtu.be/q2LVmTe9qmU?t=1444)) **Martin** suggests a list of changes that needs to be considered 
- **Heather** lays down the structure/organisation idea ([YouTube time: 13'51''](https://youtu.be/q2LVmTe9qmU?t=824))
- Between [YouTube time: 19'38'' and 24'](https://youtu.be/q2LVmTe9qmU?t=1178) the Committee discusses and agrees on the next steps: 1. Batches; 2. Plan; 3. Public comments on Contributors

4. Other: spec, quorum

**Heather** bings up an important question "What about Scala spec" ([YouTube time: 4'49''](https://youtu.be/q2LVmTe9qmU?t=289)) to which **Martin** responds within the next year we should know which features are included as a first priority but that spec should not be left for the last minute.

**Miles** ([YouTube time: 8'45](https://youtu.be/q2LVmTe9qmU?t=525))suggested that SIP proposals should include draft specification changes to save time and effort pulling the eventual spec update together.

**Martin** ([YouTube time: 37'59''](https://youtu.be/q2LVmTe9qmU?t=2279)) also raised a question about the decision making process, asking if it would be better to change to simple majority when it comes to voting. This was rejected by most of the Members and agreed it should be discussed in a different meeting or time.

**Conclusion** The first batch should be agreed upon, posted on the Contributors thread for public comments. Such discussion should be summaraized and included in the next meeting (22nd June 2018, after ScalaDays NewYork). 
