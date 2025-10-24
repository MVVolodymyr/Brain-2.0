

// *** КОНФІГУРАЦІЯ: Замініть на ваші дані Cognito ***
Amplify.configure({
    Auth: {
        region: 'us-east-1', // Ваш регіон
        userPoolId: 'ВАШ_USER_POOL_ID', 
        userPoolWebClientId: 'ВАШ_APP_CLIENT_ID'
    }
});

const loginForm = document.getElementById('login-form'); // Якщо у вас є форма

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const user = await Auth.signIn(username, password);
        const token = user.signInUserSession.idToken.jwtToken;

        // ЗБЕРЕЖЕННЯ ТОКЕНУ та ПЕРЕНАПРАВЛЕННЯ
        localStorage.setItem('idToken', token);
        window.location.href = '/events.html'; // Перенаправити на сторінку подій
    } catch (error) {
        alert(`Помилка логіну: ${error.message}`);
        console.error('Помилка логіну:', error);
    }
});