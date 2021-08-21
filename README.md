# RedM Web Map

Live web-based map showing the locations of players and other info about the server.

# Example

https://redm.khzae.net/map/

# Requirements

- [httpmanager](https://github.com/kibook/httpmanager)

- [weathersync](https://github.com/kibook/redm-weathersync)

# Installation

1. Copy to a directory in the `resources` folder of your RedM server.

   Example: `/var/redm/server-data/resources/[local]/webmap`

2. Add `start webmap` to `server.cfg`.

3. Access the map at `http://<server IP>:<server port>/webmap/` or `https://<owner>-<server ID>.users.cfx.re/webmap/` (**Note:** The trailing slash is necessary).
   
   Examples:
   - http://redm.khzae.net:30120/webmap/
   - https://kibukj-jqv8ok.users.cfx.re/webmap/
