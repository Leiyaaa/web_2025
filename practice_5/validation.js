document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();
    
    let isValid = true;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value;
    const birthdate = document.getElementById('birthdate').value;
    const terms = document.getElementById('terms').checked;

    if (!username) {
        showError('username', "Ім'я користувача обов'язкове");
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showError('email', 'Введіть коректний email');
        isValid = false;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        showError('password', 'Пароль повинен містити мінімум 8 символів, цифру та велику літеру');
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError('confirmPassword', 'Паролі не співпадають');
        isValid = false;
    }

    const phoneRegex = /^\+?\d{10,13}$/;
    if (!phone || !phoneRegex.test(phone)) {
        showError('phone', 'Введіть коректний номер телефону');
        isValid = false;
    }

    const today = new Date();
    const birthdateDate = new Date(birthdate);
    const age = today.getFullYear() - birthdateDate.getFullYear();
    if (!birthdate || age < 18) {
        showError('birthdate', 'Вам повинно бути більше 18 років');
        isValid = false;
    }

    if (!terms) {
        showError('terms', 'Ви повинні погодитись з умовами');
        isValid = false;
    }

    if (isValid) {
        console.log('Form is valid, proceed with submission');
    }
});

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
    document.getElementById(fieldId).classList.add('invalid');
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
    document.querySelectorAll('.invalid').forEach(field => field.classList.remove('invalid'));
}
