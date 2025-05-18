const modal = document.getElementById('myModal');
const btn = document.getElementById('openModal');
const span = document.getElementsByClassName('close')[0];

btn.onclick = () => modal.style.display = 'block';
span.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
}

const form = document.getElementById('contactForm');
const fields = ['name', 'email', 'message'];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    fields.forEach(field => {
        const element = document.getElementById(field);
        const errorMessage = element.nextElementSibling;
        element.classList.remove('error');
        errorMessage.style.display = 'none';

        switch(field) {
            case 'name':
                if (element.value.length < 2) {
                    showError(element, 'Ім\'я має бути довшим за 2 символи');
                    isValid = false;
                }
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.value)) {
                    showError(element, 'Введіть коректний email');
                    isValid = false;
                }
                break;
            case 'message':
                if (element.value.length < 10) {
                    showError(element, 'Повідомлення має бути довшим за 10 символів');
                    isValid = false;
                }
                break;
        }
    });

    if (isValid) {
        alert('Форму успішно відправлено!');
        form.reset();
    }
});

function showError(element, message) {
    element.classList.add('error');
    const errorMessage = element.nextElementSibling;
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

const gallery = document.querySelector('.gallery-grid');
gallery.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <img src="${e.target.src}" style="width: 100%;">
            </div>`;
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
});

const scrollBtn = document.getElementById('scrollTop');

window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
};

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
