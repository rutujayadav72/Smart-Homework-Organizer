document.addEventListener("DOMContentLoaded", () => {

  // ----- LOGIN CHECK -----
  const userId = localStorage.getItem('userId');
  if (!userId) {
    window.location.href = '/login.html';
    return;
  }

  // ----- LOAD CALENDAR -----
  async function loadCalendar() {
    try {
      const res = await fetch(`/api/assignments/${userId}`);
      const assignments = await res.json();

      const container = document.getElementById('calendar-list');
      if (!container) return;
      container.innerHTML = '';

      // Group assignments by due date
      const grouped = {};
      assignments.forEach(a => {
        const date = new Date(a.due_date).toLocaleDateString();
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(a);
      });

      for (const date in grouped) {
        const card = document.createElement('div');
        card.className = 'calendar-card';
        card.innerHTML = `<div class="calendar-date"><h3>${date}</h3></div>`;

        grouped[date].forEach(a => {
          const diff = (new Date(a.due_date) - new Date()) / (1000*60*60*24);
          let color = 'green';
          if (diff < 1) color = 'red';
          else if (diff < 3) color = 'yellow';

          card.innerHTML += `
            <div class="card" style="border-left:8px solid ${color}">
              <h3>${a.title}</h3>
              <p><b>Subject:</b> ${a.subject}</p>
              <p>${a.notes || ''}</p>
            </div>
          `;
        });

        container.appendChild(card);
      }

    } catch (err) {
      console.error("Error loading calendar:", err);
    }
  }

  loadCalendar();
});

