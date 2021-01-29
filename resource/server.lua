local Players = {}
local Updated = false

RegisterNetEvent("webmap:updateInfo")

function Log(label, message)
	local color = Config.LogColors[label] or Config.LogColors.default

	print(string.format('%s[%s] %s[%s]%s %s',
		Config.LogColors.name,
		GetCurrentResourceName(),
		color,
		label,
		Config.LogColors.default,
		message))
end

function HandleResponse(err, response, headers)
	if err ~= 200 then
		Log("error", "Update failed: " .. err)
		Updated = false
	elseif not Updated then
		Log("success", "Connected to live map")
		Updated = true
	end
end

AddEventHandler("playerDropped", function(reason)
	Players[source] = nil
end)

AddEventHandler("webmap:updateInfo", function(playerInfo)
	Players[source] = playerInfo
end)

CreateThread(function()
	while true do
		TriggerClientEvent("webmap:updateInfo", -1)

		local info = {
			time = exports.weathersync:getTime(),
			weather = exports.weathersync:getWeather(),
			players = Players
		}

		PerformHttpRequest(Config.UpdateUrl,
			HandleResponse,
			"POST",
			json.encode(info), 
			{
				["Authorization"] = Config.AuthorizationKey
			})

		Wait(Config.UpdateInterval)
	end
end)
