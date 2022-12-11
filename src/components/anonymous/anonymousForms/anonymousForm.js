import React from 'react';
import { createRoot } from 'react-dom/client';
import AnonymousAuthentification from '../anonymousAuthentification/anonymousAuthentification.js';
import AnonymousLinks from '../anonymousLinks/anonymousLinks.js';
import AnonymousProducts from '../anonymousProducts/anonymousProducts.js';
import './anonymousForm.css';


class AnonymousForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.changeLink = this.changeLink.bind(this);
    this.handleLinkFormChange = this.handleLinkFormChange.bind(this);
    this.handleProductFormChange = this.handleProductFormChange.bind(this);
    this.saveName = this.saveName.bind(this);
    this.addLink = this.addLink.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    
    this.state = {
      // если значение в массиве localStorage по ключу nord не undefined значение link берётся
      // из значения в массиве localStorage по ключу nord, в остальных случаех значение ссылки - 1 (не 0)
      link: localStorage.nord ? JSON.parse(localStorage.nord)[2] : 1,
      // если значение в массиве localStorage по ключу nord не undefined значение имени ссылки берётся
      // из значения в массиве localStorage по ключу nord. Из третьего элемента массива необходимо отнять 1,
      // чтобы получить порядковый номер элемента в массиве имен ссылок, так как
      // ссылки начинаются с 1, а не с нуля
      name: localStorage.nord ? JSON.parse(localStorage.nord)[0][JSON.parse(localStorage.nord)[2] - 1] : 'новый',
      // если значение в массиве localStorage по ключу nord не undefined значение id берётся
      // из значения в массиве localStorage по ключу nord, в остальных случаях значение id - 1 (не 0)
      id: localStorage.nord ? JSON.parse(localStorage.nord)[1] : 1,
      productName: '',
      productQuantity: 0,
    }
  }
  
  handleLinkFormChange() {
    // меняет значение свойства name в обьекте state и переписывает Html
    this.setState({
      name: document.linkName.new_link_name.value,      
    });
  }
  
  handleProductFormChange() {
    // меняет значения свойств productName и productQuantity в обьекте state и переписывает Html
    this.setState({
      productName: document.production.productName.value,
      productQuantity: document.production.productQuantity.value,      
    });
  }
  
  saveProduct() {
    // меняет значения свойств id, productName и productQuantity в обьекте state и переписывает Html
    this.setState({
      id: JSON.parse(localStorage.nord)[1],
      productName: '',
      productQuantity: 0,
    });
    
  }
  
  deleteProduct() {
    // переписывает Html
    this.setState({});
  }
  
  saveName() {
    // переписывает Html
    this.setState({});
  }
  
  addLink() {
    // меняет значения свойств link, name, productName и productQuantity в обьекте state и переписывает Html
    this.setState({
      link: JSON.parse(localStorage.nord)[2],
      name: 'новый',
      productName: '',
      productQuantity: 0,
    });
  }
  
  changeLink(i) {
    // меняет значения свойств link и name в обьекте state и переписывает Html
    const links = localStorage.nord ? JSON.parse(localStorage.nord)[0] : [];
    
    this.setState({
      link: i + 1,
      name: links[i],
    });
  }
  
  deleteLink() {
    // меняет значения свойств link и name в обьекте state и переписывает Html
    const links = localStorage.nord ? JSON.parse(localStorage.nord)[0] : [];
    
    this.setState({
      link: 1,
      name: links[0],
    });
  }
  
  render() {
    
    // выводит на экран <h1> и то что возвращает метод render классов AnonymousAuthentification,
    // AnonymousLinks и AnonymousProducts
    return (
      <section>
        <AnonymousAuthentification setView={this.props.setView}/>
        <h1 className="title">Инвентаризация</h1>
        <AnonymousLinks
          id={this.state.id}
          name={this.state.name}
          sendAjax={this.sendAjax}
          changeLink={this.changeLink}
          handleLinkFormChange = {this.handleLinkFormChange}
          saveName = {this.saveName}
          addLink = {this.addLink}
          deleteLink ={this.deleteLink}
        />
        <AnonymousProducts 
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




export default AnonymousForm;