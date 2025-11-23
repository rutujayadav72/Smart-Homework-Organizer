document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    window.location.href = '/login.html';
    return;
  }

  const userNameSpan = document.getElementById('userName');
  const userEmailSpan = document.getElementById('userEmail');
  const classmatesList = document.getElementById('classmatesList');

  // Load profile info and classmates
  async function loadProfile() {
    try {
      // Fetch user info
      const resUser = await fetch(`/api/users/${userId}`);
      if (!resUser.ok) throw new Error("Failed to load user");
      const user = await resUser.json();
      userNameSpan.innerText = user.name;
      userEmailSpan.innerText = user.email;

      // Fetch classmates
      const resClassmates = await fetch(`/api/users/classmates?userId=${userId}`);
      if (!resClassmates.ok) throw new Error("Failed to load classmates");
      const classmates = await resClassmates.json();

      classmatesList.innerHTML = '';
      if(classmates.length === 0){
        classmatesList.innerHTML = '<li>No classmates found</li>';
      } else {
        classmates.forEach(c => {
          const li = document.createElement('li');
          li.innerText = `${c.name} (${c.email})`;
          classmatesList.appendChild(li);
        });
      }

    } catch (err) {
      console.error("Error loading profile:", err);
      classmatesList.innerHTML = '<li>Error loading classmates</li>';
    }
  }

  // SPA page switch function
  function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    const el = document.getElementById(page);
    if (el) el.classList.remove("hidden");

    // Only load profile when profile page is visible
    if (page === "profile") loadProfile();
  }

  // Expose globally for sidebar clicks
  window.showPage = showPage;

  // Optionally, auto-show profile on page load
  showPage("profile");
});
