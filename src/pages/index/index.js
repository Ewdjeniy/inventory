import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Form from '../../components/authenticated/forms/form.js';
import Registration from '../../components/anonymous/registration/registration.js';
import AnonymousForm from '../../components/anonymous/anonymousForms/anonymousForm.js';
import Authentification from '../../components/authenticated/authentification/authentification.js';


class Page extends React.Component {
  
  constructor(props) {
    
    super(props);
    
    this.state = {
      view: <AnonymousForm setView={this.setView.bind(this)} />
    }
    
    this.init();
      
  }
    
  setView(view) {
    this.setState({view: view});
  }
    
  init() {
    const that = this;
    new Authentification().sendAjax({session_login: '?'}, 'authentification.php', function(login) {
      if (login == '') {
        if (!localStorage.nord) {
          localStorage.nord = '[["новый"],1,1]';
        }
        that.setState({view: <AnonymousForm setView={that.setView.bind(that)} />});
      } else {     
        localStorage.duke = login;
        
        takeDataFromBdifNoLocalData();
        
        if (localStorage[localStorage.duke]) {
          synchronizeLocalDataWithBd();
        }
        that.setState({view: <Form />});
      }
    }, true);
  }
  
  render() {
    return (
      <div className="container">
        {this.state.view}
      </div>
    );
  }
}
   

createRoot(document.getElementById('root')).render(<Page />);       
                                    

export default Page;



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
