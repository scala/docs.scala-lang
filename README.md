# Scala Documentation #

[![Build Status](https://github.com/scala/docs.scala-lang/actions/workflows/build.yml/badge.svg)](https://github.com/scala/docs.scala-lang/actions/workflows/build.yml?query=branch%3Amain)

This repository contains the source for the Scala documentation website, as well as the source for "Scala Improvement Process" (SIP) documents.

## Dependencies ##

This site uses a Jekyll, a Ruby framework. You'll need Ruby and Bundler installed; see [Jekyll installation instructions](https://jekyllrb.com/docs/installation/) for the details.

## Quickstart ##

To build and view the site locally:

    bundle install
    bundle exec jekyll serve -I

([Trouble on MacOS?](https://github.com/scala/docs.scala-lang/issues/1150))

For more details, read on.

## Quickstart with Docker Compose ##

You need to have [Docker Engine](https://docs.docker.com/engine/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.
Under macOS (Intel or Apple silicon), instead of installing [Docker Desktop](https://docs.docker.com/desktop/) you can also use [HomeBrew](https://brew.sh/) with [Colima](https://github.com/abiosoft/colima): `brew install colima docker docker-compose`.  
UID and GID environment variables are needed to avoid docker from writing files as root in your directory.
By default, docker-compose will use the file docker-compose.yml which will build the website and serve it on 0.0.0.0:4000 .
If you just need to build the website, add ```-f docker-compose_build-only.yml```

```
env UID="$(id -u)" GID="$(id -g)" docker-compose up
```

The generated site is available at `http://localhost:4000`.

When the website dependencies change (the content of the `Gemfile`),
you have to re-build the Docker image:

```
env UID="$(id -u)" GID="$(id -g)" docker-compose up --build
```

If you have problems with the Docker image or want to force the rebuild of the Docker image:
```
env UID="$(id -u)" GID="$(id -g)" docker-compose build --no-cache
```


For more details on the Docker option, see also [this issue](https://github.com/scala/docs.scala-lang/issues/1286).

## Contributing ##

Please have a look at [Add New Guides/Tutorials](https://docs.scala-lang.org/contribute/add-guides.html) before making a contribution.
This document gives an overview of the type of documentation contained within the Scala Documentation repository and the repository's structure.

Small changes, or corrected typos will generally be pulled in right away. Large changes, like the addition of new documents, or the rewriting of
existing documents will be thoroughly reviewed-- please keep in mind that, generally, new documents must be very well-polished, complete, and maintained
in order to be accepted.

## Building & Viewing ##

cd into the directory where you cloned this repository, then install the required gems with `bundle install`. This will automatically put the gems into `./vendor/bundle`.

Start the server in the context of the bundle (use `-I` for incremental builds):

    bundle exec jekyll serve -I

`It might take around 5 minutes at first but incremental compilations will be fast.`

The generated site is available at `http://localhost:4000`

If you add `--watch` at the end of the command line above, Jekyll will automatically watch for changes on the filesystem, and regenerate the site.

If you get `incompatible encoding` errors when generating the site under Windows, then ensure that the
console in which you are running jekyll can work with UTF-8 characters. As described in the blog
[Solving UTF problem with Jekyll on Windows](https://joseoncode.com/2011/11/27/solving-utf-problem-with-jekyll-on-windows/)
you have to execute `chcp 65001`. This command is best added to the `jekyll.bat`-script.

## Markdown ##

The markdown used in this site uses [kramdown](https://kramdown.gettalong.org/) extensions.

### Markdown Editor for OSX ###

There's a free markdown editor for OSX called [MacDown](https://github.com/MacDownApp/macdown). It's quite convenient to work with, and it generates the translated Markdown in real-time alongside of your editor window, as can be seen here:

## Documentation tooling (mdoc)

This repository uses **mdoc** to build Scala documentation.

mdoc is a documentation tool that allows Scala code to be written directly inside
Markdown files and evaluated at build time. This ensures that code examples in
the documentation are always correct and stay in sync with the Scala compiler.

### How mdoc is used in this repository

- Markdown files may contain Scala code blocks
- During the documentation build, mdoc:
  - Compiles the Scala code
  - Evaluates it
  - Replaces the code blocks with their evaluated output (when applicable)

This makes the documentation:
- Executable
- Always up to date
- Safe from stale examples

For more information, see the official mdoc project:
https://scalameta.org/mdoc/

![MacDown Screen Shot](https://raw.githubusercontent.com/MacDownApp/macdown/3e2a2bf101c215c143bf00d9f857965f0ee82487/assets/screenshot.png)

## License ##

All documentation contained in this repository is licensed by EPFL under a Creative Commons Attribution-Share Alike 3.0 Unported license ("CC-BY-SA"), unless otherwise noted. By submitting a "pull request," or otherwise contributing to this repository, you implicitly agree to license your contribution under the above CC-BY-SA license. The source code of this website is licensed to EPFL under the [Scala License](https://www.scala-lang.org/node/146), unless otherwise noted.
