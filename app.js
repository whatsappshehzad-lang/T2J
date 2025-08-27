
// Time2Justice - simple client-side data store
const DB = {
  courses: [
    { id: 1, title: "Constitutional Law", level: "Year 1", teacher: "Prof. A. Verma", tags: ["constitution"], updated: "2025-08-01" },
    { id: 2, title: "Law of Contracts", level: "Year 1", teacher: "Dr. S. Mehta", tags: ["contracts"], updated: "2025-08-02" },
    { id: 3, title: "Family Law", level: "Year 1", teacher: "Ms. P. Sharma", tags: ["family"], updated: "2025-08-03" },
    { id: 4, title: "Law of Crimes", level: "Year 1", teacher: "Mr. R. Khan", tags: ["criminal"], updated: "2025-08-04" },
    { id: 5, title: "Law of Torts", level: "Year 1", teacher: "Dr. N. Das", tags: ["torts"], updated: "2025-08-05" },

    { id: 6, title: "Jurisprudence", level: "Year 2", teacher: "Prof. S. Iyer", tags: ["jurisprudence"], updated: "2025-08-06" },
    { id: 7, title: "Property Law", level: "Year 2", teacher: "Dr. K. Rao", tags: ["property"], updated: "2025-08-07" },
    { id: 8, title: "Administrative Law", level: "Year 2", teacher: "Mr. V. Gupta", tags: ["admin"], updated: "2025-08-08" },
    { id: 9, title: "Company Law", level: "Year 2", teacher: "Ms. R. Sinha", tags: ["company"], updated: "2025-08-09" },
    { id: 10, title: "Public International Law", level: "Year 2", teacher: "Dr. A. Kulkarni", tags: ["international"], updated: "2025-08-10" },

    { id: 11, title: "Civil Procedure Code (CPC)", level: "Year 3", teacher: "Prof. M. Jain", tags: ["cpc"], updated: "2025-08-11" },
    { id: 12, title: "Criminal Procedure Code (CrPC)", level: "Year 3", teacher: "Mr. A. Ali", tags: ["crpc"], updated: "2025-08-12" },
    { id: 13, title: "Law of Evidence", level: "Year 3", teacher: "Dr. R. Patil", tags: ["evidence"], updated: "2025-08-13" },
    { id: 14, title: "Environmental Law", level: "Year 3", teacher: "Ms. S. Joshi", tags: ["environment"], updated: "2025-08-14" },
    { id: 15, title: "Labour Law", level: "Year 3", teacher: "Mr. D. Singh", tags: ["labour"], updated: "2025-08-15" },
  ],
  notes: [
  { id: 101, courseId: 1, title: "Preamble & Fundamental Rights (PDF)", link: "#", type: "pdf", size: "1.1 MB" },
  { id: 102, courseId: 2, title: "Offer & Acceptance (DOCX)", link: "#", type: "docx", size: "500 KB" },
  { id: 103, courseId: 4, title: "IPC Sections 1-511 Summary (PDF)", link: "#", type: "pdf", size: "1.8 MB" },
  { id: 104, courseId: 11, title: "CPC Orders & Rules Chart (PDF)", link: "#", type: "pdf", size: "900 KB" },
  { id: 105, courseId: 13, title: "Evidence Act Important Sections (DOCX)", link: "#", type: "docx", size: "650 KB" },
  { id: 106, courseId: 1, title: "Indian Constitution (PPT)", link: "assets/notes/Indian_Constitution.ppt", type: "ppt", size: "2.5 MB" },
],

  announcements: [
    { id: 201, text: "Moot Court Competition on 5 Sept 2025.", date: "2025-08-20" },
    { id: 202, text: "Mid-Sem Exams start from 15 Sept 2025.", date: "2025-08-22" },
    { id: 203, text: "Guest Lecture on Environmental Law by Justice Rao on 28 Aug.", date: "2025-08-18" },
  ]
};

// Utility: render helper
function el(html){
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// Active nav highlight
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if(a.getAttribute('href') === path){ a.classList.add('active'); }
  });
})();

// Course search
function initCourseSearch(){
  const box = document.querySelector('#courseSearch');
  const list = document.querySelector('#courseList');
  if(!box || !list) return;
  function render(items){
    list.innerHTML = '';
    if(items.length === 0){
      list.append(el(`<div class="alert">No courses found.</div>`));
      return;
    }
    items.forEach(c => {
      list.append(el(`
        <article class="card">
          <div class="badge">${c.level}</div>
          <h3>${c.title}</h3>
          <small>Teacher: ${c.teacher} • Updated: ${c.updated}</small>
          <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
            ${c.tags.map(t => `<span class="badge">#${t}</span>`).join('')}
          </div>
        </article>
      `));
    });
  }
  render(DB.courses);
  box.addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase().trim();
    const filtered = DB.courses.filter(c =>
      c.title.toLowerCase().includes(q) || c.level.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q) || c.tags.some(t=>t.includes(q))
    );
    render(filtered);
  });
}

// Notes page
function initNotes(){
  const list = document.querySelector('#notesList');
  const filter = document.querySelector('#courseFilter');
  if(!list || !filter) return;
  DB.courses.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = `${c.title}`;
    filter.appendChild(o);
  });
  function render(items){
    list.innerHTML = '';
    if(items.length === 0){
      list.append(el(`<tr><td colspan="5"><div class="alert">No notes available.</div></td></tr>`));
      return;
    }
    items.forEach(n => {
      const course = DB.courses.find(c => c.id === n.courseId);
      list.append(el(`
        <tr>
          <td>${n.title}</td>
          <td>${course ? course.title : "-"}</td>
          <td>${n.type.toUpperCase()}</td>
          <td>${n.size}</td>
          <td><a class="btn" href="${n.link}">Open</a></td>
        </tr>
      `));
    });
  }
  render(DB.notes);
  filter.addEventListener('change', () => {
    const val = filter.value;
    const items = val === 'all' ? DB.notes : DB.notes.filter(n => String(n.courseId) === val);
    render(items);
  });
}

// Announcements
function initAnnouncements(){
  const box = document.querySelector('#annList');
  if(!box) return;
  if(DB.announcements.length === 0){
    box.append(el(`<li class="card">No announcements.</li>`));
    return;
  }
  DB.announcements.forEach(a => {
    box.append(el(`<li class="card"><strong>${a.date}:</strong> ${a.text}</li>`));
  });
}

// Contact form (demo)
function initContact(){
  const form = document.querySelector('#contactForm');
  const out = document.querySelector('#contactOut');
  if(!form || !out) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    out.innerHTML = `Thanks, <strong>${name}</strong>! Your message has been received. (Demo only—no backend.)`;
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initCourseSearch();
  initNotes();
  initAnnouncements();
  initContact();
});
