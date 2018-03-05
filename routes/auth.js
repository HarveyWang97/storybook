const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
    res.redirect('/dashboard');
  });

router.get('/verify', (req, res) => {
  if(req.user){
    console.log(req.user);
  } else {
    console.log('Not Auth');
  }
});

router.get('/logout', (req, res) => {
 req.logout();
 res.redirect('/');
});

module.exports = router;


/*
    req.user is a convenience property that is an alias for req.session.user, 
    which is stored in redis. So for session-enabled requests, the session data 
    is loaded from redis, then req.user is set to be the same as req.session.user for convenience,
    then your code runs and responds to the request, and the in-memory 
    versions of these are eligible for garbage collection once the response is sent. 
    The copies in redis survive until the session expires.*/