import React from 'react';
import ReactDOM from 'react-dom';
import Form from './authenticated/forms/form.js';
import AnonymousForm from './anonymous/anonymousForms/anonymousForm.js';
import Authentification from './authenticated/authentification/authentification.js';

class Static extends React.Component {
  
  renderAPI() {
    new Authentification().sendAjax({session_login: '?'}, 'authentification.php', function(login) {
      if (login == '') {
        if (!localStorage.nord) {
          localStorage.nord = '[["новый"],1,1]';
        }
        
        ReactDOM.render(<AnonymousForm />,document.getElementById('API'));
      } else {     
        localStorage.duke = login;
        
        takeDataFromBdifNoLocalData();
        
        if (localStorage[localStorage.duke]) {
          synchronizeLocalDataWithBd();
        }
        
        ReactDOM.render(<Form />,document.getElementById('API'));
      }
    }, true);
  }
  
  render() {
    return (
      <section id="API">
        {this.renderAPI()}
      </section>
    );
  }
}









//========================================

ReactDOM.render(
  <Static />,
  document.getElementById('root')
);



function takeDataFromBdifNoLocalData() {
  if (!localStorage[localStorage.duke]) {
    var data ={
      $takeDataFromBdifNoLocalData: 1,
    };  
    var boundary = String(Math.random()).slice(2);
    var boundaryMiddle = '--' + boundary + '\r\n';
    var boundaryLast = '--' + boundary + '--\r\n'

    var body = ['\r\n'];
    for (var key in data) {
      // добавление поля
      body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + data[key] + '\r\n');
    }

    body = body.join(boundaryMiddle) + boundaryLast;

    // Тело запроса готово, отправляем

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'base.php', true);

    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

    xhr.onreadystatechange = function() {
      if (this.readyState != 4) {
        return;
      }

      if (this.responseText != '') {
        localStorage[localStorage.duke] = this.responseText;
        window.location.reload();
      }
    }

    xhr.send(body);
  }
}

function synchronizeLocalDataWithBd() {	
    var data = {
      $checkSynchronization: 1,
      $localStor: JSON.stringify(changeThirdItemOnOneinArray(JSON.parse(localStorage[localStorage.duke]))),
    };
    
	var boundary = String(Math.random()).slice(2);
	var boundaryMiddle = '--' + boundary + '\r\n';
	var boundaryLast = '--' + boundary + '--\r\n'

	var body = ['\r\n'];
	for (var key in data) {
	  // добавление поля
	  body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + data[key] + '\r\n');
	}

	body = body.join(boundaryMiddle) + boundaryLast;

	// Тело запроса готово, отправляем

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'base.php', true);

	xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

	xhr.onreadystatechange = function() {
	  if (this.readyState != 4) return;
	}

	xhr.send(body);
}

function changeThirdItemOnOneinArray(array) {
  
  array[2] = 1;
  return array;
}




export default Static;