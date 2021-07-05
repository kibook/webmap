# RedM Web Map

Live web-based map showing the locations of players and other info about the server.

# Example

https://redm.khzae.net/map

# Installation

1. Copy the contents of the `resource` folder to a directory in the resources folder of your RedM server.

   Example: `/var/redm/server-data/resources/[local]/webmap`

2. Copy the contents of the `webapp` folder to a directory on your HTTP server.

   Example: `/var/www/html/map`

3. Edit `config.lua` in the resource directory to set the URL of the web app and an authorization key.

   Example:
	 
	 ```lua
	 Config.UpdateUrl = "https://myserver.com/map/update.php"
	 Config.AuthorizationKey = "secret"
	 ```

4. Edit `update.php` in the web app directory to set the same authorization key at the top of the script.

   Example:

	 ```php
	 $authorization_key = "secret";
	 ```

5. Ensure the `info.json` can be read and written to by the web server:

   Example:

   ```sh
	 chown www-data:www-data info.json
	 ```

6. Add `start webmap` to `server.cfg`.
