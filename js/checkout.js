/*=============== CHECKOUT PAGE ===============*/

var checkoutEmpty = document.getElementById('checkout-empty');
var checkoutLayout = document.getElementById('checkout-layout');
var checkoutDone = document.getElementById('checkout-done');
var checkoutItems = document.getElementById('checkout-items');
var checkoutTotal = document.getElementById('checkout-total');
var checkoutForm = document.getElementById('checkout-form');

/* show the order summary */
function showCheckout() {
    var html = '';
    var total = 0;

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var lineTotal = item.price * item.qty;
        total = total + lineTotal;

        html = html +
            '<div class="checkout__item">' +
                '<img src="' + item.img + '" alt="' + item.name + '">' +
                '<div class="checkout__info">' +
                    '<h3>' + item.name + ' (' + item.size + ')</h3>' +
                    '<p>₱' + item.price + ' x ' + item.qty + '</p>' +
                '</div>' +
                '<p class="checkout__line">₱' + lineTotal + '</p>' +
            '</div>';
    }

    checkoutItems.innerHTML = html;
    checkoutTotal.textContent = '₱' + total;

    return total;
}

/* show the empty message or the form */
if (cart.length === 0) {
    checkoutEmpty.style.display = 'block';
    checkoutLayout.style.display = 'none';
} else {
    checkoutEmpty.style.display = 'none';
    checkoutLayout.style.display = 'grid';
    showCheckout();
}

/* when the Place Order button is clicked */
checkoutForm.addEventListener('submit', function (e) {
    e.preventDefault(); // stop the page from refreshing

    var name = document.getElementById('full-name').value;
    var payment = document.querySelector('input[name="payment"]:checked').value;
    var total = showCheckout();

    // show the thank you message
    document.getElementById('done-name').textContent = name;
    document.getElementById('done-payment').textContent = payment;
    document.getElementById('done-total').textContent = '₱' + total;

    checkoutLayout.style.display = 'none';
    checkoutDone.style.display = 'block';

    // empty the cart
    cart = [];
    saveCart();
    showCart(false);

    window.scrollTo(0, 0);
});