import React from 'react';
import { createRoot } from 'react-dom/client';
import Authentification from '../../authenticated/authentification/authentification.js';
import Registration from '../registration/registration.js';
import './anonymousAuthentification.css';

class AnonymousAuthentification extends React.Component {
  
  constructor(props) {
    
    super(props);
    
    this.state = {
      authentificationButtonInnerHtml: <div className="authentificationButtons" onClick={() => this.renderEnterForm()}>Войти</div>,
    }
    
  }
  
  renderEnterForm() {
    // Выводит на экран форму для входа на сайт
    document.getElementById('enterForm').style.display = 'flex';
    
    // переписывает функцию-обработчик события Click кнопки "Войти"
    this.setState({
      authentificationButtonInnerHtml: <div className="authentificationButtons" onClick={() => this.logIn()}>Войти</div>,
    });
  }
  
  renderRegistration() {
    // Перерисовывает корневой <div>, выводит на экран
    // только форму для регистрации с кнопками
    this.props.setView(<Registration setView={this.props.setView} />);
    
    // переписывает стиль для <body>, чтобы форма была по центру экрана
    document.body.style.display = 'table-cell';
    if (window.screen.width < 768) {
      document.body.style.height = '90vh';
    } else {
      document.body.style.height = '100vh';
    }
    document.body.style.verticalAlign = 'middle';
  }
  
  checkAuthentificationForm() {
    if (document.authentification.user_login.value == '' || document.authentification.user_password.value == '') {
      return false; 
    } else {
      return true;  
    }
  }
    
  logIn() {
    if (this.checkAuthentificationForm()) {
      // Отправляет Ajax запрос на сервер, передаем поля формы для входа
      new Authentification()
      .sendAjax({
        $user_login: document.authentification.user_login.value,
        $user_password: document.authentification.user_password.value
      }, 'authentification.php', 
                function(responseText) {
                  // если сервер вернет 'noDate' то пользователя с таким
                  // логином и паролем нет в Бд
                  if (responseText == 'noDate') {
                    alert('Вы не правильно ввели логин или пароль!');
                    document.authentification.user_password.value = '';
                  // если не будет связи с сервером, он вернет ''
                  } else if (responseText == '') {
                    alert('Извините, нет связи с сервером, попробуйте позже');
                  } else {
                    window.location.reload();
                  }
                }, true);
    } else {
      alert('Проверьте правильность заполнения полей логина и пароля');
    }
  }
  
  render() {
    
    return (      
      <header className="header">
        <div className="enter">
          <div className="logo">Лого</div>
          <div id="authentificationButton">
            {this.state.authentificationButtonInnerHtml}
          </div>
          <div className="authentificationButtons" onClick={() => this.renderRegistration()}>Зарегистрироваться</div>
        </div>
        <form name="authentification" encType="multipart/form-data" action="" method="post" id="enterForm">
          <input className="input" name="user_login" type="text" placeholder="Логин"/>
          <input className="input" name="user_password" type="password" placeholder="Пароль"/>
        </form>
      </header>
    );
  }
  
}




export default AnonymousAuthentification;