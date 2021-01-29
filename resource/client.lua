RegisterNetEvent("webmap:updateInfo")

AddEventHandler("webmap:updateInfo", function()
	local playerPed = PlayerPedId()

	TriggerServerEvent("webmap:updateInfo", {
		name = GetPlayerName(),
		coords = GetEntityCoords(playerPed),
		heading = GetEntityHeading(playerPed)
	})
end)
