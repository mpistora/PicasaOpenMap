// =====================================================================
//  PicasaOpenMap - geotag editing
//  Restores the editing features of the Picasa Places panel on top of the
//  Leaflet port: "add a place" button, drag & drop of photos from Picasa,
//  moving an existing marker, erasing coordinates, and place search
//  (via Nominatim / OpenStreetMap instead of the Google geocoder).
//  Changes compared to the Leaflet port are marked with  // [geotag]
// =====================================================================

var picasa = picasa || {};

// [geotag] Set to true to show a diagnostic log at the bottom of the map.
picasa.DEBUG = false;

// [geotag] Initial map view when no geotagged photo is selected
//          (the original Google version used the USA: [40.979898, -98.261719], zoom 4).
picasa.DEFAULT_CENTER = [40.979898, -98.261719];
picasa.DEFAULT_ZOOM = 4;

picasa._debugLines = [];
picasa.debugShow = function (a) {
  try {
    if (undefined !== a) {
      picasa._debugLines.push(String(a));
      if (picasa._debugLines.length > 60) picasa._debugLines.shift();
    }
    if (!document.body) return; // shown later, on page load
    var div = document.getElementById('debugDiv');
    if (!div) {
      div = document.createElement('div');
      div.id = 'debugDiv';
      div.style.cssText =
        'position:absolute;bottom:0;left:0;right:0;max-height:40%;overflow-y:auto;' +
        'background:#ffffff;opacity:0.9;font:10px Consolas,monospace;z-index:10000;' +
        'padding:2px;white-space:pre-wrap;border-top:1px solid #999;';
      document.body.appendChild(div);
    }
    div.textContent = picasa._debugLines.join('\n');
    div.scrollTop = div.scrollHeight;
  } catch (e) {}
};
picasa.initLog =
  picasa.initLog ||
  function () {
    picasa.log = function (a) {
      try {
        'undefined' !== typeof console && null !== console && window.console.log(a);
      } catch (e) {}
      picasa.DEBUG && picasa.debugShow(a);
    };
  };
showError = function(l) {
  return (
    picasa.log('Error: ' + l + (l && l.stack ? '\n' + l.stack : '')),
    !1
  );
};
picasa.initLog();
// [geotag] Also log uncaught JavaScript errors
//          (and forward them to the diagnostic collector of the HTML page).
picasa._prevOnError = window.onerror;
window.onerror = function (msg, url, line, col) {
  picasa.log('JS error: ' + msg + ' (line ' + line + (col ? ':' + col : '') + ')');
  return picasa._prevOnError ? picasa._prevOnError.apply(this, arguments) : false;
};
picasa.log('geotag script loaded - IE document mode: ' + document.documentMode + ' - Leaflet: ' + (window.L ? L.version : 'missing'));

var picasaInfoWindow$style = function (a, b, d, c) {
    picasa.log('picasaInfoWindow$style -  a: ' + a + ', b: ' + b + ', d: ' + d + ', c: ' + c);
    this.bottomImage_ = a;
    this.bottomImageSize_ = b;
    this.styleClass_ = d;
    this.infoWindowOffsetX_ = c;
    this.browserAdjustment_ = 0;
    a = navigator.userAgent.toLowerCase();
    b = 5; -
    1 < a.indexOf('macintosh') && (b = 4); -
    1 < a.indexOf('msie') && 1 > a.indexOf('opera') && (b = 0);
    this.browserAdjustment_ = b;
  };
