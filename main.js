window.onload = function (e) {
  let taskId = 1; //use guid
  let taskStore = [];
  const taskForm = document.querySelector(".tasks__form");
  const faIcon = taskForm.querySelector(".icon i");
  const taskList = document.querySelector(".tasks-list__list");
  const taskInput = document.querySelector("#task-text-input");
  const taskAddButton = document.querySelector(".tasks-add-task__button");
  const finishedTaskList = document.querySelector(".finished-tasks-list__list");
  const finishedHeader = document.querySelector(".finished-header");
  const finishedContainer = document.querySelector(
    ".finished-tasks-list__container"
  );

  function addTaskFocus(e) {
    const eventTarget = e.target;
    if (eventTarget.id === "task-text-input") {
      eventTarget.className = "";
      taskForm.className = "tasks__form tasks-form__focus";
      faIcon.className = "far fa-circle gray";
    }
  }

  function addTaskBlur(e) {
    const eventTarget = e.target;
    if (eventTarget.id === "task-text-input" && !eventTarget.value) {
      eventTarget.className = "red";
      faIcon.className = "fas fa-plus";
      taskForm.className = "tasks__form";
    }
  }

  function addTaskTyping(e) {
    const eventTarget = e.target;
    if (eventTarget.value === "") {
      taskAddButton.className = "tasks-add-task__button hidden";
    }
    if (eventTarget.value != "") {
      taskAddButton.className = "tasks-add-task__button";
    }
  }

  function addTask(e) {
    e.preventDefault();
    if (taskInput.value != "") {
      faIcon.className = "far fa-circle";
      createTaskObj(taskInput.value);
      updateDom(taskStore);
      taskAddButton.className = "tasks-add-task__button hidden";
      taskForm.reset();
    }
  }

  function clickTask(e) {
    const eventTarget = e.target;
    if (eventTarget.classList.contains("fa-star")) {
      const parentTask = eventTarget.parentNode.parentNode;
      taskStore = taskStore.map((task) => {
        if (task.taskId === parentTask.id) {
          return { ...task, starred: !task.starred };
        } else {
          return task;
        }
      });
    }
    if (eventTarget.classList.contains("fa-check-circle")) {
      finishedContainer.classList.remove("hidden");
      const parentTask = eventTarget.parentNode.parentNode;
      taskStore = taskStore.map((task) => {
        if (task.taskId === parentTask.id) {
          return { ...task, finished: !task.finished };
        } else {
          return task;
        }
      });
    }
    updateDom(taskStore);
  }

  function enterTask(e) {
    const eventTarget = e.target;
    if (eventTarget.className === "tasks-list-item__check-button") {
      const circleIcon = eventTarget.querySelector("i");
      if (circleIcon.classList.contains("fa-circle")) {
        circleIcon.className = "far fa-check-circle";
      }
    }
    if (eventTarget.className === "task-list-item__favorite-button") {
      const starFaIcon = eventTarget.querySelector(
        ".task-list-item__favorite-button i"
      );
      if (starFaIcon.classList.contains("gray")) {
        starFaIcon.classList.add("icon-bold");
      }
    }
  }

  function leaveTask(e) {
    const eventTarget = e.target;
    if (eventTarget.className === "tasks-list-item__check-button") {
      const circleIcon = eventTarget.querySelector("i");
      if (circleIcon.className === "far fa-check-circle") {
        circleIcon.className = "far fa-circle";
      }
    }
    if (eventTarget.className === "task-list-item__favorite-button") {
      const starFaIcon = eventTarget.querySelector(
        ".task-list-item__favorite-button i"
      );
      starFaIcon.classList.remove("icon-bold");
    }
  }

  function toggleFinished() {
    const chevronIcon = finishedHeader.querySelector("i");
    if (chevronIcon.classList.contains("finished-list-closed")) {
      console.log("yes");
      chevronIcon.classList.replace(
        "finished-list-closed",
        "finished-list-open"
      );
    } else if (chevronIcon.classList.contains("finished-list-open")) {
      chevronIcon.classList.replace(
        "finished-list-open",
        "finished-list-closed"
      );
    }
    finishedTaskList.classList.toggle("hidden");
  }

  function createTaskObj(taskName) {
    const newTask = {
      taskId: `task${taskId}`,
      taskName,
      finished: false,
      starred: false
    };
    taskId++;
    taskStore.push(newTask);
  }

  function createDomLi(taskObj) {
    const newLi = document.createElement("li");
    newLi.className = "task-list-item";
    newLi.id = taskObj.taskId;
    const newCheckButton = document.createElement("button");
    newCheckButton.type = "button";
    newCheckButton.className = "tasks-list-item__check-button";
    if (!taskObj.finished) {
      newCheckButton.innerHTML = "<i class='far fa-circle'></i>";
    } else {
      newCheckButton.innerHTML = "<i class='fas fa-check-circle'></i>";
    }
    const newTaskText = document.createElement("span");
    newTaskText.innerText = taskObj.taskName;
    newTaskText.className = "task-text";
    const newFavoriteButton = document.createElement("button");
    newFavoriteButton.type = "button";
    newFavoriteButton.className = "task-list-item__favorite-button";
    if (!taskObj.starred) {
      newFavoriteButton.innerHTML = "<i class='far fa-star gray'></i>";
    } else {
      newFavoriteButton.innerHTML = "<i class='fas fa-star'></i>";
    }

    newLi.append(newCheckButton, newTaskText, newFavoriteButton);
    return newLi;
  }

  function clearAllTaskLists() {
    taskList.innerHTML = "";
    finishedTaskList.innerHTML = "";
  }

  function updateDom(taskStore) {
    clearAllTaskLists();
    taskStore
      .filter((task) => !task.finished && task.starred)
      .forEach((task) => taskList.append(createDomLi(task)));

    taskStore
      .filter((task) => !task.finished && !task.starred)
      .forEach((task) => taskList.append(createDomLi(task)));

    taskStore
      .filter((task) => task.finished && task.starred)
      .forEach((task) => finishedTaskList.append(createDomLi(task)));

    taskStore
      .filter((task) => task.finished && !task.starred)
      .forEach((task) => finishedTaskList.append(createDomLi(task)));
  }

  taskForm.addEventListener("focus", addTaskFocus, true);
  taskForm.addEventListener("blur", addTaskBlur, true);
  taskForm.addEventListener("submit", addTask);
  taskInput.addEventListener("keyup", addTaskTyping);
  taskList.addEventListener("click", clickTask);
  taskList.addEventListener("mouseenter", enterTask, true);
  taskList.addEventListener("mouseleave", leaveTask, true);
  finishedHeader.addEventListener("click", toggleFinished);
  finishedTaskList.addEventListener("click", clickTask);
  finishedTaskList.addEventListener("mouseenter", enterTask, true);
  finishedTaskList.addEventListener("mouseleave", leaveTask, true);
};
