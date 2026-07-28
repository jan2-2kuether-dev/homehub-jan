import {db} from "./firebase.js";
import {collection,addDoc,getDocs,deleteDoc,doc,setDoc,getDoc} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const budget=document.getElementById("budget");
const budgetValue=document.getElementById("budgetValue");
const taskInput=document.getElementById("taskInput");
const taskList=document.getElementById("taskList");

async function loadBudget(){
 const ref=doc(db,"settings","budget");
 const s=await getDoc(ref);
 if(s.exists()){budget.value=s.data().value;budgetValue.textContent=s.data().value+" €";}
}
document.getElementById("saveBudget").onclick=async()=>{
 await setDoc(doc(db,"settings","budget"),{value:Number(budget.value)});
 budgetValue.textContent=budget.value+" €";
};

async function loadTasks(){
 taskList.innerHTML="";
 const snap=await getDocs(collection(db,"tasks"));
 snap.forEach(d=>{
   const li=document.createElement("li");
   li.innerHTML=`<span>${d.data().title}</span><button class="deleteBtn">🗑️</button>`;
   li.querySelector("button").onclick=async()=>{await deleteDoc(doc(db,"tasks",d.id));loadTasks();};
   taskList.appendChild(li);
 });
}
document.getElementById("addTask").onclick=async()=>{
 if(!taskInput.value.trim())return;
 await addDoc(collection(db,"tasks"),{title:taskInput.value.trim()});
 taskInput.value="";
 loadTasks();
};

loadBudget();
loadTasks();
