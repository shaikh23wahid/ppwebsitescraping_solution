var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');
var express=require('express');
var app=express();
app.use(express.static(__dirname + '/public'));

app.get('/scrape', function(req, res){
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
            if($(this).text()=="Chart"){
                myData[$(this).text()]=   imgsrc
            }else {
                myData[$(this).text()] = newArr[tr_index].replace(/(\s+)/, "");
            }
            });

        console.log(myData)

        var outputFilename = 'public/mysharesdata.json';
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
});




app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
