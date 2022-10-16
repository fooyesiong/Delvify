document.addEventListener('DOMContentLoaded', function () {

    // Use buttons to toggle between views
    document.querySelector('#list').addEventListener('click', () => load_view('lists'));
    document.querySelector('#create_list').addEventListener('click', create_list);

    document.querySelector('#create-list').onsubmit = create_submit_list;
    document.querySelector('#create-task').onsubmit = create_submit_task;
    document.querySelector('#update-task').onsubmit = update_submit_task;

    // By default, load the lists
    load_view('lists');
});

// -----------------------------------------------------------------------------------
function create_list() {
    document.querySelector('#lists-view').style.display = 'none';
    document.querySelector('#create-view').style.display = 'block';
    document.querySelector('#tasks-view').style.display = 'none';
    document.querySelector('#create-task-view').style.display = 'none';
    document.querySelector('#update-view').style.display = 'none';
    
    // Clear out field
    document.querySelector('#create-listname').value = '';
}

function create_task(id) {
    document.querySelector('#lists-view').style.display = 'none';
    document.querySelector('#create-view').style.display = 'none';
    document.querySelector('#tasks-view').style.display = 'none';
    document.querySelector('#create-task-view').style.display = 'block';
    document.querySelector('#update-view').style.display = 'none';
    
    // Clear out fields
    document.querySelector('#create-taskname').value = '';
    document.querySelector('#create-description').value = '';
    document.querySelector('#create-deadline').value = '';

    document.querySelector('#list_id_1').value = id;
}

function update_task(id, list_id) {
    document.querySelector('#lists-view').style.display = 'none';
    document.querySelector('#create-view').style.display = 'none';
    document.querySelector('#tasks-view').style.display = 'none';
    document.querySelector('#create-task-view').style.display = 'none';
    document.querySelector('#update-view').style.display = 'block';
    
    // Clear out fields
    document.querySelector('#update-taskname').value = '';
    document.querySelector('#update-description').value = '';
    document.querySelector('#update-deadline').value = '';

    document.querySelector('#task_id').value = id;
    document.querySelector('#list_id').value = list_id;

}
function create_submit_list() {
    const create_name = document.querySelector('#create-listname').value;

    fetch('/lists', {
        method: 'POST',
        body: JSON.stringify({
            name: create_name,
        })
    })
    .then(response => response.json())
    .then(result => {
            load_view('lists');
        });

    return false;
}

function create_submit_task() {
    const create_name = document.querySelector('#create-taskname').value;
    const create_description = document.querySelector('#create-description').value;
    const create_deadline = document.querySelector('#create-deadline').value;
    const list_id = document.querySelector('#list_id_1').value;

    fetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({
            name: create_name,
            description: create_description,
            deadline: create_deadline,
            list_id: list_id,
        })
    })
    .then(response => response.json())
    .then(result => {
            load_tasks(list_id);
        });

    return false;
}

function update_submit_task() {
    const update_name = document.querySelector('#update-taskname').value;
    const update_description = document.querySelector('#update-description').value;
    const update_deadline = document.querySelector('#update-deadline').value;
    const task_id = document.querySelector('#task_id').value;
    const list_id = document.querySelector('#list_id').value;

    fetch(`/task/${task_id}`,{
        method: 'PUT',
        body: JSON.stringify({
            name: update_name,
            description: update_description,
            deadline: update_deadline,
            id: task_id,
            list_id: list_id,
        })
    })
        .then(task => {
            load_tasks(list_id);
        });
}

