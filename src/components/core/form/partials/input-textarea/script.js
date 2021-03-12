import {EventBus} from "../../../../../eventbus/event-bus";

var inputTextarea = {
    // ===Component name
    name: "input-textarea",
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
        required: {
            type: Boolean,
            default: true
        },
        inputId: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            required: true
        },
        row: {
            type: Number,
            default: "5"
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
        sourceComponent: {
            type: String,
            required: false,
            default: 'public'
        }

    },
    // ===Components used by this component
    components: {},
    // ===component Data properties
    data() {
        return {}
    },
    // ===Code to be executed when Component is mounted
    mounted() {

    },
    // ===Computed properties for the component
    computed: {},
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
export default inputTextarea;
