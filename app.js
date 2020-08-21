const express = require ('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const session = require('express-session');
const path = require('path')
const flash = require ('connect-flash')
const bodyParser = require('body-parser');
// inicializar
const app = express()

// configuracion
app.set('port',process.env.PORT || 8080)
app.set('views',path.join(__dirname,'src/views'))
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./src/lib/handlebars') // ruta helpers para handlebar
}))
app.set('view engine', '.hbs')

// middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour

app.use(session({
    secret: 'supersecretpwddeoscarquetalestasyobieneeeaa',
    resave: false,
    saveUninitialized: false,
    secure: true,
    httpOnly: true,
    expires: expiryDate
}))

app.use(flash());

// global var
app.use((req, res, next) => {
    app.locals.message = req.flash('message')
    app.locals.success = req.flash('success')
    res.locals.user = req.user
    next();
  });


// routes
app.use(require('./src/routes/index'))
app.use('/dashboard',require('./src/routes/dashboard/index'))

// public
app.use(express.static(path.join(__dirname,'src/public')))

// start server
const server = app.listen(app.get('port'),()=>{
    console.log('Listening on port ',app.get('port'))  
})

module.exports = server
