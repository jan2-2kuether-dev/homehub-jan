import {db} from "./firebase.js";
import {collection,addDoc,getDocs,deleteDoc,doc,setDoc,getDoc} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const budget=document.getElementById("budget");
const budgetValue=document.getElementById("budgetValue");
const taskInput=document.getElementById("taskInput");
const taskList=document.getElementById("taskList");

function updateDashboard(){

    const openTasks = taskList.children.length;

    document.getElementById("taskCount").textContent = openTasks;

    const completedTasks =
        document.getElementById("completedTaskList").children.length;

    document.getElementById("completedCount").textContent = completedTasks;

    const total = openTasks + completedTasks;

    const progress = total === 0
        ? 0
        : Math.round((completedTasks / total) * 100);

    document.getElementById("progressFill").style.width = progress + "%";

    document.getElementById("progressText").textContent =
        progress + " % erledigt";

}

    const open = taskList.children.length;

    document.getElementById("taskCount").textContent = open;

    document.getElementById("completedCount").textContent = "0";

    document.getElementById("progressFill").style.width = "0%";

    document.getElementById("progressText").textContent = "0 % erledigt";

}
async function loadBudget(){
 const ref=doc(db,"settings","budget");
 const s=await getDoc(ref);
 if(s.exists()){budget.value=s.data().value;budgetValue.textContent=s.data().value+" €";}
}
document.getElementById("saveBudget").onclick=async()=>{
 await setDoc(doc(db,"settings","budget"),{value:Number(budget.value)});
 budgetValue.textContent=budget.value+" €";
};
function updateDashboard(){

    const open = taskList.children.length;

    document.getElementById("taskCount").textContent = open;

    document.getElementById("completedCount").textContent = "0";

    document.getElementById("progressFill").style.width = "0%";

    document.getElementById("progressText").textContent = "0 % erledigt";

}

async function loadTasks(){
 taskList.innerHTML="";
 const snap=await getDocs(collection(db,"tasks"));
 snap.forEach(d=>{
   const li=document.createElement("li");
   li.innerHTML=`<span>${d.data().title}</span><button class="deleteBtn">🗑️</button>`;
   li.querySelector("button").onclick=async()=>{await deleteDoc(doc(db,"tasks",d.id));loadTasks();};
   taskList.appendChild(li);
 });
 updateDashboard();
}
document.getElementById("addTask").onclick=async()=>{
 if(!taskInput.value.trim())return;
 await addDoc(collection(db,"tasks"),{title:taskInput.value.trim()});
 taskInput.value="";
 loadTasks();
};

loadBudget();
loadTasks();
/* ==========================================================
   SPRINT 2A
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
   SPRINT 2A
   SCHNELLAKTIONEN
========================================================== */

const quickButtons = document.querySelectorAll(".card button");

quickButtons.forEach(button => {

    button.addEventListener("click", () => {

        const text = button.textContent.trim();

        switch (text) {

            case "🧹 Wohnung aufräumen":
                document.getElementById("taskInput").value = "Wohnung aufräumen";
                break;

            case "🛒 Einkauf planen":
                document.getElementById("taskInput").value = "Einkauf planen";
                break;

            case "💡 Budget prüfen":
                document.getElementById("budget").focus();
                break;

        }

    });

});
