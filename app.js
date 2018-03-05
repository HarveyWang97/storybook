const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParesr = require('body-parser');
const methodOverride = require('method-override');

//Load User model
require('./models/User');
require('./models/Story');

//Passport config
require('./config/passport')(passport);

//Load routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

//load keys
const keys = require('./config/keys');

// get the helper functions for handlebars
const {truncate,stripTags,formatDate,select} = require('./helpers/hbs');

mongoose.Promise = global.Promise;

//Mongoose connec
mongoose.connect(keys.mongoURI,{
    useMongoClient:true
})
    .then(()=> console.log('MongoDB connected'))
    .catch(err => console.log(err));

const app = express();

app.use(bodyParesr.urlencoded({extended:false}));
app.use(bodyParesr.json());

//Method Override Middleware
app.use(methodOverride('_method'));

//Handlebars middleware
app.engine('handlebars',exphbs({
    helpers:{truncate,stripTags,formatDate,select},
    defaultLayout:'main'
}));
app.set('view engine','handlebars');


app.use(cookieParser());
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//Set global vars
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();
});

// Set Static folder
app.use(express.static(path.join(__dirname,'public')));

//Use routes
app.use('/',index);
app.use('/auth',auth);
app.use('/stories',stories);


const port = process.env.PORT||5000;


app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});

