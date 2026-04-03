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
showError = function(l) {
  return (
    picasa.log('Error: ' + l),
//     (document.getElementById('errorDiv').style.display = 'block'),
//     (document.getElementById('errorDiv').innerText = l.stack),
//     (document.getElementById('addMarkerDiv').style.display = 'none'),
//     (document.getElementById('map_canvas').style.display = 'none'),
    !1
  );
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
//   },
  };
//   picasaInfoWindow$window = function (a, b) {
//     picasa.log('picasaInfoWindow$window -  a: ' + a + ', b: ' + b);
//     this.doc_ = a;
//     this.style_ = b;
//     this.infoWindowWidth_ = 180;
//     this.isIE_ = this.visible_ = !1;
//     this.autoPanning_ = !0;
//     //  this.infoWindowOffset_ = new google.maps.Point(0, 0);
//     this.infoWindowOffset_ = L.point(0, 0);
//     var d = navigator.userAgent.toLowerCase();
//     this.isIE_ = -1 < d.indexOf('msie') && 1 > d.indexOf('opera');
//     this.infoWindowDiv_ = this.createInfoWindowDiv(this.infoWindowWidth_);
//     this.bottomImageDiv_ = this.createInfoWindowDiv(this.style_.bottomImageSize_.width);
//   };
// try {
//   picasaInfoWindow$window.prototype = new google.maps.OverlayView();
// } catch (err) {
//   console.log('Overlay failed: ' + err);
// }
var picasaInfoWindow$window = L.Layer.extend({

  initialize: function (a, b) {
    picasa.log('picasaInfoWindow$window -  a: ' + a + ', b: ' + b);
    this.doc_ = a;
    this.style_ = b;
    this.infoWindowWidth_ = 180;
    this.isIE_ = this.visible_ = !1;
    this.autoPanning_ = !0;
    //  this.infoWindowOffset_ = new google.maps.Point(0, 0);
    this.infoWindowOffset_ = L.point(0, 0);
    var d = navigator.userAgent.toLowerCase();
    this.isIE_ = -1 < d.indexOf('msie') && 1 > d.indexOf('opera');
    this.infoWindowDiv_ = this.createInfoWindowDiv(this.infoWindowWidth_);
    this.bottomImageDiv_ = this.createInfoWindowDiv(this.style_.bottomImageSize_.width);
    
    L.setOptions(this, { pane: 'popupPane' });
  },

// picasaInfoWindow$window.prototype.AttachToMap = function (a) {
  AttachToMap: function (a) {
    picasa.log('picasaInfoWindow$window.AttachToMap -  a: ' + a);
    null != this.map_ &&
      (console.log(
          'implicit detach in picasaInfoWindow.window.prototype.AttachToMap'
        ),
        this.DetachFromMap());
    this.map_ = a;
    //  this.setMap(a);
    this.addTo(a);
  // };
  },
// picasaInfoWindow$window.prototype.DetachFromMap = function () {
    DetachFromMap: function () {
    picasa.log('picasaInfoWindow$window.DetachFromMap');
    this.setShow(!1);
    //  this.setMap(null);
    this.remove();
    this.map_ = null;
  // };
  },
// picasaInfoWindow$window.prototype.onAdd = function () {
  onAdd: function () {
    picasa.log('picasaInfoWindow$window.onAdd');
    //  var a = this.getPanes();
    var a = this.getPane();
    //  a.floatPane.appendChild(this.infoWindowDiv_);
    a.appendChild(this.infoWindowDiv_);
    //  a.floatPane.appendChild(this.bottomImageDiv_);
    a.appendChild(this.bottomImageDiv_);
    
    this.map_.on('zoomend viewreset', this.draw, this);
  // };
  },
// picasaInfoWindow$window.prototype.createInfoWindowDiv = function (a) {
  createInfoWindowDiv: function (a) {
    picasa.log('picasaInfoWindow$window.createInfoWindowDiv -  a: ' + a);
    var b = this.doc_.createElement('div');
    b.style.position = 'absolute';
    b.style.width = a + 'px';
    return b;
  // };
  },
// picasaInfoWindow$window.prototype.setPosition = function (a, b, d) {
  setPosition: function (a, b, d) {
    picasa.log('picasaInfoWindow$window.setPosition -  a: ' + a + ', b: ' + b + ', d: ' + d);
    a.style.left = b + 'px';
    a.style.bottom = d + 'px';
  // };
  },
// picasaInfoWindow$window.prototype.onRemove = function () {
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
    
  // };
  },
// picasaInfoWindow$window.prototype.copy = function () {
  copy: function () {
    picasa.log('picasaInfoWindow$window.copy');
    return new picasaInfoWindow$window(this.doc_, this.style_);
  // };
  },
// picasaInfoWindow$window.prototype.draw = function () {
  draw: function () {
    picasa.log('picasaInfoWindow$window.draw');
    if (this.visible_) {
      //    var a = this.getProjection(),
      ///    var a = L.Projection.LonLat(),
      //      a = a.fromLatLngToDivPixel(this.markerPoint_);
      ///      a = a.project(this.markerPoint_);
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
  // };
  },
// picasaInfoWindow$window.prototype.openInfoWindowOnMarker = function (a, b) {
  openInfoWindowOnMarker: function (a, b) {
    picasa.log('picasaInfoWindow$window.openInfoWindowOnMarker -  a: ' + a + ', b: ' + b);
    //  var d = a.getIcon().anchor,
    var d = L.point(a.getIcon().options.iconAnchor),
      //  c = new google.maps.Point(5, 1);
      c = L.point(5, 1);
    this.openInfoWindow(
      //    a.getPosition(),
      a.getLatLng(),
      b,
      //    new google.maps.Point(d.x - c.x, d.y - c.y)
      L.point(d.x - c.x, d.y - c.y)
    );
  // };
  },
// picasaInfoWindow$window.prototype.openInfoWindow = function (a, b, d) {
    openInfoWindow: function (a, b, d) {
    picasa.log('picasaInfoWindow$window.openInfoWindow -  a: ' + a + ', b: ' + b + ', d: ' + d);
    this.infoWindowDiv_ &&
      //    ((this.infoWindowOffset_ = d || new google.maps.Point(0, 0)),
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
//         (this.infoWindowDiv_.style.zIndex = 100),
        this.setShow(!0),
        this.draw());
  // };
  },
// picasaInfoWindow$window.prototype.setShow = function (a) {
  setShow: function (a) {
    picasa.log('picasaInfoWindow$window.setShow -  a: ' + a);
    this.visible_ = a;
    this.infoWindowDiv_ &&
      ((this.infoWindowDiv_.style.display = a ? '' : 'none'),
        (this.bottomImageDiv_.style.display = a ? '' : 'none'));
  // };
  },
// picasaInfoWindow$window.prototype.isHidden = function () {
  isHidden: function () {
    picasa.log('picasaInfoWindow$window.isHidden');
    return !this.visible_;
  // };
  },
// picasaInfoWindow$window.prototype.setAutoPanning = function (a) {
  setAutoPanning: function (a) {
    picasa.log('picasaInfoWindow$window.setAutoPanning -  a: ' + a);
    this.autoPanning_ = a;
  // };
  }
});
window['picasaInfoWindow.remove'] = picasaInfoWindow$window.prototype.remove;
window['picasaInfoWindow.copy'] = picasaInfoWindow$window.prototype.copy;
window['picasaInfoWindow.draw'] = picasaInfoWindow$window.prototype.draw;
window['picasaInfoWindow.setShow'] = picasaInfoWindow$window.prototype.setShow;
window['picasaInfoWindow.setAutoPanning'] = picasaInfoWindow$window.prototype.setAutoPanning;
picasa = picasa || {};
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
//picasa.initLog();
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
  //  google.maps.MapTypeId.ROADMAP,
  //  google.maps.MapTypeId.SATELLITE,
  //  google.maps.MapTypeId.HYBRID,
  //  google.maps.MapTypeId.TERRAIN,
  'OpenStreetMap',
  'Esri.WorldImagery',
];
function Size(width, height) {
  this.width = width;
  this.height = height;
};
var picasa$geoPanelClass = function (a, b, d, c, e) {
  this.map_ = a;
  this.geocoder_ = e;
  this.searchMarkerOptions_ = {
    icon: d,
    draggable: !0
  };
//  this.allMarkers_ = [];
  this.allMarkers_ = L.featureGroup();
  this.MarkerPicasaData_ = [];
  this.regularMarkerOptions_ = {
    icon: b,
    draggable: !0
  };
  //  this.panSize_ = new google.maps.Size(0, 0);
  this.panSize_ = new Size(0, 0);
  this.infoWindow_ = c;
  //  a = new google.maps.OverlayView();
  a = L.popup().setLatLng(L.latLng(0, 0));
  a.draw = function () {};
  //  a.setMap(this.map_);
///  a.addTo(this.map_);
  this.hiddenOverlay_ = a;
  this.infoWindow_ &&
    (this.infoWindow_.DetachFromMap(), this.infoWindow_.AttachToMap(this.map_));
};
picasa$geoPanelClass.prototype.searchMarker_ = null;
picasa$geoPanelClass.prototype.searchMarkerPicasaData_ = null;
picasa$geoPanelClass.prototype.SetMarkerPicasaData = function (a, b) {
  if (this.searchMarker_ === a) return (this.searchMarkerPicasaData_ = b), !0;
//  var d = this.allMarkers_.indexOf(a);
  var d = this.allMarkers_.hasLayer(a) ? this.allMarkers_.getLayerId(a) : -1;
  if (-1 === d)
    return (
      picasa.log(
        'SetMarkerPicasaData - Market not found in allMarkers_' +
        //          a.getPosition()
        a.getLatLng()
      ),
      !1
    );
  //  picasa.log('SetMarkerPicasaData - index:' + d + ',marker:' + a.getPosition());
  picasa.log('SetMarkerPicasaData - index:' + d + ',marker:' + a.getLatLng());
  this.MarkerPicasaData_[d] = b;
  return !0;
};
picasa$geoPanelClass.prototype.GetMarkerPicasaData = function (a) {
  if (this.searchMarker_ === a) return this.searchMarkerPicasaData_;
  if (null === a) return picasa.log('GetMarkerPicasaData(null)'), null;
//  var b = this.allMarkers_.indexOf(a);
  var b = this.allMarkers_.hasLayer(a) ? this.allMarkers_.getLayerId(a) : -1;
  if (-1 === b)
    return (
      picasa.log(
        'GetMarkerPicasaData - Market not found in allMarkers_' +
        //          a.getPosition()
        a.getLatLng()
      ),
      null
    );
  //  picasa.log('GetMarkerPicasaData - index:' + b + ',marker:' + a.getPosition());
  picasa.log('GetMarkerPicasaData - index:' + b + ',marker:' + a.getLatLng());
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
//   alert("a: " + a + "\n b:" + b + "\n d:" + d + "\n c:" + c + "\n e:" + e);
  picasa.initLog();
  document.getElementById('errorDiv').innerHTML = b;
  document.getElementById('searchErrorDiv').innerHTML = d;
  document.getElementById('addMarker').setAttribute('alt', c);
  try {
    try {
      eval(e);
    } catch (f) {}
    //    var g = {
    //        mapTypeId: google.maps.MapTypeId.ROADMAP,
    //        center: new google.maps.LatLng(40.979898, -98.261719),
    //        zoom: 4,
    //        disableDefaultUI: !0,
    //        mapTypeControl: !0,
    //        mapTypeControlOptions: {
    //          mapTypeIds: picasa.maptypes,
    //          position: google.maps.ControlPosition.TOP_RIGHT,
    //          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    //        },
    //        zoomControl: !0,
    //        scaleControl: !0,
    //        draggable: !0,
    //      },
    //      h = new google.maps.Map(document.getElementById('map_canvas'), g);

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

    var h = L.map('map_canvas', { zoomControl:false, zoomAnimation:false, fadeAnimation:false, markerZoomAnimation:false, layers:[osm]}).setView([40.979898, -98.261719], 4);
    var baseMaps = {
      "OpenStreetMap": osm,
      "OpenTopoMap": topoMap,
      "Esri.WorldImagery": sat
    };

    L.control.layers(baseMaps).addTo(h);
    L.control.zoom().addTo(h);
    L.control.scale().addTo(h);

    //    b = {};
    //    d = {};
    //    b.v3 = {};
    //    d.v3 = {};
    //    c = [];
    //    c.push('file://');
    //    c.push(a);
    //    c.push('mm_20_red.png');
    //    b.image = c.join('');
    //    c = [];
    //    c.push('file://');
    //    c.push(a);
    //    c.push('mm_20_shadow.png');
    //    b.shadow = c.join('');
    //    d.shadow = c.join('');
    //    b.iconSize = new google.maps.Size(12, 20);
    ///    b.iconSize = [12, 20];
    //    b.shadowSize = new google.maps.Size(22, 20);
    ///    b.shadowSize = [22, 20];
    //    b.iconAnchor = new google.maps.Point(6, 20);
    ///    b.iconAnchor = L.point(6, 20);
    //    b.infoWindowAnchor = new google.maps.Point(5, 1);
    //    b.infoWindowAnchor = L.point(5, 1);
    //    b.v3.size = b.iconSize;
    //    b.v3.anchor = b.iconAnchor;
    //    b.v3.url = b.image;
    //    b.v3.shadow = { size: b.shadowSize, url: d.shadow };
    //    c = [];
    //    c.push('file://');
    //    c.push(a);
    //    c.push('mm_20_green.png');
    //    d.image = c.join('');
    //    d.iconSize = new google.maps.Size(12, 20);
    ///    d.iconSize = [12, 20];
    //    d.shadowSize = new google.maps.Size(22, 20);
    ///    d.shadowSize = [22, 20];
    //    d.iconAnchor = new google.maps.Point(6, 20);
    ///    d.iconAnchor = L.point(6, 20);
    //    d.infoWindowAnchor = new google.maps.Point(5, 1);
    //    d.infoWindowAnchor = L.point(5, 1);
    //     d.v3.size = d.iconSize;
    //     d.v3.anchor = d.iconAnchor;
    //     d.v3.url = d.image;
    //     d.v3.shadow = { size: d.shadowSize, url: d.shadow };
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
        //        new google.maps.Size(24, 24),
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
      //new google.maps.Geocoder()
      null
    );
    picasa.scriptQueue.scheduleQueueProcessing();
  } catch (l) {
    return (
      picasa.log('Error: ' + l),
//       (document.getElementById('errorDiv').style.display = 'block'),
//      (document.getElementById('errorDiv').innerText = l),
//       (document.getElementById('errorDiv').innerText = l.stack),
//       (document.getElementById('addMarkerDiv').style.display = 'none'),
      !1
    );
  }
  document.getElementById('errorDiv').style.display = 'none';
  document.getElementById('addMarkerDiv').style.display = 'block';
  a = document.createElement('div');
  k = document.getElementById('addMarkerDiv');
  a.appendChild(k);
  a.index = 0;
  //   h.controls[google.maps.ControlPosition.TOP_LEFT].push(a);
  //   google.maps.event.addDomListener(h, 'click', function (a) {
  //     picasa.log(a.latLng);
  //   });
  return !0;
}
picasa.handleClick = function () {
  var a = picasa.geoPanelData.GetMarkerPicasaData(this);
  if (a)
    if (0 < a.thumburl_.length)
      picasa.openMarkerInfoWindow(this, '', 'Place photos to this new mark');
    else {
      var b = document.getElementById('hiddenDiv');
      b.setAttribute('checksum', a.checksum_.toString());
      //      b.setAttribute('latlng', this.getPosition().toUrlValue());
      b.setAttribute('latlng', this.getLatLng().toString());
      b.setAttribute('markindex', a.index_.toString());
      picasa.notifyPicasa('hiddenDiv');
    }
};
picasa.handleDragStart = function () {
  picasa.geoPanelData.infoWindow_.setShow(!1);
  //  this.setIcon(picasa.geoPanelData.searchMarkerOptions_.icon.v3);
  picasa.geoPanelData.GetMarkerPicasaData(this);
};
picasa.handleDragEnd = function () {
  var a = picasa.geoPanelData.GetMarkerPicasaData(this);
  if (a)
    if (0 < a.thumburl_.length)
      picasa.openMarkerInfoWindow(this, '', 'Place photos to this new mark');
    else {
      var b = document.getElementById('hiddenDiv');
      b &&
        (b.setAttribute('checksum', a.checksum_.toString()),
          //        b.setAttribute('latlng', this.getPosition().toUrlValue()),
          b.setAttribute('latlng', this.getLatLng().toString()),
          b.setAttribute('markindex', a.index_.toString()),
          picasa.notifyPicasa('hiddenDiv'));
    }
};
picasa.cancelMarker = function (a) {
  picasa.geoPanelData.infoWindow_.setShow(!1);
  if (
    picasa.geoPanelData.map_ &&
//     -1 != a &&
//     a < picasa.geoPanelData.allMarkers_.length
    picasa.geoPanelData.allMarkers_.hasLayer(a)
  ) {
//    a = picasa.geoPanelData.allMarkers_[a];
    a = picasa.geoPanelData.allMarkers_.getLayer(a);
    var b = picasa.geoPanelData.GetMarkerPicasaData(a);
    null !== b &&
      //      b.MarkerMoved(a.getPosition()) &&
      b.MarkerMoved(a.getLatLng()) &&
      //      (a.setIcon(picasa.geoPanelData.regularMarkerOptions_.icon.v3),
      (a.setIcon(picasa.geoPanelData.regularMarkerOptions_.icon),
        a.setPosition(b.original_latlng_),
        picasa.geoPanelData.map_.panTo(b.original_latlng_));
  }
};
picasa.openMarkerInfoWindow = function (a, b, d) {
  picasa.log('openMarkerInfoWindow -  a: ' + a + ', b: ' + b + ', d: ' + d);
  b = picasa.geoPanelData.GetMarkerPicasaData(a);
  if (null !== a && null !== b && 0 != b.thumburl_.length) {
    var c = '';
    if (
      a == picasa.geoPanelData.searchMarker_ ||
//       b.MarkerMoved(a.getPosition())
      b.MarkerMoved(a.getLatLng())
    ) {
      b = a;
      c = d;
      d = [];
//       var e = b.getPosition();
      var e = b.getLatLng();
      b = picasa.geoPanelData.GetMarkerPicasaData(b);
      null != e &&
        c.length &&
        (d.push('"geotag:'),
          d.push(b.checksum_.toString()),
          d.push(','),
          d.push(e.toUrlValue()),
          d.push('"'));
      e = -1 != b.checksum_ ? '"showphotos:' + b.checksum_ + '"' : '';
      c = [];
      c.push('<table border="0" cellpadding="1" cellspacing="2" width="180">');
      var f = '',
        f = -1 != b.index_ ?
        1 < b.num_photos_ ?
        tcMovePhotos :
        tcMovePhoto :
        1 < b.num_photos_ ?
        tcPutPhotos :
        tcPutPhoto;
      1 < b.num_photos_ && (f = f.replace('%d', b.num_photos_.toString()));
      c.push(
        '<tr><td colspan="3" width="100%" class="info_window_title" nowrap>'
      );
      c.push(f);
      c.push('</td></tr>');
      e.length ?
        (c.push(
            '<tr><td colspan="3"><div class="info_window_thumb"><a href='
          ),
          c.push(e),
          c.push(' title="'),
          c.push(tcSearchTip),
          c.push('"><img src="'),
          c.push(b.thumburl_),
          c.push('?'),
          c.push(new Date().getTime()),
          c.push('"></a></div></td></tr>')) :
        (c.push(
            '<tr><td colspan="3"><div class="info_window_thumb"><img src="'
          ),
          c.push(b.thumburl_),
          c.push('?'),
          c.push(new Date().getTime()),
          c.push('"></div></td></tr>'));
      e = [];
      f = [];
      d.length &&
        (e.push('<td width="40%"><a href='),
          e.push(d.join('')),
          e.push('><div class="info_window_footer_button">'),
          e.push(tcOk),
          e.push('</div></a></td>'));
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
    } else
      (c = picasa.geoPanelData.GetMarkerPicasaData(a)) ?
      ((d = -1 != c.checksum_ ? '"cleargeotag:' + c.checksum_ + '"' : ''),
        (e = -1 != c.checksum_ ? '"showphotos:' + c.checksum_ + '"' : ''),
        (b = []),
        b.push(
          '<table border="0" cellpadding="1" cellspacing="2" width="180">'
        ),
        (f = []),
        1 < c.num_photos_ ?
        f.push(tcPhotosHere.replace('%d', c.num_photos_.toString())) :
        f.push(tcPhotoHere),
        b.push(
          '<tr><td colspan="3" width="100%" class="info_window_title" nowrap>'
        ),
        b.push(
          '<a href="javascript:picasa.geoPanelData.infoWindow_.setShow(false)">'
        ),
        b.push('<img width="14" height="13" title="'),
        b.push(tcCloseTip),
        b.push('" src="close.gif" class="info_window_close"></a>'),
        b.push(f.join('')),
        b.push('</td></tr>'),
        b.push('<tr><td colspan="3"><div class="info_window_thumb"><a href='),
        b.push(e),
        b.push(' title="'),
        b.push(tcSearchTip),
        b.push('"><img src="'),
        b.push(c.thumburl_),
        'data:' != c.thumburl_.substr(0, 5) &&
        (b.push('?'), b.push(new Date().getTime())),
        b.push('"></a></div></td></tr>'),
//         b.push('<tr>'),
//         (c = []),
//         d.length &&
//         (c.push('<td><a href='),
//           c.push(d),
//           c.push('title="'),
//           c.push(tcEraseTip),
//           c.push('"><div width="60%" class="info_window_footer_button">'),
//           c.push(tcEraseButton),
//           c.push('</div></a></td>')),
//         b.push('<td width="20%"></td>'),
//         c.length && b.push(c.join('')),
//         b.push('<td width="20%"></td>'),
//         b.push('</tr></table>'),
        b.push('</table>'),
        (d = b.join(''))) :
      (d = '');
    c = d;
    picasa.geoPanelData.infoWindow_.openInfoWindowOnMarker(a, c);
  }
};
picasa.removeMarkersFromMap = function (a) {
//   for (var b = 0; b < a.length; b++) a[b].setMap(null);
///   for (var b = 0; b < a.length; b++) picasa.geoPanelData.map_.removeLayer(a[b]);
  a.clearLayers();
};
picasa.beginAddingMarkers = function () {
try {
  picasa.geoPanelData.map_ &&
    (picasa.removeMarkersFromMap(picasa.geoPanelData.allMarkers_),
      picasa.removeSearchMarker(),
//      (picasa.geoPanelData.allMarkers_ = []),
      (picasa.geoPanelData.allMarkers_ = L.featureGroup()),
      (picasa.geoPanelData.searchMarker_ = null),
      (picasa.geoPanelData.MarkerPicasaData_ = []),
      picasa.geoPanelData.infoWindow_ &&
      (picasa.geoPanelData.infoWindow_.DetachFromMap(),
        picasa.geoPanelData.infoWindow_.AttachToMap(picasa.geoPanelData.map_)),
      null === picasa.geoPanelData.currBounds_ &&
      //      (picasa.geoPanelData.currBounds_ = new google.maps.LatLngBounds()));
      (picasa.geoPanelData.currBounds_ = L.latLngBounds()));
  } catch (l) { return showError(l); }
};
picasa.addMarker = function (a, b, d, c) {
picasa.log('picasaInfoWindow$window.openInfoWindow -  a: ' + a + ', b: ' + b + ', d: ' + d + ', c: ' + c);
try {
  if (picasa.geoPanelData.map_) {
    //     var e = new google.maps.LatLng(a, b);
    var e = L.latLng(a, b);
    picasa.geoPanelData.currBounds_.extend(e);
    b = {
      //      map: picasa.geoPanelData.map_,
      //       position: e,
//      draggable: !0,
//      draggable: !1,
      //      raiseOnDrag: !0,
      //      icon: picasa.geoPanelData.regularMarkerOptions_.icon.v3,
      icon: picasa.geoPanelData.regularMarkerOptions_.icon,
      //      shadow: picasa.geoPanelData.regularMarkerOptions_.icon.v3.shadow,
    };
//    a = picasa.geoPanelData.allMarkers_.length;
//    d = new picasa$markerData(d, a, '', e, c);
    //    c = new google.maps.Marker(b);
    m = L.marker(e, b);
    picasa.geoPanelData.allMarkers_.addLayer(m);
    a = picasa.geoPanelData.allMarkers_.getLayerId(m);
    d = new picasa$markerData(d, a, '', e, c);
    c = m;
    picasa.geoPanelData.SetMarkerPicasaData(c, d);
    //     google.maps.event.addListener(c, 'click', picasa.handleClick);
    c.addEventListener('click', picasa.handleClick);
    //     google.maps.event.addListener(c, 'dragstart', picasa.handleDragStart);
///    c.addEventListener(c, 'dragstart', picasa.handleDragStart);
    //     google.maps.event.addListener(c, 'dragend', picasa.handleDragEnd);
///    c.addEventListener(c, 'dragend', picasa.handleDragEnd);
  }
  } catch (l) { return showError(l); }
};
picasa.endAddingMarkers = function (a) {
picasa.log('endAddingMarkers -  a: ' + a);
try {
//   var b = picasa.geoPanelData.allMarkers_.length;
  var b = picasa.geoPanelData.allMarkers_.getLayers().length;
//   if (b) {
//     var d = picasa.geoPanelData.map_.getZoom();
//     picasa.geoPanelData.map_.fitBounds(picasa.geoPanelData.currBounds_);
//     var c = picasa.geoPanelData.map_.getZoom();
//     0 > c && (c = 0);
//     15 < c && (c = 15);
//     picasa.geoPanelData.map_.setZoom(a ? c : d);
//     a = picasa.geoPanelData.currBounds_.getCenter();
//     1 == b
//       ? picasa.geoPanelData.map_.panTo(a)
//       : picasa.geoPanelData.map_.setCenter(a);
  if (b > 0) {
//     picasa.geoPanelData.allMarkers_.addTo(picasa.geoPanelData.map_);
//     var d = picasa.geoPanelData.map_.getZoom();
//     if (picasa.geoPanelData.currBounds_.getNorthWest() == picasa.geoPanelData.currBounds_.getSouthEast()) {
//       picasa.geoPanelData.currBounds_ = picasa.geoPanelData.currBounds_.getNorthWest().toBounds(200);
//     }
//     picasa.geoPanelData.map_.fitBounds(picasa.geoPanelData.currBounds_);
//     var c = picasa.geoPanelData.map_.getZoom();
//     0 > c && (c = 0);
//     15 < c && (c = 15);
//     picasa.geoPanelData.map_.setZoom(a ? c : d);
//     a = picasa.geoPanelData.currBounds_.getCenter();
//     picasa.geoPanelData.map_.panTo(a);

    picasa.geoPanelData.map_.fitBounds(picasa.geoPanelData.currBounds_, 
      { maxZoom: 15, padding:	[10, 10] });
    picasa.geoPanelData.allMarkers_.addTo(picasa.geoPanelData.map_);

  }
  picasa.geoPanelData.currBounds_ = null;
  } catch (l) { return showError(l); }
};
picasa.updateMarker = function (a, b) {
  picasa.log('updateMarker -  a: ' + a + ', b: ' + b);
//   if (picasa.geoPanelData.map_ && a < picasa.geoPanelData.allMarkers_.length) {
  a = Number(a);
  if (picasa.geoPanelData.map_ && picasa.geoPanelData.allMarkers_.hasLayer(a)) {
//    var d = picasa.geoPanelData.allMarkers_[a];
    var d = picasa.geoPanelData.allMarkers_.getLayer(a);
    picasa.geoPanelData.GetMarkerPicasaData(d).thumburl_ = b;
    picasa.openMarkerInfoWindow(d, '', 'Place photos to this new mark');
  }
};
picasa.handlePanning = function () {
  picasa.geoPanelData.panning_ &&
    null !== picasa.geoPanelData.map_ &&
    picasa.geoPanelData.map_.panBy(
      -picasa.geoPanelData.panSize_.width,
      -picasa.geoPanelData.panSize_.height
    );
};
picasa.newPlaceMarker = function (a, b) {
  if (picasa.geoPanelData.map_) {
    var d = document.getElementById('addMarkerDiv'),
      c = d.offsetLeft + d.offsetParent.offsetLeft + 1.5 * d.offsetWidth,
      d = d.offsetTop + d.offsetParent.offsetTop + d.offsetHeight,
      c = picasa.fromContainerPixelToLatLng(c, d);
    picasa.geoPanelData.searchMarker_ = picasa.createSearchMarker(c, b, a, '');
    if (null !== picasa.geoPanelData.searchMarker_) {
      picasa.geoPanelData.panning_ = !1;
      //      picasa.geoPanelData.panSize_ = new google.maps.Size(0, 0);
      picasa.geoPanelData.panSize_ = new Size(0, 0);
      var e = null;
        //         e = google.maps.event.addListener(
        //           picasa.geoPanelData.map_,
        picasa.geoPanelData.map_.addEventListener(
          'mousemove',
          function (a) {
            if (picasa.geoPanelData.searchMarker_) {
              var b = a.latLng;
              picasa.geoPanelData.searchMarker_.setPosition(b);
              a = picasa.geoPanelData.map_.getDiv().offsetWidth;
              var c = picasa.geoPanelData.map_.getDiv().offsetHeight,
                d = 0,
                e = 0;
              89 < b.lat() ||
                -89 > b.lat() ||
                ((b = picasa.fromLatLngToContainerPixel(b)),
                  (d = 10 > b.x ? 2 : 10 > a - b.x ? -2 : 0),
                  (e = 10 > b.y ? 2 : 10 > c - b.y ? -2 : 0),
                  0 != d || 0 != e ? //                  ? ((picasa.geoPanelData.panSize_ = new google.maps.Size(
                  ((picasa.geoPanelData.panSize_ = new Size(d, e)),
                    (picasa.geoPanelData.panning_ = !0),
                    picasa.handlePanning()) :
                  (picasa.geoPanelData.panning_ = !1));
            }
          }
        );
      //       google.maps.event.addListener(
      //         picasa.geoPanelData.map_,
      picasa.geoPanelData.map_.addEventListener(
        'click',
        function () {
          //           google.maps.event.clearListeners(picasa.geoPanelData.map_, 'moveend');
          //           e &&
          //             (google.maps.event.removeListener(e),
          //             (e = null),
          //             picasa.geoPanelData.searchMarker_ &&
          //               picasa.openMarkerInfoWindow(
          //                 picasa.geoPanelData.searchMarker_,
          //                 '',
          //                 a
          //               ));
        }
      );
    }
  }
};
picasa.removeSearchMarker = function () {
  picasa.geoPanelData.searchMarker_ &&
    (picasa.geoPanelData.searchMarker_.setMap(null),
      (picasa.geoPanelData.searchMarker_ = null),
      picasa.geoPanelData.infoWindow_ &&
      (picasa.geoPanelData.infoWindow_.DetachFromMap(),
        picasa.geoPanelData.infoWindow_.AttachToMap(picasa.geoPanelData.map_)));
};
picasa.createSearchMarker = function (a, b, d, c) {
  if (picasa.geoPanelData.map_) {
    picasa.removeSearchMarker();
    var e = {
      //       position: a,
      //       map: picasa.geoPanelData.map_,
      draggable: !0,
      //      icon: picasa.geoPanelData.searchMarkerOptions_.icon.v3,
      icon: picasa.geoPanelData.searchMarkerOptions_.icon,
    };
    //     picasa.geoPanelData.searchMarker_ = new google.maps.Marker(e);
    x = picasa.geoPanelData.map_.containerPointToLatLng(a); 
    picasa.geoPanelData.searchMarker_ = L.marker(x, e).addTo(picasa.geoPanelData.map_);
    a = new picasa$markerData(
      -1,
      -1,
      b,
      a,
      picasa.geoPanelData.currNumSelected_
    );
    picasa.geoPanelData.SetMarkerPicasaData(
      picasa.geoPanelData.searchMarker_,
      a
    );
    //     google.maps.   .addListener(
    //       picasa.geoPanelData.searchMarker_,
    picasa.geoPanelData.searchMarker_.addEventListener(
      'click',
      function () {
        picasa.openMarkerInfoWindow(picasa.geoPanelData.searchMarker_, c, d);
      }
    );
    //     google.maps.event.addListener(
    //       picasa.geoPanelData.searchMarker_,
    picasa.geoPanelData.searchMarker_.addEventListener(
      'dragstart',
      function () {
        picasa.geoPanelData.infoWindow_.setShow(!1);
      }
    );
    //     google.maps.event.addListener(
    //       picasa.geoPanelData.searchMarker_,
    picasa.geoPanelData.searchMarker_.addEventListener(
      'dragend',
      function () {
        picasa.openMarkerInfoWindow(picasa.geoPanelData.searchMarker_, c, d);
      }
    );
    return picasa.geoPanelData.searchMarker_;
  }
};
picasa.fromContainerPixelToLatLng = function (a, b) {
  //  var d = new google.maps.Point(a, b),
  var d = L.point(a, b),
    //     c = new google.maps.LatLng(0, 0);
    c = L.latLng(0, 0);
  picasa.geoPanelData.hiddenOverlay_ &&
    //     (c = picasa.geoPanelData.hiddenOverlay_
    //       .getProjection()
    //       .fromContainerPixelToLatLng(d));
    (c = picasa.geoPanelData.map_.containerPointToLatLng(d));
  return c;
};
picasa.fromLatLngToContainerPixel = function (a) {
  //  var b = new google.maps.Point(0, 0);
  var b = L.point(0, 0);
  picasa.geoPanelData.hiddenOverlay_ &&
    //     (b = picasa.geoPanelData.hiddenOverlay_
    //       .getProjection()
    //       .fromLatLngToContainerPixel(a));
    (b = picasa.geoPanelData.map_.latLngToContainerPoint(a));
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
    picasa.geoPanelData.searchMarker_.setPosition(d);
  }
};
picasa.endDragAndDrop = function (a, b, d, c, e) {
  picasa.geoPanelData.map_ &&
    (a ?
      picasa.removeSearchMarker() :
      null !== picasa.geoPanelData.searchMarker_ &&
      ((a = picasa.fromContainerPixelToLatLng(b, d)),
        picasa.createSearchMarker(a, e, c, ''),
        picasa.openMarkerInfoWindow(picasa.geoPanelData.searchMarker_, '', c)));
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
picasa.search = function (a, b, d) {
  picasa.geoPanelData.map_ &&
    picasa.geoPanelData.geocoder_ &&
    picasa.geoPanelData.geocoder_.geocode({
      address: a
    }, function (a, e) {
      if (e == google.maps.GeocoderStatus.OK && a && 0 != a.length) {
        var f = a[0].formatted_address,
          g = a[0].geometry.location;
        picasa.geoPanelData.infoWindow_.setAutoPanning(!1);
        picasa.geoPanelData.map_.setCenter(g);
        picasa.createSearchMarker(g, d, b, f);
        null !== picasa.geoPanelData.searchMarker_ &&
          (picasa.openMarkerInfoWindow(picasa.geoPanelData.searchMarker_, f, b),
            setTimeout(
              'picasa.geoPanelData.infoWindow_.setAutoPanning(true);',
              2e3
            ));
      } else picasa.log('picasa.search - No results, response code:' + e), (document.getElementById('searchErrorDiv').style.display = 'block');
    });
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
///          alert("eval(c): " + c);
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

