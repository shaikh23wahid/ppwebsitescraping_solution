//Dilbert Comic Server
var http = require('http'),
    fs = require('fs'),
    request = require('request'),
    url = require('url'),
    cheerio = require('cheerio'),
    DilbertURL = 'http://dilbert.com/strip/' + getDateTime();

http.createServer(function(req, res) {

    request(DilbertURL, function(error, response, body) {
        var $ = cheerio.load(body);
        $('div.container-fluid').each(function(i, element) {
            var src = $('.img-responsive.img-comic').attr("src");

            download(src, 'Dilbert.jpg', function() {
                var img = fs.readFileSync('./Dilbert.jpg');
                res.writeHead(200, {
                    'Content-Type': 'image/gif'
                });
                res.end(img, 'binary');
            });
        });
    });

}).listen(1337, '127.0.0.1', function(err){
    if(err){
        console.log("Failed to start web server:", err);
    }else{
        console.log('Server running at http://127.0.0.1:1337/');
    }
});

var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};
function getDateTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day ;
}