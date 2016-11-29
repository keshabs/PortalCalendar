var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  Title:  String,
  StartDate: String,
  StartTime: String,
  EndTime: String,
  repeat: String,
  Description: String
});

var eventModel = mongoose.model('event',eventSchema);

router.get('/',function(req, res, next){
  eventModel.find(function(err, event){
    if(err){
      console.log(err);
    } else {
      res.json(event);
    }
  });
});

router.post('/',function(req, res, next){


  var newEvent = new eventModel(req.body);

  newEvent.save(function(err,event){
    if(err){
      console.log(err);
      res.send(err);
    } else {
      console.log("good",event);
      res.json(event);
    }
  })

});

router.delete('/:id',function(req, res, next){
    res.send(req.params.id);
});

router.patch('/',function(req, res, next){
  res.send('Patch');

});

module.exports = router;
