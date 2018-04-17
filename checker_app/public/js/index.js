    function MyAlert()
    {
       if(document.forms[0].radio1.checked === true) {
         document.getElementById("customInput").style.visibility = "visible";
        }
        else{
            document.getElementById("customInput").style.visibility = "hidden";
        }
    }
     function myScript()
    {
       document.getElementById('customOutput').style.visibility="hidden";
    }
    console.log(document.getElementById('1')) ;
    var resultElement = document.getElementById('result');
    var customResultElement = document.getElementById('Result');
    var customElement = document.getElementById('customOutput');
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.getSession().setMode("ace/mode/python");
    var code = editor.getValue("code")
    mapping = {'python 2': 'python',
    'python 3':'python',
    'cpp':'c_cpp',
    'java':'java'
    }
    var  client = io();
    var  clientId = null;
    client.on('register', function(id) {
        clientId = id;
    });

    client.on('notify', function(result) {
        console.log(result);
        resultElement.textContent = result;
    });

    client.on('custom', function(result) {
        result = result.replace(/\r?\n/g, '<br />');
        customElement.style.visibility = "visible";
        customElement.innerHTML = result;
    });

    document.querySelector('button[name="run-btn"]').onclick = function() {
        customElement.style.visibility="hidden";
        var compiler = document.getElementById("compiler").value  ;
        var code = editor.getValue("code");
        var input = document.getElementById('customInput').value ;
        axios.post('/evaluate', {
            'clientId': clientId,
            'code': code,
            'compiler':compiler,
            'customInput': input
          })
          .then(function (response) {
            resultElement.textContent = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
    };
    document.querySelector('button[name="submit-btn"]').onclick = function() {
        var compiler = document.getElementById("compiler").value  ;
        var code = editor.getValue("code");
        axios.post('/evaluate', {
            'clientId': clientId,
            'code': code,
            'compiler':compiler
          })
          .then(function (response) {
            resultElement.textContent = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
    };
    document.addEventListener('DOMContentLoaded',function() {
        document.querySelector('select[name="compiler"]').onchange=changeEventHandlerCompiler;
        document.querySelector('select[name="theme"]').onchange=changeEventHandlerTheme;
    },false);

    function changeEventHandlerCompiler(event) {
        // You can use “this” to refer to the selected element.
        if(!event.target.value) alert('Please Select One');
        else editor.getSession().setMode(`ace/mode/${mapping[event.target.value]}`) ; 
    }

    function changeEventHandlerTheme(event) {
        // You can use “this” to refer to the selected element.
        if(!event.target.value) alert('Please Select One');
        editor.setTheme(`ace/theme/${event.target.value}`);
    }  