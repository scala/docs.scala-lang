FROM ruby:2.5

RUN gem install bundler jekyll

WORKDIR /srv/jekyll

COPY Gemfile .
COPY Gemfile.lock .

RUN bundle install

