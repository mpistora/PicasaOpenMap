var picasa = picasa || {};
picasa.initLog =
  picasa.initLog ||
  function () {
    picasa.log =
      'undefined' !== typeof console && null !== console ?
      function (a) {
        window.console.log(a);
      } :
      function () {};
  };
showError = function (l) {
  return (picasa.log('Error: ' + l), !1);
};
picasa.initLog();

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
    L.setOptions(this, { pane: 'popupPane' });
  },

  AttachToMap: function (a) {
    picasa.log('picasaInfoWindow$window.AttachToMap -  a: ' + a);
    if (null != this.map_) {
      console.log('implicit detach in picasaInfoWindow.window.prototype.AttachToMap');
      this.DetachFromMap();
    }
    this.map_ = a;
    this.addTo(a);
  },

  DetachFromMap: function () {
    picasa.log('picasaInfoWindow$window.DetachFromMap');
    this.setShow(!1);
    if (this.map_) {
      this.remove();
    }
    this.map_ = null;
  },

  onAdd: function () {
    picasa.log('picasaInfoWindow$window.onAdd');
    var a = this._map.getPane(this.options.pane);
    a.appendChild(this.infoWindowDiv_);
    a.appendChild(this.bottomImageDiv_);
    this._map.on('zoomend viewreset', this.draw, this);
  },

  onRemove: function () {
    picasa.log('picasaInfoWindow$window.onRemove');
    if (this.infoWindowDiv_ && this.infoWindowDiv_.parentNode)
      this.infoWindowDiv_.parentNode.removeChild(this.infoWindowDiv_);
    if (this.bottomImageDiv_ && this.bottomImageDiv_.parentNode)
      this.bottomImageDiv_.parentNode.removeChild(this.bottomImageDiv_);
    this.visible_ = !1;
    if (this._map) {
      this._map.off('zoomend viewreset', this.draw, this);
    }
  },

  createInfoWindowDiv: function (a) {
    var b = this.doc_.createElement('div');
    b.style.position = 'absolute';
    b.style.width = a + 'px';
    return b;
  },

  setPosition: function (a, b, d) {
    a.style.left = b + 'px';
    a.style.bottom = d + 'px';
  },

  copy: function () {
    return new picasaInfoWindow$window(this.doc_, this.style_);
  },

  draw: function () {
    if (this.visible_ && this.map_ && this.markerPoint_) {
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
    var iconOpts = a.getIcon() && a.getIcon().options ? a.getIcon().options : {};
    var d = L.point(iconOpts.iconAnchor || [0, 0]),
      c = L.point(5, 1);
    this.openInfoWindow(a.getLatLng(), b, L.point(d.x - c.x, d.y - c.y));
  },

  openInfoWindow: function (a, b, d) {
    if (this.infoWindowDiv_) {
      this.infoWindowOffset_ = d || L.point(0, 0);
      this.markerPoint_ = a;
      var html = '<div class="' + this.style_.styleClass_ + '"><nobr>' + b + '</nobr></div>';
      this.infoWindowDiv_.innerHTML = html;
      this.bottomImageDiv_.innerHTML =
        '<img src="' + this.style_.bottomImage_ +
        '" width="' + this.style_.bottomImageSize_.width +
        '" height="' + this.style_.bottomImageSize_.height + '">';
      this.setShow(!0);
      this.draw();
    }
  },

  setShow: function (a) {
    this.visible_ = a;
    if (this.infoWindowDiv_) {
      this.infoWindowDiv_.style.display = a ? '' : 'none';
      this.bottomImageDiv_.style.display = a ? '' : 'none';
    }
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
  'OpenTopoMap',
  'Esri.WorldImagery',
];

function Size(width, height) {
  this.width = width;
  this.height = height;
}

var picasa$geoPanelClass = function (a, b, d, c, e) {
  this.map_ = a;
  this.geocoder_ = e;
  this.searchMarkerOptions_ = { icon: d, draggable: !0 };
  this.allMarkers_ = L.featureGroup();
  this.MarkerPicasaData_ = [];
  this.regularMarkerOptions_ = { icon: b, draggable: !0 };
  this.panSize_ = new Size(0, 0);
  this.infoWindow_ = c;
  this.hiddenOverlay_ = null;
  this.infoWindow_ &&
    (this.infoWindow_.DetachFromMap(), this.infoWindow_.AttachToMap(this.map_));
};

picasa$geoPanelClass.prototype.searchMarker_ = null;
picasa$geoPanelClass.prototype.searchMarkerPicasaData_ = null;

picasa$geoPanelClass.prototype.SetMarkerPicasaData = function (a, b) {
  if (this.searchMarker_ === a) return (this.searchMarkerPicasaData_ = b), !0;
  var d = this.allMarkers_.hasLayer(a) ? this.allMarkers_.getLayerId(a) : -1;
  if (-1 === d)
    return (picasa.log('SetMarkerPicasaData - Marker not found in allMarkers_'), !1);
  this.MarkerPicasaData_[d] = b;
  return !0;
};

picasa$geoPanelClass.prototype.GetMarkerPicasaData = function (a) {
  if (this.searchMarker_ === a) return this.searchMarkerPicasaData_;
  if (null === a) return picasa.log('GetMarkerPicasaData(null)'), null;
  var b = this.allMarkers_.hasLayer(a) ? this.allMarkers_.getLayerId(a) : -1;
  if (-1 === b)
    return (picasa.log('GetMarkerPicasaData - Marker not found in allMarkers_'), null);
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
  this.thumburl_ = d;
  this.original_latlng_ = c;
  this.num_photos_ = e;
};
picasa$markerData.prototype.MarkerMoved = function (a) {
  return null === this.original_latlng_ ? !0 : !this.original_latlng_.equals(a);
};

function picasa_initialize(a, b, d, c, e) {
  picasa.initLog();
  document.getElementById('errorDiv').innerHTML = b;
  document.getElementById('searchErrorDiv').innerHTML = d;
  document.getElementById('addMarker').setAttribute('alt', c);
  try {
    try {
      eval(e);
    } catch (f) {}

    // === Tile layers ===
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    });

    // OpenTopoMap via top-o-map.de (replacement for the shut-down tile.opentopomap.org)
    var topo = L.tileLayer('https://{s}.top-o-map.de/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 17,
      attribution: '&copy; OpenTopoMap (CC-BY-SA)'
    });

    var sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      minZoom: 0,
      maxZoom: 19,
      attribution: '&copy; Powered by Esri'
    });

    var h = L.map('map_canvas', {
      zoomControl: false,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
      layers: [osm]
    }).setView([40.979898, -98.261719], 4);

    var baseMaps = {
      "OpenStreetMap": osm,
      "OpenTopoMap": topo,
      "Esri.WorldImagery": sat
    };
    L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(h);
    L.control.zoom({ position: 'bottomleft' }).addTo(h);

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

    picasa.geoPanelData = new picasa$geoPanelClass(h, b, d, m, null);
    picasa.scriptQueue.scheduleQueueProcessing();
  } catch (l) {
    return (picasa.log('Error: ' + l), !1);
  }
  document.getElementById('errorDiv').style.display = 'none';
  document.getElementById('addMarkerDiv').style.display = 'block';
  a = document.createElement('div');
  k = document.getElementById('addMarkerDiv');
  a.appendChild(k);
  a.index = 0;
  return !0;
}

