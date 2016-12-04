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
  var cDate = moment().startOf('week');
  if(req.query.date){
    cDate = moment(req.query.date).startOf('week');

    if(cDate == null || !cDate.isValid())
      cDate = moment().startOf('week');

  }
  var eDate = moment(cDate).endOf('week');
  res.render('weekly',
  {
    weekTitle: cDate.format("MMMM D")+"-"+eDate.format("MMMM D"),
    startWeek: cDate,
    endWeek: eDate
  });
});

module.exports = router;
