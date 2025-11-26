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

// Initialize MongoDB connection
mongodb.initDb(async (err) => {
    if (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
    
    console.log('✓ Database connected successfully');
    
    try {
        // Create session store with explicit connection
        console.log('Creating session store...');
        const sessionStore = MongoStore.create({
            mongoUrl: process.env.MONGODB_URL,
            collectionName: 'sessions',
            ttl: 24 * 60 * 60,
            autoRemove: 'native',
            touchAfter: 0
        });

        // Wait for store to be ready
        await new Promise((resolve, reject) => {
            sessionStore.once('connected', () => {
                console.log('✓ Session store connected to MongoDB');
                resolve();
            });
            sessionStore.once('error', (error) => {
                console.error('✗ Session store error:', error);
                reject(error);
            });
            // Timeout after 10 seconds
            setTimeout(() => reject(new Error('Session store connection timeout')), 10000);
        });

        // Session middleware
        app.use(session({
            secret: process.env.SESSION_SECRET || 'fallback-secret-change-this',
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
            rolling: true,
            proxy: true
        }));

        console.log('✓ Session middleware configured');

        // Passport middleware
        app.use(passport.initialize());
        app.use(passport.session());

        console.log('✓ Passport configured');

        // Routes
        app.use('/', require('./routes'));

        // Error handler
        process.on('uncaughtException', (err, origin) => {
            console.error(`Caught exception: ${err}\nException origin: ${origin}`);
        });

        // Start server
        app.listen(port, () => {
            console.log(`✓ Server running on port ${port}`);
            console.log(`✓ All systems ready`);
        });

    } catch (error) {
        console.error('Failed to initialize session store:', error);
        process.exit(1);
    }
});