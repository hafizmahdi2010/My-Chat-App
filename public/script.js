(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;

  app.querySelector(".join-screen .joinChatBtn").addEventListener("click", (e) => {
    let username = app.querySelector(".join-screen input").value;
    if (username.length == 0) {
      return;
    }

    socket.emit("newuser", username);
    uname = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
    app.querySelector(".logo").innerHTML = `
    ChatRoom <b>${username}</b>
    `;
  });

  app.querySelector(".chat-screen .sendBtn").addEventListener("click", (e) => {
    let msg = app.querySelector(".chat-screen input").value;
    if (msg.length == 0) {
      return;
    }
    renderMessage("outgoing", {
      username: uname,
      text: msg
    });
    socket.emit("chat", {
      username: uname,
      text: msg
    });
    app.querySelector(".chat-screen input").value = "";
  });

  app.querySelector(".chat-screen .exitBtn").addEventListener("click", () => {
    socket.emit("exituser", uname);
    app.querySelector(".chat-screen").classList.remove("active");
    app.querySelector(".join-screen").classList.add("active");
  });

 
  socket.on("update", (data) => {
    renderMessage("update",data);
  });

  socket.on("chat", (data) => {
    renderMessage("incoming", data);
  });

  

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "outgoing") {
      let el = document.createElement("div");
      el.classList.add("message", "outgoing");
      el.innerHTML = `
       <div>
          <p class="name">You</p>
          <p class="text">${message.text}</p>
        </div>
      `;

      messageContainer.appendChild(el);
    }
    else if (type == "incoming") {
      let el = document.createElement("div");
      el.classList.add("message", "incoming");
      el.innerHTML = `
       <div>
          <p class="name">${message.username}</p>
          <p class="text">${message.text}</p>
        </div>
      `;

      messageContainer.appendChild(el);
    }
    else if (type == "update") {
      let el = document.createElement("div");
      el.classList.add("update","mt-2");
      el.innerHTML = `
       <div>
         <p class="text-[gray] text-nowrap overflow-hidden w-[90%] line-clamp-1"><b class="text-black">${message.username}</b> Is ${message.role === "left" ? "Left" : "Joined"} The Chat.</p>
        </div>
      `;

      messageContainer.appendChild(el);

      messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
  }


  const form = document.querySelector(".app form");
})();