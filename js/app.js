// ─────────────────────────────
// DATA STORE
// ─────────────────────────────
let DATA = {
  students: [],
  rooms: [],
  waiting: [],
  logs: []
};

// ─────────────────────────────
// WHATSAPP SUPPORT FUNCTION
// ─────────────────────────────
const PHONE_NUMBER = "918534895177"; // ← CHANGE THIS TO YOUR ACTUAL WHATSAPP NUMBER (with country code, no + or spaces)

function sendToWhatsApp() {
  const textarea = document.getElementById('support-message');
  const message = textarea.value.trim();
  if (!message) {
    alert('⚠️ Please type a message before sending to WhatsApp.');
    textarea.focus();
    return;
  }
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
  window.open(whatsappURL, '_blank');
  textarea.value = '';
  const btn = document.querySelector('#tab-support button[onclick="sendToWhatsApp()"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = `✅ Message Sent! WhatsApp Opened`;
  btn.style.backgroundColor = '#15803d';
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.backgroundColor = '';
  }, 2500);
}

// ─────────────────────────────
// AUTH
// ─────────────────────────────
function handleLogin() {
  const id = document.getElementById('login-id').value.trim();
  const pass = document.getElementById('login-pass').value;
  const err = document.getElementById('auth-err');
  if (id === 'admin' && pass === 'warden123') {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-content').classList.remove('hidden');
    setTimeout(() => document.getElementById('app-content').classList.add('opacity-100'), 100);
    addLog("Warden session authenticated.", "success");
    initApp();
  } else {
    err.style.opacity = '1';
    setTimeout(() => err.style.opacity = '0', 4000);
  }
}

// ─────────────────────────────
// THEME + TABS
// ─────────────────────────────
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  document.getElementById('theme-icon').textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
}