picasa.handleClick = function () {
  var a = picasa.geoPanelData.GetMarkerPicasaData(this);
  if (a)
    if (0 < a.thumburl_.length)
      picasa.openMarkerInfoWindow(this, '', 'Place photos to this new mark');
    else {
      var b = document.getElementById('hiddenDiv');
      var ll = this.getLatLng();
      b.setAttribute('checksum', a.checksum_.toString());
      b.setAttribute('latlng', ll.lat + ',' + ll.lng);
      b.setAttribute('markindex', a.index_.toString());
      picasa.notifyPicasa('hiddenDiv');
    }
};

picasa.handleDragStart = function () {
  picasa.geoPanelData.infoWindow_.setShow(!1);
  picasa.geoPanelData.GetMarkerPicasaData(this);
};

picasa.handleDragEnd = function () {
  var a = picasa.geoPanelData.GetMarkerPicasaData(this);
  if (a)
    if (0 < a.thumburl_.length)
      picasa.openMarkerInfoWindow(this, '', 'Place photos to this new mark');
    else {
      var b = document.getElementById('hiddenDiv');
      if (b) {
        var ll = this.getLatLng();
        b.setAttribute('checksum', a.checksum_.toString());
        b.setAttribute('latlng', ll.lat + ',' + ll.lng);
        b.setAttribute('markindex', a.index_.toString());
        picasa.notifyPicasa('hiddenDiv');
      }
    }
};

