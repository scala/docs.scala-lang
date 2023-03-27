FROM ruby:3.0.5

RUN gem install bundler:2.4.7

WORKDIR /srv/jekyll

COPY Gemfile .
COPY Gemfile.lock .

RUN echo -n "bundle version: " && bundle --version
RUN chmod u+s /bin/chown
RUN bundle install
