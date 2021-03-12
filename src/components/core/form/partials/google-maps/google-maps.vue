<template>

    <div class="form-group row">
        <label  v-if="inputLabel" :for="inputId" class="col-sm-12  col-lg-3 col-form-label">{{inputLabel}}</label>
        <div class="col-sm-12  col-lg-9">
            <gmap-autocomplete placeholder="Search for a Place" @place_changed="setPlace"
                               :class="inputClass" :value="value" class="form-control input-field"></gmap-autocomplete>

            <div v-if="errors" class="text-danger">
                {{ errors }}
            </div>
        </div>
    </div>

</template>

<script>
    import googleMaps from "./script";

    export default googleMaps;

</script>

<style type="text/css" lang="scss">
    .input-text-label {
        /*display: inline-block;*/
        /*width: 140px;*/
        /*text-align: right;*/
    }

    .input-field {
        height: 40px;
    }

    .col-form-label {
        /*font-weight: bold;*/
        color: rgba(1, 0, 0, 0.65);
    }

    // puts the google places autocomplete dropdown results above the bootstrap modal 1050 zindex.
    .pac-container {
        z-index: 1051 !important;
    }

</style>

