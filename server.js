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

// Initialize MongoDB connection first, then set up session store
mongodb.initDb((err) => {
    if (err) {
        console.log('MongoDB connection error:', err);
    } else {
        console.log('Database connected successfully');
        
        // Create session store AFTER MongoDB is connected
        const sessionStore = MongoStore.create({
            client: mongodb.getDatabase(),
            dbName: mongodb.getDatabase().db().databaseName,
            collectionName: 'sessions',
            ttl: 24 * 60 * 60 // 24 hours in seconds
        });

        // Session middleware with MongoDB store
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: sessionStore,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
            }
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

        // Start server
        app.listen(port, () => {
            console.log(`Database is listening and node is running on port ${port}`);
        });
    }
});