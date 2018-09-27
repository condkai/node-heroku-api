const ID_LOGIN  = "uctLogon_txtLogon"
const ID_SENHA  = "uctLogon_txtPassword"
const ID_BOTAO_OK  = "uctLogon_btnLogon"

var webdriver = require('selenium-webdriver');
var express = require('express')
var app = express()
var By = webdriver.By;


module.exports = {
    login: function (driver, login, password) {
    
        driver.get('http://www.mapfreconnect.com.br/ModuloAdministrativo/acesso.aspx');
        driver.findElement(By.id(ID_LOGIN)).sendKeys(login);
        driver.findElement(By.id(ID_SENHA)).sendKeys(password);
        driver.findElement(By.id(ID_BOTAO_OK)).click();
    },
    bar: function () {
      // whatever
    }
  };
  
