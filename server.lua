local players = {}

RegisterNetEvent("webmap:updateInfo")

local function prunePlayers()
	for player, info in pairs(players) do
		if info.name ~= GetPlayerName(player) then
			players[player] = nil
		end
	end
end

AddEventHandler("playerDropped", function(reason)
	players[source] = nil
end)

AddEventHandler("webmap:updateInfo", function(playerInfo)
	players[source] = playerInfo
end)

Citizen.CreateThread(function()
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
			res.sendJson {
				serverName = GetConvar("sv_projectName", GetConvar("sv_hostname", "Server Name")),
				time = exports.weathersync:getTime(),
				weather = exports.weathersync:getWeather(),
				wind = exports.weathersync:getWind(),
				forecast = exports.weathersync:getForecast(),
				players = players
			}
		end
	}
})
