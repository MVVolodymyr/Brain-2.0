// login.js

// 🚨 ВАЖЛИВО: Замініть цей об'єкт на ваші реальні налаштування AWS Cognito!
const awsConfig = {
     Auth: {
        // Ваш регіон (наприклад, 'us-east-1')
        region: 'us-east-1', 
        // ID Вашого Cognito User Pool
        userPoolId: 'us-east-1_3JOgT7sK2', 
        // ID Вашого App Client
        userPoolWebClientId: '5dqeit9puudl22qs1ris646p5a'
    }
};

/**
 * Ініціалізує Amplify, налаштовує конфігурацію Cognito та додає обробник форми входу.
 * Ця функція запускається лише після повного завантаження сторінки (включно з Amplify).
 */
function initializeAmplifyAndLogin() {
    // 1. Отримання елемента для повідомлень
    // Вам ПОТРІБНО додати <p id="message"></p> у ваш HTML, щоб це працювало!
    const messageElement = document.getElementById('message'); 
    
    // 2. ПЕРЕВІРКА НАЯВНОСТІ AWS AMPLIFY
    if (typeof Amplify === 'undefined' || typeof Amplify.Auth === 'undefined') {
        const errorMsg = "Критична помилка: AWS Amplify не визначено. Перевірте підключення в HTML.";
        console.error(errorMsg);
        if (messageElement) { 
             messageElement.textContent = errorMsg;
        }
        return; // Зупиняємо виконання
    }

    console.log('✅ AWS Amplify успішно завантажено. Ініціалізація...');
    
    // 3. КОНФІГУРАЦІЯ AMPLIFY (З'єднання з Cognito)
    try {
        Amplify.configure(awsConfig);
        console.log('✅ Amplify налаштовано.');
    } catch (e) {
        console.error('Помилка конфігурації Amplify:', e);
        if (messageElement) {
             messageElement.textContent = 'Помилка конфігурації (перевірте awsConfig).';
        }
        return;
    }

    // 4. ОБРОБНИК ФОРМИ ВХОДУ
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (messageElement) {
            messageElement.textContent = 'Вхід...';
            messageElement.style.color = 'black';
        }
        
        const username = e.target.username.value;
        const password = e.target.password.value;
        
        try {
            // Використання методу signIn з Auth модуля Amplify для автентифікації
            const user = await Amplify.Auth.signIn(username, password);
            
            console.log('Успішний вхід:', user);
            if (messageElement) {
                messageElement.textContent = `Успішний вхід користувача: ${username}`;
                messageElement.style.color = 'green';
            }
            
            // Redirect to events page after successful login
            window.location.href = '/events'; 

        } catch (error) {
            console.error('Помилка входу:', error);
            
            let displayMessage;
            
            // Обробка типових помилок Cognito
            if (error.code === 'UserNotFoundException' || error.code === 'NotAuthorizedException') {
                displayMessage = 'Невірне ім\'я користувача або пароль.';
            } else if (error.code === 'UserNotConfirmedException') {
                 displayMessage = 'Користувач не підтверджений. Перевірте свою пошту.';
            } else {
                displayMessage = `Помилка: ${error.message}`;
            }

            if (messageElement) {
                messageElement.textContent = displayMessage;
                messageElement.style.color = 'red';
            }
        }
    });
}

// 💥 ФІКС ПОМИЛКИ: Запускаємо функцію лише після того, як ВСІ ресурси (включно з Amplify) завантажені
// Використовуємо DOMContentLoaded для швидшого запуску
document.addEventListener('DOMContentLoaded', function() {
    // Додаємо невелику затримку, щоб Amplify встиг завантажитися
    setTimeout(initializeAmplifyAndLogin, 100);
    
    // Fallback: якщо Amplify не завантажився через 2 секунди, показуємо помилку
    setTimeout(function() {
        if (typeof Amplify === 'undefined') {
            const messageElement = document.getElementById('message');
            if (messageElement) {
                messageElement.textContent = 'Помилка завантаження AWS Amplify. Перевірте інтернет-з\'єднання.';
                messageElement.style.color = 'red';
            }
            console.error('AWS Amplify failed to load after 2 seconds');
        }
    }, 2000);
});