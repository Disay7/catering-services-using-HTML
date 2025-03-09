// Selecting DOM elements
const listProductHTML = document.querySelector('.listProduct');
const listCartHTML = document.querySelector('.listCart');
const iconCart = document.querySelector('.icon-cart');
const iconCartSpan = document.querySelector('.icon-cart span');
const body = document.querySelector('body');
const closeCart = document.querySelector('.close');
const previewMenu = document.querySelector('.menu-preview');
const previewBoxes = previewMenu.querySelectorAll('.preview');

// Arrays to store product and cart data
let products = [];
let cart = [];

// Toggle cart visibility when icon is clicked
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Close cart when close button is clicked
closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});

// Function to add product data to HTML
const addDataToHTML = () => {
    listProductHTML.innerHTML = ''; // Clear existing HTML
    products.forEach(product => {
        const newProduct = document.createElement('div');
        newProduct.dataset.id = product.id;
        newProduct.classList.add('item');
        newProduct.innerHTML = `
            <img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button class="addCart">Add To Cart</button>`;
        listProductHTML.appendChild(newProduct);
    });
};

// Function to handle add to cart button click
listProductHTML.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('addCart')) {
        const productId = clickedElement.parentElement.dataset.id;
        addToCart(productId);
    }
});

// Function to add product to cart
const addToCart = (productId) => {
    const cartItemIndex = cart.findIndex(item => item.product_id === productId);
    if (cartItemIndex === -1) {
        cart.push({ product_id: productId, quantity: 1 });
    } else {
        cart[cartItemIndex].quantity++;
    }
    addCartToMemory();
    addCartToHTML();
};

// Function to update cart in localStorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Function to update cart HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    cart.forEach(item => {
        totalQuantity += item.quantity;
        const product = products.find(prod => prod.id === item.product_id);
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.dataset.id = item.product_id;
        newItem.innerHTML = `
            <div class="image">
                <img src="${product.image}">
            </div>
            <div class="name">${product.name}</div>
            <div class="totalPrice">$${product.price * item.quantity}</div>
            <div class="quantity">
                <span class="minus"><</span>
                <span>${item.quantity}</span>
                <span class="plus">></span>
            </div>`;
        listCartHTML.appendChild(newItem);
    });
    iconCartSpan.innerText = totalQuantity;
};

// Function to handle cart item quantity change
listCartHTML.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('minus') || clickedElement.classList.contains('plus')) {
        const productId = clickedElement.parentElement.parentElement.dataset.id;
        const type = clickedElement.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(productId, type);
    }
});

// Function to change cart item quantity
const changeQuantityCart = (productId, type) => {
    const cartItemIndex = cart.findIndex(item => item.product_id === productId);
    if (cartItemIndex !== -1) {
        if (type === 'plus') {
            cart[cartItemIndex].quantity++;
        } else {
            if (cart[cartItemIndex].quantity > 1) {
                cart[cartItemIndex].quantity--;
            } else {
                cart.splice(cartItemIndex, 1);
            }
        }
        addCartToMemory();
        addCartToHTML();
    }
};

// Initialize the application
const initApp = () => {
    // Fetch product data
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();
            // Retrieve cart data from localStorage
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};

initApp(); // Call the initialization function

// Event listeners for menu preview
document.querySelectorAll('.menu-container .menu').forEach(product => {
    product.onclick = () => {
        previewMenu.style.display = 'flex';
        const name = product.getAttribute('data-name');
        previewBoxes.forEach(preview => {
            const target = preview.getAttribute('data-target');
            if (name === target) {
                preview.classList.add('active');
            }
        });
    };
});

previewBoxes.forEach(close => {
    close.querySelector('.fa-xmark').onclick = () => {
        close.classList.remove('active');
        previewMenu.style.display = 'none';
    };
});
