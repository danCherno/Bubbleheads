interface Room {
  id: string;
  name: string;
  population: number;
}

function main() {
  getRooms();
  addRoomRender();
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

  const fileInput = document.getElementById('fileInput') as HTMLInputElement; // Reference the file input
  const formData = new FormData();
 
  if (!fileInput.files || fileInput.files.length === 0) {
    console.error('No file selected!');
    return;
  }

  formData.append('image', fileInput.files[0]);

 
    const response = await fetch('/api/users/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.text();
    if(response.ok)
    {
      const form = document.getElementById("uploadForm") as HTMLElement;
     
   
      form.style.animation = "retract 1s ease-out forwards";  
          }
    console.log(result);
  } catch (error) {
    console.error('Error uploading image:', error);
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
        window.location.href = '/'; 
    } else {
      console.error("Logout failed:", data.message);
      alert("Logout failed: " + data.message);
    }
  } catch (error) {
    console.error("Error during logout:", error);
    alert("An error occurred while logging out.");
  }
}
function addRoomRender() {
  const addRoomElement = document.getElementById("addRoom") as HTMLElement;
  addRoomElement.innerHTML = `<h1>Add a Room</h1>
  <input type="text" id="roomName" placeholder="write the name to the room">
  <input type="password" id="password" placeholder="room password">
  <input type="submit" onclick="addRoom(event)">`;
}

async function addRoom() {
  try {
    const userInputElement = document.getElementById("roomName") as HTMLInputElement;
    const passwordInputElement = document.getElementById("password") as HTMLInputElement;
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

    window.location.href = '/rooms';

  } catch (error) {
    console.error("error:", error);
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

async function deleteRoom(room)
{
  try {
    const response = await fetch(`/api/rooms/delete-room/${room}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.statusText}`);
    }

    window.location.href = '/rooms';
  }
  catch (error) {
    console.error("error deleting room :", error);
  }
}
function renderRoom(room, population, email) {
  try {
    const globalRoomsContainElement = document.getElementById("globalRoomsContainer") as HTMLElement;
    const personalRoomsContainElement = document.getElementById("personalRoomsContainer") as HTMLElement;
    if (!globalRoomsContainElement || !personalRoomsContainElement) throw new Error("room container element not found");


    if (room.owner && room.owner !== "admin")
    {
      if (email === room.owner)
      {
        personalRoomsContainElement.innerHTML += `
          <div class="room" id="${room._id}">
            <h1 class="room_name" onclick="handleEnterRoom('${room._id}')">${room.name}</h1>
            <div class="room_population ${population}"></div>
            <div class="room_delete" onclick="deleteRoom('${room._id}')"> X </div>
          </div>`;
      }
      else
      {
        personalRoomsContainElement.innerHTML += `
          <div class="room" id="${room._id}" onclick="handleEnterRoom('${room._id}')">
          <h1 class="room_name">${room.name}</h1>
          <div class="room_population ${population}"></div>
          </div>`;
      }
    }
    else
    {
      globalRoomsContainElement.innerHTML += ` <div class="room" id="${room._id}" onclick="handleEnterRoom('${room._id}')">
        <h1 class="room_name">${room.name}</h1>
        <div class="room_population ${population}"></div>
      </div>`;
    }

  } catch (error) {
    console.error("error rendering rooms: ", error);
  }
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

    if (isProtected)
    {
      const password = prompt("Please enter the room password");
      const passwordResponse = await fetch("/api/rooms/enter-protected-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      const { auth } = await passwordResponse.json();

      if (!auth) {
        alert("Incorrect password");
        return;
      }
    }

    window.location.href = `/lobby/?id=${id}`;

  } catch (error) {
    console.error(error);
  }
}
