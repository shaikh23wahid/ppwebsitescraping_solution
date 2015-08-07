module.exports=function(app)
{
    app.get('/mysharesdata',function(req,res){
        res.render('public/mysharesdata.json')
    });
}