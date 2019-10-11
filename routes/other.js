const express = require('express');
const router = express.Router();

//Catering
router.get('/catering',(req, res)=> res.render('catering'));

//about
router.get('/about',(req, res)=> res.render('about'));

//contact
router.get('/contact',(req, res)=> res.render('contact'));


module.exports = router;
