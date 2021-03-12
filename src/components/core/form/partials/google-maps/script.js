import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps';
import env from './../../../../../Env';

Vue.use(VueGoogleMaps, {
        load: {
            key: env.GOOGLE_API_KEY,
            libraries: 'places'
        }
    }
);

var googleMaps = {
    name: "google-maps",
    props: {
        name: {
            type: String,
            required: true
        },
        inputLabel: {
            type: String,
            required: true
        },
        required: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
        },
        readOnly: {
            type: Boolean,
            required: false,
            default: false
        },
        type: {
            type: String,
            required: false,
            default: "text"
        },
        inputId: {
            type: String,
            required: true
        },
        inputClass: {
            type: String,
            default: ""
        },
        index: {
            type: Number,
            default: 0,
        },
        value: {
            type: String
        },
        errors: {},
        map_markers: {
            type: Array,
            default: function () {
                return [];
            }
        },
        sourceComponent: {
            type: String,
            required: false,
            default: 'public'
        }
    },
    components: {},
    data() {
        return {
            map_center: {
                lat: 30.0444196,
                lng: 31.23571160000006
            },
        }
    },
    mounted() {

    },
    computed: {},
    methods: {
        clearError: function () {
            this.$eventBus.$emit('clear-input-field', {
                name: this.name,
                index: this.index,
                source_component: this.sourceComponent
            });
        },
        setPlace(place){

            this.$eventBus.$emit('update-google-maps', {
                name: this.name,
                value: place.formatted_address,
                index: this.index,
                source_component: this.sourceComponent
            });
        },
        setMarkerPlace(position){

        }
    }
}
export default googleMaps;
