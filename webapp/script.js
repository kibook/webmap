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

/* Icons for each type of weather. */
const weatherIcons = {
	blizzard:       "❄️",
	clouds:         "⛅",
	drizzle:        "🌧️",
	fog:            "🌫️",
	groundblizzard: "❄️",
	hail:           "🌨️",
	highpressure:   "☀️",
	hurricane:      "🌀",
	misty:          "🌫️",
	overcast:       "☁️",
	overcastdark:   "☁️",
	rain:           "🌧️",
	sandstorm:      "🌪️",
	shower:         "🌧️",
	sleet:          "🌧️",
	snow:           "🌨️",
	snowlight:      "🌨️",
	sunny:          "☀️",
	thunder:        "🌩️",
	thunderstorm:   "⛈️",
	whiteout:       "❄️"
};

function dayOfWeek(day) {
	return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
}

function cardinalDirection(h) {
	if (h <= 22.5) {
		return "N";
	} else if (h <= 67.5) {
		return "NE";
	} else if (h <= 112.5) {
		return "E";
	} else if (h <= 157.5) {
		return "SE";
	} else if (h <= 202.5) {
		return "S";
	} else if (h <= 247.5) {
		return "SW";
	} else if (h <= 292.5) {
		return "W";
	} else if (h <= 337.5) {
		return "NW";
	} else {
		return "N";
	}
}

function timeToString(time) {
	return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}:${String(time.second).padStart(2, "0")}`;
}

function dayAndTimeToString(time) {
	return `${dayOfWeek(time.day)} ${timeToString(time)}`
}

function tabButtonOnClick(event) {
	document.querySelectorAll(".tab").forEach(tab => tab.style.display = "none");
	document.querySelectorAll(".tab-button").forEach(button => button.className = "tab-button");
	document.getElementById(this.getAttribute("data-tab")).style.display = "block";
	this.className = "tab-button active";
}

function updateMap() {
	fetch("info.json").then(resp => resp.json()).then(info => {
		var time = document.getElementById('time');
		var weather = document.getElementById('weather');
		var wind = document.getElementById("wind");

		time.innerHTML = dayAndTimeToString(info.time);
		weather.innerHTML = weatherIcons[info.weather];
		weather.title = info.weather;
		wind.innerHTML = cardinalDirection(info.wind.direction);

		var playerList = document.getElementById('player-list');
		var blips = document.getElementById('blips');
		var blipTags = document.getElementById('blip-tags');

		playerList.innerHTML = '';
		blips.innerHTML = '';
		blipTags.innerHTML = '';

		Object.keys(info.players).forEach(player => {
			var playerInfo = info.players[player];

			if (playerInfo) {
				var playerDiv = document.createElement('div');
				playerDiv.className = 'player';

				var playerIdDiv = document.createElement('div');
				playerIdDiv.className = 'player-id';
				playerIdDiv.innerHTML = player;

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

				playerDiv.appendChild(playerIdDiv);
				playerDiv.appendChild(playerNameDiv);
				playerDiv.appendChild(playerHealthDiv);
				playerList.appendChild(playerDiv);

				var blip = document.createElement('div');

				if (playerInfo.health == 0) {
					blip.className = 'blip dead';
				} else {
					blip.className = 'blip';
				}

				var left   = (playerInfo.coords.x + mapRadius - mapXOffset) / mapWidth * 100;
				var bottom = (playerInfo.coords.y + mapRadius - mapYOffset) / mapHeight * 100;

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

				blips.appendChild(blip);

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

				blipTags.appendChild(blipTag);
			}
		});

		var forecastDiv = document.getElementById("forecast");

		forecastDiv.innerHTML = "";

		var prevDay;

		info.forecast.forEach(entry => {
			var dayDiv = document.createElement("div");
			dayDiv.className = "forecast-day";
			if (entry.day != prevDay) {
				dayDiv.innerHTML = dayOfWeek(entry.day);
				prevDay = entry.day;
			}

			var timeDiv = document.createElement("div");
			timeDiv.className = "forecast-time";
			timeDiv.innerHTML = timeToString(entry);

			var weatherDiv = document.createElement("div");
			weatherDiv.className = "forecast-weather";
			weatherDiv.innerHTML = weatherIcons[entry.weather];
			weatherDiv.title = entry.weather;

			var windDiv = document.createElement("div");
			windDiv.className = "forecast-wind";
			windDiv.innerHTML = cardinalDirection(entry.wind);

			forecastDiv.appendChild(dayDiv);
			forecastDiv.appendChild(timeDiv);
			forecastDiv.appendChild(weatherDiv);
			forecastDiv.appendChild(windDiv);
		});
	});
}

window.addEventListener("load", event => {
	document.querySelectorAll("#tab-bar button").forEach(button => button.addEventListener("click", tabButtonOnClick));

	updateMap();
	setInterval(updateMap, updateInterval);
});
