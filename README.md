# PicasaOpenMap

The PC photo management application **[Picasa](https://cs.wikipedia.org/wiki/Picasa)** was [discontinued by Google in 2015](https://picasa.google.com/). Nevertheless, it still has many users who appreciate its functions and have not found an equivalent replacement.

The application has a **Places** panel for displaying a map with photo positions and the ability to write GPS coordinates to photos ([geotagging](https://web.archive.org/web/20121217081400/http://support.google.com/picasa/answer/161869?hl=en&ref_topic=1689810)). It is implemented as a [WebView control](https://learn.microsoft.com/en-us/windows/communitytoolkit/controls/wpf-winforms/webview), which displays the local HTML page `C:\Program Files (x86)\Google\Picasa3\runtime\geotag\geopanelscript_v3.html` using Internet Explorer technology. The **[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)** was used here to display Google Maps. However, this API stopped supporting Internet Explorer as of version [3.48](https://developers.google.com/maps/documentation/javascript/releases#3.48.1).
For several years, functionality was maintained by:
* setting a newer version of the embedded IE in the registries for picasa3.exe
* setting the use of an older version of the API in the HTML page
* setting the use of a different library for tags

This is described variously on the web, e.g. at:
* https://www.picxl.de/picasa3-maps-fehlerbehebung/
* https://www.mysysadmintips.com/google-picasa-3-maps-module-no-longer-works-object-error/

Once the last version of the API that still supported Internet Explorer disappeared from Google's servers, it stopped working completely.

From the above modifications, it can be seen that the HTML page and JavaScript are in the Picasa installation, the files are in the folder `C:\Program Files (x86)\Google\Picasa3\runtime\geotag`:
* `geopanelscript_v3.html`
* `picasa_geopanel_bin_v3.js`

So it is theoretically possible to modify them to work without the Google Maps JavaScript API.

At first, I considered using the JavaScript API for the great [Mapy.cz](https://mapy.cz/). However, it turned out that Mapy.cz switched to the REST API and various JavaScript map libraries can be [used](https://developer.mapy.cz/js-api/prechod-z-js-sdk-na-nove-rest-api/). And that the most common choice for simple solutions is **[Leaflet](https://leafletjs.com/)**.

Another complication is that not only Google Maps, but also Mapy.cz, require a registered client, identified in queries using the API key.
For the source of map tiles, I chose the basic **[OpenStreetMap](https://www.openstreetmap.org/)**, which is freely available.
According to [demo](https://leaflet-extras.github.io/leaflet-providers/preview/), I chose **[Esri.WorldImagery](https://www.esriuk.com/en-gb/content/products?esri-world-imagery-service)** for the satellite map and added a switch.

The JavaScript library was in compressed form, but after reformatting it is readable. It is non-trivial and moreover old JavaScript, which I had no experience with. [ChatGPT](https://chatgpt.com/) helped me a little. I commented out the original lines with `google.maps` and added new ones for Leaflet.
I revived the basic functionality for:
* displaying tags of selected photos in the map
* displaying a preview of a photo after clicking on a tag
* selecting a photo in Picasa after clicking on a preview of a photo next to a tag

I did not revive the options for searching for a place, writing coordinates to photos, moving to another place and deleting coordinates, i.e. "geotagging". Today it is not as important as in the days of Picasa, because we take pictures with our mobile phones and the coordinates are in the photos from the moment they were created. But it could probably be fine-tuned. Someone can try it.

## Installation
This assumes you are using the latest version of Picasa for Windows `3.9.141.259`. If not, download [picasa39-setup.exe](https://archive.org/download/picasa-3.9.141.259/picasa39-setup.exe) and install it.\
Administrator permissions are required in Windows.
1. download [PicasaOpenMap.zip](https://github.com/mpistora/PicasaOpenMap/releases/download/v1.1/PicasaOpenMap.zip)
2. in the folder `C:\Program Files (x86)\Google\Picasa3\runtime\geotag`, back up or rename the original files:
* `geopanelscript_v3.html`
* `picasa_geopanel_bin_v3.js`
3. put the files from `PicasaOpenMap.zip` into the folder `C:\Program Files (x86)\Google\Picasa3\runtime\geotag`, they are:
* `geopanelscript_v3.html` - a modified page that uses Leaflet from a local file instead of the Google Maps JavaScript API
* `picasa_geopanel_bin_v3.js` - modified JavaScript for Leaflet and OpenStreetMap/Esri.WorldImagery
* `leaflet.js` - this is the minified Leaflet JavaScript code from version [1.9.4](https://leafletjs.com/download.html)
* `leaflet.css` - this is the stylesheet for Leaflet
* `images\layers.png` - icon for the layer switcher
4. using the Registry Editor application (`regedit.exe`) navigate to\
`HKEY_CURRENT_USER\SOFTWARE\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION`\
create a new `DWORD` entry with name: `picasa3.exe` and hexadecimal value: `2af9` (decimal: 11001).\
You can achieve the same by running [Picasa3FEATURE_BROWSER_EMULATION.reg](https://github.com/mpistora/PicasaOpenMap/releases/download/v1.0/Picasa3FEATURE_BROWSER_EMULATION.reg).

## Future
Leaflet currently [supports IE 9–11](https://leafletjs.com/#features). However, this may change in the next version, so the library is not downloaded from the server, but installed locally in version 1.9.4. However, an Internet connection is still necessary, for downloading map tiles from the OpenStreetMap or Esri servers. If they stop working, this can be resolved by editing the URL in `picasa_geopanel_bin_v3.js`.

If anyone wants to improve this, I have two suggestions:
* instead of `leaflet.js` use `leaflet-src.js`, which is more readable
* for debugging use `C:\Windows\System32\F12\IEChooser.exe`

## Sample Screenshot

Here are some sample screenshots of how the Map panel looks like with OpenStreetMap and OpenTopoMap:

![OSM Image](sample/20250810-osm.png)

![Topo Image](sample/20250810-topo.png)
