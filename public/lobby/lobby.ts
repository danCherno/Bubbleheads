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
        if (!appElement) throw new Error("An error has accured while loading the lobby");

        const usersReq = await fetch("/api/lobby/getLobbyUsers",{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lobby})
        });
        const {users} = await usersReq.json();
     
        if (!users) throw new Error("An error has accured while loading the lobby"); //uncomment this when lobbyUser is configured

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
