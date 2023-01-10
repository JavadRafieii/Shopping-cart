"use strict";
const btnsFilter = document.querySelectorAll('.btn-filter');
const produtsBox = document.querySelectorAll('.produts-box');
const btnShowAll = document.querySelectorAll('.show-all');
const search = document.querySelector('#gsearch');
const listBasket = document.getElementsByClassName('parent-list-basket')[0];
const clear = document.querySelector('.clear');
const total = document.querySelector('.number-total');
const btnCustomer = document.querySelector('.btn-customer');
const discountCode = document.querySelector('#search-discount-code');

search.addEventListener('keyup' , function () {
    produtsBox.forEach(function (item) {
        const produtsCode = item.getAttribute("data-code");
        item.classList.add("animation-products-box");
        if (produtsCode.indexOf(search.value) != -1) {
            item.classList.remove("animation-products-box");
        }else if (search.value === item.getAttribute("data-code")) {
            item.classList.remove("animation-products-box");
        }
    });
});

btnsFilter.forEach(elem => elem.addEventListener('click', function () {
    btnsFilter.forEach(function (elem) {
        elem.classList.remove("animation-btn-filter")
    });
    elem.classList.add("animation-btn-filter")
    let contentBtnFilter = elem.textContent;
    produtsBox.forEach(function (elem) {
        elem.classList.add("animation-products-box");

        if (contentBtnFilter === 'Show all') {
            elem.classList.remove("animation-products-box");
        }else if (contentBtnFilter === elem.classList[1]) {
            elem.classList.remove("animation-products-box");
        }
    });
}));

produtsBox.forEach(proBox => proBox.addEventListener('click' , function (produts) {
    if (proBox.getAttribute("data-add") === 'no') {
        proBox.setAttribute("data-add", "yes");
        const imgProduct = proBox.lastElementChild.parentElement.firstElementChild.firstElementChild.firstElementChild.getAttribute('src');
        const titleProduct = proBox.lastElementChild.children[0].textContent;
        const codeProduct = proBox.lastElementChild.children[1].textContent;
        const priceProduct = proBox.lastElementChild.children[2].textContent;
        const newProduct = document.createElement('li');
        newProduct.innerHTML = `<div class="box-list-basket">
                                    <div class="img-box-list-basket">
                                        <img src="${imgProduct}">
                                    </div>
                                    <div class="content-box-list-basket">
                                        <h3 class="title-product">${titleProduct}</h3>
                                        <span class="product-code">${codeProduct}</span>
                                        <span class="product-price">${priceProduct}</span>
                                    </div>
                                    <div class="number-box-list-basket">
                                        <span class="counter-pro" onclick="plus(this)" data-number= "1"><i class="bi bi-plus-square"></i></span>
                                        <span class="number-pro">1</span>
                                        <span class="counter-pro" onclick="low(this)"><i class="bi bi-dash-square"></i></span>
                                    </div>
                                </div>`;
        listBasket.appendChild(newProduct);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })
          
          Toast.fire({
            icon: 'success',
            title: 'The product has been added to the shopping cart.'
          })
          updatePrice();
    } else {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })
          
          Toast.fire({
            icon: 'warning',
            title: 'This product is in your shopping cart.'
          })
    }
}));

clear.addEventListener('click' , function () {
    if (listBasket.innerHTML != '') {
        Swal.fire({
            // title: 'Are you sure?',
            text: "Do you want to clear your shopping cart?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4c78ea',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
            produtsBox.forEach(function (item) {
                item.setAttribute("data-add", "no");
            });
            listBasket.innerHTML = '';
            total.textContent = `0$`;
              Swal.fire(
                'Deleted!',
                'Your shopping cart is empty.',
                'success'
              )
            }
          })
    }  
});

let priceProduct;
function plus (elem) {
    let numberProduct = Number(elem.nextElementSibling.textContent) + 1;
    
    let sumProduct;
    elem.nextElementSibling.textContent = Number(elem.nextElementSibling.textContent) + 1;
    if ( elem.getAttribute('data-number') === '1') {
        priceProduct = Number(elem.parentElement.previousElementSibling.lastElementChild.textContent.slice(15, elem.parentElement.previousElementSibling.lastElementChild.textContent.length - 1));
        sumProduct = priceProduct * numberProduct;
        elem.setAttribute('data-number', '2');
    } else {
        sumProduct = priceProduct * numberProduct; 
    }
    elem.parentElement.previousElementSibling.lastElementChild.textContent = `Product price: ${sumProduct}$`;
    updatePrice ();
};

function low (elem) {
    let numberProduct = elem.parentElement.previousElementSibling.children[2].textContent.slice(15, elem.parentElement.previousElementSibling.children[2].textContent.length - 1);

    console.log()

    if (Number(elem.previousElementSibling.textContent) == 1) {
        const codeRemove = elem.parentElement.previousElementSibling.children[1].textContent.slice(14);
        produtsBox.forEach(function (item) {
            if (item.getAttribute("data-code") == codeRemove) {
                item.setAttribute("data-add", "no");
            }
        });
        elem.parentElement.parentElement.parentElement.remove();
        
    } else {
        let negativeProduct = -(priceProduct - numberProduct);
        elem.previousElementSibling.textContent = Number(elem.previousElementSibling.textContent) - 1;
        elem.parentElement.previousElementSibling.children[2].textContent = `Product price: ${negativeProduct}$`;
    }
    updatePrice ();
};


function updatePrice () {
    const sumPrice = document.querySelectorAll('.content-box-list-basket>.product-price');
    let sum = [];
    sumPrice.forEach(function (price) {
        sum.push(Number(price.textContent.slice(15, price.textContent.length-1)));
    });
    const theTotAlamount = sum.reduce(function(a, b) {
        return a + b;
    }, 0);
    total.textContent = `${theTotAlamount}$`;
}

const discountCodeArry = ['k01mh','w80pc','32lmn','bxx00'];
btnCustomer.addEventListener('click' , function() {
    if(discountCodeArry.includes(discountCode.value) && Number(total.textContent.slice(0, total.textContent.length-1)) >= 20) {
        discountCode.setAttribute('disabled', '');
        discountCode.style.backgroundColor = "#2ECC71";
        discountCode.style.opacity = ".5";
        total.textContent = `${Number(total.textContent.slice(0, total.textContent.length-1)) - 20}$`;
    } else {
        discountCode.style.backgroundColor = "#f8f8f8";
    }
});
