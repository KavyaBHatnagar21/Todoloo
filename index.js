"use strict"

// DOM Elements
const $todoList = document.querySelector(".todo-list")
const $todoListContainer = document.querySelector(".todo-list-container")
const $inputBox = document.querySelector(".input-box")
const $addButton = document.querySelector(".add-button")

// App constants

const DB_NAME = "tasks"

// Data structures

let tasks = []

// Data structures logic

const addToTaskList = (tasks, text, completed = false) => {
  const id = Date.now()
  tasks.push({ id, text, completed })
  return id
}

const deleteFromTaskList = (id) => {
  const index = tasks.findIndex((task) => id === task.id)
  tasks.splice(index, 1)
}

const toggleTaskCompletionInTaskList = (id) => {
  const task = getTaskFromTaskList(id)
  task.completed = !task.completed
}

const getTaskFromTaskList = (id) => tasks.find((task) => task.id === id)

// Database logic

const updateTasksToDB = (dbName, tasks) =>
  localStorage.setItem(dbName, JSON.stringify(tasks))

const loadTasksFromDB = (dbName, tasks) =>
  tasks.push(...(JSON.parse(localStorage.getItem(dbName)) || []))

// UI logic

const getInputBoxValue = () => $inputBox.value

const isInputBoxEmpty = () => getInputBoxValue() === ""

const clearInputBox = () => ($inputBox.value = "")

const updateTaskInUI = (task) => {
  const taskCard = getTaskCardFromUI(task.id)
  const boxImg = taskCard.querySelector(".box-img")
  boxImg.src = `./images/${
    task.completed ? "checked-box.png" : "unchecked-box.png"
  }`
  const taskItem = taskCard.querySelector("li")
  taskItem.textContent = task.text
  if (task.completed) {
    taskItem.classList.add("completed")
  } else {
    taskItem.classList.remove("completed")
  }
}

const getTaskCardFromUI = (id) =>
  $todoList.querySelector(`.item-container[data-id="${id}"]`)

const createCheckBox = (task, id) => {
  const checkBox = document.createElement("img")
  checkBox.src = "./images/unchecked-box.png"
  checkBox.classList.add("box-img")
  checkBox.alt = "check-boxes"
  checkBox.addEventListener("click", function () {
    toggleTaskCompletionInTaskList(id)
    updateTasksToDB(DB_NAME, tasks)
    updateTaskInUI(task)
  })
  return checkBox
}

const createTaskLabel = (task) => {
  const taskLabel = document.createElement("li")
  taskLabel.textContent = task.text
  if (task.completed) {
    taskLabel.classList.add("completed")
  } else {
    taskLabel.classList.remove("completed")
  }
  return taskLabel
}

const createCheckBoxAndLabelContainer = (task, id) => {
  const checkBoxAndLabelContainer = document.createElement("div")
  checkBoxAndLabelContainer.className = "box-and-item-container"
  checkBoxAndLabelContainer.appendChild(createCheckBox(task, id))
  checkBoxAndLabelContainer.appendChild(createTaskLabel(task))
  return checkBoxAndLabelContainer
}

const createImgButton = (buttonName, id) => {
  const imgButton = document.createElement("img")
  imgButton.src = `./images/${buttonName}-icon.png`
  imgButton.classList.add(`icon-btn`, "hidden")
  imgButton.setAttribute("data-id", id)
  imgButton.alt = `${buttonName} icon`
  return imgButton
}

const createBinButton = (id, taskCard) => {
  // Create bin button
  const binIcon = createImgButton("bin", id)

  // Attaching event listener
  binIcon.addEventListener("click", function () {
    deleteFromTaskList(id)
    updateTasksToDB(DB_NAME, tasks)
    deleteTaskFromUI(id)
  })

  taskCard.addEventListener("mouseover", function () {
    binIcon.classList.remove("hidden")
  })
  taskCard.addEventListener("mouseout", function () {
    binIcon.classList.add("hidden")
  })

  return binIcon
}

