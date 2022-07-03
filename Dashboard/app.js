var express = require('express');
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

//middleware
app.use('/', router);
app.use(express.static(__dirname + '/public'));

// delivery HTML file to client
router.get('/', (req, res) => {
    res.sendFile(path + 'index.html');
  });

// app.use('*',function(req,res){
//   res.sendFile('Error404: Not Found');
// })
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`The web server start at ${PORT}`);
})