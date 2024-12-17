const params = new URLSearchParams(window.location.search);
const lobby = params.get("id");

const socket = io("http://localhost:3000");
document.addEventListener("click", handleClick);

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
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const arenaElement = document.getElementById("arena") as HTMLElement;
  const arenaRect = arenaElement.getBoundingClientRect(); // Get arena position in the viewport

  const relativeX = mouseX - arenaRect.left; // Relative X inside arena
  const relativeY = mouseY - arenaRect.top; // Relative Y inside arena

  const inputElement = document.getElementById("chatInput") as HTMLElement;
  if (document.activeElement !== inputElement) {
    socket.emit("update-position", relativeX, relativeY);
  }
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
    }px)`
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
                <div id="chat_pastMessages">
                </div>
                <div id="chat_messageBox">
                    <input type="text" id="chatInput" placeholder="What is on your mind?"
                     onkeypress="handleKeypress(event)">
                </div>
            </div>
        </div>
    `;

    socket.emit("send-users");

  } catch (error) {
    
    alert(error.message);
    window.location.href = "/rooms/";
  }
}
