const { request } = require('http');
const express = require('express');
const {spawn} = require('child_process');
var bodyParser=require("body-parser");
const mysql = require('mysql');
const app = express();
let cors = require("cors");
var fs = require('fs');
const collect = require('collect.js');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Nnd09082001*",
    database: "database - db",
    port: "3306"
});

connection.connect((err) =>{
    if(err){
        throw err;
    } else{
        // console.log("Connection Successful!");
    }
});

activeUser = null;
app.use(cors());
temp_database_after_watched_services = []
app.get("/", function (req,res) {
    // console.log(activeUser)
    connection.query(`Select title, rating, poster from tracker where user_id = ${activeUser}`, function (err, results, fields) {
        for(let i = 0; i<results.length; i++){
            temp_database_after_watched_services.push([results[i].title, results[i].poster, results[i].rating,])
        }
        // console.log("Sending the data from the database(tracker) to the function.js file")
        res.send(temp_database_after_watched_services)
    })
    temp_database_after_watched_services = []
})


app.get("/activeUserGet", function (req,res) {
    // console.log(activeUser)
    res.send(String(activeUser))
    // console.log(`Sent Active user - ${activeUser} to the function.js file`)
})

temp_database_services = []
app.get("/watchlist/get", function (req,res) {
    connection.query(`Select title, description, poster from watchlist where user_id = ${activeUser}`, function (err, results, fields) {
        for(let i = 0; i<results.length; i++){
            temp_database_services.push([results[i].title, results[i].poster, results[i].description,])
        }
        // console.log("Sending the data from the database(watchlist) to the function.js file")
        res.send(temp_database_services)
    })
    temp_database_services = []
})

user_database = []
app.get("/getUserData", function (req,res) {
    connection.query(`Select email_id, password, user_id from users`, function (err, results, fields) {
        for(let i = 0; i<results.length; i++){
            user_database.push([results[i].email_id, results[i].password, results[i].user_id])
        }
        // console.log("Sending the data from the database(users) to the login.js file")
        // console.log(user_database)
        res.send(user_database)
    })
    user_database = []
})

app.get('/dataPy', (req, res) => {
    let largeDataSet = [];
     // spawn new child process to call the python script
    const python = spawn('python', ['assets/python/recommendator_engine.py']);
    
    // collect data from script
    python.stdout.on('data', function (data) {
        // console.log('Pipe data from python script ...');
        data = data.toString('utf8');
        largeDataSet.push(data);
        // console.log(largeDataSet)
    });
    
    // in close event we are sure that stream is from child process is closed
    python.on('close', (code, signal) => {
        // console.log(`child process close all stdio with code ${code} and signal ${signal}`);
        // send data to browser
        if(largeDataSet.length == 0){
            res.send(["Empty"])
        }
        else{
            // console.log(largeDataSet)
            res.send(largeDataSet.join())
        }
    });
})

//
app.get('/sendPopularShows', (req, res) => {
    let PopularShowDataSet = [];
     // spawn new child process to call the python script
    const python = spawn('python', ['assets/python/popular_shows.py']);
    
    // collect data from script
    python.stdout.on('data', function (data) {
        // console.log('Pipe data from python script ...');
        data = data.toString('utf8');
        PopularShowDataSet.push(data);
        // console.log(PopularShowDataSet)  
    });
    
    // in close event we are sure that stream is from child process is closed
    python.on('close', (code, signal) => {
        // console.log(`child process close all stdio with code ${code} and signal ${signal}`);
        // send data to browser
        if(PopularShowDataSet.length == 0){
            res.send(["Empty"])
        }
        else{
            // console.log(PopularShowDataSet)
            res.send(PopularShowDataSet)
        }
    });
})

//
app.get('/sendPopularMovies', (req, res) => {
    let PopularMovieDataSet = [];
     // spawn new child process to call the python script
    const python = spawn('python', ['assets/python/popular_movies.py']);
    
    // collect data from script
    python.stdout.on('data', function (data) {
        // console.log('Pipe data from python script ...');
        data = data.toString('utf8');
        PopularMovieDataSet.push(data);
        // console.log(PopularMovieDataSet)  
    });
    
    // in close event we are sure that stream is from child process is closed
    python.on('close', (code, signal) => {
        // console.log(`child process close all stdio with code ${code} and signal ${signal}`);
        // send data to browser
        if(PopularMovieDataSet.length == 0){
            res.send(["Empty"])
        }
        else{
            // console.log(PopularMovieDataSet)
            res.send(PopularMovieDataSet)
        }
    });
})


app.use(bodyParser.urlencoded({extended: true}))

// Process application/json
app.use(bodyParser.json());
app.use(cors());
app.post("/", function (req, res) {
    let title = req.body.title;
    let rating = parseInt(req.body.rating);
    let poster = req.body.poster;
    let id = activeUser;
    connection.query(`Insert into tracker (user_id, title, rating, poster) values (${id}, '${title}', ${rating}, '${poster+'g'}')`);
    res.send(`${title} added to your tracker!!`)
})

app.post("/watchlist", function (req, res) {
    let title = req.body.title;
    let description = req.body.description;
    let poster = req.body.poster;
    let id = activeUser
    connection.query(`Insert into watchlist (user_id, title, description, poster) values (${id}, '${title}', '${description}', '${poster}')`);
    // console.log(`${title} added to your watchlist!!`)
})

app.post("/watchlist/delete/:id", function(req, res){
    let id =  req.params.id;
    let title = req.body.title;
    connection.query(`delete from watchlist where user_id = ${id} and title = '${title}';`)
    // console.log(`${title} removed from your watchlist!!`)
});

app.post("/SignUp", function (req, res) {
    let email = req.body.user_id;
    let password = req.body.password;
    connection.query(`Insert into users (password, email_id) values ('${password}', '${email}')`);
    // console.log(`${email} added ✔️`)
})

app.post("/activeUser", function (req, res) {
    let user_id = req.body.id;
    activeUser = user_id;
    // console.log(`user(${user_id}) fetched 👤`)
    // console.log(active_user)
})

content = {}
app.post("/toPython", function (req, res) {
    let title = req.body.title;
    // console.log(`user(${activeUser}) fetched 👤 and title ${title} fetched`)
    // console.log(active_user)
    
    content = {User: activeUser, movie_title: title}
    const jsonString = JSON.stringify(content)

    fs.writeFile('C:/Users/HP/Desktop/formList.json', jsonString, 'utf8', function (err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
          console.log('It\'s saved!');
        }
    });
})

const port = process.env.port || 5000;
app.listen(port);

// console.log("App is listening on port " + port);

