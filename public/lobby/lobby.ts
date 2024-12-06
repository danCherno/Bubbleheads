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


