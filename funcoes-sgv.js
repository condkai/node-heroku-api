const ID_NUMERO_DA_INSPECAO  = "txtWfId"
const ID_ATIVIDADE_DA_INSPECAO = "ddlAtividade"
const ID_BOTAO_CONTINUAR = "btnContinuar"
const LINK_WORKLISTVISTORIA  = 'http://www.aliancadobrasil.com.br/SGVS/SGVW0008/principal.aspx?'
const LINK_SELECAO_PRESTADOR = 'http://www.aliancadobrasil.com.br/SGVS/SGVW0008/ListaTarefas.aspx?usuario_id=32189,32189&tp_wf_id=168,168&tp_versao_id=1,1&coluna_exibicao=1|1|1|1|1|1|1|1|1|1|1|1|1&tp_ativ_id=2'; 

var webdriver = require('selenium-webdriver');
var express = require('express')
var app = express()
var By = webdriver.By;

function indiceDaAtividade(nomeAtividade){
  if(nomeAtividade == 'Seleção de Empresa'){
    return "3";
  }
  if(nomeAtividade == 'Verificação da pré-valorização'){
    return "4";
  }
  if(nomeAtividade == 'Validação da pré-valorização'){
    return "5";
  }

}

function indiceDoComboPorNome(driver , descricao, retorno){
 
  driver.executeScript(function() {
   
    listaDoCampo =  Array.prototype.map.call(document.querySelectorAll('#ddlEmpresa option'), function(option){
      
      return option.innerHTML;
     
    });
    return listaDoCampo;

    }).then(function(innerHTML) {

      for(var i = 0; i < innerHTML.length; i++) {
          
        if (innerHTML[i] == descricao) {
          return retorno(i + 1);
        }
       
     }

     // return retorno(i);
  });


}


function lerTabela(driver, retorno){

  driver.executeScript(function() {
        
    listaWFID =  Array.prototype.map.call(document.querySelectorAll('#dtgInstancias tbody tr:not(:first-child)'), function(tr){
      return Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
        return td.innerHTML;
      });
    });
    return listaWFID;

    }).then(function(innerHTML) {
      return retorno(innerHTML);
  });

}

function irParaProximaPagina(driver){
  driver.findElement(webdriver.By.css('#' + 'lblPaginacao' + ' > a:last-child')).click();  
}


function listarTabelaDTGInstancias(driver, retorno){
  var arrayDePaginas = [];

    driver.findElements(By.css("#lblPaginacao a")).then(function(qtdPaginas){
      console.log(qtdPaginas.length);
      var ultimaPagina = 0;

      if (qtdPaginas.length > 0) {
        ultimaPagina = qtdPaginas.length - 1
      }

      for (let paginaAtual = 0; paginaAtual <= ultimaPagina ; paginaAtual++) {
        lerTabela(driver, function(lista){
          arrayDePaginas = arrayDePaginas.concat(lista);
          
          if (paginaAtual == ultimaPagina) {
          retorno(arrayDePaginas);
            
        }
          
        });
    
        if (paginaAtual != ultimaPagina) {
          irParaProximaPagina(driver);
      }
        
      
      }      
     
    });



}

function listarTabelaDTGInspecaoSituacaoHist(driver, wf_id,  retorno){
  var inspecao_id;

    consultarInspecaoPorNumero(driver, wf_id);

    driver.findElement(By.id(wf_id)).click();

    driver.executeScript(function() {
      return Array.prototype.map.call(document.querySelectorAll('#DtGInspecaoSituacaoHist tbody tr'), function(tr){
        return Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
          return td.innerHTML;
          });
        });
      }).then(function(innerHTML) {
        //console.log(innerHTML);

        var max = innerHTML.length - 1;
        var str = innerHTML[max][0];
        var mySubString = str.substring(
            str.lastIndexOf("inspecaoid=") + 11, 
            str.lastIndexOf("&amp;pqsSeguranca")
        );
    
        //console.log(mySubString);
  

        retorno(mySubString);
  
    });


}

function consultarInspecaoPorNumero(driver, numeroInspecao){
  driver.findElement(By.id(ID_NUMERO_DA_INSPECAO)).sendKeys(numeroInspecao);
  driver.findElement(By.id(ID_ATIVIDADE_DA_INSPECAO)).click();
  driver.findElement(By.id(ID_BOTAO_CONTINUAR)).click();
  driver.findElement(By.id(ID_BOTAO_CONTINUAR)).click();
    
}

module.exports = {
    TabelaDTGInstanciasToArray: function(driver, retorno){
      
      listarTabelaDTGInstancias(driver, function(linha){

        retorno(linha);

    });    
     },
     gerarJSON_inspecaoID: function(driver, wf_id, retorno){
      
      listarTabelaDTGInspecaoSituacaoHist(driver,wf_id,function(valor){
        var hash = {};
        hash['inspecao_id'] = valor;
        retorno(hash);
      });
      
     },


     consultarInspecaoPorNumero: function(driver, numeroInspecao){

      driver.findElement(By.id(ID_NUMERO_DA_INSPECAO)).sendKeys(numeroInspecao);
      driver.findElement(By.id(ID_BOTAO_CONTINUAR)).click();
      driver.findElement(By.id(ID_BOTAO_CONTINUAR)).click();
      
     },

     consultarInspecaoPorAtividade: function(driver, descricaoSituacao){
      
      driver.findElement(webdriver.By.css('#' + ID_ATIVIDADE_DA_INSPECAO + ' > option:nth-child(' + indiceDaAtividade(descricaoSituacao) + ')')).click();
      driver.findElement(By.id(ID_BOTAO_CONTINUAR)).click();
      driver.findElement(By.id(ID_BOTAO_CONTINUAR)).click();
     },
     acessarExibicaoWorklistVistoria: function(driver, tokenSGV){

      var link = LINK_WORKLISTVISTORIA + tokenSGV;

      driver.get(link);
      
     },
     selecionarPrestador: function(driver, tokenSGV, WF_ID, INSPECAO_ID, NOME_EMPRESA){

      var link = LINK_SELECAO_PRESTADOR + '&wf_id=' + WF_ID + '&inspecaoid=' + INSPECAO_ID + '&' +  tokenSGV;
      //console.log(link);
      driver.get(link);

      driver.findElement(By.id('2')).click();
      //driver.findElement(webdriver.By.css('#' + 'ddlEmpresa' + ' > option:nth-child(' + '2' + ')')).click();
      indiceDoComboPorNome(driver, NOME_EMPRESA , function(id){
        driver.findElement(webdriver.By.css('#ddlEmpresa > option:nth-child(' + id + ')')).click();
       //TabSGVW0009
      driver.findElement(webdriver.By.css('#TabSGVW0009 > tbody > tr:first-child > td:last-child')).click();

      })

     }

  };  

