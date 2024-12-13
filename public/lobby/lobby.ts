const params = new URLSearchParams(window.location.search);
const lobby = params.get("id");

const socket = io("http://localhost:3000");

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

    const users = [1];
    appElement.innerHTML = `
        <div id="arena">
            ${users.map((agent) => `<div class="agent"></div>`).join("")}
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
  } catch (error) {
    alert(error.message);
    window.location.href = "/rooms/rooms.html";
  }
}