var picasaInfoWindow$window = L.Layer.extend({

  initialize: function (a, b) {
    picasa.log('picasaInfoWindow$window -  a: ' + a + ', b: ' + b);
    this.doc_ = a;
    this.style_ = b;
    this.infoWindowWidth_ = 180;
    this.isIE_ = this.visible_ = !1;
    this.autoPanning_ = !0;
    this.infoWindowOffset_ = L.point(0, 0);
    var d = navigator.userAgent.toLowerCase();
    this.isIE_ = -1 < d.indexOf('msie') && 1 > d.indexOf('opera');
    this.infoWindowDiv_ = this.createInfoWindowDiv(this.infoWindowWidth_);
    this.bottomImageDiv_ = this.createInfoWindowDiv(this.style_.bottomImageSize_.width);
    // [geotag] A click inside the info window (OK, Cancel...) must not be seen as a click on the map.
    L.DomEvent.disableClickPropagation(this.infoWindowDiv_);
    L.DomEvent.disableClickPropagation(this.bottomImageDiv_);

    L.setOptions(this, { pane: 'popupPane' });
  },

  AttachToMap: function (a) {
    picasa.log('picasaInfoWindow$window.AttachToMap -  a: ' + a);
    null != this.map_ &&
      (picasa.log(
          'implicit detach in picasaInfoWindow.window.prototype.AttachToMap'
        ),
        this.DetachFromMap());
    this.map_ = a;
    this.addTo(a);
  },
  DetachFromMap: function () {
    picasa.log('picasaInfoWindow$window.DetachFromMap');
    this.setShow(!1);
    this.remove();
    this.map_ = null;
  },
  onAdd: function () {
    picasa.log('picasaInfoWindow$window.onAdd');
    var a = this.getPane();
    a.appendChild(this.infoWindowDiv_);
    a.appendChild(this.bottomImageDiv_);

    this.map_.on('zoomend viewreset', this.draw, this);
  },
  createInfoWindowDiv: function (a) {
    picasa.log('picasaInfoWindow$window.createInfoWindowDiv -  a: ' + a);
    var b = this.doc_.createElement('div');
    b.style.position = 'absolute';
    b.style.width = a + 'px';
    return b;
  },
  setPosition: function (a, b, d) {
    a.style.left = b + 'px';
    a.style.bottom = d + 'px';
  },
  onRemove: function () {
    picasa.log('picasaInfoWindow$window.onRemove');
    this.infoWindowDiv_ &&
      this.infoWindowDiv_.parentNode &&
      this.infoWindowDiv_.parentNode.removeChild(this.infoWindowDiv_);
    this.bottomImageDiv_ &&
      this.bottomImageDiv_.parentNode &&
      this.bottomImageDiv_.parentNode.removeChild(this.bottomImageDiv_);
    this.visible_ = !1;

    this.map_.off('zoomend viewreset', this.draw, this);
  },
  copy: function () {
    return new picasaInfoWindow$window(this.doc_, this.style_);
  },
  draw: function () {
    if (this.visible_ && this.map_) {
      var a = this.map_.latLngToLayerPoint(this.markerPoint_);
      this.setPosition(
        this.bottomImageDiv_,
        a.x + this.infoWindowOffset_.x,
        -a.y + this.infoWindowOffset_.y - this.style_.browserAdjustment_
      );
      this.setPosition(
        this.infoWindowDiv_,
        a.x + this.infoWindowOffset_.x + this.style_.infoWindowOffsetX_,
        -a.y + this.infoWindowOffset_.y + this.style_.bottomImageSize_.height - 1
      );
    }
  },
  openInfoWindowOnMarker: function (a, b) {
    var d = L.point(a.getIcon().options.iconAnchor),
      c = L.point(5, 1);
    this.openInfoWindow(
      a.getLatLng(),
      b,
      L.point(d.x - c.x, d.y - c.y)
    );
  },
  openInfoWindow: function (a, b, d) {
    picasa.log('picasaInfoWindow$window.openInfoWindow -  a: ' + a);
    this.infoWindowDiv_ &&
      ((this.infoWindowOffset_ = d || L.point(0, 0)),
        (this.markerPoint_ = a),
        (a = []),
        a.push('<div class="'),
        a.push(this.style_.styleClass_),
        a.push('"><nobr>'),
        a.push(b),
        a.push('</nobr></div>'),
        (this.infoWindowDiv_.innerHTML = a.join('')),
        (a = []),
        a.push('<img src="'),
        a.push(this.style_.bottomImage_),
        a.push('" width="'),
        a.push(this.style_.bottomImageSize_.width.toString()),
        a.push('" height="'),
        a.push(this.style_.bottomImageSize_.height.toString()),
        a.push('">'),
        (this.bottomImageDiv_.innerHTML = a.join('')),
        this.setShow(!0),
        this.draw());
  },
  setShow: function (a) {
    this.visible_ = a;
    this.infoWindowDiv_ &&
      ((this.infoWindowDiv_.style.display = a ? '' : 'none'),
        (this.bottomImageDiv_.style.display = a ? '' : 'none'));
  },
  isHidden: function () {
    return !this.visible_;
  },
  setAutoPanning: function (a) {
    this.autoPanning_ = a;
  }
});
window['picasaInfoWindow.remove'] = picasaInfoWindow$window.prototype.remove;
window['picasaInfoWindow.copy'] = picasaInfoWindow$window.prototype.copy;
window['picasaInfoWindow.draw'] = picasaInfoWindow$window.prototype.draw;
window['picasaInfoWindow.setShow'] = picasaInfoWindow$window.prototype.setShow;
window['picasaInfoWindow.setAutoPanning'] = picasaInfoWindow$window.prototype.setAutoPanning;

'undefined' === typeof Array.prototype.indexOf &&
  (Array.prototype.indexOf = function (a, b) {
    for (var d = b || 0, c = this.length; d < c; d++)
      if (this[d] === a) return d;
    return -1;
  });
// Default texts (Picasa may override them with localized strings in initialize()).
var tcSearchTip = 'Search for these photos in Picasa',
  tcEraseButton = 'Erase location info',
  tcEraseTip = 'Erase map coordinates(i.e., GPS information) from these photos',
  tcCloseTip = 'Close this window',
  tcPhotoHere = '1 photo here:',
  tcPhotosHere = '%d photos here:',
  tcMovePhoto = 'Move photo here?',
  tcMovePhotos = 'Move %d photos here?',
  tcPutPhoto = 'Put photo here?',
  tcPutPhotos = 'Put %d photos here?',
  tcOk = 'OK',
  tcCancel = 'Cancel';
