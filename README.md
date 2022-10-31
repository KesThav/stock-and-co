# Stock&Co

Stock&Co is an web application developed as part of my master thesis. The goal is to set up a backend architecture composed of microservices and a workflow engine that will be used to transfer data between microservices.

# Requirements

- PORT 3310, 8080 to 8085 and 9000 to 9005 must be free
- Docker

# Getting started

```
$ git clone https://github.com/KesThav/stock-and-co.git
$ cd stock-and-co
$ docker compose up
```

Client => `https://localhost:8081`  
server => `https://localhost:8085`  
Camunda Workflow engine => `https://localhost:8080/camunda`
