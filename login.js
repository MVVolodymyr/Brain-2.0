

// Обгортаємо весь код в window.onload, щоб гарантовано дочекатися CDN
window.onload = function() {
    
    // Перевіряємо, чи існує об'єкт Amplify, перш ніж його використовувати
    if (typeof Amplify !== 'undefined') {
        
        // Імпортуємо Auth з Amplify
        const { Auth } = Amplify;
        
        // 1. КОНФІГУРАЦІЯ AWS AMPLIFY
        // !!! ВАЖЛИВО: ЗАМІНІТЬ ПАРАМЕТРИ !!!
        Amplify.configure({
            Auth: {
                region: 'us-east-1', 
                userPoolId: 'us-east-1_3JOgT7sK2', 
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
                    const user = await Auth.signIn(username, password);
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
        // Залиште це повідомлення для діагностики, але воно не повинно з'явитися
        console.error("Критична помилка: AWS Amplify не визначено навіть після window.onload.");
        alert("Помилка завантаження бібліотеки авторизації. Спробуйте оновити сторінку.");
    }
};
