const params = new URLSearchParams(window.location.search);
const lobby = params.get("id");

const socket = io("http://localhost:3000");
document.addEventListener("click", handleClick);

function handleClick(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  console.log(mouseX, mouseY);
  socket.emit("update-position", mouseX, mouseY);
}

socket.on("change-position", (targetX, targetY, id) => {
  const avatarElement = document.getElementById(id) as HTMLElement;
  if (avatarElement) {
    const rect = avatarElement.getBoundingClientRect();
    const currentX = rect.left;  // Current X position relative to the viewport
    const currentY = rect.top;   // Current Y position relative to the viewport
    
    const deltaX = targetX - currentX;
    const deltaY = targetY - currentY;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const speed = 1000;
    const duration = distance / speed;

    avatarElement.style.transition = `transform ${duration}s linear`;

    avatarElement.style.transform = `translate(${targetX}px, ${targetY}px)`;
  }
});

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
    console.log(message);
  } catch (error) {
    console.error("an error has occurred ", error);
  }
}

socket.on("response", (data) => {
  addToChat(data);
});
socket.on("message", (data) => {
  console.log(data);
});
socket.on("show-users", (users) => {
  const arenaElement = document.getElementById("arena") as HTMLElement;
  users.forEach((user) => {
    const userElement = document.createElement("div") as HTMLElement;
    const userAvatarElement = document.createElement("div") as HTMLElement;
    const userNameElement = document.createElement("p") as HTMLElement;

    userNameElement.innerText = user.name;
    userNameElement.classList.add("name");

    userAvatarElement.classList.add("avatar");

    userElement.classList.add("agent");
    userElement.id = user.id;
    userElement.appendChild(userAvatarElement);
    userElement.appendChild(userNameElement);

    arenaElement.appendChild(userElement);
  });
  console.log(users);
});

function addToChat(message: any) {
  const chatLogElement = document.getElementById(
    "chat_pastMessages"
  ) as HTMLElement;
  chatLogElement.innerHTML += `<h1>${message}</h>`;
}
socket.on("connect", (data) => {
  console.log(data);
});
async function renderLobbyElements() {
  try {
    const appElement = document.querySelector("#content");
    if (!appElement)
      throw new Error("An error has occurred while loading the lobby");

    // const users = [1];
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
