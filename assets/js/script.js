var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// declare/initialize unique ID counter
var taskIdCounter = 0;
// declare an array to hold tasks
var tasks = [];

var taskFormHandler = function (event) {
	event.preventDefault();
	var taskNameInput = document.querySelector("input[name='task-name']").value;
	var taskTypeInput = document.querySelector("select[name='task-type']").value;

	// check if input values are empty strings
	if (!taskNameInput || !taskTypeInput) {
		alert("You need to fill out the task form!");
		return false;
	}

	formEl.reset();

	var isEdit = formEl.hasAttribute("data-task-id");

	// has data attribute, so get task id and call function to complete edit process
	if (isEdit) {
		var taskId = formEl.getAttribute("data-task-id");
		completeEditTask(taskNameInput, taskTypeInput, taskId);
	}
	// no data attribute, so create object as normal and pass to createTaskEl function
	else {
		var taskDataObj = {
			name: taskNameInput,
			type: taskTypeInput,
			status: "to do",
		};

		createTaskEl(taskDataObj);
	}
};

var createTaskEl = function (taskDataObj) {
	// create list item
	var listItemEl = document.createElement("li");
	listItemEl.className = "task-item";

	// add task id as a custom attribute
	listItemEl.setAttribute("data-task-id", taskIdCounter);

	// create div to hold task info and add to list item
	var taskInfoEl = document.createElement("div");
	// give it a class name
	taskInfoEl.className = "task-info";
	// add HTML content to div
	taskInfoEl.innerHTML =
		"<h3 class='task-name'>" +
		taskDataObj.name +
		"</h3><span class='task-type'>" +
		taskDataObj.type +
		"</span>";

	listItemEl.appendChild(taskInfoEl);

	// update taskDataObj with the current id
	taskDataObj.id = taskIdCounter;

	tasks.push(taskDataObj);

	saveTasks();

	var taskActionsEl = createTaskActions(taskIdCounter);
	listItemEl.appendChild(taskActionsEl);

	// add entire list item to list
	tasksToDoEl.appendChild(listItemEl);

	// increase task counter to next unique id
	taskIdCounter++;
};

var createTaskActions = function (taskId) {
	var actionContainerEl = document.createElement("div");
	actionContainerEl.className = "task-actions";

	// create edit button
	var editButtonEl = document.createElement("button");
	editButtonEl.textContent = "Edit";
	editButtonEl.className = "btn edit-btn";
	editButtonEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(editButtonEl);

	// create delete button
	var deleteButtonEl = document.createElement("button");
	deleteButtonEl.textContent = "Delete";
	deleteButtonEl.className = "btn delete-btn";
	deleteButtonEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(deleteButtonEl);

	// create dropdown for task status
	var statusSelectEl = document.createElement("select");
	statusSelectEl.className = "select-status";
	statusSelectEl.setAttribute("name", "status-change");
	statusSelectEl.setAttribute("data-task-id", taskId);

	var statusChoices = ["To Do", "In Progress", "Completed"];

	for (var i = 0; i < statusChoices.length; i++) {
		// create option element
		var statusOptionEl = document.createElement("option");
		statusOptionEl.textContent = statusChoices[i];
		statusOptionEl.setAttribute("value", statusChoices[i]);

		// append to select element
		statusSelectEl.appendChild(statusOptionEl);
	}

	actionContainerEl.appendChild(statusSelectEl);

	return actionContainerEl;
};

var taskButtonHandler = function (event) {
	// get target elemnet from event
	var targetEl = event.target;

	// edit button was clicked
	if (targetEl.matches(".edit-btn")) {
		var taskId = targetEl.getAttribute("data-task-id");
		editTask(taskId);
	}

	// delete button was clicked
	if (event.target.matches(".delete-btn")) {
		// get the element's task id
		var taskId = event.target.getAttribute("data-task-id");
		deleteTask(taskId);
	}
};

