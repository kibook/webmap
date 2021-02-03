/* Radius of the entire in-game world. */
const mapRadius = 16000;

/* The number of in-game distance units wide the map graphic is. */
const mapWidth = 11820;

/* The number of in-game distance units tall the map graphic is. */
const mapHeight = 8660;

/* The number of in-game distance units the map graphic is offset from the minimum X coordinate. */
const mapXOffset = 8515;

/* The number of in-game distance units the map graphic is offset from the minimum Y coordinate. */
const mapYOffset = 10850;

/* How often to fetch updates to the map. */
const updateInterval = 5000;

function dayOfWeek(day) {
	return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
}

function timeToString(time) {
	return `${dayOfWeek(time.day)} ${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:${String(time.second).padStart(2, '0')}`
}

function updateMap() {
	fetch("info.json").then(resp => resp.json()).then(info => {
		var time = document.getElementById('time');
		var weather = document.getElementById('weather');

		time.innerHTML = timeToString(info.time);
		weather.innerHTML = info.weather.icon;
		weather.title = info.weather.name;

		var playerList = document.getElementById('player-list');
		var blips = document.getElementById('blips');

		playerList.innerHTML = '';
		blips.innerHTML = '';

		Object.keys(info.players).forEach(player => {
			var playerInfo = info.players[player];

			if (playerInfo) {
				var playerDiv = document.createElement('div');
				playerDiv.className = 'player';

				var playerNameDiv = document.createElement('div');
				playerNameDiv.className = 'player-name';
				playerNameDiv.innerHTML = playerInfo.name;

				var playerHealthDiv = document.createElement('div');
				playerHealthDiv.className = 'player-health';

				var playerHealthIconDiv = document.createElement('div');
				playerHealthIconDiv.className = 'player-health-icon';
				playerHealthIconDiv.innerHTML = '<i class="fas fa-heart"></i>';

				var playerHealthValueDiv = document.createElement('div');
				playerHealthValueDiv.className = 'player-health-value';
				playerHealthValueDiv.innerHTML = playerInfo.health;

				playerHealthDiv.appendChild(playerHealthIconDiv);
				playerHealthDiv.appendChild(playerHealthValueDiv);

				playerDiv.appendChild(playerNameDiv);
				playerDiv.appendChild(playerHealthDiv);
				playerList.appendChild(playerDiv);

				var blip = document.createElement('div');

				if (playerInfo.health == 0) {
					blip.className = 'blip dead';
				} else {
					blip.className = 'blip';
				}

				var left    = (playerInfo.coords.x + mapRadius - mapXOffset) / mapWidth * 100;
				var bottom  = (playerInfo.coords.y + mapRadius - mapYOffset) / mapHeight * 100;

				if (left < 0) {
					left = 0;
				} else if (left > 100) {
					left = 100;
				}

				if (bottom < 0) {
					bottom = 0;
				} else if (bottom > 100) {
					bottom = 100;
				}

				blip.style.left = `${left}%`;
				blip.style.bottom = `${bottom}%`;

				if (playerInfo.health > 0) {
					blip.style.transform = `rotate(-${playerInfo.heading}deg)`;
				}

				var blipTag = document.createElement('div');
				blipTag.className = 'blip-tag';
				blipTag.style.left = `${left}%`
				blipTag.style.bottom = `${bottom}%`

				var blipTagPlayerName = document.createElement('div');
				blipTagPlayerName.className = 'player-name';
				blipTagPlayerName.innerHTML = playerInfo.name;

				var blipTagPlayerHealth = document.createElement('div');
				blipTagPlayerHealth.className = 'player-health';

				var blipTagPlayerHealthIcon = document.createElement('div');
				blipTagPlayerHealthIcon.className = 'player-health-icon';
				blipTagPlayerHealthIcon.innerHTML = '<i class="fas fa-heart"></i>';

				var blipTagPlayerHealthValue = document.createElement('div');
				blipTagPlayerHealthValue.className = 'player-health-value';
				blipTagPlayerHealthValue.innerHTML = playerInfo.health;

				blipTagPlayerHealth.appendChild(blipTagPlayerHealthIcon);
				blipTagPlayerHealth.appendChild(blipTagPlayerHealthValue);

				blipTag.appendChild(blipTagPlayerName);
				blipTag.appendChild(blipTagPlayerHealth);

				blips.appendChild(blip);
				blips.appendChild(blipTag);
			}
		});
	});
}

window.addEventListener("load", event => {
	updateMap();
	setInterval(updateMap, updateInterval);
});
