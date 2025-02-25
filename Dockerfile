FROM ruby:3.2.6

RUN gem install bundler:2.6.5

WORKDIR /srv/jekyll

COPY Gemfile .
COPY Gemfile.lock .

RUN echo -n "bundle version: " && bundle --version
RUN chmod u+s /bin/chown
RUN bundle install
