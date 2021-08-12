local players = {}

RegisterNetEvent("webmap:updateInfo")

local function prunePlayers()
	for player, info in pairs(players) do
		if info.name ~= GetPlayerName(player) then
			players[player] = nil
		end
	end
end

local function sendFile(res, path)
	path = "webapp" .. path

	local fileData = LoadResourceFile(GetCurrentResourceName(), path)

	if not fileData then
		res.writeHead(404)
		res.send("Not found.")
		return
	end

	res.send(fileData)
end

local function sendInfo(res)
	res.send(json.encode({
		serverName = GetConvar('sv_hostname', 'Server Name'),
		time = exports.weathersync:getTime(),
		weather = exports.weathersync:getWeather(),
		wind = exports.weathersync:getWind(),
		forecast = exports.weathersync:getForecast(),
		players = players
	}))
end

AddEventHandler("playerDropped", function(reason)
	players[source] = nil
end)

AddEventHandler("webmap:updateInfo", function(playerInfo)
	players[source] = playerInfo
end)

CreateThread(function()
	while true do
		prunePlayers()

		TriggerClientEvent("webmap:updateInfo", -1)

		Wait(Config.updateInterval)
	end
end)

SetHttpHandler(function(req, res)
	local path = req.path

	if path == "/" then
		path = "/index.html"
	end

	path = path:gsub("%.%.", "")

	if path == "/info.json" then
		return sendInfo(res)
	else
		return sendFile(res, path)
	end
end)
