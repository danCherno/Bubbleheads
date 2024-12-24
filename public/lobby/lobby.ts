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
socket.on("roomTheme", (theme) => {
  console.log(theme)
  setTheme(theme);
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
  moveAvatar(targetX, targetY, id);
});

document.body.style.opacity = "0";
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 300)
});

function setTheme(theme){
  const arenaElement = document.getElementById("arena") as HTMLElement;
  arenaElement.classList.remove(...arenaElement.classList);
  arenaElement.classList.add(theme);
}
function moveAvatar(targetX, targetY, id) {
  const avatarElement = document.getElementById(id) as HTMLElement;
  if (avatarElement) {
    const parentElement = avatarElement.offsetParent as HTMLElement;
    if (!parentElement) return;
  
    const avatarIcon = avatarElement.getElementsByClassName("avatar").item(0) as HTMLImageElement;
    if (!avatarIcon) return; 

    avatarIcon.style.height = "50%";
    setTimeout(() => {
      avatarIcon.style.height = "70%";
  
      const parentRect = parentElement.getBoundingClientRect();

      const targetXInPixels = (targetX / 100) * parentRect.width;
      const targetYInPixels = (targetY / 100) * parentRect.height;

      const currentTransform = window.getComputedStyle(avatarElement).transform;
      let currentX = 0;
      let currentY = 0;

      if (currentTransform !== "none") {
        const matrix = currentTransform.match(/matrix\(([^)]+)\)/);
        if (matrix) {
          const values = matrix[1].split(", ");
          currentX = parseFloat(values[4]);
          currentY = parseFloat(values[5]);
        }
      }

      const deltaX = targetXInPixels - currentX;
      const deltaY = targetYInPixels - currentY;

      const rect = avatarElement.getBoundingClientRect();
      const avatarWCenter = rect.width * 0.5;
      const avatarHCenter = rect.height * 0.7;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      const speed = 500;
      const duration = distance / speed;

      avatarElement.style.transition = `transform ${duration}s linear`;
      avatarElement.style.transform = `translate(${
        targetXInPixels - avatarWCenter
      }px, ${targetYInPixels - avatarHCenter}px)`;
    }, 200);
  }
}
function deleteUserElement(id) {
  const userElement = document.getElementById(id) as HTMLElement;
  userElement.remove();
}

function handleClick(event) {
  if (event.target.tagName === "BUTTON" || event.target.tagName === "INPUT")
    return;

  const arenaElement = document.getElementById("arena") as HTMLElement;
  const arenaRect = arenaElement.getBoundingClientRect();

  const clickX = event.clientX - arenaRect.left;
  const clickY = event.clientY - arenaRect.top;

  const relativeX = ((clickX / arenaRect.width) * 100).toFixed();
  const relativeY = ((clickY / arenaRect.height) * 100).toFixed();

  console.log(relativeX, relativeY);
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
  if (user.icon) {
    // Convert binary data to base64 string and create Data URL
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(user.icon.data.data))
    );
    const imageSrc = `data:${user.icon.contentType};base64,${base64String}`;

    const iconElement = document.createElement("img");
    iconElement.src = imageSrc;
    iconElement.classList.add("icon");
    userAvatarElement.appendChild(iconElement);
  }
  if (user.position) {
    const { x, y } = user.position;

    const parentRect = arenaElement.getBoundingClientRect();
    const rect = userElement.getBoundingClientRect();
    const avatarWCenter = rect.width * 0.5;
    const avatarHCenter = rect.height * 0.7;

    const targetX = (x / 100) * parentRect.width;
    const targetY = (y / 100) * parentRect.height;
    userElement.style.transform = `translate(${targetX - avatarWCenter}px, ${
      targetY - avatarHCenter
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
      <button hidden id="resetChatPos" onclick="resetChatPos(event)">◱</button>

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

function resetChatPos(event) {
  event.target.style.display = "none";
  const chatElement = document.getElementById("chat") as HTMLElement;
  const chatLogElement = document.getElementById("chat_pastMessages") as HTMLElement;

  chatElement.style.transform = `translate(0px, 0px)`;
  chatOffset = { x: 0, y: 0 };
  chatLogElement.style.height= "300px"
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
function isOutOfBounds(): boolean {
  const chatPositionElement = document.getElementById(
    "chatPosition"
  ) as HTMLElement;
  const arenaElement = document.getElementById("arena") as HTMLElement;
  const arenaRect = arenaElement.getBoundingClientRect();
  const chatPosRect = chatPositionElement.getBoundingClientRect();

  if (
    chatPosRect.top < 0 ||
    chatPosRect.left < 0 ||
    chatPosRect.left > arenaRect.width ||
    chatPosRect.top > arenaRect.height
  )
    return true;

  return false;
}
function mouseUp(event) {
  if (isDragging) {
    chatOffset.x += event.clientX - dragStartPos.x;
    chatOffset.y += event.clientY - dragStartPos.y;
  }
  const arenaElement = document.getElementById("resetChatPos") as HTMLElement;
  const OutOfBounds = isOutOfBounds();
  if (OutOfBounds) {
    arenaElement.style.display = "block";
  } else arenaElement.style.display = "none";

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

      document.body.style.opacity = "0";
      setTimeout(() => {
        window.location.href = "/rooms";
        document.body.style.opacity = "1";
      }, 300)
      
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
