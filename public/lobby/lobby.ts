const params = new URLSearchParams(window.location.search);
const lobby = params.get("id");

let isDragging = false;
let isResizing = false;
let dragStartPos = { x: 0, y: 0 };
let chatOffset = { x: 0, y: 0 };
let startHeight = 0;

const socket = io("http://localhost:3000");

socket.on("user-joined", (user) => {
  renderUser(user);
});

socket.on("response", (name, msg, id) => {
  addToChat(name, msg, id);
});

socket.on("user-left", (id) => {
  deleteUserElement(id);
});

socket.on("show-users", (users) => {
  users.forEach((user) => {
    renderUser(user);
  });
  console.log(users);
});

socket.on("change-position", (targetX, targetY, id) => {
  const avatarElement = document.getElementById(id) as HTMLElement;
  if (avatarElement) {
    const rect = avatarElement.getBoundingClientRect();

    const avatarWCenter = rect.width * 0.5;
    const avatarHCenter = rect.height * 0.7;
    const currentX = rect.left;
    const currentY = rect.top;

    const deltaX = targetX - currentX;
    const deltaY = targetY - currentY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const speed = 500;
    const duration = distance / speed;

    avatarElement.style.transition = `transform ${duration}s linear`;

    avatarElement.style.transform = `translate(${targetX - avatarWCenter}px, ${
      targetY - avatarHCenter
    }px)`;
  }
});

function deleteUserElement(id) {
  const userElement = document.getElementById(id) as HTMLElement;
  userElement.remove();
}

function handleClick(event) {
  if (event.target.tagName === "BUTTON" || event.target.tagName === "INPUT")
    return;

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const arenaElement = document.getElementById("arena") as HTMLElement;
  const arenaRect = arenaElement.getBoundingClientRect();

  const relativeX = mouseX - arenaRect.left;
  const relativeY = mouseY - arenaRect.top;

  socket.emit("update-position", relativeX, relativeY);
}

function renderUser(user) {
  const arenaElement = document.getElementById("arena") as HTMLElement;

  const userElement = document.createElement("div") as HTMLElement;
  const userAvatarElement = document.createElement("div") as HTMLElement;
  const userNameElement = document.createElement("p") as HTMLElement;

  console.log(user.position);
  userNameElement.innerText = user.name;
  userNameElement.classList.add("name");

  userAvatarElement.classList.add("avatar");

  userElement.classList.add("agent");
  userElement.id = user.id;

  userElement.appendChild(userAvatarElement);
  userElement.appendChild(userNameElement);

  arenaElement.appendChild(userElement);
  if (user.position) {
    const { x, y } = user.position;
    const rect = userElement.getBoundingClientRect();

    const avatarWCenter = rect.width * 0.5;
    const avatarHCenter = rect.height * 0.7;

    userElement.style.transform = `translate(${x - avatarWCenter}px, ${
      y - avatarHCenter
    }px)`;
  }
}

function addToChat(name, message: any, id: string) {
  const chatLogElement = document.getElementById(
    "chat_pastMessages"
  ) as HTMLElement;
  const avatarElement = document.getElementById(id) as HTMLElement;
  chatLogElement.innerHTML += `<h1>${name} : ${message}</h1>`;

  const bubbleChat = document.createElement("div") as HTMLElement;

  bubbleChat.classList.add("bubble");
  bubbleChat.innerHTML = `<p>${message}</p>`;
  avatarElement.appendChild(bubbleChat);

  setTimeout(() => bubbleChat.remove(), 3000);
}

function handleKeypress(event) {
  try {
    if (event.key === "Enter") {
      submit(event);
    }
  } catch (error) {
    console.error("an error has occurred ", error);
  }
}

function submit(event) {
  try {
    const chatInput = document.getElementById("chatInput") as HTMLInputElement;
    const message = chatInput.value;

    chatInput.value = "";
    socket.emit("message", message);
  } catch (error) {
    console.error("an error has occurred ", error);
  }
}

async function renderLobbyElements() {
  try {
    const appElement = document.querySelector("#content");
    if (!appElement)
      throw new Error("An error has occurred while loading the lobby");

    appElement.innerHTML = `
        <div id="arena">
            <div id="chat">
             <div id="chat_messageBox">
                    <input type="text" id="chatInput" placeholder="What is on your mind?"
                     onkeypress="handleKeypress(event)">
                </div>
            
                <div id="chat_pastMessages">
                </div>
               <div id="sizeAdjust">
             <div id="chatSize"> ↕ </div>
             <div id="chatPosition" ">
          ※
             </div>
             </div>
            </div>
        </div>
      <button id="leaveRoom" onclick="leaveRoom()">Leave Room</button>
    `;

    socket.emit("send-users");
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
  } catch (error) {
    alert(error.message);
    window.location.href = "/rooms/";
  }
}

function mouseDown(event) {
  if (event.target.id === "chatPosition") {
    isDragging = true;
    dragStartPos.x = event.clientX;
    dragStartPos.y = event.clientY;
    document.body.style.cursor = "grabbing";
  } else if (event.target.id === "chatSize") {
    isResizing = true;
    const chatLogElement = document.getElementById(
      "chat_pastMessages"
    ) as HTMLElement;
    startHeight = chatLogElement.offsetHeight;
    dragStartPos.y = event.clientY;
    document.body.style.cursor = "ns-resize";
  } else {
    handleClick(event);
  }
}

function mouseMove(event) {
  const chatElement = document.getElementById("chat") as HTMLElement;

  if (isDragging) {
    const moveX = event.clientX - dragStartPos.x + chatOffset.x;
    const moveY = event.clientY - dragStartPos.y + chatOffset.y;
    chatElement.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }

  if (isResizing) {
    const chatLogElement = document.getElementById(
      "chat_pastMessages"
    ) as HTMLElement;
    const deltaY = event.clientY - dragStartPos.y;
    const newHeight = startHeight - deltaY;
    chatLogElement.style.height = `${newHeight}px`;
  }
}

function mouseUp(event) {
  if (isDragging) {
    chatOffset.x += event.clientX - dragStartPos.x;
    chatOffset.y += event.clientY - dragStartPos.y;
  }

  isDragging = false;
  isResizing = false;
  document.body.style.cursor = "default";
}
async function leaveRoom() {
  try {
    console.log("aaaa");
    const response = await fetch("/api/rooms/leave-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message);
      socket.disconnect();

      window.location.href = "/rooms";
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
