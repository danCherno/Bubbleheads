interface Room {
  id: string;
  name: string;
  population: number;
}

function main() {
  getRooms();
  addRoomRender();
}
function addRoomRender() {
  const addRoomElement = document.getElementById("addRoom") as HTMLElement;
  addRoomElement.innerHTML = `<h1>Add a Room</h1>
  <input type="text" id="roomName" placeholder="write the name to the room">
  <input type="submit" onclick="addRoom(event)">`;
}

async function addRoom() {
  try {
    const userInputElement = document.getElementById(
      "roomName"
    ) as HTMLInputElement;
    const name = userInputElement.value;
    console.log("room name :", name);

    const response = await fetch("/api/rooms/add-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("error:", error);
  }
}

async function getRooms() {
  try {
    const response = await fetch("/api/rooms/get-room");
    const data = await response.json();
    const rooms = data.rooms;
    if (!rooms) throw new Error("something went wrong or no rooms");
    rooms.forEach((room) => {
      getPopulation(room);
    });
  } catch (error) {
    console.error("and error has occurred :", error);
  }
}
async function getPopulation(room) {
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
    console.log(populationNumber);
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
    renderRoom(room, roomsSize);
  } catch (error) {
    console.error(error);
  }
}

function renderRoom(room, population) {
  try {
    const roomsContainElement = document.getElementById(
      "roomsContainer"
    ) as HTMLElement;
    if (!roomsContainElement)
      throw new Error("no room container element found");

    roomsContainElement.innerHTML += ` <div class="room" id="${room._id}" onclick="handleEnterRoom('${room._id}')">
      <h1 class="room_name">${room.name}</h1>
      <div class="room_population ${population}"></div>
    </div>`;
  } catch (error) {
    console.error("error rendering rooms: ", error);
  }
}
async function handleEnterRoom(id) {
  try {
    const response = await fetch("/api/rooms/enter-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    console.log(data);
    if (!data.error) console.log("entered room id: ", id);
  } catch (error) {
    console.error(error);
  }
}
