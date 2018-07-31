var express =   require("express");
var multer  =   require('multer');
var bodyParser = require('body-parser');
var router   = express.Router();
var User  = require('./userSchema');
var app =   express();
var path = require('path');
var router = express.Router();
var multer = require('multer');
var multerS3 = require('multer-s3');
var mongoose = require('mongoose');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');
mongoose.Promise = global.Promise;
 mongoose.connect('mongodb://10.9.9.108:27018/test');
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(express.static('uploads'));

app.get('/',function(req,res){
    res.sendFile(__dirname + "/sample.html");
});


var upload = require('multer')({
    dest:"./uploads",
    limits: {
        fileSize: '5MB'
    }
});
    app.post('/upload',upload.single('imageURL'),function(request, response) {
        
        require('fs').readFile(request.file.path,function(err,data){
            var newpath = "./uploads/"+request.file.originalname;
            require('fs').writeFile(newpath, data, function(err){
                newpath = newpath.substring(1);
                request.body.imageURL = newpath;
                
                require('fs').unlink(request.file.path);
               User.create(request.body, function (error, user) {
                if(error)
                    return response.status(500).json({error: error});
                else
                    response.json(user);
                })
            });
        });
    });

    app.post('/dataupload',function(request, response) {
        User.create(request.body, function (error, user) {
                if(error)
                    return response.status(500).json({error: error});
                else
                    response.json(user);
                })
    });

    app.get('/data',function(request, response) {
        console.log('exec');
        User.find({}, function (err, docs) {
            // docs is an array of partially-`init`d documents
            // defaults are still applied and will be "populated"
            if(err)
                    return response.status(500).json({error: err});
                else
                    response.json(docs);
                })
    });

    app.post('/login',function(request, response) {
        console.log(request.body);

        User.findOne({email:request.body.email,phone:request.body.phone}, function (err, docs) {
            // docs is an array of partially-`init`d documents
            // defaults are still applied and will be "populated"
            if(err)
                    return response.status(500).json({error: err});
                else
                    response.json(docs);
                })
    });

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
var prof = {};

passport.use(new GoogleStrategy({
        callbackURL:'/google/redirect',
        clientID:'14780768209-cmv3v6nr317v60plfftq0cndo75j6hsl.apps.googleusercontent.com',
        clientSecret:'eF6OcxtD_dbQWYVFd-x9bjWR'
    },
    function(token, refreshToken, profile, done)  {

    prof.profile=profile;
    prof.token=token;
        console.log(prof);
        return done(null, {
            profile: prof,
            token: token
        });
    }));

app.get('/google',
    passport.authenticate('google', { scope:
        [ 'https://www.googleapis.com/auth/plus.login',
             'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
    ));

app.get( '/google/redirect',function (err,res) {
		
        res.sendFile(__dirname + "/google/success.html");
        if(err){
        	console.log(err);
            res.sendFile(__dirname + "/google/fail.html");
        }
    }

    );




app.listen(2001,function(){
    console.log("Server is running on port 2001");
});