var editTask = function (taskId) {
	// get task list item element
	var taskSelected = document.querySelector(
		".task-item[data-task-id='" + taskId + "']"
	);

	// get content from task name and type
	var taskName = taskSelected.querySelector("h3.task-name").textContent;
	document.querySelector("input[name='task-name']").value = taskName;

	var taskType = taskSelected.querySelector("span.task-type").textContent;
	document.querySelector("select[name='task-type']").value = taskType;

	document.querySelector("#save-task").textContent = "Save Task";

	formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function (taskName, taskType, taskId) {
	// finding the matching task list item
	var taskSelected = document.querySelector(
		".task-item[data-task-id='" + taskId + "']"
	);

	// set new values
	taskSelected.querySelector("h3.task-name").textContent = taskName;
	taskSelected.querySelector("span.task-type").textContent = taskType;

	// loop through tasks array and task object with new content
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id === parseInt(taskId)) {
			tasks[i].name === taskName;
			tasks[i].type === taskType;
		}
	}

	saveTasks();

	alert("Task Updated!");

	formEl.removeAttribute("data-task-id");
	document.querySelector("#save-task").textContent = "Add Task";
};

var deleteTask = function (taskId) {
	var taskSelected = document.querySelector(
		".task-item[data-task-id='" + taskId + "']"
	);
	taskSelected.remove();

	// create a new array to hold the updated list of tasks
	var updatedTaskArr = [];

	// loop through the current tasks
	for (var i = 0; i < tasks.length; i++) {
		// if tasks[i].id doesn't match the value of taskId, keep that task and push it into the new task
		if (tasks[i].id !== parseInt(taskId)) {
			updatedTaskArr.push(tasks[i]);
		}
	}

	// reassign tasks array to be the same as updatedTaskArr
	tasks = updatedTaskArr;

	saveTasks();
};

var taskStatusChangeHandler = function (event) {
	// get the task item's id
	var taskId = event.target.getAttribute("data-task-id");

	// get the currently selected option's value and convert to lowercase
	var statusValue = event.target.value.toLowerCase();

	// find the parent task item element based on the id
	var taskSelected = document.querySelector(
		".task-item[data-task-id='" + taskId + "']"
	);

	if (statusValue === "to do") {
		tasksToDoEl.appendChild(taskSelected);
	} else if (statusValue === "in progress") {
		tasksInProgressEl.appendChild(taskSelected);
	} else if (statusValue === "completed") {
		tasksCompletedEl.appendChild(taskSelected);
	}

	// update task in tasks array
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].id === parseInt(taskId)) {
			tasks[i].status = statusValue;
		}
	}

	saveTasks();
};

var saveTasks = function () {
	localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
	// retrieve the array of tasks from localStorage
	tasks = localStorage.getItem("tasks");

	// check if the value of tasks is null (no content in the array)
	if (!tasks) {
		tasks = [];
		return false;
	}

	// parse the string back into an array of objects
	tasks = JSON.parse(tasks);

	// create loop to print tasks to page
	for (var i = 0; i < tasks.length; i++) {
		// reassign id property so they print in order
		tasks[i].id = taskIdCounter;

		// create <li> element
		var listItemEl = document.createElement("li");
		listItemEl.className = "task-item";
		listItemEl.setAttribute("data-task-id", tasks[i].id);

		// create div element
		var taskInfoEl = document.createElement("div");
		taskInfoEl.className = "task-info";
		taskInfoEl.innerHTML =
			"<h3 class='task-name'>" +
			tasks[i].name +
			"</h3><span class='task-type'>" +
			tasks[i].type +
			"</span>";

		// append taskInfoEl to listItemEl
		listItemEl.appendChild(taskInfoEl);

		// create task actions
		var taskActionsEl = createTaskActions(tasks[i].id);

		// append taskActionsEl to listItemEl
		listItemEl.appendChild(taskActionsEl);

		// check if the task is to do
		if (tasks[i].status === "to do") {
			listItemEl.querySelector(
				"select[name='status-change']"
			).selectedIndex = 0;
			tasksToDoEl.appendChild(listItemEl);
		} else if (tasks[i].status === "in progress") {
			listItemEl.querySelector(
				"select[name='status-change']"
			).selectedIndex = 1;
			tasksInProgressEl.appendChild(listItemEl);
		} else if (tasks[i].status === "completed") {
			listItemEl.querySelector(
				"select[name='status-change']"
			).selectedIndex = 2;
			tasksCompletedEl.appendChild(listItemEl);
		}

		taskIdCounter++;

		console.log(listItemEl);
	}
};

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

formEl.addEventListener("submit", taskFormHandler);

loadTasks();
