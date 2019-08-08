var firebaseConfig = {
  apiKey: "AIzaSyC0AZ0EksH_fLh3Psl6-LjackUmvjMzYgI",
  authDomain: "traintime-6b57d.firebaseapp.com",
  databaseURL: "https://traintime-6b57d.firebaseio.com",
  projectId: "traintime-6b57d",
  storageBucket: "",
  messagingSenderId: "21412188901",
  appId: "1:21412188901:web:4f8fa56dbae6a4f9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

//show clock
updateTime();
//update clock every 1 seconds
setInterval(updateTime, 1000);

function updateTime() {
  let dt = new Date(),
    hours = dt.getHours(),
    minutes = dt.getMinutes();
  seconds = dt.getSeconds();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  document.getElementById("time").innerText = `${hours}:${minutes}:${seconds}`;
}

document.getElementById("buttonClick").addEventListener("click", event => {
  event.preventDefault();
  let train = {
    trainName: document.getElementById("trainName").value,
    destination: document.querySelector("#destination").value.trim(),
    firstTrain: document.querySelector("#trainTime").value.trim(),
    freq: document.querySelector("#frequency").value.trim()
  };

  let newtraintime = nextTrainTime(train);
  console.log(newtraintime);
  clearData();
  database.ref("/trains").push(train);
});

database.ref("/trains").on("child_added", childSnapshot => {
  console.log(document.getElementById("resultData"));
  let trains = childSnapshot.val();

  //insert html as string to table body

  let trow = document.createElement("tr");
  let tdata = document.createElement("td");
  let tbody = document.createElement("tbody");

  let output = `<td>${trains.trainName}</td><td>${trains.destination}</td><td>${
    trains.freq
  }</td><td>${trains.nextArrival}</td><td>${
    trains.Remaining_Time
  } minutes</td>`;
  trow.innerHTML = output;
  //  tbody.appendChild(trow);
  tbody.appendChild(trow);
  console.log(tbody);
  document.getElementById("resultData").append(tbody);
});
function nextTrainTime(train) {
  // Solved Mathematically
  // Test case 2:
  // 16 - 00 = 16
  // 16 % 7 = 2 (Modulus is the remainder)
  // 7 - 2 = 5 minutes away
  // 5 + 3:16 = 3:21

  let firstTrainConverted = moment(train.firstTrain, "HH:mm").subtract(
    1,
    "years"
  );

  // let currentTime = moment().format("LLLL");

  let diffTime = moment().diff(moment(firstTrainConverted), "minutes");

  let tRemainder = diffTime % train.freq;

  let tMinutesTillTrain = train.freq - tRemainder;

  let nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log(tMinutesTillTrain);
  Object.assign(train, { Remaining_Time: tMinutesTillTrain });
  //train.minAway = tMinutesTillTrain;
  train.nextArrival = moment(nextTrain).format("hh:mm A");
  return train;
}

function clearData() {
  document.querySelector("#trainName").value = "";
  document.querySelector("#destination").value = "";
  document.querySelector("#trainTime").value = "";
  document.querySelector("#frequency").value = "";
}
