/* 
 <div class="room">
        <h1 class="room_name">room 1</h1>
        <div class="room_population small"></div>
      </div>
      */

const roomsContainElement = document.getElementById(
  "roomsContainer"
) as HTMLElement;
if (!roomsContainElement) console.error("no room container element found");
interface Room {
  id: string;
  name: string;
  population: number;
}

function main() {
  getRooms();
}
function getRooms() {
  //should be async when server info available from the server
  //for now using a constants
  const room1: Room = { id: crypto.randomUUID(), name: "room1", population: 5 };
  const room2: Room = {
    id: crypto.randomUUID(),
    name: "room2",
    population: 10,
  };
  const room3: Room = { id: crypto.randomUUID(), name: "room3", population: 2 };

  const room4: Room = { id: crypto.randomUUID(), name: "lalala", population: 8 };

  const allRooms: Room[] = [];
  allRooms.push(room1, room2, room3,room4);

  renderRooms(allRooms);
}

function renderRooms(Rooms) {
  roomsContainElement.innerHTML = "";
  let roomsSize;

  Rooms.forEach((room) => {
    if (room.population === 0) {
      roomsSize = "empty";
    } else if (room.population < 5) {
      roomsSize = "small";
    } else if (room.population < 7) {
      roomsSize = "medium";
    } else if (room.population < 9) {
        roomsSize = "large";
    } else {
      roomsSize = "full";
    }
    roomsContainElement.innerHTML += ` <div class="room" id="${
      room.id
    }" onclick="handleEnterRoom('${room.id}', ${parseInt(room.population)})">
        <h1 class="room_name">${room.name}</h1>
        <div class="room_population ${roomsSize}"></div>
      </div>`;
  });
}
function handleEnterRoom(id, population) {
  if (population >= 10) {
    console.log("room is full");
    return;
  }
  console.log("entered room id: ", id);
  window.location.href = `/lobby/lobby.html?id=${id}`;
}
