---
title: Inclusive Language Guide
layout: inner-page-no-masthead
includeTOC: true
permalink: /contribute/inclusive-language/
---

We are committed to providing a friendly, safe and welcoming environment for
all, regardless of age, body size, disability, ethnicity, sex characteristics,
gender identity and expression, level of experience, education, socio-economic
status, nationality, personal appearance, race, religion, sexual identity
and orientation, or other such characteristics.

Language is a powerful vehicle of ideas and representations, and as such, can highlight, accentuate, or blur certain characteristics of the world.
Language -- in its use and structure -- may bias our perception of the world, sometimes to the disadvantage of some people.
Different language strategies have therefore been suggested to promote more inclusive forms of language, echoing the need for more equal treatment for all.

This inclusive language guide is therefore intended to help us adopt a more inclusive way of communicating.
Although the present guide does not exhaustively cover all issues pertaining to non-inclusive language, it covers the most important issues we are currently aware of.

Contributions made to the core Scala projects and their documentation -- including to this website -- should follow this guide.

## Non gendered language

The use of *He*, *Him*, *His*, *Man* and *Men* should be avoided.
Although these terms are intended to refer to any genders (male, female, other, unknown or irrelevant), they imply that the subject is male and therefore excludes all other genders.
Instead, use the singular *they*, as already used by famous authors like Jane Austen.

Example of the use of singular they:

> When a developer wants to contribute to a project, they open a pull request.

Although *they* refers to a single person, we conjugate the verb with the plural form.
This is similar to the polite form of pronouns in certain languages, such as "Sie" in German or "vous" in French.

When possible, avoid (combined) words that refer to a specific gender, and use gender-neutral alternatives instead.
For example:

* *man* or *woman* -> *person*
* *chairman* -> *chairperson*

## The words easy, simple, quick, and trivial

What might be easy for you might not be easy for others.
The same applies to other words like *quick* or *simple*.
When used in the positive or superlative forms, try eliminating this word from sentences because usually the same meaning can be conveyed without it.

Example of a positive form:

> You can then simply execute the program with the `run` command.

can be replaced with

> You can then execute the program with the `run` command.

without changing the meaning of the sentence.

Example of a superlative form:

> The foobar method is the easiest way to get started with our library.

can be replaced with

> We show here how to use the foobar method to get started with our library.

However, the comparative form of these adjectives and adverbs can be used when relevant.

Example of a comparative form:

> The foobar method is quicker to get started with than the baz method.

Similarly, the word *just* is usually redundant and can be removed without altering the meaning.

Example:

> You can just add these settings to your build.

can be replaced with

> You can add these settings to your build.

Of course, every situation is different, and there may be cases where using "the easy words" is still the best thing to do.
In that case, it should be a deliberate decision to use them, taking the above considerations into account.

## Specific loaded words

Some words may have a derogatory connotation and/or have clear oppressive origins.
Avoid these words to the greatest extent possible, and use neutral alternatives instead.
Currently, the following words, used for common computer science concepts, are discouraged.
This list is neither comprehensive nor definitive, and it can evolve over time.

* **blacklist/whitelist** \
  While the etymology of these words has no relation to racism, their use suggests an association between the color black and some form of badness or exclusion, and between the color white and some form of goodness or inclusion.
  Prefer alternatives when possible.
  Several alternatives have been proposed but none sticks as "the one". We suggest using the pair *excludelist*/*includelist*, as it is generic enough to replace all uses of *blacklist*/*whitelist*.
* **master/slave** \
  Never use *slave*.
  Never use *master* in conjunction with *slave*.
  Depending on the specific architecture, use one of the following alternatives instead: *controller*/*worker*, *primary*/*secondary*, *leader*/*follower*, etc.
  When in doubt, if you cannot choose, *primary*/*secondary* is always a decent fallback. \
  When used with the meaning of *teacher*, *expert*, *guide*, or *reference*, the word *master* is not specifically discouraged.
  For example, the term *Master of the arts* is acceptable. \
  Note: there exists a broader movement of using `main` instead of `master` as the default git branch, led by GitHub and the git project themselves, and which we encourage people to follow as well.
* **sanity check** \
  Prefer *confidence check*.
* **segregated** \
  Computer science concepts like the *interface segregation principle* and *segregated networks* present segregation as being desirable, instead of bad.
  Prefer alternatives like *separation of concerns* and *segmented networks*.
* **guru** \
  While a *guru* initially refers to a respected spiritual leader, it also designates the chief of a sect.
  Both are of a spiritual nature and are ambiguous.
  If possible, use a more precise term such as *teacher* or *expert*.

A good source with explainers and references can be found at [https://github.com/dialpad/inclusive-language](https://github.com/dialpad/inclusive-language).

Keep in mind that your particular application domain may contain its own share of domain-specific loaded words.
We encourage you to research inclusive language guidelines applicable to your domain.

You may want to use automated software like [In Solidarity](https://github.com/apps/in-solidarity) to steer contributors away from loaded words.

## Backward compatibility

Sometimes, we have existing code, APIs or commands that do not follow the above recommendations.
It is generally advisable to perform renamings to address the issue, but that should not be done to the detriment of backward compatibility (in particular, backward binary compatibility of libraries).
Deprecated aliases should be retained when possible.

Sometimes, it is not possible to preserve backward compatibility through renaming; for example for methods intended to be overridden by user-defined subclasses.
In those cases, we recommend to keep the old names, but document (e.g., in Scaladoc comments) that they are named as they are for historical reasons and to preserve compatibility, and what their intended name should be.

## See also

* Our [code of conduct](../../conduct/).