picasa.cancelMarker = function (a) {
  picasa.geoPanelData.infoWindow_.setShow(!1);
  if (picasa.geoPanelData.map_ && picasa.geoPanelData.allMarkers_.hasLayer(a)) {
    var mk = picasa.geoPanelData.allMarkers_.getLayer(a);
    var b = picasa.geoPanelData.GetMarkerPicasaData(mk);
    if (null !== b && b.MarkerMoved(mk.getLatLng())) {
      mk.setIcon(picasa.geoPanelData.regularMarkerOptions_.icon);
      mk.setLatLng(b.original_latlng_);
      picasa.geoPanelData.map_.panTo(b.original_latlng_);
    }
  }
};

picasa.openMarkerInfoWindow = function (a, b, d) {
  picasa.log('openMarkerInfoWindow -  a: ' + a + ', b: ' + b + ', d: ' + d);
  b = picasa.geoPanelData.GetMarkerPicasaData(a);
  if (null !== a && null !== b && 0 != b.thumburl_.length) {
    var c = '';
    if (
      a == picasa.geoPanelData.searchMarker_ ||
      b.MarkerMoved(a.getLatLng())
    ) {
      b = a;
      c = d;
      d = [];
      var e = b.getLatLng();
      b = picasa.geoPanelData.GetMarkerPicasaData(b);
      if (null != e && c.length) {
        d.push('"geotag:');
        d.push(b.checksum_.toString());
        d.push(',');
        d.push(e.lat + ',' + e.lng);
        d.push('"');
      }
      e = -1 != b.checksum_ ? '"showphotos:' + b.checksum_ + '"' : '';
      c = [];
      c.push('<table border="0" cellpadding="1" cellspacing="2" width="180">');
      var f = '',
        f = -1 != b.index_ ?
        1 < b.num_photos_ ? tcMovePhotos : tcMovePhoto :
        1 < b.num_photos_ ? tcPutPhotos : tcPutPhoto;
      1 < b.num_photos_ && (f = f.replace('%d', b.num_photos_.toString()));
      c.push('<tr><td colspan="3" width="100%" class="info_window_title" nowrap>');
      c.push(f);
      c.push('</td></tr>');
      if (e.length) {
        c.push('<tr><td colspan="3"><div class="info_window_thumb"><a href=');
        c.push(e);
        c.push(' title="');
        c.push(tcSearchTip);
        c.push('"><img src="');
        c.push(b.thumburl_);
        c.push('?');
        c.push(new Date().getTime());
        c.push('"></a></div></td></tr>');
      } else {
        c.push('<tr><td colspan="3"><div class="info_window_thumb"><img src="');
        c.push(b.thumburl_);
        c.push('?');
        c.push(new Date().getTime());
        c.push('"></div></td></tr>');
      }
      e = [];
      f = [];
      if (d.length) {
        e.push('<td width="40%"><a href=');
        e.push(d.join(''));
        e.push('><div class="info_window_footer_button">');
        e.push(tcOk);
        e.push('</div></a></td>');
      }
      f.push('<td width="40%">');
      f.push('<a href="javascript:picasa.cancelMarker(');
      f.push(b.index_.toString());
      f.push(');">');
      f.push('<div class="info_window_footer_button">');
      f.push(tcCancel);
      f.push('</div></a></td>');
      c.push(e.join(''));
      c.push(f.join(''));
      c.push('</tr></table>');
      d = c.join('');
    } else {
      c = picasa.geoPanelData.GetMarkerPicasaData(a);
      if (c) {
        d = -1 != c.checksum_ ? '"cleargeotag:' + c.checksum_ + '"' : '';
        e = -1 != c.checksum_ ? '"showphotos:' + c.checksum_ + '"' : '';
        b = [];
        b.push('<table border="0" cellpadding="1" cellspacing="2" width="180">');
        f = [];
        if (1 < c.num_photos_)
          f.push(tcPhotosHere.replace('%d', c.num_photos_.toString()));
        else
          f.push(tcPhotoHere);
        b.push('<tr><td colspan="3" width="100%" class="info_window_title" nowrap>');
        b.push('<a href="javascript:picasa.geoPanelData.infoWindow_.setShow(false)">');
        b.push('<img width="14" height="13" title="');
        b.push(tcCloseTip);
        b.push('" src="close.gif" class="info_window_close"></a>');
        b.push(f.join(''));
        b.push('</td></tr>');
        b.push('<tr><td colspan="3"><div class="info_window_thumb"><a href=');
        b.push(e);
        b.push(' title="');
        b.push(tcSearchTip);
        b.push('"><img src="');
        b.push(c.thumburl_);
        if ('data:' != c.thumburl_.substr(0, 5)) {
          b.push('?');
          b.push(new Date().getTime());
        }
        b.push('"></a></div></td></tr>');
        b.push('</table>');
        d = b.join('');
      } else {
        d = '';
      }
    }
    c = d;
    picasa.geoPanelData.infoWindow_.openInfoWindowOnMarker(a, c);
  }
};

