import {EventBus} from "../../../../../eventbus/event-bus";
import debounce from 'lodash/debounce'

var inputText = {
    // ===Component name
    name: "input-search-text",
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
        }, disabled: {
            type: Boolean,

        },
        inputId:
            {
                type: String,
                required:
                    true
            }
        ,
        inputClass: {
            type: String,
            default:
                ""
        },
        index: {
            type: Number,
            default: 0,
        },
        placeholder: {
            type: String,
            required:
                true
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

        grabInput: debounce(function (e) {

            EventBus.$emit('update-input-field', {
                name: this.name,
                value: e.target.value,
                index: this.index,
                source_component: this.sourceComponent
            });

        }, 500),
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