picasa.maptypes = [
  'OpenStreetMap',
  'Esri.WorldImagery',
];
function Size(width, height) {
  this.width = width;
  this.height = height;
};

// [geotag] Equivalent of google.maps.LatLng.toUrlValue(): "lat,lng" rounded to 6 decimals.
picasa.toUrlValue = function (ll) {
  ll = L.latLng(ll).wrap();
  var r = function (x) {
    return Math.round(x * 1e6) / 1e6;
  };
  return r(ll.lat) + ',' + r(ll.lng);
};
// [geotag] Adds a cache-busting parameter, except for data: URL thumbnails.
picasa.thumbSrc_ = function (url) {
  return 'data:' == url.substr(0, 5) ? url : url + '?' + new Date().getTime();
};

var picasa$geoPanelClass = function (a, b, d, c, e) {
  this.map_ = a;
  this.geocoder_ = e;
  this.searchMarkerOptions_ = {
    icon: d,
    draggable: !0
  };
  this.allMarkers_ = L.featureGroup();
  this.MarkerPicasaData_ = [];
  this.regularMarkerOptions_ = {
    icon: b,
    draggable: !0
  };
  this.panSize_ = new Size(0, 0);
  this.infoWindow_ = c;
  a = L.popup().setLatLng(L.latLng(0, 0));
  a.draw = function () {};
  this.hiddenOverlay_ = a;
  this.followMove_ = null;
  this.followClick_ = null;
  this.pendingMarker_ = null;  // [geotag] marker waiting for confirmation (OK/Cancel window open)
  this.pendingMessage_ = '';
  this.infoWindow_ &&
    (this.infoWindow_.DetachFromMap(), this.infoWindow_.AttachToMap(this.map_));
};
picasa$geoPanelClass.prototype.searchMarker_ = null;
picasa$geoPanelClass.prototype.searchMarkerPicasaData_ = null;
picasa$geoPanelClass.prototype.SetMarkerPicasaData = function (a, b) {
  if (this.searchMarker_ === a) return (this.searchMarkerPicasaData_ = b), !0;
  var d = this.allMarkers_.hasLayer(a) ? this.allMarkers_.getLayerId(a) : -1;
  if (-1 === d)
    return (
      picasa.log('SetMarkerPicasaData - Marker not found in allMarkers_ ' + a.getLatLng()),
      !1
    );
  this.MarkerPicasaData_[d] = b;
  return !0;
};
picasa$geoPanelClass.prototype.GetMarkerPicasaData = function (a) {
  if (null === a || undefined === a) return picasa.log('GetMarkerPicasaData(null)'), null;
  if (this.searchMarker_ === a) return this.searchMarkerPicasaData_;
  var b = this.allMarkers_.hasLayer(a) ? this.allMarkers_.getLayerId(a) : -1;
  if (-1 === b)
    return (
      picasa.log('GetMarkerPicasaData - Marker not found in allMarkers_ ' + a.getLatLng()),
      null
    );
  return this.MarkerPicasaData_[b];
};
picasa$geoPanelClass.prototype.currBounds_ = null;
picasa$geoPanelClass.prototype.timeoutID_ = 0;
picasa$geoPanelClass.prototype.panning_ = !1;
picasa$geoPanelClass.prototype.currNumSelected_ = 0;
picasa.geoPanelData = null;
var picasa$markerData = function (a, b, d, c, e) {
  this.checksum_ = a;
  this.index_ = b;
  this.thumburl_ = d || '';
  this.original_latlng_ = c;
  this.num_photos_ = e;
};
picasa$markerData.prototype.MarkerMoved = function (a) {
  return null === this.original_latlng_ ? !0 : !this.original_latlng_.equals(a);
};

