var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {

  var cDate = moment();
  if(req.query.date){
    cDate = moment(req.query.date);

    if(cDate == null || !cDate.isValid())
      cDate = moment();

  }

  res.render('monthly',
  { currentDateTitle: cDate.format("MMMM YYYY"),
    currentDate: cDate



  });
});

router.get('/week',function(req,res,next){
    res.render('weekly',{

    });
});

module.exports = router;
