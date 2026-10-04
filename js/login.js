/*=============== LOGIN PAGE (practice version) ===============*/

var USERS_KEY = 'zipzy-users';
var CURRENT_KEY = 'zipzy-current-user';

var loginArea = document.getElementById('login-area');
var loginWelcome = document.getElementById('login-welcome');
var loginForm = document.getElementById('login-form');
var signupForm = document.getElementById('signup-form');
var tabLogin = document.getElementById('tab-login');
var tabSignup = document.getElementById('tab-signup');
var loginError = document.getElementById('login-error');
var welcomeName = document.getElementById('welcome-name');
var logoutBtn = document.getElementById('logout-btn');

/* get all saved accounts */
function loadUsers() {
    try {
        var data = JSON.parse(localStorage.getItem(USERS_KEY));
        if (Array.isArray(data)) {
            return data;
        }
        return [];
    } catch (error) {
        return [];
    }
}

/* save all accounts */
function saveUsers(users) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        // storage not available
    }
}

/* show an error message (or clear it) */
function showError(message) {
    loginError.textContent = message;
}

/* show the Log In form or the Sign Up form */
function showTab(which) {
    showError('');

    if (which === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        tabLogin.classList.remove('active');
        tabSignup.classList.add('active');
    }
}

/* show the welcome box or the forms */
function showPage() {
    var currentName = localStorage.getItem(CURRENT_KEY);

    if (currentName) {
        welcomeName.textContent = currentName;
        loginArea.style.display = 'none';
        loginWelcome.style.display = 'block';
    } else {
        loginArea.style.display = 'block';
        loginWelcome.style.display = 'none';
        showTab('login');
    }
}

tabLogin.addEventListener('click', function () {
    showTab('login');
});

tabSignup.addEventListener('click', function () {
    showTab('signup');
});

/* SIGN UP */
signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('signup-name').value.trim();
    var email = document.getElementById('signup-email').value.trim().toLowerCase();
    var password = document.getElementById('signup-password').value;
    var confirmPassword = document.getElementById('signup-confirm').value;

    if (password.length < 8) {
        showError('Password must be at least 8 characters.');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return;
    }

    var users = loadUsers();

    // check if the email is already used
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            showError('This email is already registered. Please log in.');
            return;
        }
    }

    users.push({ name: name, email: email, password: password });
    saveUsers(users);

    // log the new user in right away
    localStorage.setItem(CURRENT_KEY, name);
    signupForm.reset();
    showPage();
});

/* LOG IN */
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var email = document.getElementById('login-email').value.trim().toLowerCase();
    var password = document.getElementById('login-password').value;

    var users = loadUsers();
    var foundUser = null;

    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            foundUser = users[i];
        }
    }

    if (foundUser === null) {
        showError('Wrong email or password.');
        return;
    }

    localStorage.setItem(CURRENT_KEY, foundUser.name);
    loginForm.reset();
    showPage();
});

/* LOG OUT */
logoutBtn.addEventListener('click', function () {
    localStorage.removeItem(CURRENT_KEY);
    showPage();
});

/* run when the page loads */
showPage();