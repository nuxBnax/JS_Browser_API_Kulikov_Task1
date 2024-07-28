const url1 = "./data.json";

async function fetchData(url) {
    try {
        const responce = await fetch(url);
        const data = await responce.json();
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

async function fillingLocalStorageWithData(url) {
    const data = await fetchData(url);
    data.forEach(subject => {
        localStorage.setItem(subject.id, JSON.stringify(subject));
    });
}

fillingLocalStorageWithData(url1);

const showContent = () => {
    document.addEventListener("DOMContentLoaded", () => {

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = JSON.parse(localStorage.getItem(key));

            titleEl.insertAdjacentHTML("beforeend", `
   
            <li class="subject border border-success p-2 mb-2" style="list-style-type: none;">
                <h2 class="subject-name d-flex justify-content-center text-primary-emphasis">Предмет - ${value.subject}</h2>
                <h3 class="study-time d-flex justify-content-center">Начало занятий: ${value.subjectTime}</h3>
                <p class="students-max d-flex justify-content-center">Максимальное кол-во участников: ${value.studentsMax}</p>
                <p class="d-flex justify-content-center">Текущее количество участников: <span class="free-places text-success">${value.freePlaces}</span> <span id="checked" style="display: none;"> - Вы записаны</span></p>
                <div class="d-flex justify-content-center">
                <button id="${value.id}" class="signup-btn btn btn-success">${(value.freePlaces >= value.studentsMax) ? 'Нет мест' : 'Записаться'}</button>
                <button class="cancel-signUp btn btn-outline-warning" style="display: none;">Отменить запись</button></div>
                
            </li>
        `)
        }
    })
}

showContent();
const titleEl = document.querySelector('.subject-list');

titleEl.addEventListener('click', (e) => {
    const target = e.target;
    const parentEl = target.closest('li');
    const placesEl = parentEl.querySelector('.free-places');
    if (target.textContent == 'Записаться') {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = JSON.parse(localStorage.getItem(key));
            if (key === target.id) {
                if (value.freePlaces < value.studentsMax) {
                    value.freePlaces++;

                    localStorage.setItem(key, JSON.stringify(value));

                    target.setAttribute('disabled', '');
                    target.classList.add('btn');
                    placesEl.textContent = value.freePlaces;


                    const singUpSpan = parentEl.querySelector('#checked');
                    singUpSpan.style.display = 'block';
                    singUpSpan.style.color = 'green';
                    singUpSpan.style.fontWeight = '700';

                    const cancelSingUpBtn = parentEl.querySelector('.cancel-signUp');
                    cancelSingUpBtn.style.display = 'block';
                    cancelSingUpBtn.classList.add('btn-danger')
                } else if (value.freePlaces >= value.studentsMax) {
                    target.setAttribute('disabled', '');

                }

            }
        }
    }
    if (target.textContent == 'Отменить запись') {
        const singUpBtn = parentEl.querySelector('.signup-btn');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = JSON.parse(localStorage.getItem(key));

            if (key === singUpBtn.id) {
                value.freePlaces--;
                placesEl.textContent = value.freePlaces;
                localStorage.setItem(key, JSON.stringify(value));
                singUpBtn.disabled = false;

                const singUpSpan = parentEl.querySelector('#checked');
                singUpSpan.style.display = 'none';

                const cancelSingUpBtn = parentEl.querySelector('.cancel-signUp');
                cancelSingUpBtn.style.display = 'none';

            }
        }
    }

})



