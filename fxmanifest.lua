fx_version "cerulean"
game "rdr3"
rdr3_warning "I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships."

dependency "weathersync"

server_scripts {
	"config.lua",
	"server.lua"
}

client_script "client.lua"
