// Player Class: Represents a Player
class Player {
  constructor(pid, pic, name, sport, location, description) {
    this.name = name;
    this.sport = sport;
    this.location = location;
    this.description = description;
    this.pid = pid;
    this.pic = pic;
  }
}

// MatchPlay Class: Handle CRUD Operations
class MatchPlay {
  constructor(tagetEl, cpid) {
    this.tagetEl = tagetEl;
    this.cpid = cpid;
  }
  static displayPlayers() {
    document.querySelector('.player-detail').style.display = 'none';
    const players = Store.getPlayers();

    players.forEach((player) => MatchPlay.addPlayerToList(player));
  }

  static addPlayerToList(player) {
    const list = document.querySelector('#player-list');

    const row = document.createElement('tr');

    row.innerHTML = `
        <td id="pid">${player.pid}</td>
        <td><img height="25" width="25" id="profile" src=${player.pic ? player.pic : "https://i.stack.imgur.com/YQu5k.png"} alt="profile-image" /></td>
        <td>${player.name}</td>
        <td>${player.sport}</td>
        <td>${player.location.join()}</td>
        <td>${player.description ? player.description : 'Not Mentioned'}</td>
        <td><a href="#"><i class="far fa-edit"></i></a><a href="#" class="ml-5"><i class="fas fa-trash"></i></a><a href="#" class="ml-5"><i class="fas fa-eye"></i></a></td>
      `;

    list.appendChild(row);
  }

  static deletePlayer(el, editFlag) {
    if (el.classList.contains('fa-trash')) {
      console.log("del");
      el.parentElement.parentElement.parentElement.remove();
      // Remove player from store
      Store.removePlayer(el.parentElement.parentElement.parentElement.firstElementChild.textContent, true);
    }
    if (el.classList.contains('fa-edit') && editFlag) {
      console.log("del");
      el.parentElement.parentElement.parentElement.remove();
      // Remove player from store
      Store.removePlayer(el.parentElement.parentElement.parentElement.firstElementChild.textContent, false);
    }
  }

  static editPlayer(el) {
    const list = document.querySelector('#player-list');
    this.tagetEl = el;
    if (el.classList.contains('fa-edit')) {
      console.log(el.parentElement.parentElement.parentElement, 'parent element');
      var temp1 = el.parentElement.parentElement.parentElement.childNodes;
      var values = [];
      temp1.forEach((item, index) => { if (item.nodeName == 'TD') { if (item.childNodes[0].tagName == 'IMG') { values.push(item.childNodes[0].src); } else values.push(item.textContent); } });
      console.log(values, 'values');
      document.querySelector('#pid').value = values[0];
      document.querySelector('#name').value = values[2];
      // document.querySelector('#profile_photo').value = values[1];
      document.querySelector('#sport').value = values[3];
      var selresults = values[4].split(',');
      const x = document.getElementById('location');
      console.log(x, 'x');
      for (var i = 0; i < selresults.length; i++) {
        console.log(selresults[i], 'itera');
        for (var j = 0; j < x.options.length; j++) {
          if (x.options[j].text === selresults[i]) {
            console.log('inside');
            x.options[j].selected = true;
          }
        }
      }
      document.querySelector('#description').value = values[5] == 'Not Mentioned' ? null : values[5];

    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#player-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#pid').value = null;
    document.querySelector('#name').value = '';
    document.querySelector('#profile_photo').value = '';
    document.querySelector('#sport').value = '';
    document.querySelector('#location').value = '';
    document.querySelector('#description').value = '';
  }

  static displayMatchPlayers(pid) {
    let players = Store.getPlayers();
    players.forEach((ele, i) => {
      ele.locObj = Object.assign({}, ele.location); var tempSport = ele.sport.split(','); ele.sprtObj = Object.assign({}, tempSport);
      ele.locObj = Object.fromEntries(
        Object.entries(ele.locObj).map(([key, value]) => [key, value.trim().toLowerCase()])
      );
      ele.sprtObj = Object.fromEntries(
        Object.entries(ele.sprtObj).map(([key, value]) => [key, value.trim().toLowerCase()])
      );
    })
    const parentObj = players.filter(ele => ele.pid == pid);
    const pctSameValsNoDups = getPctSameXs((obj, key) => obj[key], vals => [...new Set(vals)]);

    players.map(ele => {
      ele.sportPer = (pctSameValsNoDups(parentObj[0].sprtObj, ele.sprtObj));
      ele.locPer = (pctSameValsNoDups(parentObj[0].locObj, ele.locObj));
    })

    const matchPlayers = players.filter(obj => obj.pid != pid && (obj.locPer != 0 || obj.sportPer != 0));

    matchPlayers.sort(function (a, b) {
      return b.sportPer - a.sportPer;
    });

    if (document.getElementById('matching-player-list').hasChildNodes()) {
      document.getElementById('matching-player-list').textContent = ''
    }
    if (matchPlayers.length > 0) {
      matchPlayers.forEach((player) => MatchPlay.addMatchPlayerToList(player));
    }
    else {
      const list = document.getElementById('matching-player-list');

      const row = document.createElement('tr');

      row.innerHTML = `
          <td style="width=100%">No Match Found</td>
        `;

      list.appendChild(row);
    }
    document.getElementById('player-name').textContent = parentObj[0].name;
    document.getElementById('player-pic').src = '';
    document.getElementById("player-pic").src = parentObj[0].pic != '' ? parentObj[0].pic : 'https://i.stack.imgur.com/YQu5k.png';
    document.getElementById('player-sport').textContent = parentObj[0].sport;
    document.getElementById('player-location').textContent = parentObj[0].location.join();
    document.getElementById('player-description').textContent = parentObj[0].description;

  }

  static addMatchPlayerToList(player) {
    const list = document.querySelector('#matching-player-list');


    const row = document.createElement('tr');

    row.innerHTML = `
        <td id="pid">${player.pid}</td>
        <td><img height="25" width="25" id="profile" src=${player.pic ? player.pic : "https://i.stack.imgur.com/YQu5k.png"} alt="profile-image" /></td>
        <td>${player.name}</td>
        <td>${player.sport}</td>
        <td>${player.location.join()}</td>
      `;

    list.appendChild(row);
  }

  static MatchPlayers(el) {
    if (el.classList.contains('fa-eye')) {
      MatchPlay.cpid = el.parentElement.parentElement.parentElement.firstElementChild.textContent;
      document.querySelector("#player-base-list").style.display = 'none';
      document.querySelector('.player-detail').style.display = 'block';
      console.log(MatchPlay.cpid, 'MatchPlay.cpid');
      MatchPlay.displayMatchPlayers(MatchPlay.cpid);

    }
  }
}

// Store Class: Handles Storage
class Store {
  static getPlayers() {
    let players;
    if (localStorage.getItem('players') === null) {
      players = [];
    } else {
      players = JSON.parse(localStorage.getItem('players'));
    }

    return players;
  }

