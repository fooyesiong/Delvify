document.addEventListener('DOMContentLoaded', function () {

    // Use buttons to toggle between views
    document.querySelector('#list').addEventListener('click', () => load_view('lists'));
    document.querySelector('#deleted').addEventListener('click', () => load_view('deleted'));
    document.querySelector('#create_list').addEventListener('click', create_list);

    document.querySelector('#create-list').onsubmit = create_submit_list;
    document.querySelector('#create-task').onsubmit = create_submit_task;


    // By default, load the lists
    load_view('lists');
});

// -----------------------------------------------------------------------------------
function create_list() {
    document.querySelector('#lists-view').style.display = 'none';
    document.querySelector('#create-view').style.display = 'block';
    document.querySelector('#tasks-view').style.display = 'none';
    document.querySelector('#create-task-view').style.display = 'none';
    document.querySelector('#task-view').style.display = 'none';
    
    // Clear out field
    document.querySelector('#create-listname').value = '';
}

function create_task() {
    document.querySelector('#lists-view').style.display = 'none';
    document.querySelector('#create-view').style.display = 'none';
    document.querySelector('#tasks-view').style.display = 'none';
    document.querySelector('#create-task-view').style.display = 'block';
    document.querySelector('#task-view').style.display = 'none';
    
    // Clear out fields
    document.querySelector('#create-taskname').value = '';
    document.querySelector('#create-description').value = '';
    document.querySelector('#create-deadline').value = '';
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

    fetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({
            name: create_name,
            description: create_description,
            deadline: create_deadline,
        })
    })
    .then(response => response.json())
    .then(result => {
            load_tasks('tasks');
        });

    return false;
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
                        elem_view.addEventListener('click', () => load_tasks('tasks', lists[i].id));
        
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
    document.querySelector('#task-view').style.display = 'none';

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
    // .then(response => response.json())
        .then(list => {
            // console.log(email);
            load_view('deleted');
        });
}

function load_tasks(view1) {
    fetch(`/tasks/${view1}`)
            .then(response => response.json())
            .then(tasks => {        
                console.log(tasks)
                const elem_createtask = document.createElement('div');

                    elem_createtask.innerHTML = `
                        <button class="btn btn-sm btn-outline-primary" id="create_task">Create Task</button>
                    `;

                    elem_createtask.addEventListener('click', () => create_task());

                    document.querySelector('#tasks-view').append(elem_createtask);
                for (let i of Object.keys(tasks)) {
                    const elem_task = document.createElement('div');

                    elem_task.innerHTML = `
                        <div>Name: ${tasks[i].name}</div>
                        <div>Description: ${tasks[i].description}</div>
                        <div>Deadline: ${tasks[i].deadline}</div>
                    `;

                    elem_task.addEventListener('click', () => load_task(tasks[i].id));

                    document.querySelector('#tasks-view').append(elem_task);
                };

            });
            // Show tasks view and hide other views
            document.querySelector('#lists-view').style.display = 'none';
            document.querySelector('#create-view').style.display = 'none';
            document.querySelector('#tasks-view').style.display = 'block';
            document.querySelector('#create-task-view').style.display = 'none';
            document.querySelector('#task-view').style.display = 'none';

            // Show the view name
            document.querySelector('#tasks-view').innerHTML = `<h3>${view1.charAt(0).toUpperCase() + view1.slice(1)}</h3>`;
}

function load_task(id) {
    
    document.querySelector('#lists-view').style.display = 'none';
    document.querySelector('#create-view').style.display = 'none';
    document.querySelector('#tasks-view').style.display = 'none';
    document.querySelector('#create-task-view').style.display = 'none';
    document.querySelector('#task-view').style.display = 'block';

    fetch(`/tasks/${id}`)
        .then(response => response.json())
        .then(task => {
            console.log(task);
            document.querySelector('#task-view').innerHTML = `
            <div>Name: ${task.name}</div>
            <div>Description: ${task.description}</div>
            <div>Deadline: ${task.deadline}</div>         
            
            <div class="task-buttons">
                <button class="btn-task" id="task_deleted">${task["deleted"] ? "Undelete" : "Delete"}</button>
            </div>
            <hr>
            <div>
                ${task.body}
            </div>
            
          `;
          var el = document.getElementById('task_deleted');
          if(el){
            document.querySelector('#task_deleted').addEventListener('click', () => {
                fetch(`/tasks/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        deleted: !task.deleted
                    })
                })
                // .then(response => response.json())
                    .then(task => {
                        // console.log(email);
                        load_view('lists');
                    });
            })
          }    
        })
        

}