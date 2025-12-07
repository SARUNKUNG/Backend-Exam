var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.js

const express = require('express');
const cors = require('cors');
// Route and Middleware Imports
const subjectRouter = require('./routes/subjectRoute');
const authRouter = require('./routes/authRoute');
const { authenticate } = require('./middlewares/auth');

const app = express();

// --- Middleware Setup ---
app.use(cors());
app.use(express.json()); // To read JSON body of requests

// --- Route Mounting ---
// 1. Public Routes (Auth)
app.use('/auth', authRouter);

// 2. Protected Routes (Subject CRUD) - Requires 'authenticate'
app.use('/api/v1/subjects', authenticate, subjectRouter);

// --- Global Error Handler (Must be the last app.use()) ---
app.use((err, req, res, next) => {
    console.error(`[${err.code || 'UNKNOWN'}] Error: ${err.message}`, err);

    // Use custom status (err.status) or default to 500
    const status = err.status || 500;

    res.status(status).json({
        message: err.message || "An unexpected internal server error occurred.",
        code: err.code || "SERVER_ERROR",
        status: status
    });
});

module.exports = app;