'use strict';

let habits = [];

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
    const activeHabit = habits.find(habit => habit.id === activeHabitId)
    if (!activeHabit) {
		return;
	}
    rerenderMenu(activeHabit)
    rerenderHead(activeHabit)
    rerenderContent(activeHabit)
}
/*----------init----------*/
(async () => {
    await loadData();
    rerender(habits[0].id);
})();