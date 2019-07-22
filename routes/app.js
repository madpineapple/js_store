const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

router.get('/',(req, res)=> res.render('welcome'));
router.get('/about',(req, res)=> res.render('about'));


router.get('/dashboard',ensureAuthenticated,(req, res)=>
res.render('dashboard',{
name: req.user.user
}));


module.exports = router;
