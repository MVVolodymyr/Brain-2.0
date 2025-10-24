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

const POLLING_INTERVAL = 100; // Перевіряти кожні 100 мілісекунд
const MAX_WAIT_TIME = 5000;   // Максимально чекати 5 секунд

function getMessageElement() {
    return document.getElementById('message');
}

/**
 * Основна логіка застосунку, яка виконується після успішного завантаження Amplify.
 */
function runAmplifyApp() {
    const messageElement = getMessageElement();

    console.log('✅ AWS Amplify успішно знайдено. Ініціалізація...');
    
    // 1. КОНФІГУРАЦІЯ AMPLIFY
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

    // 2. ОБРОБНИК ФОРМИ ВХОДУ
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


/**
 * 💥 FIX: Використовує опитування, щоб чекати на визначення об'єкта Amplify.
 */
function pollForAmplify(startTime) {
    const messageElement = getMessageElement();
    
    if (typeof Amplify !== 'undefined' && typeof Amplify.Auth !== 'undefined') {
        // Успіх! Amplify доступний.
        runAmplifyApp();
        return;
    }

    const elapsed = Date.now() - startTime;
    if (elapsed > MAX_WAIT_TIME) {
        // Таймаут! Бібліотека не завантажилась.
        const errorMsg = `Критична помилка: AWS Amplify не визначено після ${MAX_WAIT_TIME / 1000} секунд. Перевірте підключення в HTML та мережу.`;
        console.error(errorMsg);
        if (messageElement) {
             messageElement.textContent = errorMsg;
             messageElement.style.color = 'red';
        }
        return;
    }

    // Повторити опитування
    setTimeout(() => pollForAmplify(startTime), POLLING_INTERVAL);
}

// Запускаємо опитування лише після того, як DOM повністю завантажений.
document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо, чи існує елемент повідомлення
    const messageElement = getMessageElement();
    if (messageElement) {
        messageElement.textContent = 'Очікування завантаження AWS Amplify...';
        messageElement.style.color = 'gray';
    }
    
    pollForAmplify(Date.now());
});