fx_version "cerulean"
games {"gta5", "rdr3"}
rdr3_warning "I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships."

name "webmap"
author "kibukj"
description "Live map for FiveM and RedM servers"
url "https://github.com/kibook/webmap"

dependency "httpmanager" -- https://github.com/kibook/httpmanager

-- You can comment this out if you turn off Config.displayWeather
dependency "weathersync" -- https://github.com/kibook/weathersync

server_scripts {
	"config.lua",
	"server.lua"
}

client_script "client.lua"
