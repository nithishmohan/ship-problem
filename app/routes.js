var Shipmile = require('./shipmile.js');
module.exports = function(app) {
  var index = function(req, res){
        res.render('index');
  };
  app.get('/', index);
  app.post('/calculate', Shipmile.calculate);

}
