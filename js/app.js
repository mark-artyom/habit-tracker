'use strict';

let habits = [];

/*----------page----------*/
const page = {
    menu: document.querySelector('.menu-list')
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

function rerender(activeHabitId) {
    const activeHabit = habits.find(habit => habit.id === activeHabitId)
    if (!activeHabit) {
		return;
	}
    rerenderMenu(activeHabit)
}
/*----------init----------*/
(async () => {
    await loadData();
    rerender(habits[0].id);
})();