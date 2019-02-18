const ID_NUMERO_DA_INSPECAO  = "txtWfId"
const ID_ATIVIDADE_DA_INSPECAO = "ddlAtividade"
const ID_BOTAO_CONTINUAR = "btnContinuar"

var webdriver = require('selenium-webdriver');
var express = require('express')
var app = express()
var By = webdriver.By;




module.exports = {
    consultarInspecaoPorNumero: function(driver, numeroInspecao){

      driver.findElement(By.id(ID_NUMERO_DA_INSPECAO)).sendKeys(numeroInspecao);
      driver.findElement(By.id(ID_BOTAO_CONTINUAR)).click();
      driver.findElement(By.id(ID_BOTAO_CONTINUAR)).click();
      
     },

     consultarInspecaoPorAtividade: function(driver, descricaoSituacao){
      
      driver.findElement(webdriver.By.css('#' + ID_ATIVIDADE_DA_INSPECAO + ' > option:nth-child(' + indiceDaAtividade(driver, descricaoSituacao) + ')')).click();
      driver.findElement(By.id(ID_BOTAO_CONTINUAR)).click();
      driver.findElement(By.id(ID_BOTAO_CONTINUAR)).click();
     }


  };  

