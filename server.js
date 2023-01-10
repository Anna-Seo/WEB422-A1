/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Anna Seo        Student ID: 110186202       Date: January 10, 2023
*  Cyclic Link: 
*
********************************************************************************/
const express = require("express");
const app = express();
var cors = require('cors');
const MoviesDB = require("./modules/moviesDB.js");
const { DBRef } = require("bson");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(cors());
app.use(express.json());
require('dotenv').config();

app.get("/", (req, res) => {
    res.json({ message: 'API Listening' });
});

app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body).then((data) => {
        console.log(data);
        res.json(data);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/api/movies", (req, res) => {
    var page = req.query.page;
    var perPage = req.query.perPage;
    var title = req.query.title;
    db.getAllMovies(page, perPage, title).then((data) => {
        res.json(data);
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/api/movies/:_id", (req, res) => {
    db.getMovieById(req.params._id).then((data) => {
        console.log("get");
        res.json(data);
    }).catch((err) => {
        console.log(err);
    })
});

app.put("/api/movie/:_id", (req, res) => {
    db.updateMovieById(req.body, req.params._id).then((data) => {
        console.log("update");
        res.json(data);
    }).catch((err) => {
        console.log(err);
    })
});

app.delete("/api/movies/:_id", (req, res) => {
    db.deleteMovieById(req.params._id).then((data) => {
        console.log("delete");
        res.json(data);
    }).catch((err) => {
        console.log(err);
    })
});

db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart);
    }).catch((err) => {
        console.log(err);
    });