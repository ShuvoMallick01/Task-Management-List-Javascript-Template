const currentDay = document.getElementById('date');
const currentTime = document.getElementById('time');
const taskForm = document.querySelector('.task-form');
const taskInput = document.querySelector('#task-input');
const taskPriority = document.querySelector('.task-priority');
const taskAssigned = document.querySelector('.task-assigned');
const taskListWrapper = document.querySelector('.task-list');

// FILTER (No Need)
const taskStatusFilter = document.querySelector('.task-status-filter');
const taskPriorityFilter = document.querySelector('.task-priority-filter');
const taskAssignedFilter = document.querySelector('.task-assigned-filter');

// STATUS FILTER (No Need)
const allBtn = document.getElementById('all');
const openBtn = document.getElementById('open');
const completeBtn = document.getElementById('complete');

// FILTER
const statusCheckFilter = document.querySelectorAll('.status-filter');
const priorityCheckFilter = document.querySelectorAll('.priorityFilter');
const assignedCheckFilter = document.querySelectorAll('.assignedFilter');

//STATUS
const searchInput = document.getElementById('search');

let taskList = [];
let editId = null;

// DATE & TIME FUNCTION
function timeFormat(date) {
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return time;
}

function currentDateTime() {
  const today = new Date();
  const date = today.toLocaleDateString('en-US', {
    day: '2-digit',
    weekday: 'short',
  });
  currentDay.textContent = date;
  currentTime.textContent = timeFormat(today);
}
currentDateTime();

// CREATE TASK FUNCTION
function createTask(title, priority, assigned) {
  return {
    title,
    priority,
    assigned,
    id: Date.now(),
    complete: false,
    createAt: new Date(),
  };
}

// RENDER UI
function renderUI(tasks) {
  let markup = '';
  tasks.forEach((item) => {
    markup += ` <div class="task-item">
            <div class="d-flex gap-3">
              <input
                id="complete" onchange="completeTask(${item.id})" ${
      item.complete && 'checked'
    }
                class="form-check-input"
                type="checkbox"
              />

              <div class="${
                item.complete ? 'text-decoration-line-through' : ''
              }">
                <h5 class="task-title">${item.title}</h5>
                <span class="badge text-bg-primary">${item.priority}</span>
                <span class="badge text-bg-primary"
                  >Assigned For ${item.assigned}</span
                >
                <p class="task-createAt text-muted">Today at ${timeFormat(
                  new Date()
                )}</p>
              </div>
            </div>

            <div class="task-actions d-flex align-items-center">
              <i
                id="edit" onclick="editTask(${item.id})"
                class="fa-solid fa-pen-to-square text-success edit-btn"
              ></i>
              <i
                id="delete" onclick="deleteTask(${item.id})"
                class="fa-solid fa-trash text-danger delete-btn"
              ></i>
            </div>
          </div>`;
  });

  taskListWrapper.innerHTML = markup;
}

// EDIT TODO
function editTask(id) {
  editId = id;
  findTask = taskList.find((item) => item.id === editId);
  taskInput.value = findTask.title;
  taskPriority.value = findTask.priority;
  taskAssigned.value = findTask.assigned;
}

// DELETE TASK
function deleteTask(id) {
  const result = confirm('Are you want to delete this Task?');

  if (result) {
    taskList = taskList.filter((item) => item.id !== id);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // showLength();
    renderUI(taskList);
  }
}

// COMPLETE TASK
function completeTask(id) {
  taskList = taskList.map((item) => {
    if (item.id === id) return { ...item, complete: !item.complete };
    return item;
  });

  localStorage.setItem('tasks', JSON.stringify(taskList));
  // showLength();
  renderUI(taskList);
}

// SHOW LENGTH TASK
// function showLength() {
//   const openTasks = taskList.filter((item) => item.complete === false);
//   const completeTasks = taskList.filter((item) => item.complete === true);

//   taskStatusFilter.innerHTML = '';