function picasa_initialize(a, b, d, c, e) {
  picasa.initLog();
  picasa.log('initialize');
  document.getElementById('errorDiv').innerHTML = b;
  document.getElementById('searchErrorDiv').innerHTML = d;
  document.getElementById('addMarker').setAttribute('alt', c);
  document.getElementById('addMarker').setAttribute('title', c);
  var h;
  try {
    try {
      eval(e);
    } catch (f) {}

    // Windows7: if tiles won't load, try openstreetmap.de instead
    //   https://leaflet-extras.github.io/leaflet-providers/preview/
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    });
    var sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      minZoom: 0,
      maxZoom: 19,
      attribution: '&copy; Powered by Esri'
    });
    var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '&copy; OpenStreetMap'
    });

    h = L.map('map_canvas', { zoomControl:false, zoomAnimation:false, fadeAnimation:false, markerZoomAnimation:false, layers:[osm]}).setView(picasa.DEFAULT_CENTER, picasa.DEFAULT_ZOOM);
    var baseMaps = {
      "OpenStreetMap": osm,
      "OpenTopoMap": topoMap,
      "Esri.WorldImagery": sat
    };

    L.control.layers(baseMaps).addTo(h);
    L.control.zoom().addTo(h);
    L.control.scale().addTo(h);

    // [geotag] The "add a place" button becomes a Leaflet control below the zoom buttons
    //          (the Leaflet port detached it from the page, so it was invisible).
    var AddMarkerControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function () {
        var box = L.DomUtil.create('div', 'leaflet-bar picasa-addmarker');
        var k = document.getElementById('addMarkerDiv');
        k.style.position = 'static';
        k.style.display = 'block';
        box.appendChild(k);
        L.DomEvent.disableClickPropagation(box);
        return box;
      }
    });
    new AddMarkerControl().addTo(h);
    // [geotag] Click on the map: moves the marker that is waiting for confirmation.
    h.on('click', function (ev) {
      picasa.handleMapClick_(ev);
    });

    b = L.icon({
      iconUrl: 'mm_20_red.png',
      iconSize: [12, 20],
      iconAnchor: [6, 20],
      popupAnchor: [5, 1],
      shadowUrl: 'mm_20_shadow.png',
      shadowSize: [22, 20]
    });
    d = L.icon({
      iconUrl: 'mm_20_green.png',
      iconSize: [12, 20],
      iconAnchor: [6, 20],
      popupAnchor: [5, 1],
      shadowUrl: 'mm_20_shadow.png',
      shadowSize: [22, 20]
    });
    var k = new picasaInfoWindow$style(
        'bottom_image.gif',
        new Size(24, 24),
        'info_window_bottom_image',
        -50
      ),
      m = new picasaInfoWindow$window(document, k);
    picasa.geoPanelData = new picasa$geoPanelClass(
      h,
      b,
      d,
      m,
      null // the Google geocoder is replaced by Nominatim (see picasa.search)
    );
    picasa.scriptQueue.scheduleQueueProcessing();
  } catch (l) {
    return showError(l);
  }
  document.getElementById('errorDiv').style.display = 'none';
  document.getElementById('addMarkerDiv').style.display = 'block';
  return !0;
}

// [geotag] Sends a marker's info to Picasa through the hidden div.
picasa.notifyMarker_ = function (marker, data) {
  var b = document.getElementById('hiddenDiv');
  b &&
    (b.setAttribute('checksum', data.checksum_.toString()),
      b.setAttribute('latlng', picasa.toUrlValue(marker.getLatLng())),
      b.setAttribute('markindex', data.index_.toString()),
      picasa.notifyPicasa('hiddenDiv'));
};
picasa.handleClick = function () {
  var a = picasa.geoPanelData.GetMarkerPicasaData(this);
  picasa.log('handleClick - data: ' + (a ? a.checksum_ : 'null'));
  if (a)
    if (0 < a.thumburl_.length)
      picasa.openMarkerInfoWindow(this, '', 'Place photos to this new mark');
    else
      picasa.notifyMarker_(this, a);
};
picasa.handleDragStart = function () {
  picasa.log('handleDragStart');
  picasa.geoPanelData.infoWindow_.setShow(!1);
  // [geotag] green marker while dragging (as in the Google version)
  this.setIcon(picasa.geoPanelData.searchMarkerOptions_.icon);
};
picasa.handleDragEnd = function () {
  var a = picasa.geoPanelData.GetMarkerPicasaData(this);
  picasa.log('handleDragEnd - ' + picasa.toUrlValue(this.getLatLng()));
  if (a)
    if (0 < a.thumburl_.length)
      picasa.openMarkerInfoWindow(this, '', 'Place photos to this new mark');
    else
      picasa.notifyMarker_(this, a);
};
// [geotag] Until OK is clicked, a click on the map moves the pending marker
//          (new place or dragged existing marker) and refreshes the info window.
picasa.handleMapClick_ = function (ev) {
  var g = picasa.geoPanelData;
  if (!g || g.followMove_) return; // the "follow the mouse" mode already handles this click
  var mk = g.pendingMarker_;
  if (!mk || !g.map_.hasLayer(mk)) return;
  picasa.log('map click: marker moved to ' + picasa.toUrlValue(ev.latlng));
  mk.setLatLng(ev.latlng);
  picasa.openMarkerInfoWindow(mk, '', g.pendingMessage_);
};
// [geotag] Called when OK is clicked: the marker is no longer pending.
picasa.confirmed_ = function () {
  picasa.log('OK clicked');
  picasa.geoPanelData && (picasa.geoPanelData.pendingMarker_ = null);
};
picasa.cancelMarker = function (a) {
  picasa.log('cancelMarker - ' + a);
  var g = picasa.geoPanelData;
  g.infoWindow_.setShow(!1);
  g.pendingMarker_ = null;
  a = Number(a);
  // [geotag] Cancel on a new place: remove the green marker.
  if (-1 === a) {
    picasa.removeSearchMarker();
    return;
  }
  if (g.map_ && g.allMarkers_.hasLayer(a)) {
    var mk = g.allMarkers_.getLayer(a);
    var b = g.GetMarkerPicasaData(mk);
    null !== b &&
      (mk.setIcon(g.regularMarkerOptions_.icon),
        b.MarkerMoved(mk.getLatLng()) &&
        (mk.setLatLng(b.original_latlng_), g.map_.panTo(b.original_latlng_)));
  }
};

