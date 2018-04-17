FROM ubuntu
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y python2.7
RUN apt-get install -y python3
RUN apt-get install -y gcc
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
RUN curl -L https://get.rvm.io |bash -s stable --ruby
RUN apt-get install -y ruby 
RUN apt-get install -y default-jre
RUN apt install -y openjdk-8-jdk
WORKDIR /usr/src/app
COPY . /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app
