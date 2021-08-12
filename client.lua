RegisterNetEvent("webmap:updateInfo")

AddEventHandler("webmap:updateInfo", function()
	local playerPed = PlayerPedId()

	TriggerServerEvent("webmap:updateInfo", {
		name = GetPlayerName(PlayerId()),
		coords = GetEntityCoords(playerPed),
		heading = GetEntityHeading(playerPed),
		health = GetEntityHealth(playerPed)
	})
end)
