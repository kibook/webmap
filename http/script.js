/* Map settings for RedM */
const rdr3Map = {
	width: 11820,
	height: 8660,
	xOffset: 8515,
	yOffset: 10850
};

/* Map settings for FiveM */
const gta5Map = {
	width: 12340,
	height: 12200,
	xOffset: 10390,
	yOffset: 12150
};

/* Radius of the entire in-game world. */
const mapRadius = 16000;

/* The number of in-game distance units wide the map graphic is. */
let mapWidth = 0;

/* The number of in-game distance units tall the map graphic is. */
let mapHeight = 0;

/* The number of in-game distance units the map graphic is offset from the minimum X coordinate. */
let mapXOffset = 0;

/* The number of in-game distance units the map graphic is offset from the minimum Y coordinate. */
let mapYOffset = 0;

/* How often to fetch updates to the map. */
const updateInterval = 5000;

/* URL to get configuration from. */
const configUrl = 'config.json';

/* URL to fetch server info from. */
const updateUrl = 'info.json';

/* Whether weathersync info is enabled. */
let displayWeather = false;

/* Icons for each type of weather. */
const gta5WeatherIcons = {
	blizzard:       "❄️",
	clear:          "☀️",
	clearing:       "🌦️",
	clouds:         "⛅",
	extrasunny:     "☀️",
	foggy:          "🌫️",
	halloween:      "🎃",
	neutral:        "🌧️",
	overcast:       "☁️",
	rain:           "🌧️",
	smog:           "🌫️",
	snow:           "🌨️",
	snowlight:      "🌨️",
	thunder:        "⛈️",
	xmas:           "🌨️"
};

const rdr3WeatherIcons = {
	blizzard:       "❄️",
	clouds:         "⛅",
	drizzle:        "🌦️",
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

let weatherIcons = {};

let customPoints = [];

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

function mapOnMouseMove(event) {
	var width  = event.clientX / this.offsetWidth;
	var height = Math.abs(event.clientY - this.offsetHeight) / this.offsetHeight;

	var x = width  * mapWidth  + mapXOffset - mapRadius
	var y = height * mapHeight + mapYOffset - mapRadius

	document.getElementById("coords").innerHTML = `${x.toFixed(3)}, ${y.toFixed(3)}`
}

function tabButtonOnClick(event) {
	document.querySelectorAll(".tab").forEach(tab => tab.style.display = "none");
	document.querySelectorAll(".tab-button").forEach(button => button.className = "tab-button");
	document.getElementById(this.getAttribute("data-tab")).style.display = "block";
	this.className = "tab-button active";
}

function addBlip(x, y, z, heading, blipClass, tag) {
	let blip = document.createElement('div');

	blip.className = blipClass;

	let left   = (x + mapRadius - mapXOffset) / mapWidth * 100;
	let bottom = (y + mapRadius - mapYOffset) / mapHeight * 100;

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

	blip.style.transform = `rotate(-${heading}deg)`;

	let blipTag = document.createElement('div');
	blipTag.className = 'blip-tag';
	blipTag.style.left = `${left}%`
	blipTag.style.bottom = `${bottom}%`

	if (typeof tag == 'string') {
		blipTag.innerHTML = tag;
	} else {
		tag.forEach(e => blipTag.appendChild(e));
	}

	document.getElementById('blips').appendChild(blip);
	document.getElementById('blip-tags').appendChild(blipTag);
}

function updateMap() {
	fetch(updateUrl).then(resp => resp.json()).then(info => {
		document.title = `${info.serverName} Live Map`;

		var serverName = document.getElementById('server-name');

		serverName.innerHTML = info.serverName;

		var time = document.getElementById('time');
		var weather = document.getElementById('weather');
		var wind = document.getElementById("wind");

		if (displayWeather) {
			time.innerHTML = dayAndTimeToString(info.time);
			weather.innerHTML = weatherIcons[info.weather];
			weather.title = info.weather;
			wind.innerHTML = cardinalDirection(info.wind.direction);
		}

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

				let blipClass = playerInfo.health == 0 ? 'blip dead' : 'blip';
				let heading = playerInfo.health == 0 ? 0 : playerInfo.heading;

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

				addBlip(playerInfo.coords.x, playerInfo.coords.y, playerInfo.coords.z, heading, blipClass, [blipTagPlayerName, blipTagPlayerHealth]);
			}
		});

		customPoints.forEach(point => {
			addBlip(point.x, point.y, point.z, 0, 'blip pin', point.name);
		});

		if (displayWeather) {
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
		}
	});
}

function addCustomPoint(name, x, y, z) {
	customPoints.push({name: name, x: x, y: y, z: z});
}

window.addEventListener("load", event => {
	let map = document.getElementById('map');

	map.addEventListener("mousemove", mapOnMouseMove);

	document.querySelectorAll("#tab-bar button").forEach(button => button.addEventListener("click", tabButtonOnClick));

	let url = new URL(window.location);
	let x = url.searchParams.get("x");
	let y = url.searchParams.get("y");
	let z = url.searchParams.get("z");

	if (x && y && z) {
		addCustomPoint(`${x}, ${y}, ${z}`, parseFloat(x), parseFloat(y), parseFloat(z));
	}

	fetch(configUrl).then(resp => resp.json()).then(resp => {
		if (resp.gameName == "gta5") {
			document.querySelectorAll('.tab-button').forEach(e => e.style.fontFamily = "Pricedown");
			document.body.style.backgroundColor = '#0fa8d2';
			map.style.backgroundImage = 'url("gta5/map.jpg")';

			mapWidth = gta5Map.width;
			mapHeight = gta5Map.height;
			mapXOffset = gta5Map.xOffset;
			mapYOffset = gta5Map.yOffset;

			weatherIcons = gta5WeatherIcons;
		} else {
			document.querySelectorAll('.tab-button').forEach(e => e.style.fontFamily = "Chinese Rocks");
			document.body.style.backgroundColor = '#d4b891';
			map.style.backgroundImage = 'url("rdr3/map.jpg")';

			mapWidth = rdr3Map.width;
			mapHeight = rdr3Map.height;
			mapXOffset = rdr3Map.xOffset;
			mapYOffset = rdr3Map.yOffset;

			weatherIcons = rdr3WeatherIcons;
		}

		displayWeather = resp.displayWeather;

		if (!displayWeather) {
			document.getElementById('forecast-button').remove();
			document.getElementById('weather-container').remove();
		}

		updateMap();
		setInterval(updateMap, updateInterval);
	});
});
