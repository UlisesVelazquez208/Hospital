import Multiselect from 'vue-multiselect';
import {EventBus} from "../../../../../eventbus/event-bus";


var inputMultiSelect = {
    // ===Component name
    name: "input-multiselect",
    // ===Props passed to component
    props: {
        name: {
            type: String,
            required: true,
        },
        inputId: {
            type: String,
            required: true,
        },
        inputLabel: {
            type: String,
            required: true
        },
        selectOptions: {
            type: Array,
            required: true,
        },
        inputClass: {
            type: String,
            default:'col-sm-12 col-lg-9 multiselect-container',
            required: false,
        },
        inputplaceholder: {
            type: String
        },
        index: {
            type: Number,
            default: 0,
        },
        errors: {},
        taggable: {
            type: Boolean,
            default: false
        },
        value: {
            type: Array,
        },
        label: {
            type: String,
            default: 'name'
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false
        }
        // selected:{
        //     type:Array
        // }
    },
    // ===Components used by this component
    components: {
        Multiselect
    },
    // ===component Data properties
    data() {
        return {
            options: this.selectOptions,
            selectedData: this.value,
        }
    },
    // ===Computed properties for the component
    created() {
    },
    // ===Component methods
    methods: {
        grabinput: function () {
            EventBus.$emit('update-multi-select', {
                name: this.name,
                value: this.selectedData
            });
        },
        clearError: function () {
            EventBus.$emit('clear-input-field', {
                name: this.name,
            });
        }
    },
    watch: {
        value: function() {
            this.selectedData = this.value;
        }
    }
}
export default inputMultiSelect;
