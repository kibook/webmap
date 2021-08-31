local players = {}

RegisterNetEvent("webmap:updateInfo")

local function prunePlayers()
	for player, info in pairs(players) do
		if not GetPlayerEndpoint(player) then
			players[player] = nil
		end
	end
end

local function getWebmapUrl()
	local url = GetConvar("web_baseUrl", "")

	if url == "" then
		url = "http://[server IP]:[server port]/" .. GetCurrentResourceName() .. "/"
	else
		url = "https://" .. url .. "/" .. GetCurrentResourceName() .. "/"
	end

	return url
end

AddEventHandler("playerDropped", function(reason)
	players[source] = nil
end)

AddEventHandler("webmap:updateInfo", function(playerInfo)
	players[source] = playerInfo
end)

Citizen.CreateThread(function()
	print("Access the live map at: " .. getWebmapUrl())

	while true do
		prunePlayers()
		TriggerClientEvent("webmap:updateInfo", -1)
		Citizen.Wait(Config.updateInterval)
	end
end)

SetHttpHandler(exports.httpmanager:createHttpHandler {
	documentRoot = "webapp",
	routes = {
		["^/info.json$"] = function(req, res, helpers)
			local data = {}

			data.serverName = GetConvar("sv_projectName", GetConvar("sv_hostname", "Server Name"))
			data.players = players

			if GetResourceState("weathersync") == "started" then
				data.time = exports.weathersync:getTime()
				data.weather = exports.weathersync:getWeather()
				data.wind = exports.weathersync:getWind()
				data.forecast = exports.weathersync:getForecast()
			end

			res.sendJson(data)
		end,
		["^/game$"] = function(req, res, helpers)
			res.sendJson{game = GetConvar("gamename", "gta5")}
		end
	}
})
