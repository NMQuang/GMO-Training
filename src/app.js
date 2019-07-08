import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import handleUtil from './util/handleUtil';

// define 1 express to control application
const app = express();

// define logger to write log in enviroment dev
app.use(logger('dev'));

// parse json
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

// define folder public to express can access resource: css, image, ... 
app.use(express.static(path.join(__dirname, '../public')));

// define header of response
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //* will allow from all cross domain
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// define root router to control all request and response
app.use('/', handleUtil.authorization, indexRouter, handleUtil.error);

export default app;