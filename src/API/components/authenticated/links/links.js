import React from 'react';
import ReactDOM from 'react-dom';
import Authentification from '../authentification/authentification.js';

class Links extends React.Component {
  
  constructor(props) {
    super(props);
    this.changeLink = this.changeLink.bind(this);
    this.saveName = this.saveName.bind(this);
    this.addLink = this.addLink.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
  }
  
  changeLink(i) {
    const products = JSON.parse(localStorage[localStorage.duke]);
    const links = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[0] : [];
    
    products[2] = i + 1;
    localStorage[localStorage.duke] = JSON.stringify(products);
    this.props.changeLink(i);
  }
  
  saveName() {
    const products = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke]) : [];
    const links = localStorage[localStorage.duke] ? products[0] : [];
    const activeLink = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[2] : 1;
    const id = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[1] : 1;
    
    if (localStorage[localStorage.duke]) {
      
      products[0][activeLink - 1] = this.props.name;
      
    } else {
      
      links.push(this.props.name);
      products.push(links);
      products.push(id);
      products.push(1);
      
    }
    localStorage[localStorage.duke] = JSON.stringify(products);
    
    this.props.sendAjax('links.php', {
	  linkID: document.linkName.linkID.value,
	  new_link_name: document.linkName.new_link_name.value,
	});
    
    this.props.saveName();
  }
  
  addLink() {
    const products = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke]) : [];
    const links = localStorage[localStorage.duke] ? products[0] : [];
    const activeLink = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[2] : 1;
    const id = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[1] : 1;
    
    if (localStorage[localStorage.duke]) {
      
      links.push('новый');
      products[2] += 1;
      
    } else {
      
      links.push(this.props.name);
      products.push(links);
      products.push(id);
      products.push(1);
    }
    
    localStorage[localStorage.duke] = JSON.stringify(products);
    
    this.props.sendAjax('links.php', {
	  new_link: 1,
	});
    
    this.props.addLink();
  }
  
  deleteLink() {
    const isSure = confirm('Вы точно хотите удалить этот список?');
    if (isSure) {
      const products = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke]).slice(3) : [];
      const links = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[0] : [];
      const activeLink = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[2] : 1;

      for (let i=0; i < products.length;) {
        if (products[i].linkName == activeLink) {
          products.splice(i, 1);
        } else {
          if (products[i].linkName > activeLink) {
            products[i].linkName -=1;
          }
          i += 1;
        }
      }
      
      links.splice(activeLink - 1, 1);
      if (links.length == 0) {
        links.push('новый');
      }
      const result = [];
      result.push(links, this.props.id, 1);
      for (let j = 0; j < products.length; j++) {
        result.push(products[j]);
      }
      localStorage[localStorage.duke] = JSON.stringify(result);

      this.props.deleteLink();
      
      this.props.sendAjax('links.php', {$id: activeLink});   
    }
  }  
  
  render() {
    
    const JSNproducts = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke]).slice(0,1).join() : [];
    const products = localStorage[localStorage.duke] ? JSNproducts.split(',') : [];
    const links = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[0] : [];
    const activeLink = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[2] : 1;
    const list = products.map((product, index) => {
      return  <span key={index} className={(index + 1 == activeLink) ? 'lists active' : 'lists'} onClick={() => this.changeLink(index)}>
                {product}
              </span>
    });
    
    return (
      <section className="list">
        <form name="linkName" encType="multipart/form-data" action="" method="post">
          Название списка:<br/>
          <div className="listName">
            <input type="hidden" name="linkID" value={localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[2] : 1} />
            <input name="new_link_name" type="text" value={this.props.name} onChange={ () => this.props.handleLinkFormChange() } />
            <div className="changeListName" onClick={ () => this.saveName() }>Изменить</div>
            <div className="deleteList" onClick={ () => this.deleteLink() }>Удалить</div>
          </div>
        </form>
        <div className="links">
          <div className="addListButton" onClick={() => this.addLink()}>+</div>
          {list}
        </div>
      </section>
    );
  }
}








export default Links;