# workflow management project 

This project is an actual implementation of these technical specifications ( see image ) using NodeJs, ExpressJs, Mocha , Mongoose and Mongodb 

Documentation are written with Swagger following OpenAPI standards .

![](images/specification.png)

### Objectif 

Write a production ready API for a modern and well architectured application for managing workflows specified in the above database schema 

API exposes :
* a webservice that gets  all workflowcategories ( approximately 20 )
* a webservice that query workflows (approximately 500) under three ( possibely simultanious ) filters
by name ,  by categories (1 to N) and by status 

## Run Project
```
npm install
npm start
```
## View Swagger Documentation

```
npm start 
```
[github]localhost:3000/api-docs

## Run Test
```
npm test
```

