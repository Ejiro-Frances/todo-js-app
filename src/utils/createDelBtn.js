import {
  saveTodoToLocalStorage,
  getTodosFromLocalStorage,
} from "./saveTodos.js";

const deleteModalEl = document.querySelector(".delete-modal");
const overlayEl = document.querySelector(".overlay");
const yesDeleteEl = document.querySelector("#modal--btn-yes");
const noDeleteEl = document.querySelector("#modal--btn-no");
const deleteAllBtn = document.querySelector("#deleteAllBtn");
const deleteWarningEl = document.querySelector("#delete-warning");

// Hide modal function
function toggleDeleteModal() {
  deleteModalEl.classList.toggle("hidden");
  overlayEl.classList.toggle("hidden");
}

// Close modal when "No" is clicked
noDeleteEl.addEventListener("click", toggleDeleteModal);

// Close modal if body is clicked
document.body.addEventListener("click", (e) => {
  const clickedOutsideModal =
    !deleteModalEl.contains(e.target) &&
    !e.target.classList.contains("deleteBtn");

  if (!deleteModalEl.classList.contains("hidden") && clickedOutsideModal) {
    toggleDeleteModal();
  }
});

function showSuccess(message) {
  const successMessage = document.getElementById("successMessage");
  successMessage.textContent = message;
  successMessage.classList.remove("hidden");
  successMessage.classList.add("show");

  // Show message for 1 second only
  setTimeout(() => {
    successMessage.classList.remove("show");
    successMessage.classList.add("hidden");
  }, 1000);
}

// Function to create a delete button
export function createDeleteButton(listItem, id) {
  const todoDeleteEl = document.createElement("span");
  todoDeleteEl.classList.add("deleteBtn");
  todoDeleteEl.textContent = "🆇";
  todoDeleteEl.setAttribute("title", `Delete ${listItem.textContent.trim()}`);

  // When the delete icon is clicked
  todoDeleteEl.onclick = () => {
    toggleDeleteModal();

    // Assign a one-time click handler for "Yes"
    const handleYesClick = () => {
      listItem.remove();

      //filter todos to remove the deleted todo
      const todos = getTodosFromLocalStorage().filter((todo) => todo.id !== id);

      // Save the updated todos to local storage
      saveTodoToLocalStorage(todos);

      // Close the modal
      toggleDeleteModal();

      // Show success message
      showSuccess("Task deleted successfully!");

      // remove eventlistener to avoid multiple triggers
      yesDeleteEl.removeEventListener("click", handleYesClick);
    };

    // actually delete the task
    yesDeleteEl.onclick = null;
    yesDeleteEl.addEventListener("click", handleYesClick);
  };

  return todoDeleteEl;
}
