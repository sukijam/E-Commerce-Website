/*========== SHOW MENU ==========*/
var navMenu = document.getElementById('nav-menu');
var navToggle = document.getElementById('nav-toggle');
var navClose = document.getElementById('nav-close');

/* open menu */
if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
        navMenu.classList.add('show-menu');
    });
}

/* close menu */
if (navClose && navMenu) {
    navClose.addEventListener('click', function () {
        navMenu.classList.remove('show-menu');
    });
}

/* close menu when a link is clicked (mobile) */
var navLinks = document.querySelectorAll('.nav__link');

for (var a = 0; a < navLinks.length; a++) {
    navLinks[a].addEventListener('click', function () {
        if (navMenu) {
            navMenu.classList.remove('show-menu');
        }
    });
}


/*========== SHOP: SIZE SELECTOR ==========*/
var sizeButtons = document.querySelectorAll('.shop__size');

for (var b = 0; b < sizeButtons.length; b++) {

    // preload the image so there is no blank flash
    var preload = new Image();
    preload.src = sizeButtons[b].dataset.img;

    sizeButtons[b].addEventListener('click', function () {
        var card = this.closest('.shop__card');
        var canImg = card.querySelector('.shop__img');
        var price = card.querySelector('.shop__price');
        var flavor = card.querySelector('.shop__name').textContent;

        // move the "active" class to the clicked button
        card.querySelector('.shop__size.active').classList.remove('active');
        this.classList.add('active');

        // change the can image (fade out, swap, fade in)
        var newSrc = this.dataset.img;
        var newAlt = 'Zipzy ' + flavor + ' can, ' + this.textContent;

        canImg.classList.add('swapping');
        setTimeout(function () {
            canImg.src = newSrc;
            canImg.alt = newAlt;
            canImg.classList.remove('swapping');
        }, 150);

        // change the price and restart the pop animation
        price.textContent = '₱' + this.dataset.price;
        price.classList.remove('pop');
        void price.offsetWidth;
        price.classList.add('pop');
    });
}

/*========== CART ==========*/
var CART_KEY = 'zipzy-cart-v2';

var cartPanel = document.getElementById('cart');
var cartOverlay = document.getElementById('cart-overlay');
var cartItems = document.getElementById('cart-items');
var cartTotal = document.getElementById('cart-total');
var cartCount = document.getElementById('cart-count');
var navCart = document.getElementById('nav-cart');
var cartClose = document.getElementById('cart-close');

/* floating "View cart" bar */
var cartBar = document.getElementById('cart-bar');
var cartBarImg = document.getElementById('cart-bar-img');
var cartBarCount = document.getElementById('cart-bar-count');

/* load the saved cart (or start with an empty one) */
var cart = [];

try {
    var saved = JSON.parse(localStorage.getItem(CART_KEY));
    if (Array.isArray(saved)) {
        cart = saved;
    }
} catch (error) {
    cart = [];
}

/* save the cart */
function saveCart() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
        // storage not available, the cart still works for this visit
    }
}

/* open and close the cart panel */
function openCart() {
    if (cartPanel && cartOverlay) {
        cartPanel.classList.add('show');
        cartOverlay.classList.add('show');
    }
}

function closeCart() {
    if (cartPanel && cartOverlay) {
        cartPanel.classList.remove('show');
        cartOverlay.classList.remove('show');
    }
}

if (navCart) {
    navCart.addEventListener('click', openCart);
}
if (cartClose) {
    cartClose.addEventListener('click', closeCart);
}
if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
}
if (cartBar) {
    cartBar.addEventListener('click', openCart);
}

/* show the cart items, total, the number on the bag icon, and the View cart bar */
function showCart(bump) {
    var html = '';
    var total = 0;
    var count = 0;

    if (cart.length === 0) {
        html = '<p class="cart__empty">Your cart is empty.</p>';
    }

    for (var n = 0; n < cart.length; n++) {
        var item = cart[n];
        total = total + item.price * item.qty;
        count = count + item.qty;

        html = html +
            '<div class="cart__item">' +
                '<img src="' + item.img + '" alt="' + item.name + '">' +
                '<div class="cart__info">' +
                    '<h3>' + item.name + ' (' + item.size + ')</h3>' +
                    '<p>₱' + item.price + '</p>' +
                '</div>' +
                '<div class="cart__qty">' +
                    '<button type="button" data-action="minus" data-index="' + n + '">-</button> ' +
                    item.qty +
                    ' <button type="button" data-action="plus" data-index="' + n + '">+</button>' +
                '</div>' +
                '<button type="button" class="cart__remove" data-action="remove" data-index="' + n + '">' +
                    '<i class="ri-delete-bin-line" data-action="remove" data-index="' + n + '"></i>' +
                '</button>' +
            '</div>';
    }

    if (cartItems) {
        cartItems.innerHTML = html;
    }
    if (cartTotal) {
        cartTotal.textContent = '₱' + total;
    }

    if (cartCount) {
        cartCount.textContent = count;
        cartCount.dataset.count = count;

        // little bump animation when something is added
        if (bump) {
            cartCount.classList.remove('bump');
            void cartCount.offsetWidth;
            cartCount.classList.add('bump');
        }
    }

    if (navCart) {
        if (count === 1) {
            navCart.setAttribute('aria-label', 'Cart, 1 item');
        } else {
            navCart.setAttribute('aria-label', 'Cart, ' + count + ' items');
        }
    }

    // floating "View cart" bar: show it only when the cart has items
    if (cartBar) {
        if (count > 0) {
            cartBar.classList.add('show');
            cartBarImg.src = cart[cart.length - 1].img;

            if (count === 1) {
                cartBarCount.textContent = '1 item';
            } else {
                cartBarCount.textContent = count + ' items';
            }
        } else {
            cartBar.classList.remove('show');
        }
    }
}

