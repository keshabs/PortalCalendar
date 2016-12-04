var express = require('express');
var router = express.Router();
var moment = require('moment');



var mongoose = require('mongoose');
var schema = mongoose.Schema;


var eventSchema = new schema({
  Title:  String,
  StartDate: Date,
  EndDate: Date,
  Repeat: String,
  Description: String
});

eventSchema.methods.hasConflicts = function(){

  var that = this;


  var s = this.StartDate;
  var e = this.EndDate;

  return new Promise(function(resolve,reject){
    eventModel.find({ $or:
      [
        { $and : [{StartDate:{$gte: s } },{StartDate:{$lte:e } }]},
        { $and : [{EndDate:{$gte:s } },{ EndDate:{$lte:e } }]}
     ]
    },function(err,events){
      if(err) console.log(err);
      else {
        if(events.length > 0){
          resolve(events);
        }else {
          reject();
        }
      }
    });
  });

}
var eventModel = mongoose.model('event',eventSchema);



router.get('/',function(req, res, next){

  var q;
  if(req.query.calendar === "monthly"){

    var s = moment(req.query.date);
    var e = s.clone().endOf('month').toDate();


    s = s.toDate();
    e.setDate(e.getDate()-1);

    q = {StartDate: {$gte:s,$lte:e}};

  } else if (req.query.calendar === "weekly"){
    var s = moment(req.query.startweek);
    var e = moment(req.query.endweek);



    q = {StartDate: {$gte:s.toDate(),$lte:e.toDate()}};
  }
  eventModel.find(q,function(err, event){
    if(err){
      console.log(err);
      res.send({
        error: "Error: Getting events failed."
      });
    } else {
      res.json(event);
    }
  });

});


router.post('/',function(req, res, next){


  var newEvent = new eventModel(req.body);
  newEvent.hasConflicts()
  .then(function(events){
    res.send({
      error: "Error: Conflicting event."
    });

  }).catch(function(){
    newEvent.save(function(err,event){
      if(err){
        console.log(err);
        res.send({
          error: "Error: Adding event failed."
        });
      } else {
        res.json(event);
      }
    });

  });

  // newEvent.save(function(err,event){
  //   if(err){
  //     console.log(err);
  //     res.send({
  //       error: "Error: Adding event failed."
  //     });
  //   } else {
  //     res.json(event);
  //   }
  // });


});

router.delete('/:id',function(req, res, next){
    eventModel.findByIdAndRemove(req.params.id,function(err, event){
      if(err){
        res.send({
          error: "Error: Deleting event failed."
        });
      } else {
        res.send(event);
      }
    });
});

router.patch('/:id',function(req, res, next){
  eventModel.findById(req.params.id,function(err,event){
    if(err){
      res.send({
        error: "Error: Updating event failed."
      });
    } else {
      event.Title = req.body.Title || event.Title;
      event.StartDate = req.body.StartDate || event.StartDate;
      event.EndDate = req.body.EndDate || event.EndDate;
      event.Repeat = req.body.Repeat || event.Repeat;
      event.Description = req.body.Description || event.Description;

      event.save(function(err,event){
        if(err)
          res.send(err);
        else{
          res.json(event);
        }
      });
    }

  })

});

module.exports = router;
