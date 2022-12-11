import React from 'react';
import { createRoot } from 'react-dom/client';
import './anonymousProducts.css';

class AnonymousProducts extends React.Component {
  
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
  
  changeQuantity(index) {
    const formName = 'form' + index;
    const inputIdNumber = 'id' + index;
    const inputQuantityName = 'quantity' + index;
    const coefficientFormName = 'coefficientForm' + index;
    const coefficientInput = 'coefficient' + index;
    const products = JSON.parse(localStorage.nord);
    const productsArray = JSON.parse(localStorage.nord).slice(3);
    const coefficient = document[coefficientFormName][coefficientInput].value ? +document[coefficientFormName][coefficientInput].value : 1;
    
    products[index + 3].quantity = +document[formName][inputQuantityName].value + coefficient;
    document[formName][inputQuantityName].value = products[index + 3].quantity;
    localStorage.nord = JSON.stringify(products);
  }
  
  saveProduct() {
    const products = localStorage.nord ? JSON.parse(localStorage.nord) : [];
    const links = localStorage.nord ? products[0] : [];
    const activeLink = localStorage.nord ? this.props.link : 1;
    
    if (this.props.productName) {
      if (localStorage.nord && this.props.productName) {

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
    localStorage.nord = JSON.stringify(products);
    
    this.props.saveProduct();
    
  }
  
  deleteProduct(i) {
    const localStorProducts = localStorage.nord ? JSON.parse(localStorage.nord) : [];
    const products = localStorProducts.slice(3);
    products.splice(i,1);
    const result = localStorProducts.slice(0,3);
    for (let j = 0; j < products.length; j++) {
      result.push(products[j]);
    }
    localStorage.nord = JSON.stringify(result);
    this.props.deleteProduct();
  }
  
  render() {
    const products = localStorage.nord ? JSON.parse(localStorage.nord).slice(3) : [];
    const links = localStorage.nord ? JSON.parse(localStorage.nord)[0] : [];
    const activeLink = localStorage.nord ? JSON.parse(localStorage.nord)[2] : 1;
    const list = products.map((product, index) => {
      if ( product.linkName == this.props.link) {
        return <tr key={index} className="tr" >
                  <td onClick={() => this.deleteProduct(index)}><span className="deleteProduct">x</span></td>
                  <td lang="ru" className="productName" key={index}>
                    {product.name}
                  </td>
                  <td>
                    <form name={'form' + index} action="" method="post" encType="multipart/form-data">
                      <input type="hidden" name={'id' + index} value={product.id}/>
                      <input className="quantity" type="button" name={'quantity' + index} value={product.quantity} onClick={() => this.changeQuantity(index)} />
                    </form>
                  </td>
                  <td className="coefficient">
                    <form name={'coefficientForm' + index} action="" method="post" encType="multipart/form-data">
                      <input type="number" name={'coefficient' + index} placeholder="1"/>
                    </form>
                  </td>
               </tr>
      }
                
    });
    
    return (
      <section className="products">
        <form name="production" encType="multipart/form-data" action="" method="post">
          <input type="hidden" name="linkName" value={localStorage.nord ? JSON.parse(localStorage.nord)[2] : 1} />
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
          <tbody>
            <tr>
              <td className="emptyCell"></td>
              <td lang="ru" className="reactProductName">{this.props.productName}</td>
              <td>{this.show()}</td>
              <td className="emptyCell"></td>
            </tr>
          </tbody>
        </table>
        <table className="productsTable">
          <tbody>
            {list}
          </tbody>
        </table>
      </section>
    );
  }
}








export default AnonymousProducts;