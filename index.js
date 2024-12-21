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
        <div class="buttons-container">
            <img src="./images/edit-icon.png" class="edit-icon-img hidden" data-index="${index}" alt="edit icon">
            <img src="./images/bin.png" class="bin-img hidden" data-index="${index}" alt="bin icon">
        </div>
    </div>
      `
  })

  displayBinOnHover()
  displayEditOnHover()
  deleteTask()
  editTask()
  checkTheBox()
}

const deleteTask = () => {
  const binIcons = document.querySelectorAll(".bin-img")

  binIcons.forEach((img) => {
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

    item.addEventListener("mouseover", function () {
      binImg.classList.remove("hidden")
    })
    item.addEventListener("mouseout", function () {
      binImg.classList.add("hidden")
    })
  })
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

const displayEditOnHover = () => {
  const itemContainers = document.querySelectorAll(".item-container")

  itemContainers.forEach((item) => {
    const editImg = item.querySelector(".edit-icon-img")

    item.addEventListener("mouseover", () => {
      editImg.classList.remove("hidden")
    })
    item.addEventListener("mouseout", () => {
      editImg.classList.add("hidden")
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
