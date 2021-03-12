import {EventBus} from "../../../../../eventbus/event-bus";

var inputCheckbox = {
    // ===Component name
    name: "input-checkbox",
    // ===Props passed to component
    props: {
        name: {
            type: String,
            required: true,
        },
        inputClass: {
            type: String,
        },
        inputLabel: {
            type: String,
            required: true,
        },
        checked: {
            type: Boolean,
            default: false
        },
        value: {
            required: true
        },
        errors: {}

    },
    // ===Components used by this component
    components: {},
    // ===component Data properties
    data() {
        return {
            val: this.checked
        }
    },
    // ===Code to be executed when Component is mounted
    mounted() {

    },
    // ===Computed properties for the component
    computed: {},
    // ===Component methods
    methods: {
        grabInput: function (data) {
            EventBus.$emit('update-checkbox-field', {
                name: this.name,
                value: this.value,
                checked: !this.val
            });
        },
        clearError: function () {
            EventBus.$emit('clear-input-field', {
                name: this.name,
                index: this.index
            });
        },
    },
    watch: {
        checked: function() {
            this.val = this.checked;
        }
    }
}
export default inputCheckbox;
