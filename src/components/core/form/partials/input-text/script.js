import {EventBus} from "../../../../../eventbus/event-bus";

var inputText = {
    // ===Component name
    name: "input-text",
    // ===Props passed to component
    props: {
        name: {
            type: String,
            required: true
        },
        inputLabel: {
            type: String,
            required: true
        },
        inputLabelClass: {
            type: String,
            required: false,
            default: "col-sm-12  col-lg-3 col-form-label"
        },
        inputWrapClass: {
            type: String,
            required: false,
            default: "col-sm-12  col-lg-9"
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
        placeholder: {
            type: String,
            required: true
        },
        value: {
            type: String
        },
        errors: {},
        sourceComponent: {
            type: String,
            required: false,
            default: 'public'
        }
    },
// ===Components used by this component
    components: {}
    ,
// ===component Data properties
    data() {
        return {}
    }
    ,
// ===Code to be executed when Component is mounted
    mounted() {

    }
    ,
// ===Computed properties for the component
    computed: {}
    ,
// ===Component methods
    methods: {
        grabinput: function (data) {

            EventBus.$emit('update-input-field', {
                name: this.name,
                value: data,
                index: this.index,
                source_component: this.sourceComponent
            });
        },
        clearError: function () {
            EventBus.$emit('clear-input-field', {
                name: this.name,
                index: this.index,
                source_component: this.sourceComponent
            });
        }
    }
}
export default inputText;
