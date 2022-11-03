FROM ruby:2.6.9

RUN gem install rouge -v3.30.0
RUN gem install bundler:2.3.10 jekyll

WORKDIR /srv/jekyll

COPY Gemfile .
COPY Gemfile.lock .

RUN echo -n "bundle version: " && bundle --version
RUN chmod u+s /bin/chown
RUN bundle install
