import React from 'react';
import ReactDOM from 'react-dom';
import Authentification from '../authentification/authentification.js';

class Products extends React.Component {
  
  constructor(props) {
    super(props);
    this.saveProduct = this.saveProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }
  
  show() {
    if (this.props.productName == '') {
      return '';
    } else {
      return this.props.productQuantity;
    }
  }
  
  changeQuantity(index, id) {
    const formName = 'form' + index;
    const inputIdNumber = 'id' + index;
    const inputQuantityName = 'quantity' + index;
    const products = JSON.parse(localStorage[localStorage.duke]);
    const productsArray = JSON.parse(localStorage[localStorage.duke]).slice(3);
    const coefficientFormName = 'coefficientForm' + index;
    const coefficientInput = 'coefficient' + index;
    const coefficient = document[coefficientFormName][coefficientInput].value ? +document[coefficientFormName][coefficientInput].value : 1;
    
    products[index + 3].quantity = +document[formName][inputQuantityName].value + coefficient;
    document[formName][inputQuantityName].value = products[index + 3].quantity;
    localStorage[localStorage.duke] = JSON.stringify(products);
    this.props.sendAjax('products.php', {
      $id_to_change: id,
      $quantity: +document[formName][inputQuantityName].value,
    });
  }
  
  saveProduct() {
    const products = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke]) : [];
    const links = localStorage[localStorage.duke] ? products[0] : [];
    const activeLink = localStorage[localStorage.duke] ? this.props.link : 1;
    
    if (this.props.productName) {
      if (localStorage[localStorage.duke] && this.props.productName) {

        products.push({
          id: this.props.id,
          linkName: this.props.link,
          name: this.props.productName,
          quantity: this.props.productQuantity,
        });

      } else {

        links.push(this.props.name);
        products.push(links);
        products.push(this.props.id);
        products.push(1);
        products.push({
          id: this.props.id,
          linkName: this.props.link,
          name: this.props.productName,
          quantity: this.props.productQuantity,
        });
      }
    }
      
    products[1] += 1;
    localStorage[localStorage.duke] = JSON.stringify(products);
    
    this.props.sendAjax('products.php', {
      link_id: this.props.id,
	  linkName: this.props.link,
	  productName: this.props.productName,
      productQuantity: this.props.productQuantity,
	});
    
    this.props.saveProduct();
    
  }
  
  deleteProduct(i, id) {
    const localStorProducts = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke]) : [];
    const products = localStorProducts.slice(3);
    products.splice(i,1);
    const result = localStorProducts.slice(0,3);
    for (let j = 0; j < products.length; j++) {
      result.push(products[j]);
    }
    localStorage[localStorage.duke] = JSON.stringify(result);
    
    this.props.deleteProduct();
    
    this.props.sendAjax('products.php', {
	  $id: id,
	});
  }  
  
  render() {
    const products = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke]).slice(3) : [];
    const links = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[0] : [];
    const activeLink = localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[2] : 1;
    const list = products.map((product, index) => {
      if ( product.linkName == this.props.link) {
        return <tr className="tr">
                  <td key={index} onClick={() => this.deleteProduct(index, product.id)}>
                    <span className="deleteProduct">x</span>
                  </td>
                  <td lang="ru" className="productName" key={index}>
                    {product.name}
                  </td>
                  <td>
                    <form key={index} name={'form' + index} action="" method="post" encType="multipart/form-data">
                      <input type="hidden" name={'id' + index} value={product.id}/>
                      <input className="quantity" type="button" name={'quantity' + index} value={product.quantity} onClick={() => this.changeQuantity(index, product.id)} />
                    </form>
                  </td>
                  <td className="coefficient">
                    <form key={index} name={'coefficientForm' + index} action="" method="post" encType="multipart/form-data">
                      <input type="number" name={'coefficient' + index} placeholder="1"/>
                    </form>
                  </td>
               </tr>
      }
                
    });
    
    return (
      <section className="products">
        <form name="production" encType="multipart/form-data" action="" method="post">
          <input type="hidden" name="linkName" value={localStorage[localStorage.duke] ? JSON.parse(localStorage[localStorage.duke])[2] : 1} />
          <input 
            name="productName" className="productInput" type="text" 
            value={this.props.productName} onChange={ () => this.props.handleProductFormChange() } 
            placeholder="Наименование продукта"
          />
          <div className="productValueInput">
            <span>Начальное количество: </span>
            <div className="productQuantity">
              <input name="productQuantity" type="number" value={this.props.productQuantity} onChange={ () => this.props.handleProductFormChange() } />
            </div>
            <div className="saveProduct" onClick={ () => this.saveProduct() }>Сохранить</div>
          </div>
        </form>
        <table className="productsTabl">
          <tr>
            <td className="emptyCell"></td>
            <td lang="ru" className="reactProductName">{this.props.productName}</td>
            <td>{this.show()}</td>
            <td className="emptyCell"></td>
          </tr>
        </table>
        <table className="productsTable">
          {list}
        </table>
      </section>
    );
  }
}








export default Products;