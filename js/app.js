'use strict';

let habits = [];
let globalActiveHabitId;

/*----------page----------*/
const page = {
    menu: document.querySelector('.menu-list'),
    header: {
        h1: document.querySelector('.title-haeder'),
        progressPercent: document.querySelector('.progress-percent'),
        progressCoverBar: document.querySelector('.progress-cover-bar')
    },
    content: {
        daysContainer: document.querySelector('.main-wrapper'),
		nextDay: document.querySelector('.habit-day')
    },
	popup: {
		index: document.querySelector('.cover'),
		iconField: document.querySelector('.pop-up-form input[name="icon"]')
	}
}

/*---------utils---------*/

async function loadData() {
    const response = await fetch('/habit-tracker/data/demo.json');
    const habitsArray = await response.json();
    if (Array.isArray(habitsArray)) {
        habits = habitsArray;
    }
}

function saveData() {
    const blob = new Blob([JSON.stringify(habits)], {type : 'application/json'});
    saveAs(blob, 'demo.json');
}

function togglePopup() {
	if (page.popup.index.classList.contains('cover-hidden')) {
		page.popup.index.classList.remove('cover-hidden');
	} else {
		page.popup.index.classList.add('cover-hidden');
	}
}

function resetForm(form, fields) {
	for (const field of fields) {
		form[field].value = '';
	}
}

function validateAndGetFormData(form, fields) {
	const formData = new FormData(form);
	const res = {};
	for (const field of fields) {
		const fieldValue = formData.get(field);
		form[field].classList.remove('error');
		if (!fieldValue) {
			form[field].classList.add('error');
		}
		res[field] = fieldValue;
	}
	let isValid = true;
	for (const field of fields) {
		if (!res[field]) {
			isValid = false;
		}
	}
	if (!isValid) {
		return;
	}
	return res;
}

/*---------render---------*/
function rerenderMenu(activeHabit) {
    for (const habit of habits) {
        const existed = document.querySelector(`[habit-menu-id="${habit.id}"]`)
        if (!existed) {
            const element = document.createElement('button')
            element.setAttribute('habit-menu-id', habit.id)
            element.classList.add('menu-item')
            element.addEventListener('click', () => rerender(habit.id));
            element.innerHTML = `<img src="/habit-tracker/img/${habit.icon}.svg" alt="${habit.name}">`
            if (activeHabit.id === habit.id) {
                element.classList.add('active')
            } 
            page.menu.appendChild(element)
            continue
        }        
        if (activeHabit.id === habit.id) {
            existed.classList.add('active')
        } else {
            existed.classList.remove('active')
        }
    }
}

function rerenderHead(activeHabit) {
    page.header.h1.innerText = activeHabit.name
    const progress = activeHabit.days.length / activeHabit.target > 1
        ? 100
        : activeHabit.days.length / activeHabit.target * 100
        page.header.progressPercent.innerText = progress.toFixed(0) + '%'
        page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`)
}

function rerenderContent(activeHabit) {
	page.content.daysContainer.innerHTML = '';
	for (const index in activeHabit.days) {
		const element = document.createElement('div');
		element.classList.add('habit');
		element.innerHTML = `<div class="habit-day-wrapper">
                                <div class="habit-day">Day ${Number(index) + 1}</div>
                            </div>
                            <div class="habit-coment-wrapper">
                                <div class="habit-coment">${activeHabit.days[index].comment}</div>
                                <button class="habit-delete" onclick="deleteDay(${index})">
                                    <img src="/habit-tracker/img/delete.svg" alt="delete day ${index + 1}">
                                </button>
                            </div>`;
		page.content.daysContainer.appendChild(element);
	}
	page.content.nextDay.innerHTML = `Day ${activeHabit.days.length + 1}`;
}

function rerender(activeHabitId) {
    globalActiveHabitId = activeHabitId;
    const activeHabit = habits.find(habit => habit.id === activeHabitId)
    if (!activeHabit) {
		return;
	}
    document.location.replace(document.location.pathname + '#' + activeHabitId);
    rerenderMenu(activeHabit)
    rerenderHead(activeHabit)
    rerenderContent(activeHabit)
}

/*------work-with-days-----*/
function addDays(event) {
	event.preventDefault();
	const data = validateAndGetFormData(event.target, ['comment']);
	if (!data) {
		return;
	}
	habits = habits.map(habit => {
		if (habit.id === globalActiveHabitId) {
			return {
				...habit,
				days: habit.days.concat([{ comment: data.comment }])
			}
		}
		return habit;
	});
	resetForm(event.target, ['comment']);
	rerender(globalActiveHabitId);
	saveData();
}

function deleteDay(index) {
	habits = habits.map(habit => {
		if (habit.id === globalActiveHabitId) {
			habit.days.splice(index, 1);
			return {
				...habit,
				days: habit.days
			};
		}
		return habit;
	});
	rerender(globalActiveHabitId);
	saveData();
}

/*----------init----------*/
(async () => {
    await loadData();
	const hashId = Number(document.location.hash.replace('#', ''));
	const urlHabit = habits.find(habit => habit.id == hashId);
	if (urlHabit) {
		rerender(urlHabit.id);
	} else {
		rerender(habits[0].id);
	}
})();