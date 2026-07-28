import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
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
            <span>${data.title}</span>
            <button class="deleteBtn">🗑️</button>
        `;

        li.querySelector(".deleteBtn")
            .addEventListener("click", async () => {

                await deleteDoc(
                    doc(db, "tasks", task.id)
                );

                loadTasks();

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
