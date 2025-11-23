document.addEventListener("DOMContentLoaded", () => {

  // ----- USER INFO -----
  const userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "/login.html";
    return;
  }

  // ----- SOCKET.IO -----
  const socket = io();
  socket.emit("join", { userId });

  // ----- DOM ELEMENTS -----
  const chatWindow = document.getElementById("chatWindow");
  const chatMessage = document.getElementById("chatMessage");
  const classmateSelect = document.getElementById("classmateSelect");
  const onlineStatus = document.getElementById("onlineStatus");
  const sendBtn = document.getElementById("sendBtn");

  // ----- STATE -----
  let currentPeerId = null;
  let onlineUsers = new Set();

  // ----- LOAD CLASSMATES -----
  window.loadClassmates = async function() {
    try {
      const res = await fetch(`/api/users/classmates?userId=${userId}`);
      const classmates = await res.json();

      // Clear previous options
      classmateSelect.innerHTML = `<option value="">Select classmate</option>`;
      classmates.forEach(c => {
        const opt = document.createElement("option");
        opt.value = String(c.id); // always use string for value
        opt.textContent = c.name;
        classmateSelect.appendChild(opt);
      });

      // Reset chat window
      currentPeerId = null;
      chatWindow.innerHTML = "";
      onlineStatus.textContent = "";

    } catch(err) {
      console.error("Error loading classmates:", err);
    }
  };

  // ----- SELECT CLASSMATE -----
  classmateSelect.addEventListener("change", async () => {
    currentPeerId = classmateSelect.value;
    chatWindow.innerHTML = "";
    if (!currentPeerId) {
      onlineStatus.textContent = "";
      return;
    }

    onlineStatus.textContent = onlineUsers.has(currentPeerId) ? "Online 🟢" : "Offline ⚪";
    await loadChat();
  });

  // ----- LOAD CHAT HISTORY -----
  async function loadChat() {
    if (!currentPeerId) return;

    try {
      const res = await fetch(`/api/chat/${userId}/${currentPeerId}`);
      const messages = await res.json();

      chatWindow.innerHTML = "";
      messages.forEach(m => addMessageBubble(String(m.sender_id), m.message, m.created_at));
      scrollToBottom();

    } catch(err) {
      console.error("Error loading chat:", err);
    }
  }

  // ----- ADD MESSAGE BUBBLE -----
  function addMessageBubble(senderId, message, timestamp) {
    const bubble = document.createElement("div");
    bubble.className = senderId === userId ? "my-msg" : "peer-msg";
    const time = new Date(timestamp).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
    bubble.innerHTML = `<span>${message}</span><small class="timestamp">${time}</small>`;
    chatWindow.appendChild(bubble);
  }

  function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // ----- SEND MESSAGE -----
  window.sendMessage = () => {
    const msg = chatMessage.value.trim();
    if (!msg || !currentPeerId) return;

    // Send via socket
    socket.emit("private_message", {
      senderId: userId,
      receiverId: currentPeerId,
      message: msg
    });

    // Add own message to UI
    addMessageBubble(userId, msg, new Date());
    chatMessage.value = "";
    scrollToBottom();
  };

  sendBtn.addEventListener("click", window.sendMessage);

  // ----- RECEIVE LIVE MESSAGES -----
  socket.on("new_message", data => {
    const senderIdStr = String(data.senderId);
    if (senderIdStr !== currentPeerId && senderIdStr !== userId) return;
    addMessageBubble(senderIdStr, data.message, new Date());
    scrollToBottom();
  });

  // ----- ONLINE USERS -----
  socket.on("update_online", onlineList => {
    onlineUsers = new Set(onlineList.map(String)); // store as strings
    if (currentPeerId) {
      onlineStatus.textContent = onlineUsers.has(currentPeerId) ? "Online 🟢" : "Offline ⚪";
    }
  });

});