picasa.removeMarkersFromMap = function (a) {
  a.clearLayers();
};

picasa.beginAddingMarkers = function () {
  try {
    if (picasa.geoPanelData.map_) {
      picasa.removeMarkersFromMap(picasa.geoPanelData.allMarkers_);
      picasa.removeSearchMarker();
      picasa.geoPanelData.allMarkers_ = L.featureGroup();
      picasa.geoPanelData.searchMarker_ = null;
      picasa.geoPanelData.MarkerPicasaData_ = [];
      if (picasa.geoPanelData.infoWindow_) {
        picasa.geoPanelData.infoWindow_.DetachFromMap();
        picasa.geoPanelData.infoWindow_.AttachToMap(picasa.geoPanelData.map_);
      }
      if (null === picasa.geoPanelData.currBounds_)
        picasa.geoPanelData.currBounds_ = L.latLngBounds([]);
    }
  } catch (l) {
    return showError(l);
  }
};

picasa.addMarker = function (a, b, d, c) {
  picasa.log('addMarker -  a: ' + a + ', b: ' + b + ', d: ' + d + ', c: ' + c);
  try {
    if (picasa.geoPanelData.map_) {
      var e = L.latLng(a, b);
      picasa.geoPanelData.currBounds_.extend(e);
      var markerOpts = { icon: picasa.geoPanelData.regularMarkerOptions_.icon };
      var m = L.marker(e, markerOpts);
      picasa.geoPanelData.allMarkers_.addLayer(m);
      var idx = picasa.geoPanelData.allMarkers_.getLayerId(m);
      var md = new picasa$markerData(d, idx, '', e, c);
      picasa.geoPanelData.SetMarkerPicasaData(m, md);
      m.addEventListener('click', picasa.handleClick);
    }
  } catch (l) {
    return showError(l);
  }
};

picasa.endAddingMarkers = function (a) {
  picasa.log('endAddingMarkers -  a: ' + a);
  try {
    var b = picasa.geoPanelData.allMarkers_.getLayers().length;
    if (b > 0) {
      picasa.geoPanelData.allMarkers_.addTo(picasa.geoPanelData.map_);
      picasa.geoPanelData.map_.fitBounds(picasa.geoPanelData.currBounds_, {
        maxZoom: 15,
        padding: [10, 10]
      });
    }
    picasa.geoPanelData.currBounds_ = null;
  } catch (l) {
    return showError(l);
  }
};

