# PicasaOpenMap 🗺️

The PC photo management application **[Picasa](https://cs.wikipedia.org/wiki/Picasa)** was [discontinued by Google in 2015](https://picasa.google.com/). Nevertheless, it still has many users who appreciate its functions and have not found an equivalent replacement.

The application features a **Places** panel for displaying a map with photo positions and the ability to write GPS coordinates to photos ([geotagging](https://web.archive.org/web/20121217081400/http://support.google.com/picasa/answer/161869?hl=en&ref_topic=1689810)). This is implemented via a [WebView control](https://learn.microsoft.com/en-us/windows/communitytoolkit/controls/wpf-winforms/webview) that displays the local HTML page `C:\Program Files (x86)\Google\Picasa3\runtime\geotag\geopanelscript_v3.html` using Internet Explorer technology. The **[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)** was originally used to render the map. However, this API ceased supporting Internet Explorer as of version [3.48](https://developers.google.com/maps/documentation/javascript/releases#3.48.1). ❌🗺️

For several years, functionality was maintained by:
* Setting a newer version of the embedded IE in the registry for `picasa3.exe`.
* Forcing the use of an older API version in the HTML page.
* Utilizing a different library for tags.

These workarounds are described in various places, such as:
* https://www.picxl.de/picasa3-maps-fehlerbehebung/
* https://www.mysysadmintips.com/google-picasa-3-maps-module-no-longer-works-object-error/

Once the final version of the API that supported Internet Explorer vanished from Google's servers, the map stopped working completely. 💥

Since the HTML page and JavaScript reside in the Picasa installation folder (`C:\Program Files (x86)\Google\Picasa3\runtime\geotag`), specifically:
* `geopanelscript_v3.html`
* `picasa_geopanel_bin_v3.js`

It is theoretically possible to modify them to function without the Google Maps JavaScript API. ✅

Initially, I considered using the JavaScript API for [Mapy.cz](https://mapy.cz/). However, Mapy.cz switched to a REST API, meaning various JavaScript map libraries can now be [used](https://developer.mapy.cz/js-api/prechod-z-js-sdk-na-nove-rest-api/). Consequently, the most common choice for simple solutions is **[Leaflet](https://leafletjs.com/)**. 🌿

Another complication is that both Google Maps and Mapy.cz require a registered client identified by an API key. For map tiles, I chose the basic **[OpenStreetMap](https://www.openstreetmap.org/)**, which is freely available. Based on the [demo](https://leaflet-extras.github.io/leaflet-providers/preview/), I selected **[Esri.WorldImagery](https://www.esriuk.com/en-gb/content/products?esri-world-imagery-service)** for the satellite view and added a switch. 🛰️

The original JavaScript library was compressed; after reformatting, it became readable. It is non-trivial legacy JavaScript, which I had limited experience with. [ChatGPT](https://chatgpt.com/) assisted slightly. 🤖 I commented out the original `google.maps` lines and added new ones for Leaflet.

I revived the basic functionality for:
* Displaying tags of selected photos on the map. 📍
* Showing a photo preview after clicking a tag. 📸
* Selecting a photo in Picasa after clicking a preview next to a tag. 👆

**Update:** I have now also revived the options for **searching for a place** and **writing coordinates to photos** (geotagging)! 🎉 Previously, these were missing because the Google Geocoder was deprecated. Now, the app uses the **Nominatim API** for search and coordinate writing. While less critical today than in Picasa's prime—since mobile phones embed coordinates at capture time—these features are fully functional again. ✨

## Installation 🛠️

This assumes you are using the latest version of Picasa for Windows (`3.9.141.259`). If not, download [picasa39-setup.exe](https://archive.org/download/picasa-3.9.141.259/picasa39-setup.exe) and install it.  
**Administrator permissions are required.** 🔑

1. Download [PicasaOpenMap.zip](https://github.com/mpistora/PicasaOpenMap/releases/download/v1.1/PicasaOpenMap.zip).
2. In the folder `C:\Program Files (x86)\Google\Picasa3\runtime\geotag`, back up or rename the original files:
   * `geopanelscript_v3.html`
   * `picasa_geopanel_bin_v3.js`
3. Copy the files from `PicasaOpenMap.zip` into the same folder:
   * `geopanelscript_v3.html` – Modified page using Leaflet from a local file instead of the Google Maps API.
   * `picasa_geopanel_bin_v3.js` – Modified JavaScript for Leaflet and OpenStreetMap/Esri.WorldImagery (+ Search/Geotagging!).
   * `leaflet.js` – Minified Leaflet JavaScript code (version [1.9.4](https://leafletjs.com/download.html)).
   * `leaflet.css` – Leaflet stylesheet.
   * `images\layers.png` – Icon for the layer switcher.
4. Using the Registry Editor (`regedit.exe`), navigate to:  
   `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION`  
   Create a new `DWORD` entry named `picasa3.exe` with the hexadecimal value `2af9` (decimal: 11001).  
   Alternatively, run [Picasa3FEATURE_BROWSER_EMULATION.reg](https://github.com/mpistora/PicasaOpenMap/releases/download/v1.0/Picasa3FEATURE_BROWSER_EMULATION.reg). 📝

## Future 🔮

Leaflet currently [supports IE 9–11](https://leafletjs.com/#features). However, this may change in future versions, so the library is installed locally (v1.9.4) rather than fetched from a server. An internet connection is still required to download map tiles from OpenStreetMap or Esri servers. If those stop working, the URL in `picasa_geopanel_bin_v3.js` can be updated.

If anyone wishes to improve this, here are two suggestions:
* Use `leaflet-src.js` instead of `leaflet.js` for better readability. 📖
* Use `C:\Windows\System32\F12\IEChooser.exe` for debugging. 🐞

## Sample Screenshots 📷

Below are screenshots of the Map panel with OpenStreetMap and OpenTopoMap:

![OSM Image](sample/20250810-osm.png)

![Topo Image](sample/20250810-topo.png)