function switchTab(tab, e) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(`tab-${tab}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('slide-up');
  }
  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('tab-active'));
  if (e && e.currentTarget) e.currentTarget.classList.add('tab-active');
}

// ─────────────────────────────
// LOGS
// ─────────────────────────────
function addLog(msg, type = 'info') {
  const audit = document.getElementById('audit-trail');
  const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const el = document.createElement('div');
  el.className = `log-entry ${type==='success'?'log-success':type==='error'?'log-error':''}`;
  el.innerHTML = `<span class="opacity-50">[${time}]</span> ${msg}`;
  audit.prepend(el);
  DATA.logs.unshift({time, msg, type});
}

// ─────────────────────────────
// INIT + STORAGE
// ─────────────────────────────
function initApp() {
  document.getElementById('boot-time') && (document.getElementById('boot-time').textContent = new Date().toLocaleTimeString());
  loadStoredData();
  renderAll();
}

function saveAndRender() {
  localStorage.setItem('DAA_ENGINE_DATA', JSON.stringify(DATA));
  renderAll();
}

function loadStoredData() {
  const saved = localStorage.getItem('DAA_ENGINE_DATA');
  if (saved) {
    DATA = JSON.parse(saved);
    addLog("Data recovery successful. Registry synchronized.");
  }
}

// Rest of your original script (student form, room form, allocation, renderAll, etc.) remains unchanged
document.getElementById('s-year').addEventListener('change', function() {
  const isFirst = this.value === '1';
  document.getElementById('cgpa-group').classList.toggle('hidden', isFirst);
  document.getElementById('payment-group').classList.toggle('hidden', !isFirst);
  document.getElementById('s-cgpa').required = !isFirst;
  document.getElementById('s-payment-date').required = isFirst;
});

document.getElementById('stu-form').onsubmit = function(e) {
  e.preventDefault();
  const prefs = [];
  if (document.getElementById('p-sac').checked) prefs.push('Single AC');
  if (document.getElementById('p-snac').checked) prefs.push('Single Non-AC');
  if (document.getElementById('p-dac').checked) prefs.push('Double AC');
  if (document.getElementById('p-dnac').checked) prefs.push('Double Non-AC');
  const year = parseInt(document.getElementById('s-year').value);
  const student = {
    id: document.getElementById('s-roll').value.trim(),
    name: document.getElementById('s-name').value.trim(),
    year: year,
    cgpa: year === 1 ? 0 : parseFloat(document.getElementById('s-cgpa').value) || 0,
    payment_date: year === 1 ? document.getElementById('s-payment-date').value : null,
    prefs: prefs,
    timestamp: Date.now()
  };
  if (DATA.students.some(s => s.id === student.id)) {
    return addLog(`Refused duplicate ID: ${student.id}`, "error");
  }
  DATA.students.push(student);
  addLog(`Enrolled student ${student.name} (${student.id})`, "success");
  e.target.reset();
  saveAndRender();
};

function deleteStudent(id) {
  DATA.students = DATA.students.filter(s => s.id !== id);
  addLog(`Removed student ${id} from registry.`);
  saveAndRender();
}

document.getElementById('room-form').onsubmit = function(e) {
  e.preventDefault();
  const roomId = document.getElementById('r-id').value.trim();
  if (DATA.rooms.some(r => r.id === roomId)) {
    addLog(`Room ID "${roomId}" already allocated.`, "error");
    const input = document.getElementById('r-id');
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 800);
    return;
  }
  const room = {
    id: roomId,
    type: document.getElementById('r-type').value,
    yearGroup: document.getElementById('r-yeargroup').value,
    capacity: parseInt(document.getElementById('r-cap').value),
    occupied: 0,
    residents: []
  };
  DATA.rooms.push(room);
  addLog(`Unit ${room.id} added (${room.yearGroup}).`, "success");
  e.target.reset();
  saveAndRender();
};

function deleteRoom(id) {
  DATA.rooms = DATA.rooms.filter(r => r.id !== id);
  addLog(`Decommissioned unit ${id}.`);
  saveAndRender();
}

function executeAllocation() {
  if (DATA.students.length === 0 || DATA.rooms.length === 0) {
    return addLog("Execution failed: Null dataset detected.", "error");
  }
  addLog("Starting DAA Greedy Protocol Execution...");
  DATA.rooms.forEach(r => { r.occupied = 0; r.residents = []; });
  DATA.waiting = [];
  const priorityQueue = [...DATA.students].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (a.year === 1) {
      const dateA = a.payment_date ? new Date(a.payment_date) : new Date(0);
      const dateB = b.payment_date ? new Date(b.payment_date) : new Date(0);
      return dateA - dateB;
    } else {
      const normA = a.cgpa / 10;
      const normB = b.cgpa / 10;
      const senA = a.year / 4;
      const senB = b.year / 4;
      const scoreA = 0.6 * normA + 0.4 * senA;
      const scoreB = 0.6 * normB + 0.4 * senB;
      return scoreB - scoreA;
    }
  });

  priorityQueue.forEach(stu => {
    let assigned = false;
    const allowed = stu.year === 1 ? "Freshman" : "Senior";
    for (let pref of stu.prefs) {
      const target = DATA.rooms.find(r =>
        r.type === pref &&
        r.yearGroup === allowed &&
        r.occupied < r.capacity
      );
      if (target) {
        target.occupied++;
        target.residents.push(stu.name);
        assigned = true;
        addLog(`Assigned ${stu.name} to ${target.id} (${pref})`);
        break;
      }
    }
    if (!assigned) {
      DATA.waiting.push(stu);
      addLog(`Overflow: ${stu.name} moved to buffer.`, "error");
    }
  });
  addLog("Greedy optimization pass complete.", "success");
  saveAndRender();
  switchTab('engine', {currentTarget: document.querySelector('.nav-tab:nth-child(4)')});
}

function renderAll() {
  document.getElementById('stat-students').innerText = DATA.students.length;
  document.getElementById('stat-rooms').innerText = DATA.rooms.length;
  document.getElementById('reg-count').innerText = `${DATA.students.length} TOTAL`;
  const avail = DATA.rooms.reduce((acc, r) => acc + (r.capacity - r.occupied), 0);
  document.getElementById('stat-avail').innerText = avail;
  const rate = DATA.students.length > 0
    ? Math.round(((DATA.students.length - DATA.waiting.length) / DATA.students.length) * 100)
    : 0;
  document.getElementById('stat-rate').innerText = rate + "%";

  // Student List
  document.getElementById('stu-list').innerHTML = DATA.students.map(s => `
    <tr class="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
      <td class="p-6 font-mono font-bold text-blue-600">${s.id}</td>
      <td class="p-6">
        <div class="font-bold">${s.name}</div>
        <div class="text-[10px] text-slate-400">Year ${s.year} • ${s.prefs.join(', ') || 'None'}</div>
      </td>
      <td class="p-6">
        <span class="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full font-black text-xs">
          ${s.year === 1 ? '—' : s.cgpa}
        </span>
      </td>
      <td class="p-6 text-right">
        <button onclick="deleteStudent('${s.id}')" class="text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');

  // Room Grid
  document.getElementById('room-grid').innerHTML = DATA.rooms.map(r => `
    <div class="glass-ui p-6 rounded-3xl border-l-4 ${r.occupied >= r.capacity ? 'border-red-500' : 'border-emerald-500'}">
      <div class="flex justify-between items-start mb-4">
        <div>
          <div class="text-xs font-black opacity-40 uppercase">${r.type} • ${r.yearGroup}</div>
          <div class="text-lg font-black">${r.id}</div>
        </div>
        <button onclick="deleteRoom('${r.id}')" class="text-slate-300 hover:text-red-500 transition-colors">×</button>
      </div>
      <div class="flex items-center gap-2 mb-4">
        <div class="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div class="h-full bg-blue-500 transition-all duration-500" style="width: ${(r.occupied / r.capacity) * 100}%"></div>
        </div>
        <span class="text-xs font-mono">${r.occupied}/${r.capacity}</span>
      </div>
      <div class="text-[10px] font-bold text-slate-400 uppercase">Occupants:</div>
      <div class="text-xs font-bold mt-1">${r.residents.join(', ') || 'VACANT'}</div>
    </div>
  `).join('');

  document.getElementById('count-allocated').innerText = DATA.students.length - DATA.waiting.length;
  document.getElementById('count-waiting').innerText = DATA.waiting.length;

  document.getElementById('allocated-list').innerHTML = DATA.rooms.filter(r => r.occupied > 0).map(r => `
    <div class="p-4 bg-blue-50 dark:bg-blue-600/5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
      <div class="flex justify-between text-[10px] font-black uppercase text-blue-500 mb-2">
        <span>${r.id}</span>
        <span>${r.type} • ${r.yearGroup}</span>
      </div>
      <div class="text-sm font-bold">${r.residents.join(' • ')}</div>
    </div>
  `).join('');

  document.getElementById('waiting-list').innerHTML = DATA.waiting.map(s => `
    <div class="p-4 bg-orange-50 dark:bg-orange-600/5 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex justify-between items-center">
      <div>
        <div class="text-sm font-bold">${s.name}</div>
        <div class="text-[10px] text-slate-400">Year ${s.year} • ${s.year===1?'Payment date priority':`CGPA ${s.cgpa}`}</div>
      </div>
      <span class="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded uppercase font-black">Waiting</span>
    </div>
  `).join('');
}