// [geotag] Rewritten for readability. Two cases:
//   - new place or moved marker -> "Put/Move photo here?" + OK (geotag: link) / Cancel
//   - existing marker           -> thumbnail + "Erase location info" button (cleargeotag: link)
picasa.openMarkerInfoWindow = function (marker, address, message) {
  var g = picasa.geoPanelData;
  var data = g.GetMarkerPicasaData(marker);
  picasa.log('openMarkerInfoWindow - message: ' + message + ', data: ' + (data ? data.checksum_ : 'null'));
  if (null === marker || null === data || !data.thumburl_ || 0 == data.thumburl_.length) return;
  var html = [];
  var thumb = picasa.thumbSrc_(data.thumburl_);
  var showLink = -1 != data.checksum_ ? '"showphotos:' + data.checksum_ + '"' : '';
  var thumbHtml = showLink ?
    '<a href=' + showLink + ' title="' + tcSearchTip + '"><img src="' + thumb + '"></a>' :
    '<img src="' + thumb + '">';
  var pos = marker.getLatLng();

  if (marker === g.searchMarker_ || data.MarkerMoved(pos)) {
    g.pendingMarker_ = marker;
    g.pendingMessage_ = message || 'Place photos to this new mark';
    var title = -1 != data.index_ ?
      (1 < data.num_photos_ ? tcMovePhotos : tcMovePhoto) :
      (1 < data.num_photos_ ? tcPutPhotos : tcPutPhoto);
    1 < data.num_photos_ && (title = title.replace('%d', data.num_photos_.toString()));
    // Picasa intercepts this link to write the coordinates into the photos.
    var geotagLink = '"geotag:' + data.checksum_ + ',' + picasa.toUrlValue(pos) + '"';
    picasa.log('OK link: ' + geotagLink);
    html.push('<table border="0" cellpadding="1" cellspacing="2" width="180">');
    html.push('<tr><td colspan="2" width="100%" class="info_window_title" nowrap>' + title + '</td></tr>');
    html.push('<tr><td colspan="2"><div class="info_window_thumb">' + thumbHtml + '</div></td></tr>');
    html.push('<tr>');
    html.push('<td width="50%"><a href=' + geotagLink + ' onclick="picasa.confirmed_()"><div class="info_window_footer_button">' + tcOk + '</div></a></td>');
    html.push('<td width="50%"><a href="javascript:picasa.cancelMarker(' + data.index_ + ');"><div class="info_window_footer_button">' + tcCancel + '</div></a></td>');
    html.push('</tr></table>');
  } else {
    g.pendingMarker_ === marker && (g.pendingMarker_ = null);
    var here = 1 < data.num_photos_ ?
      tcPhotosHere.replace('%d', data.num_photos_.toString()) :
      tcPhotoHere;
    html.push('<table border="0" cellpadding="1" cellspacing="2" width="180">');
    html.push('<tr><td colspan="3" width="100%" class="info_window_title" nowrap>');
    html.push('<a href="javascript:picasa.geoPanelData.infoWindow_.setShow(false)">');
    html.push('<img width="14" height="13" title="' + tcCloseTip + '" src="close.gif" class="info_window_close"></a>');
    html.push(here + '</td></tr>');
    html.push('<tr><td colspan="3"><div class="info_window_thumb">' + thumbHtml + '</div></td></tr>');
    if (-1 != data.checksum_) {
      // [geotag] "Erase location info" button re-enabled
      html.push('<tr><td width="10%"></td><td width="80%">');
      html.push('<a href="cleargeotag:' + data.checksum_ + '" title="' + tcEraseTip + '">');
      html.push('<div class="info_window_footer_button">' + tcEraseButton + '</div></a>');
      html.push('</td><td width="10%"></td></tr>');
    }
    html.push('</table>');
  }
  g.infoWindow_.openInfoWindowOnMarker(marker, html.join(''));
  // [geotag] Pans the map if the info window is out of view.
  try {
    g.infoWindow_.autoPanning_ && g.map_.panInside &&
      g.map_.panInside(pos, { paddingTopLeft: [140, 230], paddingBottomRight: [60, 20], animate: false });
  } catch (e) {}
};
picasa.removeMarkersFromMap = function (a) {
  a.clearLayers();
  // [geotag] also removes the old, empty group from the map
  picasa.geoPanelData.map_ && picasa.geoPanelData.map_.hasLayer(a) && picasa.geoPanelData.map_.removeLayer(a);
};
picasa.beginAddingMarkers = function () {
  picasa.log('beginAddingMarkers');
  try {
    picasa.geoPanelData.map_ &&
      (picasa.removeMarkersFromMap(picasa.geoPanelData.allMarkers_),
        picasa.removeSearchMarker(),
        (picasa.geoPanelData.pendingMarker_ = null),
        (picasa.geoPanelData.allMarkers_ = L.featureGroup()),
        (picasa.geoPanelData.searchMarker_ = null),
        (picasa.geoPanelData.MarkerPicasaData_ = []),
        picasa.geoPanelData.infoWindow_ &&
        (picasa.geoPanelData.infoWindow_.DetachFromMap(),
          picasa.geoPanelData.infoWindow_.AttachToMap(picasa.geoPanelData.map_)),
        null === picasa.geoPanelData.currBounds_ &&
        (picasa.geoPanelData.currBounds_ = L.latLngBounds()));
  } catch (l) { return showError(l); }
};
picasa.addMarker = function (a, b, d, c) {
  picasa.log('addMarker - lat: ' + a + ', lng: ' + b + ', checksum: ' + d + ', nb: ' + c);
  try {
    if (picasa.geoPanelData.map_) {
      var e = L.latLng(a, b);
      null === picasa.geoPanelData.currBounds_ && (picasa.geoPanelData.currBounds_ = L.latLngBounds());
      picasa.geoPanelData.currBounds_.extend(e);
      var opts = {
        icon: picasa.geoPanelData.regularMarkerOptions_.icon,
        draggable: !0 // [geotag] markers can be dragged again
      };
      var mk = L.marker(e, opts);
      picasa.geoPanelData.allMarkers_.addLayer(mk);
      var id = picasa.geoPanelData.allMarkers_.getLayerId(mk);
      picasa.geoPanelData.SetMarkerPicasaData(mk, new picasa$markerData(d, id, '', e, c));
      mk.on('click', picasa.handleClick);
      mk.on('dragstart', picasa.handleDragStart); // [geotag]
      mk.on('dragend', picasa.handleDragEnd);     // [geotag]
    }
  } catch (l) { return showError(l); }
};
picasa.endAddingMarkers = function (a) {
  picasa.log('endAddingMarkers -  a: ' + a);
  try {
    var b = picasa.geoPanelData.allMarkers_.getLayers().length;
    if (b > 0) {
      picasa.geoPanelData.map_.fitBounds(picasa.geoPanelData.currBounds_,
        { maxZoom: 15, padding: [10, 10] });
      picasa.geoPanelData.allMarkers_.addTo(picasa.geoPanelData.map_);
    }
    picasa.geoPanelData.currBounds_ = null;
  } catch (l) { return showError(l); }
};
picasa.updateMarker = function (a, b) {
  picasa.log('updateMarker -  a: ' + a + ', b: ' + (b ? String(b).substr(0, 60) : b));
  a = Number(a);
  if (picasa.geoPanelData.map_ && picasa.geoPanelData.allMarkers_.hasLayer(a)) {
    var d = picasa.geoPanelData.allMarkers_.getLayer(a);
    picasa.geoPanelData.GetMarkerPicasaData(d).thumburl_ = b || '';
    picasa.openMarkerInfoWindow(d, '', 'Place photos to this new mark');
  }
};
picasa.handlePanning = function () {
  picasa.geoPanelData.panning_ &&
    null !== picasa.geoPanelData.map_ &&
    // [geotag] Leaflet expects a point, not two numbers
    picasa.geoPanelData.map_.panBy(
      [-picasa.geoPanelData.panSize_.width, -picasa.geoPanelData.panSize_.height],
      { animate: false }
    );
};

