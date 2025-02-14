document.addEventListener("DOMContentLoaded", function () {
  displayMessages();
});

function addMessage() {
  let name = document.getElementById("name").value.trim();
  let location = document.getElementById("location").value.trim();
  let message = document.getElementById("message").value.trim();

  if (name === "" || location === "" || message === "") {
    alert("Please fill in all fields before posting!");
    return;
  }

  let timestamp = new Date().toLocaleString();
  let pinboard = document.getElementById("pinboard");
  let pinboardRect = pinboard.getBoundingClientRect();

  let messages = JSON.parse(localStorage.getItem("messages")) || [];
  let position = calculateNotePosition(messages.length, pinboardRect);

  let messageData = {
    name,
    location,
    message,
    timestamp,
    x: position.x,
    y: position.y,
    rotation: `${Math.random() * 10 - 5}deg`,
  };

  messages.push(messageData);
  localStorage.setItem("messages", JSON.stringify(messages));

  document.getElementById("name").value = "";
  document.getElementById("location").value = "";
  document.getElementById("message").value = "";

  displayMessages();
}

function calculateNotePosition(index, pinboardRect) {
  const noteWidth = 200;
  const noteHeight = 140;
  const padding = 32;

  const notesPerRow = Math.floor(
    (pinboardRect.width - padding * 2) / (noteWidth + 20)
  );

  const row = Math.floor(index / notesPerRow);
  const col = index % notesPerRow;

  const x = padding + col * (noteWidth + 20) + (Math.random() * 20 - 10);
  const y = padding + row * (noteHeight + 40) + (Math.random() * 20 - 10);

  return { x, y };
}

function displayMessages() {
  let pinboard = document.getElementById("pinboard");
  pinboard.innerHTML = "";

  let messages = JSON.parse(localStorage.getItem("messages")) || [];

  updatePinboardHeight(messages.length);

  messages.forEach((msg, index) => {
    let note = document.createElement("div");
    note.classList.add("note");
    note.style.left = `${msg.x}px`;
    note.style.top = `${msg.y}px`;
    note.style.transform = `rotate(${msg.rotation})`;

    note.innerHTML = `
            <strong>${msg.name} from ${msg.location}</strong>
            <p>${msg.message}</p>
            <small>${msg.timestamp}</small>
        `;

    note.setAttribute("draggable", "false");
    note.dataset.index = index;

    note.onmousedown = function (event) {
      dragNote(event, note);
    };

    pinboard.appendChild(note);
  });
}

function updatePinboardHeight(numberOfMessages) {
  const pinboard = document.getElementById("pinboard");
  const pinboardRect = pinboard.getBoundingClientRect();
  const noteWidth = 200;
  const noteHeight = 140;
  const padding = 32;

  const notesPerRow = Math.floor(
    (pinboardRect.width - padding * 2) / (noteWidth + 20)
  );

  const rows = Math.ceil(numberOfMessages / notesPerRow);

  const requiredHeight = padding * 2 + rows * (noteHeight + 40);

  pinboard.style.height = `${Math.max(500, requiredHeight)}px`;
}

function dragNote(event, note) {
  let pinboard = document.getElementById("pinboard");
  let rect = note.getBoundingClientRect();
  let pinboardRect = pinboard.getBoundingClientRect();
  let shiftX = event.clientX - rect.left;
  let shiftY = event.clientY - rect.top;

  note.style.zIndex = "1000";

  function moveAt(clientX, clientY) {
    let newX = clientX - shiftX - pinboardRect.left;
    let newY = clientY - shiftY - pinboardRect.top;

    newX = Math.max(0, Math.min(pinboardRect.width - rect.width, newX));
    newY = Math.max(0, Math.min(pinboardRect.height - rect.height, newY));

    note.style.left = `${newX}px`;
    note.style.top = `${newY}px`;
  }

  function onMouseMove(event) {
    moveAt(event.clientX, event.clientY);
  }

  document.addEventListener("mousemove", onMouseMove);

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    let index = note.dataset.index;
    let messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages[index].x = parseFloat(note.style.left);
    messages[index].y = parseFloat(note.style.top);
    localStorage.setItem("messages", JSON.stringify(messages));
  }

  document.addEventListener("mouseup", onMouseUp);

  note.ondragstart = function () {
    return false;
  };

  function calculateNotePosition(index, pinboardRect) {
    const noteWidth = 180;
    const noteHeight = 140;
    const padding = 32;
    const horizontalGap = 30;
    const verticalGap = 40;

    const availableWidth = pinboardRect.width - padding * 2;

    const notesPerRow = Math.max(
      2,
      Math.floor(availableWidth / (noteWidth + horizontalGap))
    );

    const row = Math.floor(index / notesPerRow);
    const col = index % notesPerRow;

    const baseX = padding + col * (noteWidth + horizontalGap);
    const baseY = padding + row * (noteHeight + verticalGap);

    const x = baseX + (Math.random() * 10 - 5);
    const y = baseY + (Math.random() * 10 - 5);

    return { x, y };
  }

  function updatePinboardHeight(numberOfMessages) {
    const pinboard = document.getElementById("pinboard");
    const pinboardRect = pinboard.getBoundingClientRect();
    const noteWidth = 180;
    const noteHeight = 140;
    const padding = 32;
    const horizontalGap = 30;
    const verticalGap = 40;

    const notesPerRow = Math.max(
      2,
      Math.floor(
        (pinboardRect.width - padding * 2) / (noteWidth + horizontalGap)
      )
    );

    const rows = Math.ceil(numberOfMessages / notesPerRow);

    const requiredHeight = padding * 2 + rows * (noteHeight + verticalGap);

    pinboard.style.height = `${Math.max(500, requiredHeight)}px`;
  }
}
