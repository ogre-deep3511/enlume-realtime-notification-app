const { response } = require('express');
const express = require('express');
const router = express.Router();
const postTemplateCopy = require('../models/postSchema');

router.post('/post', async (req, res) => {

    const activeUser = new postTemplateCopy({
        name: req.body.name,
        message: req.body.message
    });

    activeUser.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.json(err);
        })
});

module.exports = router;