// [geotag] "Follow the mouse" mode after clicking the add-a-place button.
picasa.stopFollowing_ = function () {
  var g = picasa.geoPanelData;
  if (!g || !g.map_) return;
  g.followMove_ && (g.map_.off('mousemove', g.followMove_), (g.followMove_ = null));
  g.followClick_ && (g.map_.off('click', g.followClick_), (g.followClick_ = null));
  g.panning_ = !1;
  g.panSize_ = new Size(0, 0);
};
picasa.setMarkerClickThrough_ = function (mk, through) {
  var el = mk && mk.getElement ? mk.getElement() : null;
  el && (el.style.pointerEvents = through ? 'none' : '');
};
picasa.newPlaceMarker = function (a, b) {
  // a = message text, b = thumbnail URL (both provided by Picasa)
  picasa.log('newPlaceMarker - a: ' + a + ', b: ' + (b ? String(b).substr(0, 60) : b));
  var g = picasa.geoPanelData;
  if (!g || !g.map_) return;
  try {
    picasa.stopFollowing_();
    var map = g.map_,
      cont = map.getContainer(),
      x = cont.clientWidth / 2,
      y = cont.clientHeight / 2,
      btn = document.getElementById('addMarkerDiv');
    if (btn && btn.getBoundingClientRect) {
      var r = btn.getBoundingClientRect(),
        mr = cont.getBoundingClientRect();
      x = r.left - mr.left + 1.5 * r.width;
      y = r.top - mr.top + r.height;
    }
    var mk = picasa.createSearchMarker(picasa.fromContainerPixelToLatLng(x, y), b, a, '');
    if (!mk) return;
    // The marker follows the mouse: it must not catch clicks meanwhile.
    picasa.setMarkerClickThrough_(mk, !0);
    g.followMove_ = function (ev) {
      if (g.searchMarker_ !== mk) return picasa.stopFollowing_();
      var ll = ev.latlng;
      mk.setLatLng(ll);
      var w = cont.offsetWidth,
        h = cont.offsetHeight,
        p = ev.containerPoint,
        dx = 0,
        dy = 0;
      if (89 > ll.lat && -89 < ll.lat) {
        dx = 10 > p.x ? 2 : 10 > w - p.x ? -2 : 0;
        dy = 10 > p.y ? 2 : 10 > h - p.y ? -2 : 0;
      }
      0 != dx || 0 != dy ?
        ((g.panSize_ = new Size(dx, dy)), (g.panning_ = !0), picasa.handlePanning()) :
        (g.panning_ = !1);
    };
    g.followClick_ = function (ev) {
      if (g.searchMarker_ !== mk) return picasa.stopFollowing_();
      picasa.log('newPlaceMarker - map click: ' + picasa.toUrlValue(ev.latlng));
      picasa.stopFollowing_();
      mk.setLatLng(ev.latlng);
      picasa.setMarkerClickThrough_(mk, !1);
      picasa.openMarkerInfoWindow(mk, '', a);
    };
    map.on('mousemove', g.followMove_);
    map.on('click', g.followClick_);
  } catch (l) { return showError(l); }
};
picasa.removeSearchMarker = function () {
  var g = picasa.geoPanelData;
  if (!g) return;
  picasa.stopFollowing_();
  g.searchMarker_ &&
    (g.map_ && g.map_.removeLayer(g.searchMarker_), // [geotag] setMap(null) does not exist in Leaflet
      g.pendingMarker_ === g.searchMarker_ && (g.pendingMarker_ = null),
      (g.searchMarker_ = null),
      (g.searchMarkerPicasaData_ = null),
      g.infoWindow_ &&
      (g.infoWindow_.DetachFromMap(), g.infoWindow_.AttachToMap(g.map_)));
};
picasa.createSearchMarker = function (a, b, d, c) {
  // a = position (LatLng), b = thumbnail, d = message, c = address
  var g = picasa.geoPanelData;
  if (!g || !g.map_) return null;
  picasa.removeSearchMarker();
  // [geotag] a is already a LatLng (the Leaflet port converted it again as a pixel -> NaN)
  var ll = L.latLng(a);
  var mk = L.marker(ll, {
    draggable: !0,
    icon: g.searchMarkerOptions_.icon,
    zIndexOffset: 1000
  }).addTo(g.map_);
  g.searchMarker_ = mk;
  g.SetMarkerPicasaData(mk, new picasa$markerData(-1, -1, b, ll, g.currNumSelected_));
  mk.on('click', function () {
    picasa.openMarkerInfoWindow(mk, c, d);
  });
  mk.on('dragstart', function () {
    g.infoWindow_.setShow(!1);
  });
  mk.on('dragend', function () {
    picasa.openMarkerInfoWindow(mk, c, d);
  });
  return mk;
};
picasa.fromContainerPixelToLatLng = function (a, b) {
  return picasa.geoPanelData.map_.containerPointToLatLng(L.point(a, b));
};
picasa.fromLatLngToContainerPixel = function (a) {
  return picasa.geoPanelData.map_.latLngToContainerPoint(a);
};

