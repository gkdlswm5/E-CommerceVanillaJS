//variables

const cartBtn = document.querySelector(".cart-btn");
const cartBtncloseCartBtn = document.querySelector(".close-cart");
const clearBtncloseCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//main cart
let cart = [];
//buttons
let buttonsDOM = [];

//getting the product
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      //   console.log("getProduct working");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//display products
class UI {
  //retreiving data and display via DOM manipulation
  displayProducts(products) {
    console.log(products);
    let result = "";
    products.forEach((product) => {
      result += `
        <article class="product">
            <div class="img-container">
                <img src=${product.image}
                alt="product"
                class="product-img"
                />
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart">
                        add to bag
                    </i>
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
        </article>
        `;
    });
    // console.log(result);
    productsDOM.innerHTML = result;
  }

  getBagButton() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    // const buttons = document.querySelector(".bag-btn");
    // console.log(buttons);
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      // console.log(button);
      // console.log(button.dataset.id);
      let id = button.dataset.id;
      let inCart = cart.find((item) => {
        item.id === id;
      });
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        // console.log(event);
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        // logs item
        // console.log(id);
        // console.log(cartItem);

        // add product to the cart
        cart = [...cart, cartItem];

        // save cart in local storage
        Storage.saveCart(cart);

        // set cart values
        this.setCartValues(cart);

        // display cart item
        this.addCartItem(cartItem);

        // show the cart
        this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    console.log(cartTotal, itemsTotal);
  }

  addCartItem(item) {
    console.log(item);
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img src=${item.image} alt="product" />
    <div>
        <h4>${item.title}</h4>
        <h5>${item.price}</h5>
        <span class="remove- item" data-id=${item.id}>remove</span>
    </div>
    <div>
        <i class="fas fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>
    `;
    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
}

//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    // logs products in an array
    // console.log(products);
    for (let i = 0; i < products.length; i++) {
      //finding products -
      if (products[i].id === id) {
        let foundResult = products[i];
        // console.log(foundResult);
        return foundResult;
      }
    }
    // let result = products.find((product) => {
    //   product.id === id;
    // });
    // console.log(result);
    // return products.find((product) => {
    //   console.log(product);
    //   product.id === id;
    // });
    // return result;
    return foundResult;
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //get all products
  products
    .getProducts()
    .then((products) => {
      // console.log(products);
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButton();
    });
});
