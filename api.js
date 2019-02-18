const token = 'pqsSeguranca=56405642565256465645565356555660565656595660571556805711568956925691569257045699570957615700571857215715571357765717576457655767571757885713573157245734573257175741573057885715580857115767576757685780576057755775576057805786576957885791578157885772577557665777574957135792571757825783578457775780571358085717592359275922591759285918592059225938592459255942';


var webdriver = require('selenium-webdriver');
var express = require('express')
var app = express()
var port = process.env.PORT || 14000;
var By = webdriver.By;


var SGV = require('./funcoes-sgv');

const navegador = 'chrome';//'chrome'; //phantomjs

app.get('/buscarInspecaoID/:id', function (req, res) {
    var params = req.params.id;
    console.log(params);
    var driver = new webdriver.Builder().forBrowser(navegador).build();
 
    SGV.acessarExibicaoWorklistVistoria(driver, token);
 
    SGV.gerarJSON_inspecaoID(driver, params, function(lista){
       
    var resultado_json = JSON.stringify(lista);
    res.status(200).send(resultado_json  );
   })

    driver.quit();
});


app.get('/listarWFID/', function (req, res) {

    var driver = new webdriver.Builder().forBrowser(navegador).build();
  
    SGV.acessarExibicaoWorklistVistoria(driver, token);
      
    SGV.consultarInspecaoPorAtividade(driver, "Seleção de Empresa"); //Validação da pré-valorização   ---- Seleção de Empresa
    var hash = {};
    var resultado_json  = '';
    SGV.TabelaDTGInstanciasToArray(driver, function(lista){
        
        wf_id = [];
        prestador = [];
        subRamo = [];

        for(var i = 0; i < lista.length; i++) {

           wf_id.push(lista[i][1]);
           prestador.push(lista[i][13]);
           subRamo.push(lista[i][6]);
        }
        hash['workflow_id'] = wf_id;
        hash['prestador'] = prestador;
        hash['subramo'] = subRamo;
        resultado_json = JSON.stringify(hash);
        res.status(200).send(resultado_json);
    })
  
    driver.quit();
});


app.get('/selecao/', function (req, res) {
    var driver = new webdriver.Builder().forBrowser(navegador).build();

    let wf_id = req.query.wf_id;
    let inspecao_id = req.query.inspecao_id;
    let nome_empresa = req.query.nome_empresa;
    //console.log(nome_empresa);
    //SGV.selecionarPrestador(driver, token, '8466623' , '403134' , 'ACETEC VISTORIAS LTDA - MT, CUIABA');
    SGV.selecionarPrestador(driver, token, wf_id, inspecao_id , nome_empresa);
    //exemplo: http://localhost:14000/selecao/?wf_id=8466623&inspecao_id=403134&nome_empresa=COOPERATIVA DE VISTORIADORES DO SUL DO BRASIL LTDA - RS, PELOTAS


    driver.quit();
});

setInterval(function() {  

    var driver = new webdriver.Builder().forBrowser(navegador).build();

    SGV.acessarExibicaoWorklistVistoria(driver, token);
      
    SGV.consultarInspecaoPorAtividade(driver, "Seleção de Empresa"); //Validação da pré-valorização   ---- Seleção de Empresa
    var hash = {};
    var resultado_json  = '';
    SGV.TabelaDTGInstanciasToArray(driver, function(lista){
        
        wf_id = [];
        prestador = [];
        subRamo = [];

        for(var i = 0; i < lista.length; i++) {

           wf_id.push(lista[i][1]);
           prestador.push(lista[i][13]);
           subRamo.push(lista[i][6]);
        }
        hash['workflow_id'] = wf_id;
        hash['prestador'] = prestador;
        hash['subramo'] = subRamo;
        resultado_json = JSON.stringify(hash);
       // res.status(200).send(resultado_json);
    })
  
    driver.quit();
}, 600000);


app.listen(port, function () {
    console.log('Example app listening on port: ',port)
});

