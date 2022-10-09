document.addEventListener('DOMContentLoaded', function () {

    // Use buttons to toggle between views
    document.querySelector('#list').addEventListener('click', () => load_view('list'));
    document.querySelector('#deleted').addEventListener('click', () => load_view('deleted'));
    document.querySelector('#create').addEventListener('click', create_task);

    document.querySelector('#create-form').onsubmit = create_submit;

    // By default, load the lists
    load_view('list');
});

// -----------------------------------------------------------------------------------
function create_task() {
    document.querySelector('#lists-view').style.display = 'none';
    document.querySelector('#create-view').style.display = 'block';
    document.querySelector('#task-view').style.display = 'none';

    
    // Clear out field
    document.querySelector('#create-name').value = '';
}

function create_submit() {
    const create_name = document.querySelector('#create-name').value;

    fetch('/lists', {
        method: 'POST',
        body: JSON.stringify({
            name: create_name,
        })
    })
    .then(response => response.json())
    .then(result => {
            load_view('list');
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
                elem_list.classList.add('lists');

                elem_list.innerHTML = `
                    <div>Name: ${lists[i].name}</div>
                    <div>Date: ${lists[i].timestamp}</div>
                `;
       
                elem_list.addEventListener('click', () => load_task(lists[i].id, view));

       
                document.querySelector('#lists-view').append(elem_list);
            };
        });
    // Show lists view and hide other views
    document.querySelector('#lists-view').style.display = 'block';
    document.querySelector('#create-view').style.display = 'none';
    document.querySelector('#task-view').style.display = 'none';
    // Show the view name
    document.querySelector('#lists-view').innerHTML = `<h3>${view.charAt(0).toUpperCase() + view.slice(1)}</h3>`;

}


function load_task(id, view) {
    
    document.querySelector('#task-view').style.display = 'block';
    document.querySelector('#lists-view').style.display = 'none';

    fetch(`/lists/${id}`)
        .then(response => response.json())
        .then(task => {
            console.log(task);
            document.querySelector('#task-view').innerHTML = `
            <div>Name: ${task.name}</div>
            <div>Description: ${task.description}</div>
            <div>Deadline: ${task.deadline}</div>         
            
            <div class="task-buttons">
                <button class="btn-task" id="deleted">${task["deleted"] ? "Undelete" : "Delete"}</button>
            </div>
            <hr>
            <div>
                ${task.body}
            </div>
            
          `;

            document.querySelector('#deleted').addEventListener('click', () => {
                fetch(`/lists/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        deleted: !task.deleted
                    })
                })
                // .then(response => response.json())
                    .then(task => {
                        // console.log(email);
                        load_view('list');
                    });
            })    
        })
        

}