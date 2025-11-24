document.addEventListener("DOMContentLoaded", () => {

  const userId = parseInt(localStorage.getItem("userId"), 10);
  if (!userId) {
    window.location.href = "/login.html";
    return; 
  }

 
  const form = document.getElementById("assignmentForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

   
    const title = document.getElementById("title")?.value.trim();
    const subject = document.getElementById("subject")?.value.trim();
    const due_date = document.getElementById("dueDate")?.value;
    const due_time = document.getElementById("dueTime")?.value;
    const priority = document.getElementById("priority")?.value;
    const notes = document.getElementById("notes")?.value.trim();

   
    if (!title || !subject || !due_date || !due_time || !priority) {
      const msgBox = document.getElementById("message");
      if (msgBox) {
        msgBox.style.color = "red";
        msgBox.innerText = "Please fill in all required fields.";
      }
      return;
    }

    const fullDueDate = `${due_date} ${due_time}`;
    const assignment = {
      user_id: userId,  
      title,
      subject,
      due_date: fullDueDate,
      priority,
      notes
    };

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignment)
      });

      const data = await res.json();
      const msgBox = document.getElementById("message");
      if (!msgBox) return;

      if (res.ok && data.message) {
        msgBox.style.color = "green";
        msgBox.innerText = "Assignment added successfully!";
        form.reset();
      } else {
        msgBox.style.color = "red";
        msgBox.innerText = data.message || "Error adding assignment";
      }

    } catch (err) {
      const msgBox = document.getElementById("message");
      if (msgBox) {
        msgBox.style.color = "red";
        msgBox.innerText = "Error adding assignment";
      }
      console.error("Assignment submission error:", err);
    }
  });

});
