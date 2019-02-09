var webdriver = require('selenium-webdriver');
var express = require('express')
var app = express()

var port = process.env.PORT || 14000;
var By = webdriver.By;

var modulo = require('./modulo-administrativo');

const navegador = 'chrome';//'chrome'; //phantomjs

app.get('/test', function (req, res) {
    var driver = new webdriver.Builder().forBrowser(navegador).build();

   // modulo.login(driver, 'lleite', 'l9l6l3L2@@');

    driver.get('https://www.w3schools.com/html/html_tables.asp');

    modulo.tabela(driver, function(resultado){
        //console.log(resultado[1][1]);
        for(var i = 1; i < resultado.length; i++) {
            var cube = resultado[i];
            console.log(resultado[i][1]);
            
        }
        res.status(200).send(JSON.stringify(resultado));
    });    

    driver.quit();
});

app.listen(port, function () {
    console.log('Example app listening on port: ',port)
});

