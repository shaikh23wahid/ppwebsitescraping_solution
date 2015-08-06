var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');


    //url = "http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=" + 02888;
    url = "http://www.asx.com.au/asx/markets/equityPrices.do?by=asxCodes&asxCodes=ppl";

request(url, function (error, response, body) {
    if (!error) {
        var $ = cheerio.load(body),
            trelement = $("#content > table.datatable tr").eq(0).find("th");
            tdelement1 = $("#content > table.datatable tr").eq(1).find("th");
            tdelement2 = $("#content > table.datatable tr").eq(1).find("td");

        var newArr =[];
        newArr.push(tdelement1.find("a").text());

      var imgsrc= "http://www.asx.com.au"+tdelement2.find("a > img").attr("src");

        $(tdelement2).each(function() {
            newArr.push($(this).text());
        });

        var myData = {};

        $(trelement).each(function(tr_index) {
            var fieldname="";
            /*fieldname=$(this).html();
            if(fieldname!="") {
                fieldname=$(this).find("a").text();
            }*/

            //console.log($(this).text());
            if($(this).text()=="Chart"){
                myData[$(this).text()]=   imgsrc
            }else {
                myData[$(this).text()] = newArr[tr_index].replace(/(\s+)/, "");
            }
            });

        //console.log(newArr)
        console.log(myData)

        /*download(imgsrc, 'chart.gif', function() {
            var img = fs.readFileSync('./chart.gif');
            res.writeHead(200, {
                'Content-Type': 'image/gif'
            });
            res.end(img, 'binary');
        });*/

        var outputFilename = 'mysharesdata.json';
        fs.writeFile(outputFilename, JSON.stringify(myData, null, 4), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + outputFilename);
            }
        });
    } else {
        console.log("We�ve encountered an error: " + error);
    }
});

var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};