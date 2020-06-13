const express = require('express')
const Article = require('../models/article')
const router = express.Router()


//rendering the new article page
router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

//getting one blog post
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) return res.redirect('/')
    res.render('articles/show', { article: article })
})
//editing the article
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

//adding blog to the database
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

//updating the article after the edit
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

//save article and redirect(for saving and updating)
function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            res.redirect(`/article/${article.slug}`)
        } catch (e) {
            console.log(e.message)
            res.render(`articles/${path}`, { article: article }) // when user save the invalid data it should bring him back to the same page 
        }
    }
}

//deleting the blog post
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

module.exports = router