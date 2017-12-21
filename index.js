var _ = require("lodash");
var express = require("express");
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var users = [
    {
        id: 1,
        name: 'eswaribala',
        password: 'test@123'
    },
    {
        id: 2,
        name: 'test',
        password: 'test'
    }
];

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'tasmanianDevil';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    var user = users[_.findIndex(users, {id: jwt_payload.id})];
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy);

var app = express();
app.use(passport.initialize());

app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json())




app.get("/", function(req, res) {
    res.setHeader('Access-Control-Allow-Origin','http://localhost:7070');
    res.setHeader('Access-Control-Allow-Methods','GET', 'POST');
    res.header('Access-Control-Allow-Headers','X-Requested-With, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    res.json({message: "Express is up!"});
});

app.post("/login", function(req, res) {

    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET', 'POST');
    res.header('Access-Control-Allow-Headers','X-Requested-With, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    //console.log(req);
    //console.log(req.body.name);
    if(req.body.name && req.body.password){
        var name = req.body.name;
        var password = req.body.password;
    }
    // usually this would be a database call:
    var user = users[_.findIndex(users, {name: name})];
    if( ! user ){
        res.status(401).json({message:"no such user found"});
    }

    if(user.password === req.body.password) {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        var payload = {id: user.id};
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({message: "ok", token: token});
    } else {
        res.status(401).json({message:"passwords did not match"});
    }
});

app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    res.json({message: "Success! You can not see this without a token"});
});

app.get("/secretDebug",
    function(req, res, next){
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Methods','GET', 'POST');
        res.header('Access-Control-Allow-Headers','X-Requested-With, Content-Type');
        res.setHeader('Access-Control-Allow-Credentials',true);
        console.log(req.get('Authorization'));
        next();
    }, function(req, res){
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Methods','GET', 'POST');
        res.header('Access-Control-Allow-Headers','X-Requested-With, Content-Type');
        res.setHeader('Access-Control-Allow-Credentials',true);
        res.json("debugging");
    });

app.listen(3000, function() {
    console.log("Express running");
});