function simulateTraffic() {
  addLog("Generating synthetic dataset (20 students + 10 rooms)...");
  const names = ["Aarav","Vivaan","Aditya","Krishna","Ishaan","Shaurya","Atharv","Kabir","Ananya","Diya","Saanvi","Aadhya","Pari","Myra","Riya","Priyanshi","Kavya","Radha","Pooja","Meera"];
  const types = ["Single AC","Single Non-AC","Double AC","Double Non-AC"];
  for (let i = 0; i < 20; i++) {
    const y = Math.floor(Math.random() * 4) + 1;
    DATA.students.push({
      id: 'S' + (1000 + i),
      name: names[i] + " " + (i+1),
      year: y,
      cgpa: y === 1 ? 0 : (6 + Math.random() * 4).toFixed(2),
      payment_date: y === 1 ? `2025-${Math.floor(Math.random()*12)+1}-${Math.floor(Math.random()*28)+1}`.replace(/(\d)-(\d)/g,'$10$2') : null,
      prefs: [types[Math.floor(Math.random()*4)]],
      timestamp: Date.now()
    });
  }
  for (let i = 0; i < 10; i++) {
    DATA.rooms.push({
      id: 'R' + (100 + i),
      type: types[i % 4],
      yearGroup: Math.random() < 0.4 ? "Freshman" : "Senior",
      capacity: Math.floor(Math.random() * 3) + 1,
      occupied: 0,
      residents: []
    });
  }
  saveAndRender();
}

function exportResults() {
  let content = "HOSTEL ALLOCATION REPORT\n========================\n\n";
  DATA.rooms.forEach(r => {
    content += `ROOM ${r.id} [${r.type} - ${r.yearGroup}]: ${r.residents.join(', ') || 'EMPTY'}\n`;
  });
  content += "\nWAITING LIST:\n" + (DATA.waiting.map(s => s.name).join(', ') || 'None');
  const blob = new Blob([content], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'allocation_report.txt';
  a.click();
  addLog("Exported allocation manifest.");
}

// 🚀 Initialize on load
window.addEventListener("load", () => {
  // Floating stars removed as requested
});
