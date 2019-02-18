const LINK_WORKLISTVISTORIA  = 'http://www.aliancadobrasil.com.br/SGVS/SGVW0008/principal.aspx?'

var webdriver = require('selenium-webdriver');
var express = require('express')
var app = express()
var By = webdriver.By;


module.exports = {
    acessarExibicaoWorklistVistoria: function(driver, tokenSGV){

      var link = LINK_WORKLISTVISTORIA + tokenSGV;

      driver.get(link);
      
     }
    

  };  

