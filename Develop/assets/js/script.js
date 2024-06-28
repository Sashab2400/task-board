// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    nextId++;
    localStorage.setItem("nextId" , JSON.stringify(nextId));
    return nextId;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    // Create a div element for the task card
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    // Set the task card content
    card.innerHTML = `
        <div class="card-header bg-light">
            <h5 class="card-title">${task.name}</h5>
        </div>
        <div class="card-body">
            <p class="card-text">Description: ${task.description}</p>
            <p class="card-text">Due Date: ${task.dueDate}</p>
            <p class="card-text">Status: ${task.status}</p>
        </div>
    `;

    // Determine which swim lane to append the card based on the task status
    let lane;
    switch (task.status) {
        case 'To Do':
            lane = document.getElementById('to-do');
            break;
        case 'In Progress':
            lane = document.getElementById('in-progress');
            break;
        case 'Done':
            lane = document.getElementById('done');
            break;
        default:
            lane = document.getElementById('to-do'); // Default to 'To Do' lane
    }

    // Append the card to the appropriate swim lane
    if (lane) {
        lane.querySelector('.card-body').appendChild(card);
    }

    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    function renderTaskList() {
        taskList.forEach(task => {
            createTaskCard(task);
        });
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Retrieve task details from the form fields
    const name = document.getElementById('task-name').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('due-date').value;
    const status = document.getElementById('task-status').value;

    // Create a new task object
    const newTask = {
        id: generateTaskId(), // Generate a unique task id
        name: name,
        description: description,
        dueDate: dueDate,
        status: status
    };

    // Add the new task to the taskList array
    taskList.push(newTask);

    // Save the updated taskList array to localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // Create a task card for the new task and render it on the page
    createTaskCard(newTask);

    // Optionally, you can reset the form fields after adding the task
    document.getElementById('task-form').reset();
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    // Check if the click event happened on a delete button
    if (event.target.classList.contains('delete-task')) {
        // Find the task card element
        const taskCard = event.target.closest('.card');

        // Find the task id associated with the task card
        const taskId = parseInt(taskCard.dataset.taskId);

        // Remove the task from the taskList array
        taskList = taskList.filter(task => task.id !== taskId);

        // Save the updated taskList array to localStorage
        localStorage.setItem('tasks', JSON.stringify(taskList));

        // Remove the task card from the DOM
        taskCard.remove();
    }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    function handleDrop(event, ui) {
        // Get the task card element being dropped
        const taskCard = ui.draggable[0];
    
        // Get the task id associated with the task card
        const taskId = parseInt(taskCard.dataset.taskId);
    
        // Determine the status lane where the task is being dropped
        const newStatus = event.target.id; // Assuming the status lane IDs match the task status values
    
        // Find the task in the taskList array
        const taskIndex = taskList.findIndex(task => task.id === taskId);
    
        if (taskIndex !== -1) {
            // Update the status of the task in the taskList array
            taskList[taskIndex].status = newStatus;
    
            // Save the updated taskList array to localStorage
            localStorage.setItem('tasks', JSON.stringify(taskList));
    
            // Move the task card to the new status lane in the DOM
            const newLane = document.getElementById(newStatus);
            newLane.querySelector('.card-body').appendChild(taskCard);
        }
    }
    
    // Connect the handleDrop function to the HTML using jQuery UI's droppable feature
    $('.status-lane').droppable({
        drop: handleDrop
    });
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function() {
    $('#taskForm').submit(function(event) {
      event.preventDefault();
      
      // Get form values
      let taskName = $('#taskName').val();
      let taskType = $('#taskType').val();
      let dueDate = $('#dueDate').val();
      
      // Add the task to the board or perform any necessary actions
      // For example, you can create a new card in the To Do section
      
      // Close the modal
      $('#formModal').modal('hide');
    });
  });
