'use strict';

const todosArray = [];
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { stock, customers } = require('./data/promo')

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
    res.redirect('/todos');
}

const handleConfirm = (req, res) => {
    res.render('order-confirmed.ejs', {
        title: 'Your stinky confirmation',
        orderData:orderData
    })
}
const handleOrder = (req, res) => {
    res.render('index.html', {
        title: 'Order your shitty merch',
    })
}

let status = 'success'
let error = ''

const handleForm = (req, res) => {
    const {givenName, surname, address, order, size, country, email, city, postcode, province} = req.body;
        if (givenName === undefined || surname === undefined  || address === undefined || city === undefined || province === undefined || postcode === undefined || country === undefined) {
            status = 'error';
            error = '000'
            res.send (
                {
                    status:status,
                    error:error
                }
            )
        }
    customers.forEach(customer => {
        if (customer.givenName === givenName &&
            customer.surname === surname &&
            customer.address === address &&
            customer.postcode === postcode){
                status = 'error';
                error = '550';
                res.send(
                    {
                        status:status,
                        error:error
                    }
                )
            }
        })
    if (country !== 'Canada') {
        status = 'error';
        error = '650';
        res.send (
            {
                status:status,
                error:error
            }
        )
    }
    if (stock[order][size] === '0') {
        status = 'error';
        error = '450'
        res.send (
            {
                status:status,
                error:error
            }
        )
    }
    console.log('does it get here?')
    res.render('order-confirmed.ejs', {
        status:status,
        givenName:givenName,
        surname:surname,
        order:order,
        size:size,
        email:email,
        address:address,
        city:city,
        country:country,
        postcode:postcode,
        province:province,
        title: 'Order your shitty merch'
    })
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
    .get('/order-form', handleOrder)
    .post('/order', handleForm)
    .get('/order-confirmed', handleConfirm)
    .get('*', (req, res) => res.send('Dang. 404.'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));