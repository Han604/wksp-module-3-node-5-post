'use strict';

const todosArray = [];
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;
const handleTodos = (req, res) => {
    res.render('todos.ejs', {
        title: 'To do list generator!',
        todosArray: todosArray
    });
};
const handleData = (req, res) => {
    const {item} = req.body;
    todosArray.push(item);
    console.log(todosArray);
    res.redirect('/todos')
}


express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('tiny'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')

    // endpoints

    .get('/todos', handleTodos)
    .post('/data', handleData)
    .get('*', (req, res) => res.send('Dang. 404.'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));