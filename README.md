## Description

Dmytro Husiev's test assignment for IguVerse using:
- Nest.js
- Typescript
- Graphql
- PostgreSQL
- TypeORM

## Installation

### 1. Install [Docker](https://docs.docker.com/get-docker/) for your OS. Docker Desktop is preferable for Mac and Windows distributions because of it's built-in Kubernetes cluster support.
### 2. Ensure that you have a Kubernetes cluster, it is up and running or install it with these possible options:
  - [Docker Desktop integration](https://docs.docker.com/desktop/kubernetes/) official docs
  - [Kubernetes](https://kubernetes.io/docs/setup/) official docs
### 3. Install the [kubectl](https://kubernetes.io/docs/tasks/tools/) CLI and verify it's installation with:
```bash
$ kubectl version --output=yaml
```
### 4. Run ```$ bash ./infra/k8s/init.sh``` to setup the dev environment. 
### 6. Install [Skaffold](https://skaffold.dev/docs/install/) to run your development infrastructure
### 7. Install all dependencies:
```bash
$ yarn install
```
### 8. Initialize your local infrastructure in the Kubernetes cluster and start the app:
```bash
$ skaffold dev
```

### 9 Navigate to the [rates.dev/graphql](https://rates.dev/graphql) to test the graphql queries
```gql
query CurrentRate {
  currentRate{
    id
    date
    price
    symbol1
    symbol2
  }
}

query Rates($dateStart:Date!, $dateEnd: Date!){
  rates(dateStart:$dateStart, dateEnd: $dateEnd){
    id
    date
    price
    symbol1
    symbol2
  }
}
```

## Cleanup after assignment check
```bash
$ bash ./infra/k8s/cleanup.sh
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
