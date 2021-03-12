import {EventBus} from "../../../../../eventbus/event-bus";


let inputSelect = {
    // ===Component name
    name: "input-select",
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
            required: false
        },
        required: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
        },
        multiple: {
            type: Boolean,
        },
        selectOptions: {
            type: Array,
            required: true,
        },
        inputClass: {
            type: String,
            required: false,
        },
        index: {
            type: Number,
            default: 0,
        },
        errors: {},
        value: {
            type: String
        },
        change: {
            type:Function,
            default: function () {
                
            }
        },
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
        getSelectValues(select) {
            var result = [];
            var options = select && select.options;
            var opt;
            for (var i=0, iLen=options.length; i<iLen; i++) {
                opt = options[i];

                if (opt.selected) {
                    result.push(opt.value || opt.text);
                }
            }
            return result;
        },
        grabinput: function (data) {

            if(this.multiple)
                data = this.getSelectValues(data);
            else
                data = data.value;

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

            this.change();
        }

    }
};

export default inputSelect;
