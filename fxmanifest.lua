fx_version "cerulean"
games {"gta5", "rdr3"}
rdr3_warning "I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships."

dependency "httpmanager"
dependency "weathersync"

server_scripts {
	"config.lua",
	"server.lua"
}

client_script "client.lua"