// Drag & drop of photos from Picasa onto the map (called by Picasa).
picasa.beginDragAndDrop = function (a, b) {
  picasa.log('beginDragAndDrop - ' + a + ', ' + b);
  try {
    picasa.geoPanelData.map_ &&
      picasa.createSearchMarker(picasa.fromContainerPixelToLatLng(a, b), '', '', '');
  } catch (l) { return showError(l); }
};
picasa.updateDragAndDrop = function (a, b) {
  try {
    picasa.geoPanelData.map_ &&
      picasa.geoPanelData.searchMarker_ &&
      picasa.geoPanelData.searchMarker_.setLatLng(picasa.fromContainerPixelToLatLng(a, b)); // [geotag] setPosition -> setLatLng
  } catch (l) { return showError(l); }
};
picasa.endDragAndDrop = function (a, b, d, c, e) {
  // a = cancelled?, b/d = pixel x/y, c = message, e = thumbnail
  picasa.log('endDragAndDrop - cancelled: ' + a + ', x: ' + b + ', y: ' + d);
  try {
    picasa.geoPanelData.map_ &&
      (a ?
        picasa.removeSearchMarker() :
        null !== picasa.geoPanelData.searchMarker_ &&
        (picasa.createSearchMarker(picasa.fromContainerPixelToLatLng(b, d), e, c, ''),
          picasa.openMarkerInfoWindow(picasa.geoPanelData.searchMarker_, '', c)));
  } catch (l) { return showError(l); }
};
picasa.setMapType = function () {};
picasa.setNumSelected = function (a) {
  picasa.log('setNumSelected - ' + a);
  picasa.geoPanelData && (picasa.geoPanelData.currNumSelected_ = a);
};
// [geotag] Re-entrancy guard: element.click() fires the button's onclick again.
picasa.notifying_ = !1;
picasa.notifyPicasa = function (a) {
  if (picasa.notifying_) return;
  picasa.notifying_ = !0;
  try {
    picasa.log('notifyPicasa - ' + a);
    var b = window.WebBrowserPicasaPlugin;
    if (b)
      try {
        b.elementEventNotify(a, 'click');
      } catch (d) {
        alert(
          'An exception occurred calling plugin. Error name: ' +
          d.name +
          '. Error message: ' +
          d.message
        );
      }
    var el = document.getElementById(a);
    el && el.click();
  } finally {
    picasa.notifying_ = !1;
  }
};

