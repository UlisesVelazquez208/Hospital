<template>
    <div class="map-holder">
        <div :id="mapId" class="map" :key="mapId"></div>
    </div>
</template>

<script>

    import Env from  './../../../Env';

    var GoogleMapsLoader = require('google-maps');
    GoogleMapsLoader.KEY = Env.GOOGLE_API_KEY;
    GoogleMapsLoader.VERSION = '3.39';

    export default {
        name: "abstract-google-map",
        props: {
            mapId: {
                type: String,
                required: true
            },
            locationAsString: {
                type: String,
                required: false,
                default: ""
            },
            latitude:{
                type:String,
                required:false
            },
            longitude:{
                type:String,
                required:false
            },
            locationAsCoordinates: {
                type: Object,
                required: false,
                default: function() {return {}}
            }
        },
        data: function() {
            return this.initialState();
        },
        updated: function() {
            this.resetMap();
            let that = this;
            GoogleMapsLoader.load(function(google) {
                that.initMap();
                that.locateCoordinates();
                // that.adjustAddressLocation();
            }.bind(that));

        },
        methods: {
            resetMap: function() {
                Object.assign(this.$data, this.initialState());
            },
            initialState: function() {
                return {
                    map: null,
                    marker: null,
                };
            },
            /**
             * Init map with random position
             */
            initMap: function() {

               $(document).find(".modal-body").css('padding', 0);

               // initialize Map Object
               this.map = new google.maps.Map($(document).find('#'+this.mapId)[0], {
                   center: new google.maps.LatLng(29.98003, 31.2784877),
                   zoom: 16,
               });

               // initialize Marker Object
               this.marker = new google.maps.Marker({
                   position: new google.maps.LatLng(29.98003, 31.2784877),
                   map: this.map
               });
            },
            /**
             * set map marker with coordinates
             */
            locateCoordinates: function() {
            //     this.map = new google.maps.Map($(document).find('#'+this.mapId)[0], {
            //        center: new google.maps.LatLng(this.latitude*1, this.longitude*1),
            //        zoom: 16,
            //    });
                var theCoordinates = {lat:(this.latitude*1), lng:(this.longitude*1)};
                this.marker.setPosition(theCoordinates);
                google.maps.event.trigger(this.map,'resize');
                this.map.setCenter(this.marker.getPosition());

                // this.marker = new google.maps.Marker({
                //     position: new google.maps.LatLng(this.latitude*1, this.longitude*1),
                //     map: this.map
                // });
                // return;
            },
            /**
             * Adjust The map maker and center using the given address
             */
            adjustAddressLocation: function() {

                let isCoordinates = Object.keys(this.locationAsCoordinates).length == 0 ? false : true;
                let isAddress = this.locationAsString == "" ? false : true;

                if (!isCoordinates && !isAddress) {
                    return;
                }

                if (isCoordinates) {
                    this.marker.setPosition(this.locationAsCoordinates);
                    google.maps.event.trigger(this.map,'resize');
                    this.map.setCenter(this.marker.getPosition());
                    return;
                }

                let that = this;
                (new google.maps.Geocoder).geocode({
                    address: this.locationAsString
                }, function(results, status) {

                    if (status !== "OK") {
                        return;
                    }

                    that.marker.setPosition(results[0].geometry.location);
                    google.maps.event.trigger(that.map,'resize');
                    that.map.setCenter(that.marker.getPosition());

                }.bind(that));
            }
        },
        components: {

        }
    }
</script>

<style type="text/css" lang="scss" scoped>
    .map-holder {
        height: 400px;
        width: 100%;
        border: 1px solid #cecece;
        border-radius: 6px 6px;
        padding: 2px 2px;
    }
    .map {
        width: 100%;
        height: 100%;
    }
</style>
