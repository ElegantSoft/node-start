const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const publicRouter = require('./router/public')
const app = express()
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
/********* 
** Middleware
**********/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(cookieParser())
require('./config/passport')(passport)

//mongoDB
//mongoDB
mongoose.connect('mongodb://localhost/laptop',{useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log('connected to mongoDB')
})

app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    
}))
// app.use(cookieSession({
//     maxAge:1000 * 60 * 60 * 24 * 50,
//     // expires: Date.now,
//     keys:['asdsadjaskldhaskjdhaskdhas'],
//     name: 'laptop'
// }))
app.use(passport.initialize())
app.use(passport.session())


app.use((req,res,next)=>{
    res.locals.user =  req.user || null
    next()
})


const port = process.env.PORT || 3000
app.listen(port,(err)=>{
    if(err) throw err
    console.log(`listen on port: ${port}`)
})
app.use('/',publicRouter)