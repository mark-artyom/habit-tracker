'use strict';

let habits = [];
const HABIT_KEY = 'HABIT_KEY'

/*----------page----------*/
const page = {
    menu: document.querySelector('.menu-list')
}

/*---------utils---------*/

function loadData() {
    const habitsString = localStorage.getItem(HABIT_KEY);
    const habitsArray = JSON.parse(habitsString);
    if (Array.isArray(habitsArray)) {
        habits = habitsArray
    }
}
function saveData() {
    localStorage.setItem(HABIT_KEY, JSON.stringify(habits))
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
(() => {
    loadData()
    rerender(habits[0].id)
})()