//   const markup = `<option disabled selected>Status</option>
//     <option value="all" id="all">
//       All-(<span class="all-task-length">${taskList.length}</span>)
//     </option>
//     <option value="open" id="open">
//       Open-(<span class="open-task-length">${openTasks.length}</span>)
//     </option>
//     <option value="complete" id="complete">
//       Complete-(<span class="complete-task-length">${completeTasks.length}</span>)
//     </option>`;

//   taskStatusFilter.insertAdjacentHTML(`afterbegin`, markup);
//   console.log(taskStatusFilter);
// }

// STATUS FILTER
statusCheckFilter.forEach((item) => {
  item.addEventListener('click', function (e) {
    const currentItem = e.target;
    statusCheckFilter.forEach((item) => {
      if (currentItem != item && currentItem.checked) {
        item.checked = false;
      }
    });
  });

  item.addEventListener('change', (e) => {
    if (item.checked) {
      let filterValue = item.value;
      if (filterValue === 'open') {
        let openTasks = taskList.filter((item) => item.complete === false);
        renderUI(openTasks);
      } else if (filterValue === 'complete') {
        let completeTasks = taskList.filter((item) => item.complete === true);
        renderUI(completeTasks);
      } else {
        renderUI(taskList);
      }
    } else {
      renderUI(taskList);
    }
  });
});

// PRIORITY FILTER
priorityCheckFilter.forEach((item) => {
  item.addEventListener('click', function (e) {
    const currentItem = e.target;
    priorityCheckFilter.forEach((item) => {
      if (currentItem != item && currentItem.checked) {
        item.checked = false;
      }
    });
  });

  item.addEventListener('change', (e) => {
    if (item.checked) {
      let priorityValue = item.value;
      let priorityTasks = taskList.filter(
        (item) => item.priority.toLowerCase() === priorityValue
      );
      renderUI(priorityTasks);
    } else {
      renderUI(taskList);
    }
  });
});

// TASK ASSIGN FILTER
assignedCheckFilter.forEach((item) => {
  item.addEventListener('click', function (e) {
    const currentItem = e.target;
    assignedCheckFilter.forEach((item) => {
      if (currentItem != item && currentItem.checked) {
        item.checked = false;
      }
    });
  });

  item.addEventListener('change', (e) => {
    if (item.checked) {
      let assignedValue = item.value;
      let assignedTasks = taskList.filter(
        (item) => item.assigned.toLowerCase() === assignedValue
      );
      renderUI(assignedTasks);
    } else {
      renderUI(taskList);
    }
  });
});

// SEARCH TASKS
searchInput.addEventListener('keyup', (e) => {
  const searchValue = e.target.value.toLowerCase();

  let filteredList = taskList.filter((item) =>
    item.title.toLowerCase().includes(searchValue)
  );

  renderUI(filteredList);
});

// MAIN INPUT TASK FUNCTION
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let inputTitle = taskInput.value;
  let inputTaskPriority = taskPriority.value;
  let inputTaskAssigned = taskAssigned.value;

  if (
    !inputTitle &&
    inputTaskPriority == 'default' &&
    inputTaskAssigned == 'default'
  ) {
    alert('Title, Priority, Assigned Field is required!');
    return;
  } else if (inputTaskPriority == 'default') {
    alert('Task Priority is Required!');
    return;
  } else if (inputTaskAssigned == 'default') {
    {
      alert('Task Assinged is Required!');
      return;
    }
  }

  if (editId) {
    console.log('Find Task ID');
    taskList = taskList.map((item) => {
      if (item.id === editId)
        return {
          ...item,
          title: inputTitle,
          priority: inputTaskPriority,
          assigned: inputTaskAssigned,
        };
      return item;
    });
  } else {
    const newTask = createTask(
      inputTitle,
      inputTaskPriority,
      inputTaskAssigned
    );
    taskList.push(newTask);
  }

  localStorage.setItem('tasks', JSON.stringify(taskList));
  // showLength();
  renderUI(taskList);
  taskInput.value = '';
});

// BORWSER LOAD TIME LISTENER
document.addEventListener('DOMContentLoaded', (e) => {
  if (localStorage.getItem('tasks')) {
    taskList = JSON.parse(localStorage.getItem('tasks'));
  }
  // showLength();
  renderUI(taskList);
});

// console.log(taskList);
