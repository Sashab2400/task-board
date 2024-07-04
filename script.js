let taskList = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
let nextId = localStorage.getItem("nextId") ? JSON.parse(localStorage.getItem("nextId")) : 0;


function generateTaskId() {
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return nextId;
}

function createTaskCard(task) {

  const card = $("div");-
  card.addClass("card border-light mb-3 task-card");

  // Set the task card content
  card.html(`
        <div class="card-header bg-light">
            <h5 class="card-title">${task.name}</h5>
            <button class="delete-task">Delete</button> 
        </div>
        <div class="card-body">
            <p class="card-text">Description: ${task.description}</p>
            <p class="card-text">Due Date: ${task.dueDate}</p>
        </div>
    `);

  
  const deleteButton = card.find("button.delete-task");
  deleteButton.click(handleDeleteTask);
  if(task.dueDate&&task.status!=="done"){
    const today=dayjs()
    if(today.isSame(task.dueDate,'day')){
      card.addClass("bg-warning text-white")
    }
    else if(today.isAfter(task.dueDate)){
      card.addClass("bg-danger text-white")
    }
  }

  // Determine which swim lane to append the card based on the task status
  // let lane;
  // switch (task.status) {
  //   case "To Do":
  //     lane = $("#to-do");
  //     break;
  //   case "In Progress":
  //     lane = $("#in-progress");
  //     break;
  //   case "Done":
  //     lane = $("#done");
  //     break;
  //   default:
  //     lane = $("#to-do"); // Default to 'To Do' lane
  // }

  // // Append the card to the appropriate swim lane
  // if (lane) {
  //   const test = $("todo-cards");
  //   console.log(test)
  // }


return card;
}


//function renderTaskList() {
  //taskList.forEach((task) => {
    //createTaskCard(task);
  //});
//}



function handleAddTask(event) {
   event.preventDefault(); // Prevent the form from submitting

   console.log("hit");

   const name = $("#taskName").val()
   const description = $("#description").val()
   const dueDate = $("#dueDate").val()
//   const status = document.getElementById("task-status").value;


   const newTask = {
     id: generateTaskId(), // Generate a unique task id
     name: name,
     description: description,
     dueDate: dueDate,
     status: "to-do",
   };

//   // Add the new task to the taskList array
   taskList.push(newTask);

//   createTaskCard(newTask);
//   document.getElementById("task-form").reset();

//   // Save the updated taskList array to localStorage
   localStorage.setItem("tasks", JSON.stringify(taskList));
   renderTaskList()
   $("#taskName").val("")
   $("#description").val("")
   $("#dueDate").val("")

//   // Create a task card for the new task and render it on the page
//   createTaskCard(newTask);

//   // Optionally, you can reset the form fields after adding the task
//   document.getElementById("task-form").reset();
 }

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  // Check if the click event happened on a delete button
  if (event.target.classList.contains("delete-task")) {
    // Find the task card element
    const taskCard = event.target.closest(".card");

    // Find the task id associated with the task card
    const taskId = parseInt(taskCard.dataset.taskId);

    // Remove the task from the taskList array
    taskList = taskList.filter((task) => task.id !== taskId);

    // Save the updated taskList array to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Remove the task card from the DOM
    taskCard.remove();

    document.addEventListener("click", handleDeleteTask);
  }
}


function handleDrop(event, ui) {

  const taskCard = ui.draggable[0];

  // Get the task id associated with the task card
  const taskId = parseInt(taskCard.dataset.taskId);

  // Determine the status lane where the task is being dropped
  const newStatus = event.target.id; // Assuming the status lane IDs match the task status values

  // Find the task in the taskList array
  const taskIndex = taskList.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    // Update the status of the task in the taskList array
    taskList[taskIndex].status = newStatus;

    // Save the updated taskList array to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Move the task card to the new status lane in the DOM
    const newLane = document.getElementById(newStatus);
    newLane.querySelector(".card-body").appendChild(taskCard);
  }
}


// $(".status-lane").droppable({
//   drop: handleDrop,
// });


$(document).ready(function() {
    renderTaskList(); // Call the function to render the task list
    $("#taskForm").on("submit",handleAddTask)
    $(".lane").droppable({accept:".task-card",drop: handleDrop})
});

    

  // $("#taskForm").submit(function (event) {
  //   event.preventDefault();

  //   const name = $("#taskName").val();
  //   const description = $("#taskType").val();
  //   const dueDate = $("#dueDate").val();
  //   const status = "To Do"; 

  
  //   const newTask = {
  //     id: generateTaskId(), 
  //     name: name,
  //     description: description,
  //     dueDate: dueDate,
  //     //   status: status,
  //   };

  //   createTaskCard(newTask);

  //   $("#formModal").modal("hide");
  // });

  // $(document).on("click", "#add-task-btn", function (event) {
  //   event.preventDefault();
  //   $("#taskForm").submit();
  // });



function renderTaskList() {
  const todoList=$("#todo-cards")
  todoList.empty()

  const inProgress=$("#in-progress-cards")
  inProgress.empty()

  const doneList=$("#done-cards")
  doneList.empty()


  if (taskList) {
    taskList.forEach((task) => {
      if(task.status==="to-do")
      todoList.append(createTaskCard(task));
    else if(task.status==="in-progress")
      inProgress.append(createTaskCard(task));
    else 
    doneList.append(createTaskCard(task));
    });
  }
}
