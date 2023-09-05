FROM node:alpine

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean && yarn global add @nestjs/cli
COPY . .

CMD ["yarn", "start:dev"]
