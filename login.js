// =================================================================
// login.js - ЛОГІКА АВТЕНТИФІКАЦІЇ AWS COGNITO
// Примітка: Цей файл розрахований на підключення AWS Amplify через CDN 
//           в index.html (використовує глобальні змінні Amplify та Auth).
// =================================================================

// 1. КОНФІГУРАЦІЯ AWS AMPLIFY
// !!! ВАЖЛИВО: ЗАМІНІТЬ ЦІ ПАРАМЕТРИ НА ВАШІ РЕАЛЬНІ ДАНІ COGNITO !!!
Amplify.configure({
    Auth: {
        // Ваш регіон (наприклад, 'us-east-1')
        region: 'us-east-1', 
        // ID Вашого Cognito User Pool
        userPoolId: 'us-east-1_3JOgT7sK2', 
        // ID Вашого App Client
        userPoolWebClientId: '5dqeit9puudl22qs1ris646p5a'
    }
});


// 2. ОТРИМАННЯ ЕЛЕМЕНТІВ
// Використовуємо 'loginForm', щоб відповідати id у index.html
const loginForm = document.getElementById('loginForm'); 
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');


// 3. ОБРОБНИК SUBMIT
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert("Будь ласка, введіть ім'я користувача та пароль.");
            return;
        }

        try {
            // Автентифікація через Cognito
            const user = await Auth.signIn(username, password);
            
            // Отримання ID токена (JWT)
            const token = user.signInUserSession.idToken.jwtToken;

            // ЗБЕРЕЖЕННЯ ТОКЕНУ для захисту API Gateway
            localStorage.setItem('idToken', token);
            
            // Успішний вхід: перенаправлення на сторінку подій
            window.location.href = 'events.html'; 
            
        } catch (error) {
            // Обробка помилок Cognito (Incorrect username or password, User not confirmed, etc.)
            let errorMessage = error.message || "Помилка входу. Спробуйте ще раз.";
            alert(`Помилка логіну: ${errorMessage}`);
            console.error('Помилка логіну:', error);
        }
    });
}