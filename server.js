// 'use strict'
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const BookSchema = require('./models/Book')
const app = express();

let port = process.env.PORT ||4000


//Connect db
mongoose.connect('mongodb://localhost/CRUD')

//using bodyParser to parse the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))


app.get('/test', (req, res) => {
    res.send(`Server is running on port ${port}`)
})


//retrieving all the books from database
app.get('/books', (req, res) => {
    console.log('Getting the books');
    BookSchema.find({})
        .then(books => {
            console.log(books);
            res.send(books)
        }).catch(err => {
            console.log('Error has occured');
            res.send('Error has occured')
        })
});

//retreving one book - using findOne - mongoose query
app.get('/books/:id', (req, res) => {
    console.log('Getting one book');
    BookSchema.findOne({
        _id:req.params.id
    }).then(book => {
        console.log('We are looking for', book.title)
        res.send(book);
    }).catch(err => {
        console.log('Error has occured')
    })
})


//Adding book to database 
app.post('/book', (req, res) => {
    const newBook = new BookSchema({
        title:req.body.title,
        author: req.body.author,
        category: req.body.category
    })
    newBook.save();
    res.send(newBook)
})

//find and update
app.put('/book/:id', (req, res) => {
    BookSchema.findOneAndUpdate({
        _id: req.params.id
    }, { title: req.body.title },{new:true})
        .then(updatedUser => {
            console.log(updatedUser)
            res.status(204).send(updatedUser)
    }).catch(error =>console.log(error))
})


//delete Book
app.delete('/book/:id', (req, res) => {
    BookSchema.findOneAndDelete({
        _id:req.params.id
    }).then(book => {
        console.log(book)
        res.send('book deleted')
    }).catch(err => console.log('error'))
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})