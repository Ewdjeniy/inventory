import React from 'react';
import ReactDOM from 'react-dom';
import Authentification from '../../authenticated/authentification/authentification.js';
import Static from '../../static.js';

class Registration extends React.Component {
  
  checkRegistrateForm() {
    const password = document.registration.user_password.value;
    const confirmationPassword = document.registration.confirm_user_password.value;
    if (password == confirmationPassword) {
      return true; 
    } else {
      return false;  
    }
  }
  
  registrate() {
    if (this.checkRegistrateForm()) {
      new Authentification()
        .sendAjax({
          $user_login: document.registration.user_login.value,
          $user_password: document.registration.user_password.value
        }, 'registration.php', function(login) {
            if (login == '') {
              alert('Извините, нет связи с сервером, попробуйте позже');
            } else if (login == 'busy') {
              document.registration.user_login.value ='';
              alert('Извините, логин уже занят, придумайте другой');
            } else {
              localStorage.duke = login;
              if (localStorage.nord != '[["новый"],1,1]') {
                localStorage[localStorage.duke] = localStorage.nord;
              }
              window.location.reload();
            }
          }, true);
    } else {
      alert('Поля пароль и подтверждение пароля не совпадают!');
      document.registration.user_password.value = '';
      document.registration.confirm_user_password.value = '';
    }
  }
  
  exitRegistration() {
    document.body.style.display = 'block';
    document.body.style.height = 'auto';
    document.body.style.verticalAlign = 'top';
    ReactDOM.render(
      <Static />,
      document.getElementById('root')
    );
  }
  
  render() {
    
    return (      
      <section className="registration">
        <form name="registration" action="" method="post" enctype="multipart/form-data">
          Введите Ваш логин:
          <input className="registrationInput" name="user_login" type="text" placeholder="Логин"/>
          Придумайте пароль:
          <input className="registrationInput" name="user_password" type="password" placeholder="Пароль"/>
          Повторите пароль:
          <input className="registrationInput" name="confirm_user_password" type="password" placeholder="Пароль"/>
          <div className="registrationButtons">
            <div className="authentificationButtons" onClick={() => this.registrate()}>Зарегистрироваться</div>
            <div className="authentificationButtons" onClick={() => this.exitRegistration()}>Назад</div>
          </div>
        </form>
      </section>
    );
  }
  
}




export default Registration;