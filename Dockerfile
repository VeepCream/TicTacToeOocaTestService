FROM node:10.14
RUN mkdir -p /usr/src/app/TicTacToeOocaTestService
WORKDIR /usr/src/app/TicTacToeOocaTestService
COPY package.json /usr/src/app/TicTacToeOocaTestService
RUN yarn install
COPY . /usr/src/app/TicTacToeOocaTestService
EXPOSE 2303
CMD [ "yarn", "dev" ]