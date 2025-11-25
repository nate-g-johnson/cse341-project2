const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const mongodb = require('./data/database');
const app = express();

const port = process.env.PORT || 3000;

// Passport config
require('./config/passport')(passport);

// Body parser middleware
app.use(bodyParser.json());

// create session store
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SESSION_SECRET
    }
});

// Listen for session store errors
sessionStore.on('error', function(error) {
    console.error('Session store error:', error);
});

sessionStore.on('create', function(sessionId) {
    console.log('Session created:', sessionId);
});

sessionStore.on('touch', function(sessionId) {
    console.log('Session touched:', sessionId);
});

sessionStore.on('update', function(sessionId) {
    console.log('Session updated:', sessionId);
});

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    },
    name: 'sessionId',
    proxy: process.env.NODE_ENV === 'production'
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// Routes
app.use('/', require('./routes'));

// Error handler
process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

// Connect to MongoDB and start server
mongodb.initDb((err) => {
    if (err) {
        console.log('MongoDB connection error:', err);
    } else {
        console.log('Database connected successfully');
        
        app.listen(port, () => {
            console.log(`Database is listening and node is running on port ${port}`);
        });
    }
});