// [geotag] Place search via Nominatim (OpenStreetMap), using JSONP.
//          Called by Picasa: search(address, message, thumbnail).
//          Light use only (Nominatim usage policy: max 1 request/second).
picasa.searchSeq_ = 0;
picasa.search = function (a, b, d) {
  picasa.log('search - ' + a);
  var g = picasa.geoPanelData;
  if (!g || !g.map_ || !a) return;
  var errDiv = document.getElementById('searchErrorDiv');
  errDiv && (errDiv.style.display = 'none');
  var cbName = '_picasaGeocodeCb' + ++picasa.searchSeq_,
    script = document.createElement('script'),
    done = !1,
    timer = null;
  var cleanup = function () {
    timer && clearTimeout(timer);
    try {
      delete window[cbName];
    } catch (e) {
      window[cbName] = undefined;
    }
    script.parentNode && script.parentNode.removeChild(script);
  };
  var fail = function (why) {
    picasa.log('picasa.search - failed: ' + why);
    errDiv && (errDiv.style.display = 'block');
  };
  window[cbName] = function (res) {
    if (done) return;
    done = !0;
    cleanup();
    try {
      if (!res || !res.length) return fail('no result');
      var r = res[0],
        ll = L.latLng(parseFloat(r.lat), parseFloat(r.lon)),
        bb = r.boundingbox;
      g.infoWindow_.setAutoPanning(!1);
      bb && 4 == bb.length ?
        g.map_.fitBounds([[parseFloat(bb[0]), parseFloat(bb[2])], [parseFloat(bb[1]), parseFloat(bb[3])]], { maxZoom: 16 }) :
        g.map_.setView(ll, 14);
      picasa.createSearchMarker(ll, d, b, r.display_name);
      null !== g.searchMarker_ && picasa.openMarkerInfoWindow(g.searchMarker_, r.display_name, b);
      setTimeout(function () {
        g.infoWindow_.setAutoPanning(!0);
      }, 2e3);
    } catch (l) {
      showError(l);
    }
  };
  timer = setTimeout(function () {
    if (done) return;
    done = !0;
    cleanup();
    fail('timeout');
  }, 1e4);
  script.src =
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
    encodeURIComponent(a) +
    '&json_callback=' + cbName;
  document.getElementsByTagName('head')[0].appendChild(script);
};

picasa.ScriptQueueClass = (function () {
  var a = function () {
    var a = null,
      d = [];
    this.processQueue = function () {
      a = null;
      if (0 < d.length) {
        var c = d[0];
        d.shift();
        try {
          eval(c);
        } catch (e) {
          picasa.log('SubmitQueue - error in: ' + String(c).substr(0, 80) + ' -> ' + e.message);
        }
        this.scheduleQueueProcessing();
      }
    };
    this.push = function (a) {
      a && a.length && (d.push(a), this.scheduleQueueProcessing());
    };
    this.scheduleQueueProcessing = function () {
      if (0 < d.length && !a) {
        var c = this;
        a = setTimeout(function () {
          c.processQueue();
        }, 250);
      }
    };
    this.clear = function () {
      a && clearTimeout(a);
      d = [];
    };
  };
  return a;
})();
picasa.scriptQueue = new picasa.ScriptQueueClass();

function SubmitQueue(a) {
  picasa.scriptQueue.push(a);
}

function StopQueue() {
  picasa.scriptQueue.clear();
}
window.initialize = picasa_initialize;
window.setMapType = picasa.setMapType;
window.setNumSelected = picasa.setNumSelected;
window.beginAddingMarkers = picasa.beginAddingMarkers;
window.addMarker = picasa.addMarker;
window.endAddingMarkers = picasa.endAddingMarkers;
window.updateMarker = picasa.updateMarker;
window.newPlaceMarker = picasa.newPlaceMarker;
window.beginDragAndDrop = picasa.beginDragAndDrop;
window.updateDragAndDrop = picasa.updateDragAndDrop;
window.endDragAndDrop = picasa.endDragAndDrop;
window.notifyPicasa = picasa.notifyPicasa;
window.SubmitQueue = SubmitQueue;
window.search = picasa.search;
window.StopQueue = StopQueue;
