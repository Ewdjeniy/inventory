import React from 'react';
import { createRoot } from 'react-dom/client';
import './authentification.css';

class Authentification extends React.Component {
  
  sendAjax(data, action, callBack, asynchrony) {
    var boundary = String(Math.random()).slice(2);
    var boundaryMiddle = '--' + boundary + '\r\n';
    var boundaryLast = '--' + boundary + '--\r\n';

    var body = ['\r\n'];
    for (var key in data) {
        // добавление поля
        body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + data[key] + '\r\n');
    }

    body = body.join(boundaryMiddle) + boundaryLast;

    // Тело запроса готово, отправляем

    var xhr = new XMLHttpRequest();
    xhr.open('POST', action, asynchrony);

    xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

    xhr.onreadystatechange = function() {
        if (this.readyState != 4) {
            return;
        }
        callBack(this.responseText);
    }
    
    xhr.send(body);
  }
  
  logOut() {
    localStorage.removeItem(localStorage.duke);
    localStorage.removeItem('duke');
    
    this.sendAjax({$log_out: 1}, 'authentification.php', function() {window.location.reload();}, true);
  }
  
  render() {
    
    return (      
      <header className="header">
        <div className="enter">
          <div className="logo">Лого</div>
          <span>
            {localStorage.duke}
          </span>
          <div id="indicator"></div>
        </div>
        <div className="logOut">
          <div className="authentificationButtons" onClick={() => this.logOut()}>Выйти</div>
        </div>
      </header>
    );
  }
  
}




export default Authentification;