function load_view(view) {
        fetch(`/lists/${view}`)
            .then(response => response.json())
            .then(lists => {
                console.log(lists)
                for (let i of Object.keys(lists)) {
                    const elem_list = document.createElement('div');

                    elem_list.innerHTML = `
                        <div>Name: ${lists[i].name}</div>
                        <div>Date: ${lists[i].timestamp}</div>  
                    `;
                    
                    const elem_view = document.createElement('div');

                    elem_view.innerHTML = `
                        <div class="list-buttons">
                            <button class="list-buttons" id="list_view">View</button>
                        </div>
                    `;

                    const elem_deleted = document.createElement('div');

                    elem_deleted.innerHTML = `
                        <div class="list-buttons">
                            <button class="list-buttons" id="list_deleted">Delete</button>
                        </div>
                    `;

                           
                        elem_deleted.addEventListener('click', () => list_deleted(lists[i].id))
                        elem_view.addEventListener('click', () => load_tasks(lists[i].id));
        
                    document.querySelector('#lists-view').append(elem_list);
                    document.querySelector('#lists-view').append(elem_view);
                    document.querySelector('#lists-view').append(elem_deleted);
                };
                
            });
    
    // Show lists view and hide other views
    document.querySelector('#lists-view').style.display = 'block';
    document.querySelector('#create-view').style.display = 'none';
    document.querySelector('#tasks-view').style.display = 'none';
    document.querySelector('#create-task-view').style.display = 'none';
    document.querySelector('#update-view').style.display = 'none';

    // Show the view name
    document.querySelector('#lists-view').innerHTML = `<h3>${view.charAt(0).toUpperCase() + view.slice(1)}</h3>`;

}

function list_deleted(id) {
    fetch(`/lists/${id}`,{
        method: 'PUT',
        body: JSON.stringify({
            deleted: true
        })
    })
        .then(list => {
            load_view('lists');
        });
}

function load_tasks(id) {
    // Show tasks view and hide other views
    document.querySelector('#lists-view').style.display = 'none';
    document.querySelector('#create-view').style.display = 'none';
    document.querySelector('#tasks-view').style.display = 'block';
    document.querySelector('#create-task-view').style.display = 'none';
    document.querySelector('#update-view').style.display = 'none';

    // Show the view name
    document.querySelector('#tasks-view').innerHTML = `<h3>Tasks</h3>`;

    const elem_createtask = document.createElement('div');

    elem_createtask.innerHTML = `
        <button class="btn btn-sm btn-outline-primary" id="create_task">Create Task</button>
    `;

    const elem_delete_selected = document.createElement('div');

    elem_delete_selected.innerHTML = `
        <button class="btn btn-sm btn-outline-primary" id="delete_selected">Delete Selected</button>
    `;


    elem_createtask.addEventListener('click', () => create_task(id));
    elem_delete_selected.addEventListener('click', () => load_tasks(id));

    document.querySelector('#tasks-view').append(elem_createtask);
    document.querySelector('#tasks-view').append(elem_delete_selected);

    fetch(`/tasks/${id}`)
            .then(response => response.json())
            .then(task => {        
                console.log(task)
                
                for (let i of Object.keys(task)) {
                    const elem_task = document.createElement('div');

                    elem_task.innerHTML = `
                        <div>Name: ${task[i].name}</div>
                        <div>Description: ${task[i].description}</div>
                        <div>Deadline: ${task[i].deadline}</div>
                    `;

                    const elem_deleted = document.createElement('div');

                    elem_deleted.innerHTML = `
                        <div class="task-buttons">
                            <button class="task-buttons" id="task_deleted">Delete</button>
                        </div>
                    `;

                    const elem_checkbox = document.createElement('div');

                    elem_checkbox.innerHTML = `
                        <div class="task-buttons">
                            <input type="checkbox" id="select">
                            <label for="select">Select</label>
                        </div>
                    `;

                    const elem_update = document.createElement('div');

                    elem_update.innerHTML = `
                        <div class="task-buttons">
                            <button class="task-buttons" id="task_update">Update Task</button>
                        </div>
                    `;
                    
                    elem_checkbox.addEventListener('click', () => task_select(task[i].id))
                    elem_deleted.addEventListener('click', () => task_deleted(task[i].id, id))
                    elem_update.addEventListener('click', () => update_task(task[i].id, id))

                    document.querySelector('#tasks-view').append(elem_task);
                    document.querySelector('#tasks-view').append(elem_deleted);
                    document.querySelector('#tasks-view').append(elem_checkbox);
                    document.querySelector('#tasks-view').append(elem_update);
                };

            });
}

function task_select(task_id) {
    fetch(`/task_selected/${task_id}`,{
        method: 'PUT',
        body: JSON.stringify({
            selected: true
        })
    })
}

function task_deleted(task_id, list_id) {
    fetch(`/task/${task_id}`,{
        method: 'PUT',
        body: JSON.stringify({
            deleted: true
        })
    })
        .then(task => {
            load_tasks(list_id);
        });
}