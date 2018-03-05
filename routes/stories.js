const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated,ensureGuest} = require('../helpers/auth');

router.get('/',(req,res) => {
    Story.find({status:'public'})
        .populate('user')
        .then(stories => {
            res.render('stories/index',{
                stories:stories
            });
        });
});

//Add stories from
router.get('/add',ensureAuthenticated,(req,res) => {
    res.render('stories/add');
});

router.get('/show/:id',(req,res) => {
    Story.findOne({_id:req.params.id})
        .populate('user')
        .then(story => {
            res.render('stories/show',{
                story:story
            });
        });
});

router.get('/edit/:id',(req,res)=>{
    Story.findOne({_id:req.params.id})
    .then(story => {
        res.render('stories/edit',{
            story:story
        });
    });
});

router.put('/edit/:id',(req,res)=>{
    Story.findOne({_id:req.params.id})
    .then(story => {
        let allowComments;
        if(req.body.allowComments){
            allowComments = true;
        }
        else{
            allowComments = false;
        }

        story.body = req.body.body;
        story.allowComments = allowComments;
        story.title = req.body.title;
        story.status = req.body.status;

        story.save()
        .then(() => {
            res.redirect('/dashboard');
        });
    });
});

router.delete('/:id',(req,res)=>{
    Story.findOne({_id:req.params.id})
    .then(story =>{
        story.remove()
        .then(()=>{
            res.redirect('/dashboard');
        });
    });
});

//Process add story
router.post('/',(req,res) => {
    let allowComments;

    if(req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false;
    }
    
    const newStory = {
        title:req.body.title,
        body:req.body.body,
        status:req.body.status,
        allowComments:allowComments,
        user:req.user.id
    };

    new Story(newStory)
       .save()
       .then(story => {
            res.redirect(`/stories/show/${story.id}`);
       });
});



module.exports = router;