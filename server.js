const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express()
const Article = require('./models/article')
const articleRouter = require('./routes/article')

mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false })) // telling express how to access data from url
app.use(methodOverride('_method')) // it will override the method in the html from get and post to other methods

//getting all article
app.get('/', async (req, res) => {
    const articles = await Article.find().sort({    //getting all article and sorting them on basis of recently created
        createdAt: 'desc'
    })
    res.render('articles/index', { articles: articles })
})

//calling article route
app.use('/article', articleRouter)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`server started on port ${port}`)
})