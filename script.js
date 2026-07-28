document.getElementById('nav_selector').addEventListener('change', function () {
    document.getElementById('filter-dot').className = `dot dot--${this.value}`;
});

const tasks = [
    { id: 1, title: 'Layihə strukturunu qur',  priority: 'high',   column: 'todo'       },
    { id: 2, title: 'HTML skeletini yaz',       priority: 'high',   column: 'todo'       },
    { id: 3, title: 'CSS stilləri əlavə et',    priority: 'medium', column: 'inprogress' },
    { id: 4, title: 'JS ilə render et',         priority: 'high',   column: 'inprogress' },
    { id: 5, title: 'README yaz',               priority: 'low',    column: 'done'       },
];

function createCard(task) {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = task.id;

    const title = document.createElement('p');
    title.className = 'card__title';
    title.textContent = task.title; // XSS qorunması — innerHTML yox!

    const badge = document.createElement('span');
    badge.className = `card__priority card__priority--${task.priority}`;
    badge.textContent = task.priority === 'high' ? 'Çətin' :
                        task.priority === 'medium' ? 'Orta' : 'Aşağı';

    card.appendChild(title);
    card.appendChild(badge);

    return card;
}  

function renderBoard() {
    const columns = ['todo', 'inprogress', 'done'];

    // Əvvəlcə hər sütunu təmizlə
    columns.forEach(col => {
        document.getElementById(`cards-${col}`).innerHTML = '';
    });

    tasks.forEach(task => {
        const container = document.getElementById(`cards-${task.column}`);
        if (!container) return;
        container.appendChild(createCard(task));
    });

        columns.forEach(col => {
        const count = tasks.filter(t => t.column === col).length;
        document.getElementById(`count-${col}`).textContent = count;
    });


}

document.addEventListener('DOMContentLoaded', renderBoard);