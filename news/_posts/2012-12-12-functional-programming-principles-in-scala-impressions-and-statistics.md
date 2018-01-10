---
layout: inner-page-no-masthead
title: "Functional Programming Principles in Scala: Impressions and Statistics"
discourse: true
---
###### By Heather Miller and Martin Odersky

<div class="summary">
  In this post, we discuss our experience giving the popular MOOC Functional Programming Principles in Scala, and provide some insight into who our course participants were, how, overall, students performed in the course, and how students felt about the course. We visualize a lot of these statistics in a number of interactive plots, and we go on to publicly release <a href="http://github.com/heathermiller/progfun-stats">the data and the code</a> to generate these plots within a fun Scala-based project aimed at allowing you to manipulate these statistics with functional programming in Scala, to generate HTML/Javascript for easily visualizing and sharing them. We encourage you to share what you find with us&mdash; we'll share a number of your plots in a follow-up post!
</div>

[_Functional Programming Principles in Scala_](https://www.coursera.org/course/progfun) is a [MOOC](http://en.wikipedia.org/wiki/Massive_open_online_course) given by [our research group](http://lamp.epfl.ch) at [EPFL](http://www.epfl.ch), whose first edition was recently completed on [Coursera](http://www.coursera.org). The certificates of completion for those who passed the course have been released, and in looking back as the dust settles&mdash; it was a great experience to have done a class like that which greatly exceeded our expectations in more than one dimension.

We had more than 50,000 registered students&mdash; an unfathomably large number in the context of traditional teaching. While large, that number doesn't tell the whole story; as is typical for a MOOC, a statistical majority of those students participate no further beyond watching a couple of videos to find out what the course is about. Of the 50,000, about 21,000 students participated in the interactive in-video quizzes that are part of the lectures, and a remarkable 18,000 unique students attempted at least one programming assignment. A whopping 9,593 students successfully completed the course and earned a certificate of completion&mdash; that's an incredible 20% of students, which blows the average 10% rate of completion for MOOCs out of the water.

## A Novel Course Format

Beyond entertaining record numbers of markedly motivated and enthusiastic students, the course also introduced a few novelties, in particular with regard to how students interacted with it.

The course was run as a series of short online videos, 5-7 of which were released each week, each around 8-12 minutes, complete with transcriptions (and thus crowd-sourced translations into other languages), as well as controls for speeding up or slowing down the playback of the video. Within each video were interactive quizzes, not-for-credit, which required the student to participate realtime in the lecture.

Simultaneously with this online part of the course, we ran a live course at EPFL for 2nd year undergraduate students in Computer Science. The EPFL students followed the online lectures and quizzes just like any other participant registered on Coursera. In addition, we organized interactive sessions were students at EPFL could answer questions and review the course material. To satisfy the requirements of their degree, those students also had to take written exams which accounted for a majority of their final grade on their EPFL academic record.

The lectures were complemented by weekly or bi-weekly assignments, all of which were programming exercises. How this course handled these programming assignments was quite unique in relation to other similar MOOCs. Students were able to submit their assignments via the command-line, which would be compiled remotely, and graded automatically by subjecting the students' solutions to a number of test cases, and also analyzing it with a custom style checker that enforced that solutions were written in a functional style. Students were encouraged to write their own test suites for each assignment in an effort to ensure that all possible test cases were covered. Students were able re-submit as often as they liked without penalty, until the deadline by which each assignment had to be handed in. Upon each submission, students would receive feedback about how their code fared our automated test suite, including hints about which of our tests failed and cost them points, or which aspects of style needed to be improved (also a score deduction). This format resulted in a markedly different trend in how students seemed to navigate course material, how they seemed to learn, and certainly how they scored. What's particularly interesting is the strong tendency of students to continue improving their submission. That is, upon receiving the rather immediate feedback from our grading suite, students tended to re-submit until they received perfect scores&mdash; as is evidenced by the below overall score distribution for the course (the maximum score is 80 points). Incredibly, of all possible scores, the highest concentration of any one score was that of perfect score of 80/80.

A certificate was given to students who earned at least 60% of all available points, and a certificate with distinction was given to those who obtained 80% or more. That amounts to 1,894 students who received a normal certificate, and a whopping 7,699 certificates with distinction. Of those, 3,939 were perfect scores.

<p>&nbsp;</p>
<div style="text-align: center;"><h6>Breakdown of Final Scores</h6><div id="grades-breakdown">&nbsp;</div></div>

## Statistics

Those of you reading this who were enrolled in the course might recall that, several weeks ago, we asked that you complete a survey, describing yourself, and your experience in the course. What programming languages/paradigms are you most comfortable with?  Did you find the assignments too challenging? About 7,492 students responded to our survey. In addition to the survey, we also have statistics on many aspects of the course from the Coursera site&mdash; an amount of data that one can only acquire when running a massive online course such as this.

For example, as mentioned above, a success rate of 20% is quite high for an online course. One might suspect that it was because the course was very easy, but in our previous experience that's not the case. In fact, the online course is a direct adaptation of a 2nd year course that was given at EPFL for a number of years and that has a reputation of being rather tough. If anything, the material in the online course was a bit more compressed than in the previous on-campus class.

In particular, 57% of all respondents to the survey rated the overall course as being 3, "Just Right", on a scale from 1 to 5, with 1 being "Too Easy" and 5 being "Too Difficult. With regard to programming assignments specifically, 40% rated the assignments as being 3, "Just Right", while 46% rated assignments as being 4 "Challenging".

Another point which might be particularly interesting is the fact that the difficulty rating appears to be independent of whether people have a background in Computer Science/Software Engineering or not. One might guess that this could mean that learning Scala is not much more difficult without a formal educational background in Computer Science.

<div style="text-align: center;"><h6>Perceived Difficulty Relative to Educational Background</h6><div id="difficulty-to-field">&nbsp;</div><span style="font-size: 10px;"><i><b>Scale:</b> 1 - Too Easy, 2 - Easy, 3 - Just Right, 4 - Challenging, 5 - Too Difficult</i></span><p>&nbsp;</p></div>

While a majority of the students in the course have degrees in Computer Science/Software Engineering, it was nonetheless interesting to discover how many students from fields as varied as Life Sciences and Fine Arts have participated in the course! Here's what it looks like:

<div style="text-align: center;"><h6>Participants' Fields of Study</h6><div id="fields-of-study">&nbsp;</div></div>

However, we were still interested to see how the formal education of participants influenced their assessment of the perceived difficulty. It turns out that, of those who have or have pursued university degrees&mdash; Bachelors or Masters degrees, there was almost no difference in perceived difficulty. The only marked differences appeared to the far left and the far right of the spectrum.

<div style="text-align: center;"><h6>Perceived Difficulty Relative to Level of Education</h6><div id="difficulty-to-education">&nbsp;</div><span style="font-size: 10px;"><i><b>Scale:</b> 1 - Too Easy, 2 - Easy, 3 - Just Right, 4 - Challenging, 5 - Too Difficult</i></span><p>&nbsp;</p></div>

This leads to the question&mdash; what is the educational profile of the students taking the course? The answer is somewhat surprising. It turns out that most students taking the course have already completed a master's degree!

<div style="text-align: center;"><h6>Participants' Highest Degrees</h6><div id="degrees">&nbsp;</div></div>

We also collected information from respondents about their prior experience with other programming languages and paradigms, and perhaps not surprisingly, we found that most people considered themselves Java experts, while few considered themselves experienced in any form of functional programming.

<div style="text-align: center;"><h6>Participants' Experience With Other Languages/Paradigms</h6><div id="languages-percentages">&nbsp;</div></div>

However, in comparing people who considered themselves "experts" or "fluent" across a few paradigms, we found that C/C++ experts considered the course marginally less challenging than did Java experts. And, not surprisingly, experts in functional programming considered the course not to be particularly difficult.

<div style="text-align: center;"><h6>Perceived Difficulty of Expert Participants in Other Languages/Paradigms</h6><div id="difficulty-to-expertise">&nbsp;</div><span style="font-size: 10px;"><i><b>Scale:</b> 1 - Too Easy, 2 - Easy, 3 - Just Right, 4 - Challenging, 5 - Too Difficult</i></span><p>&nbsp;</p></div>

One of the most interesting questions for us running the course was: why were you interested in taking the course in the first place? Here is the answer:

<div style="text-align: center;"><h6>What interested you in the Functional Programming Principles in Scala course?</h6><div id="what-interested-you">&nbsp;</div></div>

We also wanted to know in what type of scenario people would like to apply what they've learned in the course. Here's what we found:

<div style="text-align: center;"><h6>Where do you plan to apply what you've learned in this course?</h6><div id="where-apply">&nbsp;</div></div>

Another question that we couldn't wait to hear the answer to was whether course participants thought that the course was worth the time they invested in it. We were delighted to find that a vast majority of students rated the course as being well worth their time!

<div style="text-align: center;"><h6>Was the course worth the time you spent?</h6><div id="worthit">&nbsp;</div></div>

Furthermore, we found a similar trend of students interested in taking our tentative follow-up MOOC!

<div style="text-align: center;"><h6>Would you be interested in taking a follow-up course?</h6><div id="followup">&nbsp;</div></div>

We also collected numbers about the used programming tools. First, we were interested in the editor (or IDE) of choice that participants use in their professional lives or in hobby projects. In a second step, we wanted to compare this to the editor that participants used (primarily) for completing the exercises of the course. Here are the results:

<div style="text-align: center;"><h6>Which editor do you normally use, and which editor did you use for the course?</h6><div id="editors">&nbsp;</div></div>

The collected numbers are markedly different. In no small part this is due to the fact that the [Scala IDE for Eclipse](http://scala-ide.org) introduced a new [worksheet](https://github.com/scala-ide/scala-worksheet/wiki/Getting-Started) component used throughout the lectures.

We'd like to close with some fun, and partially surprising, information on the demographics of those who took the course and completed our survey. Here is a world map showing the number of participants per country&mdash; darker colors indicate a larger number of students per-country:

<div style="text-align: center;"><h6>Absolute Number of Participants Per Country</h6><div id="map-population" style="width: 700px; height: 350px;">&nbsp;</div></div>
&nbsp;<p>&nbsp;</p><p>&nbsp;</p>

Here's that graph again, relating that population of students who enrolled in the course with the population  of the respective country:

<div style="text-align: center;"><h6>Number of Participants Per Country Relative to Countries' Population</h6><div id="map-density" style="width: 700px; height: 350px;">&nbsp;</div></div>
&nbsp;<p>&nbsp;</p><p>&nbsp;</p>

## Get the data and explore it with Scala!

For those of you who want to have a little bit of fun with the numbers, we've made all of the data publicly available, and we've made a small Scala project out of it. In particular, we put the code that we used to produce the above plots on [github (progfun-stats)](http://www.github.com/heathermiller/progfun-stats).

For those of you who have taken the course and are itching for some fun additional exercises in functional programming, one of our suggestions is to tinker with and extend this project! You'll find the code examples for generating most of these plots available in this post, in the above repository.

Given sufficient interest, we're planning on posting a follow-up blog article with interesting observations and plots that you have produced. So, tinker away! Feel free to post links to your graphs in the comments below.

## Closing Thoughts

Overall, it was an intense 7 weeks for us as well as the course students. Organizing a MOOC is no small matter. We could count on the help the EPFL team, with Lukas Rytz, Nada Amin, Vojin Jovanovic and Manohar Jonnalagedda who designed and implemented the grading infrastructure, prepared the setup instructions, designed the homeworks, and edited the videos and quizzes; Tao Lee, who did most of the video cutting and editing, Tobias Schlatter, who worked tirelessly answering questions on the discussion boards, Pedro Pinto, who designed the recording equipment setup, and Nastaran Fatemi Odersky who did content editing. Many people at Typesafe also helped, in particular the IDE team around Iulian Dragos and Mirco Dotta who implemented the worksheet software and Josh Suereth who helped with sbt.

Hard as the work of preparing and running the course was, the amount of positive feedback we got made it worth for us many times over. We believe this medium has a lot of potential and, so far, we are only scratching the surface.
