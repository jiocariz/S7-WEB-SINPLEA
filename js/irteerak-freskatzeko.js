//Tiempo de refresco
msFreskatzeko=2000;
//Zenbat aldiz galdetu diot PLCri
var nKontsultaKopurua = 0;

//ALDAGAIAK
//Irteerak
var bARGIA;
//Tenporizadorearen berehalako balioa
var tZENBATZAILEA;
//Botoia
var bBotoia;

//Etiketa batzuk aldez aurretik sortuko ditut, gero bat edo bestea HTML dokumentuan jartzeko ...
var pilotoVerdeOFF = document.createElement("img");
pilotoVerdeOFF.setAttribute("src","http://192.168.66.10/img/pilotoOFF.JPG");
//<img src="./img/pilotoOFF.JPG"/> ---> gauza bera egiten ari naiz, baina dokumentuan momentuz jarri gabe ...
var PilotoVerdeON = document.createElement("img");
PilotoVerdeON.setAttribute("src","http://192.168.66.10/img/pilotoVerdeOn.JPG");
//<img src="./img/pilotoVerdeOn.JPG"/> ---> gauza bera egiten ari naiz, baina dokumentuan momentuz jarri gabe ...

//BOTOIA
var etengailuaOFF = document.createElement("img");
etengailuaOFF.setAttribute("src","http://192.168.66.10/img/etengailuaOFF.JPG");
var etengailuaON = document.createElement("img");
etengailuaON.setAttribute("src","http://192.168.66.10/img/etengailuaON.JPG");

//BOTOIA sakatzen dudanean, SUBMIT sakatuko banu bezala egin behar da 
etengailuaOFF.addEventListener( "click", e => {
   var formularioa = document.querySelector("#form1");
   var balioa = document.querySelector("#form1 input");
   balioa.setAttribute("value","1");
   formularioa.submit();
} );

etengailuaON.addEventListener( "click", e => {
   var formularioa = document.querySelector("#form1");
   var balioa = document.querySelector("#form1 input");
   balioa.setAttribute("value","0");
   formularioa.submit();
} );

//Cuando cargue la página, que se vaya refrescando ...
window.addEventListener('load', (event) => {
   console.log("AddEventListener atalean sartzen naiz");
   eskatuDatuakPLCri();   
   nTimer = setInterval(function(){
       eskatuDatuakPLCri();
   },msFreskatzeko);
});  

function eskatuDatuakPLCri(){
   console.log("eskatuDatuakPLCri atalean sartzen naiz");
   fetch("API-IRTEERAK-JSON.html")
   .then((response) => response.json())
   .then((json) => {
    //JSON Mezua osorik ikusteko
   console.log(json);
   //JSON mezu horretatik datuak hartu behar ditut
   jsonMezuarenDatuakHartu(json);
   //Hartutako datuak HTML orrialdean margotu
   datuakSartuOrrialdean();        
   }).catch((error) => {
        //Erroren bat badago, catch atal honetara ailegatuko gara
       console.log("CATCH atalean sartzen ari naiz: hona hemen gertatu den errorea: ");
       console.log(error);
       //<p id="pJSON-error"></p> HTML elementuan errorea azalduko da:
       document.getElementById("pJSON-error").innerHTML="Errorea gertatu da PLCtik irteerak irakurtzean. Ikusi garatzailearentzako kontsolan"
   }).finally(() => {
        //Finally atala erabiltzen da exekutatzen den kode bat jartzeko, bai errore bat gertatu bada, bai dena ondo joan bada
        //<p id="pPLCriEskaerak"></p> HTML elementuan PLCri eskaera kopurua agertuko da
        console.log("FINALLY atalean sartzen ari naiz");
        nKontsultaKopurua+=1;
        document.getElementById("spanPLCriEskaerak").innerText = nKontsultaKopurua;
   }); 
}

function jsonMezuarenDatuakHartu( jsonObj ){     
   console.log("jsonMezuarenDatuakHartu atalean sartzen naiz");
   //JSON String aldagaia hartzeko
   tZENBATZAILEA = jsonObj['TENPORIZADOREAREN_BEREHALAKO_BALIOA']; 
   //JSON String aldagaia Boolean bihurtzeko
   bARGIA = jsonObj['ARGIAREN_EGOERA']=="1"?true:false;
   bBotoia = jsonObj['BOTOIAREN_EGOERA']=="1"?true:false;
   //JSON Int aldagaia hartzeko
   nZikloKopurua = parseInt(jsonObj['ZIKLO_KOPURUA']);
}

function datuakSartuOrrialdean(){
  console.log("datuakSartuOrrialdean atalean sartzen naiz"); 
  tdArgia = document.querySelector("#tdARGIA");

  if (bARGIA){
   tdArgia.children[0].remove();
   tdArgia.append(PilotoVerdeON);
  } else {
   tdArgia.children[0].remove();
   tdArgia.append(pilotoVerdeOFF);
  }

  //document.querySelector("#tdARGIA").innerHTML = bARGIA;
  document.getElementById("tdTENPORIZADOREA").innerHTML = tZENBATZAILEA;
  document.getElementById("tdZIKLO_KOPURUA").innerHTML = nZikloKopurua;

  //ETENGAILUA
  pEtengailua = document.getElementById("pEtengailua");
  if (bBotoia){
   pEtengailua.children[0].remove();
   pEtengailua.append(etengailuaON);
} else {   
   pEtengailua.children[0].remove();
   pEtengailua.append(etengailuaOFF);
   }
}
