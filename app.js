var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    User                    = require("./models/user");

//MongoDB Location
mongoose.connect("mongodb://localhost/auth_demo", {useMongoClient: true});
mongoose.Promise = global.Promise; 

var app = express();

app.use(require("express-session")({
    secret: "this string is used to encode and decode",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());

// take data from session - encode and decode it
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==============================================================================
//  ROUTES
//==============================================================================
app.get("/", function(req,res){
    res.render("home");
});

app.get("/secret", function(req, res){
    res.render("secret");
});

//==============================================================================
//  ROUTES
//==============================================================================
app.get("/register", function(req, res){
    res.render("register");    
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
});
