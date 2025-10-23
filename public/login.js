// Login page JavaScript - handles authentication
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === 'user' && password === 'pass') {
            alert('Авторизація успішна!');
            // Redirect to events page
            window.location.href = '/events'; 
        } else {
            alert('Невірне ім\'я користувача або пароль.');
        }
    });
}
