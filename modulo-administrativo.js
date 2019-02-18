const ID_LOGIN  = "uctLogon_txtLogon"
const ID_SENHA  = "uctLogon_txtPassword"
const ID_BOTAO_OK  = "uctLogon_btnLogon"

var webdriver = require('selenium-webdriver');
var express = require('express')
var app = express()
var By = webdriver.By;


module.exports = {
    login: function (driver, login, password) {
    
        driver.get('http://www.mapfreconnect.com.br/ModuloAdministrativo/index.aspx?Pagina=Menu_Iniciar');
        driver.switchTo().frame(2);

        size = driver.findElements(By.tagName("frame")).size();
        // prints the total number of frames inside outer frame           
        console.log("Total Frames --" + size)

        driver.findElement(By.id(ID_LOGIN)).sendKeys(login);
        driver.findElement(By.id(ID_SENHA)).sendKeys(password);
        driver.findElement(By.id(ID_BOTAO_OK)).click();
    },
    tabela: function (driver, retorno) {

      driver.executeScript(function() {
        
        return Array.prototype.map.call(document.querySelectorAll('#customers tr'), function(tr){
          return Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
            return td.innerHTML;
            });
          });
        }).then(function(innerHTML) {
          //console.log(innerHTML);
          return retorno(innerHTML);
      });
     
    }


  };  

