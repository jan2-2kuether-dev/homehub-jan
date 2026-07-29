import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

/* ==========================================================
   DOM
========================================================== */

const budget = document.getElementById("budget");
const budgetValue = document.getElementById("budgetValue");

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const completedTaskList = document.getElementById("completedTaskList");
const priority = document.getElementById("priority");
const category = document.getElementById("category");

const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

/* ==========================================================
   DASHBOARD
========================================================== */

function updateDashboard() {

    const open = taskList.children.length;
    const completed = completedTaskList.children.length;

    taskCount.textContent = open;
    completedCount.textContent = completed;

    const total = open + completed;

    const percent =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    progressFill.style.width = percent + "%";
    progressText.textContent = percent + " % erledigt";

}

/* ==========================================================
   BUDGET
========================================================== */

async function loadBudget() {

    const ref = doc(db, "settings", "budget");

    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    budget.value = snap.data().value;
    budgetValue.textContent = snap.data().value + " €";

}

async function saveBudget() {

    const value = Number(budget.value);

    await setDoc(doc(db, "settings", "budget"), {
        value
    });

    budgetValue.textContent = value + " €";

}

document
    .getElementById("saveBudget")
    .addEventListener("click", saveBudget);

/* ==========================================================
   TASKS
========================================================== */

async function loadTasks() {

    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";

    const snapshot =
        await getDocs(collection(db, "tasks"));

    snapshot.forEach(task => {

        const data = task.data();

        const li = document.createElement("li");

li.innerHTML = `
    <div class="taskContent">

    <span class="taskTitle">
        ${data.title}
    </span>

    <div class="taskMeta">

        <span class="priorityBadge">
            ${data.priority ?? "-"}
        </span>

        <span class="categoryBadge">
            ${data.category ?? "-"}
        </span>

    </div>

</div>

    <div class="taskActions">

        <button class="toggleBtn">
            ${data.completed ? "↺" : "☑️"}
        </button>

        <button class="deleteBtn">
            🗑️
        </button>

    </div>
    
        `;

      const actionButton = li.querySelector(".toggleBtn");
      const deleteButton = li.querySelector(".deleteBtn");

      deleteButton.addEventListener("click", async () => {

    const confirmed = confirm(
        "Möchtest du diese Aufgabe wirklich endgültig löschen?"
    );

    if (!confirmed) return;

    await deleteDoc(
        doc(db, "tasks", task.id)
    );

    await loadTasks();

});

if (data.completed) {

    actionButton.style.background = "#4f8df7";

} else {

    actionButton.style.background = "#36c275";

}

actionButton.addEventListener("click", async () => {

        await updateDoc(
            doc(db, "tasks", task.id),
            {
                completed: !data.completed
            }
        );

        await loadTasks();

            });

        if (data.completed) {

            completedTaskList.appendChild(li);

        } else {

            taskList.appendChild(li);

        }

    });

    updateDashboard();

}

async function addTask() {

    const title = taskInput.value.trim();

    if (!title) return;

    await addDoc(collection(db, "tasks"), {

    title,
    priority: priority.value,
    category: category.value,
    completed: false

});

    taskInput.value = "";

    loadTasks();

}

document
    .getElementById("addTask")
    .addEventListener("click", addTask);

/* ==========================================================
   START
========================================================== */

loadBudget();
loadTasks();
/* ==========================================================
   SPRINT 2
   SIDEBAR
========================================================== */

const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const mobileOverlay = document.getElementById("mobileOverlay");

menuButton.addEventListener("click", () => {

    if (window.innerWidth <= 900) {

        sidebar.classList.toggle("open");
        mobileOverlay.classList.toggle("active");

    } else {

        sidebar.classList.toggle("collapsed");

    }

});

mobileOverlay.addEventListener("click", () => {

    sidebar.classList.remove("open");
    mobileOverlay.classList.remove("active");

});

window.addEventListener("resize", () => {

    if (window.innerWidth > 900) {

        sidebar.classList.remove("open");
        mobileOverlay.classList.remove("active");

    }

});


/* ==========================================================
   SPRINT 2
   SCHNELLAKTIONEN
========================================================== */

const quickButtons = document.querySelectorAll(".card button");

quickButtons.forEach(button => {

    const text = button.textContent.trim();

    switch (text) {

        case "🧹 Wohnung aufräumen":

            button.addEventListener("click", () => {

                taskInput.value = "Wohnung aufräumen";
                taskInput.focus();

            });

            break;

        case "🛒 Einkauf planen":

            button.addEventListener("click", () => {

                taskInput.value = "Einkauf planen";
                taskInput.focus();

            });

            break;

        case "💡 Budget prüfen":

            button.addEventListener("click", () => {

                budget.focus();

            });

            break;

    }

});


/* ==========================================================
   SPRINT 2
   ENTER = AUFGABE HINZUFÜGEN
========================================================== */

taskInput.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        addTask();

    }

});


/* ==========================================================
   SPRINT 2
   BUDGET MIT ENTER SPEICHERN
========================================================== */

budget.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        saveBudget();

    }

});