picasa.updateMarker = function (a, b) {
  picasa.log('updateMarker -  a: ' + a + ', b: ' + b);
  a = Number(a);
  if (picasa.geoPanelData.map_ && picasa.geoPanelData.allMarkers_.hasLayer(a)) {
    var d = picasa.geoPanelData.allMarkers_.getLayer(a);
    picasa.geoPanelData.GetMarkerPicasaData(d).thumburl_ = b;
    picasa.openMarkerInfoWindow(d, '', 'Place photos to this new mark');
  }
};

picasa.handlePanning = function () {
  if (picasa.geoPanelData.panning_ && null !== picasa.geoPanelData.map_)
    picasa.geoPanelData.map_.panBy(
      -picasa.geoPanelData.panSize_.width,
      -picasa.geoPanelData.panSize_.height
    );
};

picasa.newPlaceMarker = function (a, b) {
  if (picasa.geoPanelData.map_) {
    var d = document.getElementById('addMarkerDiv'),
      c = d.offsetLeft + d.offsetParent.offsetLeft + 1.5 * d.offsetWidth,
      d2 = d.offsetTop + d.offsetParent.offsetTop + d.offsetHeight,
      c2 = picasa.fromContainerPixelToLatLng(c, d2);
    picasa.geoPanelData.searchMarker_ = picasa.createSearchMarker(c2, b, a, '');
    if (null !== picasa.geoPanelData.searchMarker_) {
      picasa.geoPanelData.panning_ = !1;
      picasa.geoPanelData.panSize_ = new Size(0, 0);
      picasa.geoPanelData.map_.on('mousemove', function (evt) {
        if (picasa.geoPanelData.searchMarker_) {
          var ll = evt.latlng;
          picasa.geoPanelData.searchMarker_.setLatLng(ll);
          var w = picasa.geoPanelData.map_.getContainer().offsetWidth,
            hh = picasa.geoPanelData.map_.getContainer().offsetHeight,
            dx = 0,
            dy = 0;
          if (ll.lat <= 89 && ll.lat >= -89) {
            var px = picasa.fromLatLngToContainerPixel(ll);
            dx = 10 > px.x ? 2 : 10 > w - px.x ? -2 : 0;
            dy = 10 > px.y ? 2 : 10 > hh - px.y ? -2 : 0;
            if (dx != 0 || dy != 0) {
              picasa.geoPanelData.panSize_ = new Size(dx, dy);
              picasa.geoPanelData.panning_ = !0;
              picasa.handlePanning();
            } else {
              picasa.geoPanelData.panning_ = !1;
            }
          }
        }
      });
      picasa.geoPanelData.map_.on('click', function () {});
    }
  }
};

picasa.removeSearchMarker = function () {
  if (picasa.geoPanelData.searchMarker_) {
    picasa.geoPanelData.searchMarker_.remove();
    picasa.geoPanelData.searchMarker_ = null;
    if (picasa.geoPanelData.infoWindow_) {
      picasa.geoPanelData.infoWindow_.DetachFromMap();
      picasa.geoPanelData.infoWindow_.AttachToMap(picasa.geoPanelData.map_);
    }
  }
};

picasa.createSearchMarker = function (a, b, d, c) {
  if (picasa.geoPanelData.map_) {
    picasa.removeSearchMarker();
    var e = {
      draggable: !0,
      icon: picasa.geoPanelData.searchMarkerOptions_.icon
    };
    var x = a; // a is already a LatLng
    picasa.geoPanelData.searchMarker_ = L.marker(x, e).addTo(picasa.geoPanelData.map_);
    var md = new picasa$markerData(-1, -1, b, x, picasa.geoPanelData.currNumSelected_);
    picasa.geoPanelData.SetMarkerPicasaData(picasa.geoPanelData.searchMarker_, md);
    picasa.geoPanelData.searchMarker_.addEventListener('click', function () {
      picasa.openMarkerInfoWindow(picasa.geoPanelData.searchMarker_, c, d);
    });
    picasa.geoPanelData.searchMarker_.addEventListener('dragstart', function () {
      picasa.geoPanelData.infoWindow_.setShow(!1);
    });
    picasa.geoPanelData.searchMarker_.addEventListener('dragend', function () {
      picasa.openMarkerInfoWindow(picasa.geoPanelData.searchMarker_, c, d);
    });
    return picasa.geoPanelData.searchMarker_;
  }
};

