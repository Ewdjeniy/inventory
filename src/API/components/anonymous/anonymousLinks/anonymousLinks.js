import React from 'react';
import ReactDOM from 'react-dom';

class AnonymousLinks extends React.Component {
  
  constructor(props) {
    super(props);
    this.changeLink = this.changeLink.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    this.saveName = this.saveName.bind(this);
    this.addLink = this.addLink.bind(this);
  }
  
  changeLink(i) {
    const products = JSON.parse(localStorage.nord);
    const links = localStorage.nord ? JSON.parse(localStorage.nord)[0] : [];
    
    //переписывает значение ключа 'nord' в массиве localStorage 
    products[2] = i + 1;
    localStorage.nord = JSON.stringify(products);
    // вызывает метод changeLink(i) в родительском классе AnonymousForm
    this.props.changeLink(i);
    
    for (let j = 0; j < links.length; j++) {
      // удаляет класс 'active' у всех элементов массивоподобного (итерируемого) объекта 
      // всех дочерних элементов, соответствующих имени класса 'lists'
      document.getElementsByClassName('lists')[j].classList.remove('active');
    }
    // добавляет класс 'active' элементу массивоподобного (итерируемого) объекта 
    // всех дочерних элементов, соответствующих имени класса 'lists' с ключом i
    document.getElementsByClassName('lists')[i].classList.add('active');
  }
  
  saveName() {
    const products = localStorage.nord ? JSON.parse(localStorage.nord) : [];
    const links = localStorage.nord ? products[0] : [];
    const activeLink = localStorage.nord ? JSON.parse(localStorage.nord)[2] : 1;
    const id = localStorage.nord ? JSON.parse(localStorage.nord)[1] : 1;
    
    // если значения в localStorage и поля <input name="new_link_name"> различны
    if (products[0][activeLink - 1] != this.props.name) {
      if (localStorage.nord) {
        // если значение в массиве localStorage c ключом nord не undefined
        // то переписывает первый элемент из массива (полученного из строки
        // сохраненной в localStorage по ключу 'nord') c ключем activeLink
        // на значение поля <input name="new_link_name">
        products[0][activeLink - 1] = this.props.name;

      } else {
        // если undefined то создает значение
        links.push(this.props.name);
        products.push(links);
        products.push(id);
        products.push(1);

      }
      // и сохраняет новое значение в массиве localStorage с ключом 'nord'
      localStorage.nord = JSON.stringify(products);
      // вызывает метод saveName в родительском классе AnonymousForm
      this.props.saveName();
    // если значение в localStorage совпадает со значением поля <input name="new_link_name">
    // форма фокусируется на поле <input name="new_link_name">
    } else {
      document.linkName.new_link_name.focus();
    }
  }
  
  addLink() {
    const products = localStorage.nord ? JSON.parse(localStorage.nord) : [];
    const links = localStorage.nord ? products[0] : [];
    const activeLink = localStorage.nord ? JSON.parse(localStorage.nord)[2] : 1;
    const id = localStorage.nord ? JSON.parse(localStorage.nord)[1] : 1;
    
    if (localStorage.nord) {
      
      links.push('новый');
      products[2] = links.length;
      
    } else {
      
      links.push(this.props.name);
      products.push(links);
      products.push(id);
      products.push(1);
    }
    
    localStorage.nord = JSON.stringify(products);
    this.props.addLink();
  }
  
  deleteLink() {
    const isSure = confirm('Вы точно хотите удалить этот список?');
    if (isSure) {
      const products = localStorage.nord ? JSON.parse(localStorage.nord).slice(3) : [];
      const links = localStorage.nord ? JSON.parse(localStorage.nord)[0] : [];
      const activeLink = localStorage.nord ? JSON.parse(localStorage.nord)[2] : 1;

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
      localStorage.nord = JSON.stringify(result);

      this.props.deleteLink();
    }
  }
  
  render() {
    
    const JSNproducts = localStorage.nord ? JSON.parse(localStorage.nord).slice(0,1).join() : [];
    const products = localStorage.nord ? JSNproducts.split(',') : [];
    const links = localStorage.nord ? JSON.parse(localStorage.nord)[0] : [];
    const activeLink = localStorage.nord ? JSON.parse(localStorage.nord)[2] : 1;
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
            <input type="hidden" name="linkID" value={localStorage.nord ? JSON.parse(localStorage.nord)[2] : 1} />
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








export default AnonymousLinks;