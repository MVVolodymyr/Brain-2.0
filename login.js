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
 */
function initializeAmplifyAndLogin() {
    const messageElement = document.getElementById('message'); 
    
    // 1. ПЕРЕВІРКА НАЯВНОСТІ AWS AMPLIFY
    if (typeof Amplify === 'undefined' || typeof Amplify.Auth === 'undefined') {
        const errorMsg = "Критична помилка: AWS Amplify не визначено. Перевірте підключення в HTML.";
        console.error(errorMsg);
        if (messageElement) { 
             messageElement.textContent = errorMsg;
        }
        return; 
    }

    console.log('✅ AWS Amplify успішно завантажено. Ініціалізація...');
    
    // 2. КОНФІГУРАЦІЯ AMPLIFY
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

    // 3. ОБРОБНИК ФОРМИ ВХОДУ
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
            const user = await Amplify.Auth.signIn(username, password);
            
            console.log('Успішний вхід:', user);
            if (messageElement) {
                messageElement.textContent = `Успішний вхід користувача: ${username}`;
                messageElement.style.color = 'green';
            }
            
            // window.location.href = '/dashboard.html'; 

        } catch (error) {
            console.error('Помилка входу:', error);
            
            let displayMessage;
            
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

// 💥 ФІКС ПОМИЛКИ ГОНКИ: Запускаємо функцію лише після того, як ВСІ ресурси завантажені
window.onload = initializeAmplifyAndLogin;