picasa.fromContainerPixelToLatLng = function (a, b) {
  var d = L.point(a, b), c = L.latLng(0, 0);
  if (picasa.geoPanelData && picasa.geoPanelData.map_) {
    c = picasa.geoPanelData.map_.containerPointToLatLng(d);
  }
  return c;
};

picasa.fromLatLngToContainerPixel = function (a) {
  var b = L.point(0, 0);
  if (picasa.geoPanelData && picasa.geoPanelData.map_) {
    b = picasa.geoPanelData.map_.latLngToContainerPoint(a);
  }
  return b;
};

picasa.beginDragAndDrop = function (a, b) {
  if (picasa.geoPanelData.map_) {
    var d = picasa.fromContainerPixelToLatLng(a, b);
    picasa.createSearchMarker(d, '', '', '');
  }
};

picasa.updateDragAndDrop = function (a, b) {
  if (picasa.geoPanelData.map_ && picasa.geoPanelData.searchMarker_) {
    var d = picasa.fromContainerPixelToLatLng(a, b);
    picasa.geoPanelData.searchMarker_.setLatLng(d);
  }
};

picasa.endDragAndDrop = function (a, b, d, c, e) {
  if (picasa.geoPanelData.map_) {
    if (a) {
      picasa.removeSearchMarker();
    } else if (null !== picasa.geoPanelData.searchMarker_) {
      var pos = picasa.fromContainerPixelToLatLng(b, d);
      picasa.createSearchMarker(pos, e, c, '');
      picasa.openMarkerInfoWindow(picasa.geoPanelData.searchMarker_, '', c);
    }
  }
};

picasa.setMapType = function () {};
picasa.setNumSelected = function (a) {
  picasa.geoPanelData.currNumSelected_ = a;
};
picasa.notifyPicasa = function (a) {
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
  document.getElementById(a).click();
};

// Geocoding is implemented in this Leaflet port.
picasa.search = function (a, b, d) {
  if (!picasa.geoPanelData || !picasa.geoPanelData.map_) return;

  // Nominatim requires identifying the app via User-Agent (set in setRequestHeader below).
  var searchUrl =
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
    encodeURIComponent(a);

  try {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (xhr.status === 200) {
        var results = null;
        try {
          results = JSON.parse(xhr.responseText);
        } catch (parseErr) {
          picasa.log('picasa.search - JSON parse error: ' + parseErr);
          document.getElementById('searchErrorDiv').style.display = 'block';
          return;
        }

        if (results && results.length > 0) {
          var r = results[0];
          var g = L.latLng(parseFloat(r.lat), parseFloat(r.lon));

          picasa.geoPanelData.infoWindow_.setAutoPanning(!1);
          picasa.geoPanelData.map_.setView(g);

          var marker = picasa.createSearchMarker(g, d, b, r.display_name);
          if (marker) {
            picasa.openMarkerInfoWindow(marker, r.display_name, b);
          }

          setTimeout(function () {
            picasa.geoPanelData.infoWindow_.setAutoPanning(!0);
          }, 2000);
        } else {
          picasa.log('picasa.search - No results');
          document.getElementById('searchErrorDiv').style.display = 'block';
        }
      } else {
        picasa.log('picasa.search - HTTP error: ' + xhr.status);
        document.getElementById('searchErrorDiv').style.display = 'block';
      }
    };

    xhr.open('GET', searchUrl, true);
    // Nominatim usage policy requires a User-Agent identifying the application.
    xhr.setRequestHeader('User-Agent', 'PicasaOpenMap/1.0');
    xhr.send();
  } catch (err) {
    picasa.log('picasa.search - Error: ' + err);
    document.getElementById('searchErrorDiv').style.display = 'block';
  }
};

picasa.ScriptQueueClass = (function () {
  var a = function () {
    var a = null, d = [];
    this.processQueue = function () {
      a = null;
      if (0 < d.length) {
        var c = d[0];
        d.shift();
        try {
          eval(c);
        } catch (e) {}
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