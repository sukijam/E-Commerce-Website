/*=============== CONTACT PAGE ===============*/
var contactForm = document.getElementById('contact-form');
var contactThanks = document.getElementById('contact-thanks');
var thanksName = document.getElementById('thanks-name');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // stop the page from refreshing

    // show the name in the thank you message
    thanksName.textContent = document.getElementById('contact-name').value;

    // hide the form and show the thank you box
    contactForm.style.display = 'none';
    contactThanks.style.display = 'block';
});