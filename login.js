// =================================================================
// login.js - ВИПРАВЛЕНО: Запобігання Uncaught ReferenceError
// =================================================================

// Перевіряємо, чи існує об'єкт Amplify, перш ніж його використовувати
if (typeof Amplify !== 'undefined') {
    
    // 1. КОНФІГУРАЦІЯ AWS AMPLIFY
    // !!! ВАЖЛИВО: ЗАМІНІТЬ ПАРАМЕТРИ !!!
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


    // 2. ОТРИМАННЯ ЕЛЕМЕНТІВ (Запускаємо після конфігурації)
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

                // ЗБЕРЕЖЕННЯ ТОКЕНУ та ПЕРЕНАПРАВЛЕННЯ
                localStorage.setItem('idToken', token);
                window.location.href = 'events.html'; 
                
            } catch (error) {
                let errorMessage = error.message || "Помилка входу. Спробуйте ще раз.";
                alert(`Помилка логіну: ${errorMessage}`);
                console.error('Помилка логіну:', error);
            }
        });
    }
} else {
    // Цей код виконається, якщо CDN Amplify не завантажився
    console.error("AWS Amplify не визначено. Перевірте CDN-посилання в index.html.");
}