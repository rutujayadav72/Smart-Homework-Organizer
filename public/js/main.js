document.addEventListener("DOMContentLoaded", () => {

  // ----- USER INFO -----
  const userId = parseInt(localStorage.getItem("userId"), 10);
  if (!userId) {
    window.location.href = "/login.html";
    return;
  }

  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";

  const userNameHeader = document.getElementById("userNameHeader");
  const userNameSpan = document.getElementById("userName");
  const userEmailSpan = document.getElementById("userEmail");

  if (userNameHeader) userNameHeader.innerText = userName;
  if (userNameSpan) userNameSpan.innerText = userName;
  if (userEmailSpan) userEmailSpan.innerText = userEmail;

  // ----- PAGE SWITCHING -----
  window.showPage = function(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    const activePage = document.getElementById(pageId);
    if (activePage) activePage.classList.remove("hidden");

    document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
    switch(pageId) {
      case "dashboard": document.getElementById("navDashboard")?.classList.add("active"); break;
      case "calendar": document.getElementById("navCalendar")?.classList.add("active"); break;
      case "chat": document.getElementById("navChat")?.classList.add("active"); break;
      case "profile": document.getElementById("navProfile")?.classList.add("active"); break;
    }

    const titles = {
      dashboard: "Welcome, " + userName,
      calendar: "Assignment Calendar",
      chat: "Chat with Classmates",
      profile: "Profile"
    };
    const pageTitleEl = document.getElementById("pageTitle");
    if (pageTitleEl) pageTitleEl.innerText = titles[pageId] || "Smart Homework Organizer";
  };

  showPage("dashboard");

  // ----- LOAD ASSIGNMENTS -----
  async function loadAssignments() {
    try {
      const res = await fetch(`/api/assignments/${userId}`);
      const assignments = await res.json();
      if (!assignments) return;

      // Update notification count for upcoming assignments
      const upcoming = assignments.filter(a => {
        const due = new Date(a.due_date);
        return due - new Date() <= 3*24*60*60*1000 && a.status === "pending";
      });
      const notifCount = document.getElementById("notifCount");
      if (notifCount) notifCount.innerText = upcoming.length;

      // Populate assignment list
      const list = document.getElementById("assignment-list");
      if (!list) return;
      list.innerHTML = "";

      assignments.forEach(a => {
        if (a.status === "completed") return;

        const div = document.createElement("div");
        div.className = "card";
        let color = "green";
        if (a.priority === "high") color = "red";
        else if (a.priority === "medium") color = "yellow";
        div.style.borderLeft = `8px solid ${color}`;

        div.innerHTML = `
          <h3>${a.title}</h3>
          <p><b>Subject:</b> ${a.subject}</p>
          <p>${a.notes || ""}</p>
          <p><b>Due:</b> ${new Date(a.due_date).toLocaleString()}</p>
          <button class="delete-btn" data-id="${a.id}">Delete</button>
        `;

        list.appendChild(div);
      });

      // Attach delete event listeners
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          if (!confirm("Are you sure you want to delete this assignment?")) return;
          try {
            await fetch(`/api/assignments/${id}`, { method: "DELETE" });
            loadAssignments(); // reload after deletion
          } catch (err) {
            console.error("Error deleting assignment:", err);
          }
        });
      });

    } catch (err) {
      console.error("Error loading assignments:", err);
    }
  }

  loadAssignments();
  setInterval(loadAssignments, 5*60*1000); // reload every 5 mins

  // ----- SHOW NOTIFICATIONS -----
  window.showNotifications = async () => {
    try {
      const res = await fetch(`/api/assignments/${userId}`);
      const assignments = await res.json();
      const upcoming = assignments.filter(a => {
        const due = new Date(a.due_date);
        return due - new Date() <= 3*24*60*60*1000 && a.status === "pending";
      });

      if (!upcoming.length) return alert("No upcoming assignments in the next 3 days!");
      let msg = "Upcoming Assignments:\n";
      upcoming.forEach(a => {
        msg += `• ${a.title} (${a.subject}) due on ${new Date(a.due_date).toLocaleString()}\n`;
      });
      alert(msg);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // ----- LOGOUT -----
  window.logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.location.href = "/login.html";
  };

});

