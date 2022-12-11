import React from 'react';
import { createRoot } from 'react-dom/client';
import Authentification from '../authentification/authentification.js';
import Links from '../links/links.js';
import Products from '../products/products.js';

class Form extends React.Component {
  
  constructor(props) {
    super(props);
    this.sendAjax = this.sendAjax.bind(this);
    this.changeLink = this.changeLink.bind(this);
    this.handleLinkFormChange = this.handleLinkFormChange.bind(this);
    this.handleProductFormChange = this.handleProductFormChange.bind(this);
    this.saveName = this.saveName.bind(this);
    this.addLink = this.addLink.bind(this);
    this.changeQuantity = this.changeQuantity.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    
    this.state = {
      link: localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[2] : 1,
      name: localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[0][JSON.parse(localStorage[localStorage.duke])[2] - 1] : 'новый',
      id: localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[1] : 1,
      productName: '',
      productQuantity: 0,
    }
  }
  
  sendAjax(action, data) {
    
    data.$online = 1;
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
	xhr.open('POST', action, true);

	xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

	xhr.onreadystatechange = function() {
      if (this.readyState != 4) {
        return;
      }
      
      if (this.responseText != 'online') {
        document.getElementById('indicator').style.backgroundColor = 'rgba(252, 3, 3, 0.8)';
        const intervalID = setInterval(function() {
          let array = JSON.parse(localStorage[localStorage.duke]);
          var data = {
            $online: 2,
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
            if (this.responseText == 'online') {
              window.location.reload();
            }
          }
          xhr.send(body);
        }, 10000);
      }
	}

	xhr.send(body);
  }
  
  handleLinkFormChange() {
    this.setState({
      name: document.linkName.new_link_name.value,      
    });
  }
  
  handleProductFormChange() {
    this.setState({
      productName: document.production.productName.value,
      productQuantity: document.production.productQuantity.value,      
    });
  }
  
  saveProduct() {
    
    this.setState({
      id: JSON.parse(localStorage[localStorage.duke])[1],
      productName: '',
      productQuantity: 0,
    });
    
  }
  
  deleteProduct() {
    this.setState({
      id: JSON.parse(localStorage[localStorage.duke])[1],
    });
  }
  
  saveName() {
    this.setState({});
  }
  
  addLink() {    
    this.setState({
      link: JSON.parse(localStorage[localStorage.duke])[2],
      name: 'новый',
      id: localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[1] : 2,
      productName: '',
      productQuantity: 0,
    });
  }
  
  changeLink(i) {
    const links = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[0] : [];
    
    this.setState({
      link: i + 1,
      name: links[i],
    });
  }
  
  deleteLink() {
    const links = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[0] : [];
    
    this.setState({
      link: 1,
      name: links[0],
    });
  }
  
  changeQuantity(index) {
    const formName = 'form' + index;
    const inputIdNumber = 'id' + (1 + index);
    const inputQuantityName = 'quantity' + (1 + index);
    const products = JSON.parse(localStorage[localStorage.duke]);
    const productsArray = JSON.parse(localStorage[localStorage.duke]).slice(3);
    const obj = {
      ['id' + (1 + index)]: document[formName][inputIdNumber].value,
      ['quantity' + (1 + index)]: +document[formName][inputQuantityName].value +1,
      $i: index + 1,
    };
    
    products[index + 3].quantity = +document[formName][inputQuantityName].value + 1;
    document[formName][inputQuantityName].value = products[index + 3].quantity;
    localStorage[localStorage.duke] = JSON.stringify(products);
    this.sendAjax(obj);
  }
  
  render() {
      
    return (
      <section>
        <Authentification />
        <h1 className="title">Инвентаризация</h1>
        <Links 
          id={this.state.id}
          name={this.state.name}
          sendAjax={this.sendAjax}
          changeLink={this.changeLink}
          handleLinkFormChange = {this.handleLinkFormChange}
          saveName = {this.saveName}
          addLink = {this.addLink}
          deleteLink ={this.deleteLink}
        />
        <Products 
          id={this.state.id}
          link={this.state.link}
          productName={this.state.productName}
          productQuantity={this.state.productQuantity}
          sendAjax={this.sendAjax}
          handleProductFormChange={this.handleProductFormChange}
          saveProduct={this.saveProduct}
          deleteProduct = {this.deleteProduct}
        />
      </section>
    );
  }
  
}




export default Form;