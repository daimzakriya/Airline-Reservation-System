const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const pgConnect = require('connect-pg-simple');
const path = require('path');

/* Make all variables from our .env file available in our process */
require('dotenv').config();

/* Init express */
const app = express();

/* Init helmet and CORS */
app.use(helmet({ contentSecurityPolicy: false }));

/* set view engine */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* setup middleware and configs */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const dotenv = require('dotenv').config()
/* setup static files */
app.use(express.static(path.join(__dirname, 'public')));

/* session set up */
app.use(session({
    store: new (pgConnect(session))({ conString: process.env.DATABASE_URL }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
}));
/* setup routes */
app.use(require('./routes'));

/* Listen on the port for requests */
if (process.env.NODE_ENV !== 'production' || process.env.PORT) {
    app.listen(process.env.PORT || 3000, () => {
        console.log('Express server listening on port %d', process.env.PORT || 3000);
    });
}

module.exports = app;
