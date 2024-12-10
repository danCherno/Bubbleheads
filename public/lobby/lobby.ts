const socket = io("http://localhost:3000");

const chatInput = document.getElementById("chatInput") as HTMLInputElement;
const chatLogElement = document.getElementById("chat_pastMessages")as HTMLElement;
chatInput.addEventListener("keypress", handleKeypress);

function handleKeypress(event) {
  try {
    if(event.key==="Enter")
    { submit(event) }
  } catch (error) {
    console.error("an error has occurred ", error);
  }
}
function submit(event) {
  try {
    const message = chatInput.value;
    chatInput.value="";
    socket.emit("message", message);
    console.log(message);
  } catch (error) {
    console.error("an error has occurred ", error);
  }
}
socket.on("connect", (data) => {
  console.log(data); 
});
socket.on("response", (data) => {
    addToChat(data);
  });
socket.on("message", (data) => {
  console.log(data); 
});

function addToChat(message:string)
{
    chatLogElement.innerHTML+=
    `<h1>${message}</h>`;
}


async function renderLobbyElements()
{
    try
    {
        const params = new URLSearchParams(window.location.search);
        const lobby = params.get('id');

        const ifAuthorized = await fetch("/api/lobby/isAuthorized",{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lobby})
        });

        if (!ifAuthorized.ok) throw new Error("You have not been authorized to enter this lobby");

        const appElement = document.querySelector("#content");
        if (!appElement) throw new Error("An error has occurred while loading the lobby");

        const usersReq = await fetch("/api/lobby/getLobbyUsers",{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lobby})
        });
        const {users} = await usersReq.json();
     
        if (!users) throw new Error("An error has occurred while loading the lobby"); //uncomment this when lobbyUser is configured

        const messagesReq = await fetch("/api/lobby/getLobbyMessages",{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lobby})
        });
        const { messages } = await messagesReq.json();
        if (!messages) throw new Error("An error has accured while loading the lobby");

        appElement.innerHTML = `
        <div id="arena">
            ${users.map(agent => `<div class="agent"></div>`).join('')}
            <div id="chat">
                <div id="chat_pastMessages">
                    ${messages.map(message => `<h1>${message}</h1>`).join('')}
                </div>
                <div id="chat_messageBox">
                    <input type="text" placeholder="What is on your mind?">
                </div>
            </div>
        </div>
    `;
        
    }
    catch (error)
    {
        alert(error.message);
        window.location.href = "/rooms/rooms.html";
    }
}