  static addPlayer(player) {
    const players = Store.getPlayers();
    players.push(player);
    localStorage.setItem('players', JSON.stringify(players));
  }

  static removePlayer(pid, msg) {
    console.log("del");
    const players = Store.getPlayers();

    players.forEach((player, index) => {
      if (player.pid == pid) {
        players.splice(index, 1);
      }
    });

    localStorage.setItem('players', JSON.stringify(players));
    // Show success message
    msg ? MatchPlay.showAlert('Player Removed', 'success') : '';
  }
}

// Event: Display Players
document.addEventListener('DOMContentLoaded', MatchPlay.displayPlayers);


// Event: File Upload

document.querySelector('#profile_photo').addEventListener('change', function () {
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    localStorage.setItem('recent-image', reader.result)
  })
  reader.readAsDataURL(this.files[0]);
})

// Event: Add a Player
document.querySelector('#player-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  if (document.querySelector('#pid').value) {
    console.log(MatchPlay.tagetEl, 'MatchPlay.tagetEl');
    MatchPlay.deletePlayer(MatchPlay.tagetEl, true);
  }
  // Get form values
  const form = document.getElementById('player-form');
  const pid = document.querySelector('#pid').value ? document.querySelector('#pid').value : Math.floor(Math.random() * 1000);
  const name = document.querySelector('#name').value;
  const sport = document.querySelector('#sport').value;
  var selresults = [];
  const x = document.getElementById('location');
  for (i = 0; i < x.options.length; i++) {
    if (x.options[i].selected === true) {
      selresults.push(x.options[i].value);
    }
  }
  const location = selresults;
  console.log(location, 'location');
  const description = document.querySelector('#description').value;
  const pic = localStorage.getItem('recent-image');
  localStorage.removeItem("recent-image'");

  // Validate
  if (name === '' || sport === '' || location.length <= 0) {
    MatchPlay.showAlert('Please fill in all mandatory fields', 'danger');
  } else {
    // Instatiate player
    const player = new Player(pid, pic, name, sport, location, description);

    // Add Player to UI
    MatchPlay.addPlayerToList(player);

    // Add player to store
    Store.addPlayer(player);

    // Show success message
    MatchPlay.showAlert('Player Added', 'success');

    // Clear fields
    MatchPlay.clearFields();
  }
});

// Event: Remove a Player
document.querySelector('#player-list').addEventListener('click', (e) => {
  // Remove player from UI
  MatchPlay.deletePlayer(e.target, false);
  MatchPlay.editPlayer(e.target);
  MatchPlay.MatchPlayers(e.target);

});

//Event: Read Image file
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    var filedetails = reader.readAsDataURL(input.files[0]);
    console.log(filedetails, 'filedetails');
  }
}

//For matching Statergy
const getXs = (obj, getX) =>
  Object.keys(obj).map(key => getX(obj, key));

const getPctSameXs = (getX, filter) =>
  (objA, objB) =>
    (filter ? filter(getXs(objB, getX)) : getXs(objB, getX)).reduce(
      (numSame, x) =>
        getXs(objA, getX).indexOf(x) > -1 ? numSame + 1 : numSame,
      0
    ) / Object.keys(objA).length * 100;

//For navigating back to list
function goBack() {
  document.querySelector("#player-base-list").style.display = 'block';
  document.querySelector('.player-detail').style.display = 'none';
}

function readFile(file) {
  var reader = new FileReader();
  reader.onload = readSuccess;
  console.log('readfile1');
  function readSuccess(evt) {
    console.log('readfile2');
    localStorage.setItem('recent-image', reader.result);
  };
  reader.readAsText(file);
}

function showImage() {
  const imgurl = localStorage.getItem('recent-image');
  document.querySelector('#imgPreview').setAttribute('src', imgurl);
}