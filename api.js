var webdriver = require('selenium-webdriver');
var express = require('express')
var app = express()

var port = process.env.PORT || 14000;
var By = webdriver.By;

var modulo = require('./modulo-administrativo');

const navegador = 'chrome'; //phantomjs

app.get('/test', function (req, res) {
    var driver = new webdriver.Builder().forBrowser(navegador).build();

    modulo.login(driver, '', '');

    driver.get('http://www.mapfreconnect.com.br/ModuloAdministrativo/Enquadramento.aspx');

    driver.findElement(By.id('ctl00_body_tabelaNome')).sendKeys('tb_re_corretor_agrupado');
    driver.findElement(By.id('ctl00_body_btnBuscar')).click();

    driver.findElement(By.id('ctl00_body_listaChavesTabela')).findElements(By.className('td')).then(function(rowns){
        for (var i = 0; i < rowns.length; i++) {
            console.log(rowns.length);
        }
    })
    //ctl00_body_listaChavesTabela_ctl00_NomeChaveValor
    //ctl00_body_listaChavesTabela_ctl01_NomeChaveValor

    
 

    //ctl00_body_listaChavesTabela

//ctl00_body_listaChavesTabela

    driver.sleep(60000);
    driver.wait(function() {
        return driver.getTitle().then(function(title) {
            console.log(title);
            return title === '.: Modulo Administrativo :.';
        });
    }, 5000).then(function() {
        res.status(200).send('Done');
    }, function(error) {
        res.status(200).send(error);
    });
    driver.quit();
});

app.listen(port, function () {
    console.log('Example app listening on port: ',port)
});

