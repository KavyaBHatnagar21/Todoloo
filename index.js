"use strict"

const todoList = document.querySelector(".todo-list")
const todoListContainer = document.querySelector(".todo-list-container")
const inputBox = document.querySelector(".input-box")
const addButton = document.querySelector(".add-button")
let tasks = []

document.addEventListener("DOMContentLoaded", function () {
  retrieveItems()
})

//Update task array and add that to the local storage
const addItems = () => {
  const newTask = inputBox.value
  if (newTask === "") return
  tasks.push({ text: newTask, completed: false })

  localStorage.setItem("tasks", JSON.stringify(tasks))

  inputBox.value = ""
}

//Retrieve old tasks and display tasks and retrieve updated tasks
const retrieveItems = () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || []

  todoList.innerHTML = ""
  tasks.forEach((task, index) => {
    todoList.innerHTML += `
    <div class="item-container">
        <div class="box-and-item-container">
            <img src="./images/${
              task.completed ? "checked-box.png" : "unchecked-box.png"
            }" class="box-img" data-index="${index}" alt="check-boxes">
            <li class="${task.completed ? "completed" : ""}">${task.text}</li>
        </div>
        <img src="./images/bin.png" class="bin-img hidden" data-index="${index}" alt="bin icon">
    </div>
      `
  })

  displayBinOnHover()
  deleteTask()
  checkTheBox()
}

const deleteTask = () => {
  const binImg = document.querySelectorAll(".bin-img")

  binImg.forEach((img) => {
    img.addEventListener("click", function () {
      const index = img.dataset.index
      tasks.splice(index, 1)
      localStorage.setItem("tasks", JSON.stringify(tasks))
      retrieveItems()
    })
  })
}

const displayBinOnHover = () => {
  const itemContainers = document.querySelectorAll(".item-container")
  itemContainers.forEach((item) => {
    const binImg = item.querySelector(".bin-img")

    item.addEventListener("mouseover", () => {
      binImg.classList.remove("hidden")
    })
    item.addEventListener("mouseout", () => {
      binImg.classList.add("hidden")
    })
  })
}

const checkTheBox = () => {
  const boxImg = document.querySelectorAll(".box-img")

  boxImg.forEach((img) => {
    img.addEventListener("click", function () {
      const index = img.dataset.index
      tasks[index].completed = !tasks[index].completed
      localStorage.setItem("tasks", JSON.stringify(tasks))
      retrieveItems()
    })
  })
}

addButton.addEventListener("click", () => {
  addItems()
  retrieveItems()
})

inputBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addItems()
    retrieveItems()
  }
})
