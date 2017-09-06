// this part is my google error :)
function googleError(){
  alert("get a new computer");
}

// this part is for the sidebar to show and hide
var toggleStatus = 0;

var toggleMenu= document.querySelector('#toggleMenu');
var main = document.querySelector('main');
var sidebar = document.querySelector('#sidebar');

toggleMenu.addEventListener('click', function(e) {
  if (toggleStatus == 1) {
    sidebar.classList.toggle('open');
    e.stopPropagation();
   toggleStatus = 0;
 }
 else if (toggleStatus === 0) {
    sidebar.classList.remove('open');
    toggleStatus = 1;
 }
});


var map;

// this part is my model
var locations = [
         {title: 'White Tower of Thessaloniki',
          content: '',
           location: {lat: 40.626446, lng:22.948426}},
          {title: 'Museum of Photography Thessaloniki',
          content: '',
           location: {lat: 40.632874, lng:22.935479}},
          {title: 'Teloglion Fine Arts Foundation',
            content: '',
           location: {lat: 40.632854, lng:22.941567}},
          {title: 'War Museum of Thessaloniki',
          content: '',
           location: {lat: 40.624308, lng: 22.95953}},
          {title: 'Jewish Museum of Thessaloniki',
           content: '',
          location: {lat: 40.635132, lng: 22.939538}}
        ];

function initMap() {

  var styles = [
      {
        featureType: 'water',
        stylers: [
          { color: '#31A9B8' }
        ]
      },{
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
          { color: '#ffffff' },
          { weight: 6 }
        ]
      },{
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
          { color: '#e85113' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          { color: '#efe9e4' },
          { lightness: -40 }
        ]
      },{
        featureType: 'transit.station',
        stylers: [
          { weight: 9 },
          { hue: '#e85113' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
          { visibility: 'off' }
        ]
      },{
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
          { lightness: 100 }
        ]
      },{
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          { lightness: -100 }
        ]
      },{
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          { visibility: 'on' },
          { color: '#f0e4d3' }
        ]
      },{
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          { color: '#efe9e4' },
          { lightness: -25 }
        ]
      }
    ];

       map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 40.640063, lng: 22.944419},
         zoom: 13,
         styles: styles,
         fullscreenControl: true,
         mapTypeControl: false
       });

       var largeInfowindow = new google.maps.InfoWindow();
       var bounds = new google.maps.LatLngBounds();


       for (var i = 0; i < locations.length; i++) {
               // Get the position from the location array.
               var position = locations[i].location;
               var title = locations[i].title;
               var defaultIcon = makeMarkerIcon('0091ff');
                var highlightedIcon = makeMarkerIcon('FFFF24');
               // Create a marker per location, and put into markers array.
                var marker = new google.maps.Marker({
                 position: position,
                 title: title,
                 map: map,
                 icon: defaultIcon,
                animation: google.maps.Animation.DROP,

                 id: i
               });

               locations[i].marker = marker ;

               bounds.extend(marker.position);

            }
            map.fitBounds(bounds);

            // This function takes in a COLOR, and then creates a new marker
               // icon of that color. The icon will be 21 px wide by 34 high, have an origin
               // of 0, 0 and be anchored at 10, 34).
               function makeMarkerIcon(markerColor) {
                 var markerImage = new google.maps.MarkerImage(
                   'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
                   '|40|_|%E2%80%A2',
                   new google.maps.Size(21, 34),
                   new google.maps.Point(0, 0),
                   new google.maps.Point(10, 34),
                   new google.maps.Size(21,34));
                 return markerImage;
               }

            function populateInfoWindow (marker, infowindow){

                // this part is my wikipedia url
              var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
              var wikiTimeout = setTimeout(function () {
        alert("failed to load wikipedia page");
    }, 4000);
                // this is my ajax request
                      $.ajax({
                     url: wikiURL,
                     dataType: "jsonp",
                     success: function (response) {
                      var articleList = response[3];
                      var articleName = response[0];
                      if (infowindow.marker != marker){
                        infowindow.marker = marker;
                        infowindow.open(map, marker);
                        infowindow.addListener('closeclick', function(){
                        infowindow.setMarker = null;
                        });
                         infowindow.setContent('<div>' + '<p>' + 'Wikipedia Link' + '</p>' + '<a href ="' + articleList + '">' + articleName + '</a>'  + '</div>');


                        clearTimeout(wikiTimeout);
                      }
                    }
                  });

                }
                // this part is my class
                var Loc = function(data){
                  this.title = data.title;
                  this.location = data.location;
                  this.marker = data.marker;
                };
                  // this part is my ViewModel AKA octopus
                var ViewModel = function(){
                 var self = this;

                 self.listLoc = ko.observableArray();

                 locations.forEach(function(locItem){
                 self.listLoc.push(new Loc(locItem));
               });
                  //this part is my filter for the list
                self.filter = ko.observable('');

                self.filteredItems = ko.computed(function () {
                  var filter = self.filter().toLowerCase();

                  if (!filter) {

                    ko.utils.arrayForEach(self.listLoc(), function (item) {
                      item.marker.setVisible(true);
                      item.marker.addListener('click', function(){
                     populateInfoWindow(this, largeInfowindow);
                     });
                     item.marker.addListener('mouseover', function() {
                         this.setIcon(highlightedIcon);
                       });
                       item.marker.addListener('mouseout', function() {
                         this.setIcon(defaultIcon);
                       });
                    });
                    return self.listLoc();
                  } else {
                    return ko.utils.arrayFilter(self.listLoc(), function(item) {
                      var result = (item.title.toLowerCase().search(filter) >= 0);
                      item.marker.setVisible(result);

                      return result;
                    });
                  }
                  		});
                        //this part is my function that I data bind so the infowindow opens
                  self.setLoc = function (clickedLoc) {
                     populateInfoWindow (clickedLoc.marker, largeInfowindow);
                     clickedLoc.marker.setIcon(highlightedIcon);
                   };
                };


     ko.applyBindings(new ViewModel());
}
