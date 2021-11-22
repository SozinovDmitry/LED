var json ={};
const txt = document.getElementById('textArea');
var counter = 0;
const canvas = document.getElementById('canvasData');
const headerGroup = document.getElementById('headerGroup');
let SelectElement = document.getElementById("selectFileName");

var jsonString = document.getElementById('textArea').value;

const url = new URL("http://localhost:4000/jsonConfigFile");
var configFilesName;

function showJSON(jsonData){
    txt.value = JSON.stringify(jsonData, null, 5);
}

function createHeader(){
    let HeaderMessage = document.getElementById('headerMessage').value;
    let HeaderTimeOut = document.getElementById('headerTimeOut').value;
    let HeaderAnimation = document.getElementById('headerAnimation').value;
    let HeaderColor = document.getElementById('headerColor').value;
    
    
    json = {...json, 
        
        ["key"+counter]:{
            "tag":"h1",
            "text":HeaderMessage,
            "duration":HeaderTimeOut,
            "anim":HeaderAnimation,
            "color":HeaderColor
        }
    };

    counter++;
    console.log(json);
    showJSON(json);
}

function createBar(){
    let barTimeOut = document.getElementById('barTimeOut').value;
    let barType = document.getElementById('barType').value;
    
    
    json = {...json, 
        
        ["key"+counter]:{
            "tag":"progress",
            "duration":barTimeOut,
            "type":barType
        }
    };

    counter++;
    console.log(json);
    showJSON(json);
}

function createNote(){
    let noteMessage = document.getElementById('noteMessage').value;
    let noteTimeOut = document.getElementById('noteTimeOut').value;
    let noteAnimation = document.getElementById('noteAnimation').value;
    
    
    json = {...json, 
        
        ["key"+counter]:{
            "tag":"notification",
            "text":noteMessage,
            "duration":noteTimeOut,
            "anim":noteAnimation
        }
    };

    counter++;
    console.log(json);
    showJSON(json);
}

function createStrike(){
    let StrikeMessage = document.getElementById('strikeMessage').value;
    let StrikeTimeOut = document.getElementById('strikeTimeOut').value;
    let StrikeAnimation = document.getElementById('strikeAnimation').value;
    let StrikeColor = document.getElementById('strikeColor').value;
    
    console.log("OLD JSON " + json);
    json = {...json, 
        ["key"+counter]:{
            "tag":"strike",
            "text":StrikeMessage,
            "duration":StrikeTimeOut,
            "anim":StrikeAnimation,
            "color":StrikeColor
        }
    };
    counter++;
    console.log(json);
    showJSON(json);
}

function createImage(){
    let ImageURL = document.getElementById('imgURL').value;
    let ImageTimeOut = document.getElementById('imgTimeOut').value;
    let ImageAnimation = document.getElementById('imgAnimation').value;
    
    console.log("OLD JSON " + json);
    json = {...json, 
        ["key"+counter]:{
            "tag":"img",
            "URL":ImageURL,
            "duration":ImageTimeOut,
            "anim":ImageAnimation
        }
    };
    counter++;
    console.log(json);
    showJSON(json);
}

function addHeaderinCanvas(){
    const canvasData = document.getElementById('createdID');
    const groupSelect =  document.getElementById('selectGroup').value;
    canvasData.remove();
    var div = document.createElement('div');
    div.setAttribute('id', 'createdID');
    div.innerHTML = document.getElementById(groupSelect).innerHTML;
    canvas.appendChild(div);
}

function createConfigFile(){
    var configFileName = document.getElementById('fileName').value;

    if(IsJsonString(json) == true) {
        (async () => {
            const rawResponse = await fetch('http://localhost:4000/jsonData', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: configFileName, jsonData:  document.getElementById('textArea').value})
            });
            const content = await rawResponse.json();
            
            console.log(content);
        })();
        
        alert("Конфигурационный файл создан! Обновите текущую страницу!")
    } else alert("Проверьте JSON!");

    
}

fetch(url).then(function(response) {
    response.json().then(function(json) {
        console.log(json);
        configFilesName = json;
        var count = Object.keys(configFilesName).length;
        
        for (i = 0; i < count; i++){
            var opt = document.createElement('option');
            opt.value = configFilesName[i];
            opt.innerHTML = configFilesName[i];
            SelectElement.appendChild(opt);
        }
    });
  });



function changeConfigFile(){
    const url = new URL("http://localhost:4000/jsonData?name="+SelectElement.value);
    fetch(url).then(function(response) {
        response.json().then(function(json) {
            showJSON(json);
        });
      });
    
    document.getElementById("fileName").value = SelectElement.value;

}

function createMainFile(){
    
    
        (async () => {
            const rawResponse = await fetch('http://localhost:4000/jsonConfigFile', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: SelectElement.value})
            });
            const content = await rawResponse.json();
        
            console.log(content);
        })();
        
        alert("КОнфигурационный файл изменен! На главной странице изменена информация!")


}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        console.log(e);
        return true;
    }
    return true;    
}