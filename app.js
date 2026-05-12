// useres...
let users = [
  { reg: "23010395", pass: "395", name: "Ifetkhar Haider Rifat" },
  { reg: "23010397", pass: "397", name: "Thouhidul Hoque Sany" },
  { reg: "23010407", pass: "407", name: "Abdullah Raihan Rafi" }
];

// Courses..
let courses = [
  "Agricultural Statistics (Theory)",
  "Agricultural Statistics (Practical)",
  "Genetics (Theory)",
  "Genetics (Lab)",
  "Biotechnology (Theory)",
  "Biotechnology (Lab)",
  "Entomology (Theory)",
  "Entomology (Lab)",
  "Horticulture (Theory)",
  "Horticulture (Lab)",
  "Forestry (Elective)"
];

// current users....
let currentUser = null;
let currentCourse = "";

// login function ................
function login() {
  let reg = document.getElementById("reg").value;
  let pass = document.getElementById("pass").value;

  for (let i = 0; i < users.length; i++) {
    if (users[i].reg == reg && users[i].pass == pass) {
      currentUser = users[i];
      localStorage.setItem("loggedUser", JSON.stringify(currentUser));
    }
  }

  if (!currentUser) {
    alert("Wrong login");
    return;
  }

  document.getElementById("loginBox").style.display = "none";
  document.getElementById("main").style.display = "block";
  document.getElementById("userText").innerText = currentUser.name + " (" + currentUser.reg + ")";

  showCourses();
}

// course list ........................
function showCourses() {
  let box = document.getElementById("courseBox");
  box.innerHTML = "";

  for (let i = 0; i < courses.length; i++) {
    let delay = i * 0.2; 
    box.innerHTML += `
    <button onclick="openCourse('${courses[i]}')"
      style="animation: rise 0.4s ease-out ${delay}s forwards; opacity: 0;"
      class="p-3 rounded-2xl text-center bg-transparent border-2 border-green-500 font-bold text-slate-900 text-2xl w-[90vw] h-[18vh] shadow-lg transition-all duration-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-400 hover:text-white hover:border-transparent">
      ${courses[i]}
    </button>`;
  }
}

// show courses new page...................
function openCourse(course) {
  currentCourse = course;
  localStorage.setItem("currentCourse", course);

  let key = currentUser.reg + "_" + course;
  let data = JSON.parse(localStorage.getItem(key));

  if (!data || !data.records) {
    data = { records: [] };
  }

  document.getElementById("courseBox").style.display = "none";
  let logBox = document.getElementById("box");
  logBox.style.display = "block";
  logBox.style.animation = "none";

  setTimeout(() => {
    logBox.style.animation = "slideUp 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
  }, 10);

  showLog(course, data);
}

// logbook.....................
function showLog(course, data) {
  let total = data.records.length;
  let present = 0;

  for (let i = 0; i < data.records.length; i++) {
    if (data.records[i]) { present++; }
  }

  let percent = total === 0 ? 0 : (present / total) * 100;
  let history = "";

  for (let i = 0; i < data.records.length; i++) {
    history += `
    <div class="flex justify-between items-center mt-3 border-b pb-2">
      <div class="font-semibold">Class ${i + 1}</div>
      <div class="${data.records[i] ? 'text-green-600' : 'text-red-600'} font-bold">
        ${data.records[i] ? "Present" : "Absent"}
      </div>
      <div class="flex gap-2">
        <button onclick="editAttendance(${i})" class="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
        <button onclick="deleteAttendance(${i})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
      </div>
    </div>`;
  }

  document.getElementById("box").innerHTML = `
    <button onclick="back()" class="mb-3 text-blue-900 font-bold text-xs md:text-xl border-2 border-black p-1 rounded transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white">← Back</button>
    <h2 class="text-lg md:text-3xl font-bold mb-3">${course}</h2>
    <div class="grid grid-cols-3 gap-2 text-center font-bold">
      <div style="background:#42A5F5;" class="p-2 rounded text-base md:text-2xl">Classes</div>
      <div style="background:#42A5F5;" class="p-2 rounded text-base md:text-2xl">Present</div>
      <div style="background:#42A5F5;" class="p-2 rounded text-base md:text-2xl">Attendance %</div>
    </div>
    <div class="grid grid-cols-3 gap-2 text-center mt-2">
      <div class="p-2 text-lg md:text-3xl">${total}</div>
      <div class="p-2 text-lg md:text-3xl">${present}</div>
      <div class="p-2 text-lg md:text-3xl">${percent.toFixed(1)}%</div>
    </div>
    <div class="mt-4 flex gap-2">
      <button onclick="addClass(true)" class="p-2 rounded w-full text-sm md:text-xl text-white bg-[#2e9c10] hover:bg-[#0a5418] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]">Present</button>
      <button onclick="addClass(false)" class="bg-[#9c1029] p-2 rounded w-full text-sm md:text-xl text-white hover:bg-[#5c0313] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]">Absent</button>
    </div>
    <div class="mt-6">
      <h3 class="text-base md:text-2xl font-bold mb-3">Attendance History</h3>
      ${history}
    </div>`;
}

// add class ..............
function addClass(isPresent) {
  let key = currentUser.reg + "_" + currentCourse;
  let data = JSON.parse(localStorage.getItem(key)) || { records: [] };
  data.records.push(isPresent);
  localStorage.setItem(key, JSON.stringify(data));
  showLog(currentCourse, data);
}

// edit attendance...........................
function editAttendance(index) {
  let key = currentUser.reg + "_" + currentCourse;
  let data = JSON.parse(localStorage.getItem(key));
  data.records[index] = !data.records[index];
  localStorage.setItem(key, JSON.stringify(data));
  showLog(currentCourse, data);
}

// delete attendance ..................
function deleteAttendance(index) {
  let key = currentUser.reg + "_" + currentCourse;
  let data = JSON.parse(localStorage.getItem(key));
  data.records.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(data));
  showLog(currentCourse, data);
}

// back button ..................
function back() {
  localStorage.removeItem("currentCourse");
  document.getElementById("box").style.display = "none";
  document.getElementById("courseBox").style.display = "flex";
  showCourses();
}

// logout.......................
function logout() {
  localStorage.removeItem("currentCourse");
  localStorage.removeItem("loggedUser");
  location.reload();
}

// auto login after refresh.................
window.onload = function () {
  let savedUser = localStorage.getItem("loggedUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("main").style.display = "block";
    document.getElementById("userText").innerText = currentUser.name + " (" + currentUser.reg + ")";
    showCourses();
    let savedCourse = localStorage.getItem("currentCourse");
    if (savedCourse) { openCourse(savedCourse); }
  }
}

// If there is something added it will be written here ..................