interface Room {
  id: string;
  name: string;
  population: number;
}

document.body.style.opacity = "0";
function main() {
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 300);
  getRooms();

  renderLogOutButton();
}

function renderLogOutButton() {
  const logOutBtn = document.createElement("button") as HTMLButtonElement;
  logOutBtn.innerText = "Log Out";
  logOutBtn.id = "logOut";
  logOutBtn.addEventListener(`click`, logOut);
  document.body.appendChild(logOutBtn);
}

async function uploadImage(event) {
  try {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput") as HTMLInputElement; // Reference the file input
    const formData = new FormData();

    if (!fileInput.files || fileInput.files.length === 0) {
      console.error("No file selected!");
      return;
    }

    formData.append("image", fileInput.files[0]);

    const response = await fetch("/api/users/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.text();
    if (response.ok) {
      popupElement.innerHTML = "<h1> image uploaded successfully!</h1>";
      setTimeout(closePopup, 2300);
    }
    //console.log(result);
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

async function logOut(event) {
  try {
    const response = await fetch("/api/users/logout-user", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      document.body.style.opacity = "0";
      setTimeout(() => {
        window.location.href = "/";
        document.body.style.opacity = "1";
      }, 300);
    } else {
      console.error("Logout failed:", data.message);
      alert("Logout failed: " + data.message);
    }
  } catch (error) {
    console.error("Error during logout:", error);
    alert("An error occurred while logging out.");
  }
}
const popupElement = document.getElementById("popUp") as HTMLElement;

function changeAvatarRender(event) {
  popupElement.style.display = "flex";
  popupElement.innerHTML = `<div id="closePop" onclick="closePopup(event)">X</div>
   <form id="uploadForm" enctype="multipart/form-data" >
      <h1>upload an image for your avatar!</h1>
      <label for="fileInput" class="file-label">
        <span class="file-text">Choose an Image</span>
        <input type="file" id="fileInput" name="image" class="file-input" onchange="uploadImage(event)" />
          </label>
    </form>`;
}
function addRoomRender() {
  popupElement.style.display = "flex";
  popupElement.innerHTML = `<div id="closePop" onclick="closePopup(event)">X</div><h1>Add a Room</h1>
  <input type="text" id="roomName" placeholder="room name">
  <input type="password" id="password" placeholder="room password">
  <p>Optional</p>
  <input type="submit" onclick="addRoom(event)" value="Create">`;
}
function closePopup(event) {
  popupElement.style.display = "none";
}
function search(event) {
  const searchElement = document.getElementById("searchRoom") as HTMLElement;
  const searchBarElement = document.createElement("input") as HTMLInputElement;
  searchBarElement.type = "text";
  searchBarElement.title = "search";
  searchBarElement.style.position="relative"
  searchBarElement.style.top="-100%";
  searchBarElement.id = "searchInput";
  searchBarElement.addEventListener("blur", handleUnfocus);
    searchBarElement.addEventListener("input",handleKeyPress);
  searchElement.appendChild(searchBarElement);
  searchBarElement.focus();
}
function handleKeyPress(event){
  const searchElement = document.getElementById("searchInput") as HTMLInputElement;
  const value = searchElement.value;
  if(value==="") return;
  getRoomsSearch(value);
}
function handleUnfocus(event){
  const searchBarElement = document.getElementById("searchInput") as HTMLInputElement;
    const globalRoomsContainElement = document.getElementById(
      "globalRoomsContainer"
    ) as HTMLElement;
    const personalRoomsContainElement = document.getElementById(
      "personalRoomsContainer"
    ) as HTMLElement;
    personalRoomsContainElement.innerHTML="";
    globalRoomsContainElement.innerHTML="";
  searchBarElement.remove();
  getRooms();
  
}
async function addRoom() {
  try {
    const userInputElement = document.getElementById(
      "roomName"
    ) as HTMLInputElement;
    const passwordInputElement = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const name = userInputElement.value;
    const password = passwordInputElement.value;

    const response = await fetch("/api/rooms/add-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();

    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = "/rooms";
      document.body.style.opacity = "1";
    }, 300);
  } catch (error) {
    console.error("error:", error);
  }
}
async function getRoomsSearch(name:string) {
  try {
    const response = await fetch(`/api/rooms/get-room-search/${name}`)
    const data = await response.json();
    const rooms = data.rooms;
    const email = data.email;
    if (!rooms) throw new Error("something went wrong or no rooms");

    const globalRoomsContainElement = document.getElementById(
      "globalRoomsContainer"
    ) as HTMLElement;
    const personalRoomsContainElement = document.getElementById(
      "personalRoomsContainer"
    ) as HTMLElement;
    personalRoomsContainElement.innerHTML=""
  
    globalRoomsContainElement.innerHTML=""
    rooms.forEach((room) => {
      getPopulation(room, email);
    });
  } catch (error) {
    console.error("and error has occurred :", error);
  }
}
async function getRooms() {
  try {
    const response = await fetch("/api/rooms/get-room");
    const data = await response.json();
    const rooms = data.rooms;
    const email = data.email;
    if (!rooms) throw new Error("something went wrong or no rooms");
    rooms.forEach((room) => {
      getPopulation(room, email);
    });
  } catch (error) {
    console.error("and error has occurred :", error);
  }
}
async function getPopulation(room, email) {
  try {
    let id = room._id;
    const response = await fetch("/api/rooms/get-room-population", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    const populationNumber = data.length;
    if (!populationNumber && populationNumber != 0)
      throw new Error("an error has occurred");
    let roomsSize = "-1";
    switch (true) {
      case populationNumber === 0:
        roomsSize = "empty";
        break;
      case populationNumber < 5:
        roomsSize = "small";
        break;
      case populationNumber < 7:
        roomsSize = "medium";
        break;
      case populationNumber < 9:
        roomsSize = "large";
        break;
      default:
        roomsSize = "full";
    }
    renderRoom(room, roomsSize, email);
  } catch (error) {
    console.error(error);
  }
}

async function deleteRoom(room) {
  try {
    const response = await fetch(`/api/rooms/delete-room/${room}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.statusText}`);
    }

    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = "/rooms";
      document.body.style.opacity = "1";
    }, 300);
  } catch (error) {
    console.error("error deleting room :", error);
  }
}
function renderRoom(room, population, email) {
  try {
    const globalRoomsContainElement = document.getElementById(
      "globalRoomsContainer"
    ) as HTMLElement;
    const personalRoomsContainElement = document.getElementById(
      "personalRoomsContainer"
    ) as HTMLElement;
    if (!globalRoomsContainElement || !personalRoomsContainElement)
      throw new Error("room container element not found");

    if (room.owner && room.owner !== "admin") {
      if (email === room.owner) {
        personalRoomsContainElement.innerHTML += `
          <div class="room" id="${room._id}">
            <h1 class="room_name" onclick="handleEnterRoom('${room._id}')">${room.name}</h1>
            <div class="room_population ${population}"></div>
            <div class="room_delete" onclick="deleteRoom('${room._id}')"> X </div>
          </div>`;
      } else {
        personalRoomsContainElement.innerHTML += `
          <div class="room" id="${room._id}" onclick="handleEnterRoom('${room._id}')">
          <h1 class="room_name">${room.name}</h1>
          <div class="room_population ${population}"></div>
          </div>`;
      }
    } else {
      globalRoomsContainElement.innerHTML += ` <div class="room" id="${room._id}" onclick="handleEnterRoom('${room._id}')">
        <h1 class="room_name">${room.name}</h1>
        <div class="room_population ${population}"></div>
      </div>`;
    }
  } catch (error) {
    console.error("error rendering rooms: ", error);
  }
}
async function checkRoomPassword(event) {
  const id =event.target.id;
const passwordInputElement= document.getElementById("popPassword")as HTMLInputElement
  const password = passwordInputElement.value;
  popupElement.style.display="none";
  const passwordResponse = await fetch("/api/rooms/enter-protected-room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password }),
  });

  const { auth } = await passwordResponse.json();

  if (!auth) {
    popupElement.style.display="flex";
    popupElement.innerHTML=`<div id="closePop" onclick="closePopup(event)">X</div>
    <h1>incorrect password</h1>
    <button onclick="closePopup(event)>OK</button>`
    return;
  }

  enterRoom(id);
}
function enterRoom(id)
{
  document.body.style.opacity = "0";
setTimeout(() => {
  window.location.href = `/lobby/?id=${id}`;
  document.body.style.opacity = "1";
}, 300);
}
async function handleEnterRoom(id) {
  try {
    await fetch("/api/rooms/leave-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const testResponse = await fetch("/api/rooms/enter-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const { isProtected } = await testResponse.json();

    if (isProtected) {
      popupElement.style.display="flex";
      popupElement.innerHTML=`<div id="closePop" onclick="closePopup(event)">X</div>
      <h1>Enter password</h1>
      <input type="password" title="password" id="popPassword">
      <input type="submit" id="${id}" onclick="checkRoomPassword(event)" value="Enter">`;
      
      return;
  }
  enterRoom(id)
  } catch (error) {
    console.error(error);
  }
}