const createEditButton = (id, taskCard) => {
  const editIcon = createImgButton("edit", id)

  taskCard.addEventListener("mouseover", function () {
    editIcon.classList.remove("hidden")
  })
  taskCard.addEventListener("mouseout", function () {
    editIcon.classList.add("hidden")
  })

  return editIcon
}

const createTaskCardButtonsContainer = (id, taskCard) => {
  const buttonsContainer = document.createElement("div")
  buttonsContainer.classList.add("buttons-container")
  buttonsContainer.appendChild(createEditButton(id, taskCard))
  buttonsContainer.appendChild(createBinButton(id, taskCard))
  return buttonsContainer
}

const addTaskToUI = (task) => {
  const id = task.id
  const taskCard = document.createElement("div")
  taskCard.className = "item-container"
  taskCard.setAttribute("data-id", id)
  taskCard.appendChild(createCheckBoxAndLabelContainer(task, id))
  taskCard.appendChild(createTaskCardButtonsContainer(id, taskCard))

  $todoList.appendChild(taskCard)
}

// Delete tasks from the UI

const deleteTaskFromUI = (id) => getTaskCardFromUI(id).remove()

// App logic

const addItems = (tasks, dbName) => {
  if (!isInputBoxEmpty()) {
    const id = addToTaskList(tasks, getInputBoxValue())
    clearInputBox()
    updateTasksToDB(dbName, tasks)
    addTaskToUI(getTaskFromTaskList(id))
  }
}

const editTask = () => {
  const editIcons = document.querySelectorAll(".edit-icon-img")

  editIcons.forEach((img) => {
    img.addEventListener("click", function () {
      // Find the parent item-container
      const itemContainer = img.closest(".item-container")

      // Find the <li> element inside the container
      const li = itemContainer.querySelector("li")
      const currentText = li.textContent

      // Check if an input already exists to avoid duplicates
      if (itemContainer.querySelector(".edit-input")) {
        console.log("An input is already active.")
        return
      }

      // Create an input element
      const input = document.createElement("input")
      input.type = "text"
      input.value = currentText
      input.className = "edit-input"

      // Replace <li> with <input>
      itemContainer
        .querySelector(".box-and-item-container")
        .replaceChild(input, li)

      // Add event listener to handle saving on pressing Enter
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const newText = input.value.trim()

          if (newText) {
            // Create a new <li> element with the updated text
            const newLi = document.createElement("li")
            newLi.textContent = newText
            newLi.className = li.className

            // Replace <input> with <li>
            itemContainer
              .querySelector(".box-and-item-container")
              .replaceChild(newLi, input)

            // Update the task in the tasks array
            const index = img.dataset.index
            tasks[index].text = newText

            // Update localStorage
            localStorage.setItem("tasks", JSON.stringify(tasks))
          } else {
            alert("Task cannot be empty.")
          }
        }
      })

      // Optionally save on input blur
      input.addEventListener("blur", () => {
        const newText = input.value.trim()

        if (newText) {
          // Create a new <li> element with the updated text
          const newLi = document.createElement("li")
          newLi.textContent = newText
          newLi.className = li.className

          // Replace <input> with <li>
          itemContainer
            .querySelector(".box-and-item-container")
            .replaceChild(newLi, input)

          // Update the task in the tasks array
          const index = img.dataset.index
          tasks[index].text = newText

          // Update localStorage
          localStorage.setItem("tasks", JSON.stringify(tasks))
        } else {
          alert("Task cannot be empty.")
        }
      })
    })
  })
}

// Event Listeners

document.addEventListener("DOMContentLoaded", function () {
  loadTasksFromDB(DB_NAME, tasks)

  tasks.forEach((task) => {
    addTaskToUI(task)
  })
})

$addButton.addEventListener("click", () => addItems(tasks, DB_NAME))

$inputBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addItems(tasks, DB_NAME)
  }
})
