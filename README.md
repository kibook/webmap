# RedM Web Map

Live web-based map showing the locations of players and other info about the server.

# Example

https://redm.khzae.net/map

# Installation

1. Copy to a directory in the `resources` folder of your RedM server.

   Example: `/var/redm/server-data/resources/[local]/webmap`

2. Add `start webmap` to `server.cfg`.

3. Access the map at http://localhost:30120/webmap/ (**Note:** The trailing slash is necessary).

You can alternatively install the web app portion on an external HTTP server as follows:

1. Copy the contents of the `webapp` folder to your HTTP server.

   Example: `/var/www/html/map`

2. Edit `script.js` and change the `updateUrl` constant to:

   ```
   http://localhost:30120/webmap/info.json
   ```

   If your HTTP server is on a different server than your FiveM server, replace `localhost` with the IP of the FiveM server.