/* a copy of the can image flies to the cart icon */
function flyToCart(canImg) {
    if (!navCart) {
        return;
    }

    var start = canImg.getBoundingClientRect();
    var end = navCart.getBoundingClientRect();

    var fly = canImg.cloneNode();
    fly.className = 'fly-img';
    fly.style.left = start.left + 'px';
    fly.style.top = start.top + 'px';
    fly.style.width = start.width + 'px';
    fly.style.height = start.height + 'px';
    document.body.appendChild(fly);

    void fly.offsetWidth; // makes the browser see the starting position first

    fly.style.left = end.left + 'px';
    fly.style.top = end.top + 'px';
    fly.style.width = '20px';
    fly.style.height = '20px';
    fly.style.opacity = '0.3';

    setTimeout(function () {
        fly.remove();
    }, 800);
}

/* add to cart buttons */
var addButtons = document.querySelectorAll('.shop__button');

for (var j = 0; j < addButtons.length; j++) {
    addButtons[j].addEventListener('click', function () {
        var button = this;
        var card = button.closest('.shop__card');
        var activeSize = card.querySelector('.shop__size.active');

        var name = card.querySelector('.shop__name').textContent;
        var size = activeSize.textContent;
        var price = Number(activeSize.dataset.price);
        var img = activeSize.dataset.img;

        // if the same flavor + size is already in the cart, add 1 to quantity
        var found = false;
        for (var k = 0; k < cart.length; k++) {
            if (cart[k].name === name && cart[k].size === size) {
                cart[k].qty = cart[k].qty + 1;
                found = true;
            }
        }

        if (found === false) {
            cart.push({ name: name, size: size, price: price, img: img, qty: 1 });
        }

        saveCart();
        showCart(true);
        flyToCart(card.querySelector('.shop__img'));

        // button feedback
        button.textContent = '\u2713 Added';
        button.classList.add('added');
        setTimeout(function () {
            button.textContent = 'Add To Cart';
            button.classList.remove('added');
        }, 1200);
    });
}

/* plus, minus, remove buttons inside the cart */
if (cartItems) {
    cartItems.addEventListener('click', function (e) {
        var action = e.target.dataset.action;
        var index = Number(e.target.dataset.index);

        if (action === 'plus') {
            cart[index].qty = cart[index].qty + 1;
        }

        if (action === 'minus') {
            cart[index].qty = cart[index].qty - 1;
            if (cart[index].qty === 0) {
                cart.splice(index, 1);
            }
        }

        if (action === 'remove') {
            cart.splice(index, 1);
        }

        saveCart();
        showCart(false);
    });
}

/* show the saved cart when the page loads */
showCart(false);

/* when we come from another page's cart icon (shop.html#cart), open the cart */
if (window.location.hash === '#cart') {
    openCart();
}


/*========== FLAVOR CAROUSEL ==========*/
var flavorTrack = document.getElementById('flavor-track');
var flavorPrev = document.getElementById('flavor-prev');
var flavorNext = document.getElementById('flavor-next');

/* move one can left (-1) or right (1) */
function moveFlavor(direction) {
    var slide = flavorTrack.querySelector('.flavor__slide');
    var maxScroll = flavorTrack.scrollWidth - flavorTrack.clientWidth;
    var target = flavorTrack.scrollLeft + direction * slide.offsetWidth;

    // go back to the start after the last can, and the other way around
    if (target > maxScroll + 5) {
        target = 0;
    }
    if (target < -5) {
        target = maxScroll;
    }

    flavorTrack.scrollTo({ left: target, behavior: 'smooth' });
}

if (flavorTrack && flavorPrev && flavorNext) {
    flavorPrev.addEventListener('click', function () {
        moveFlavor(-1);
    });

    flavorNext.addEventListener('click', function () {
        moveFlavor(1);
    });
}