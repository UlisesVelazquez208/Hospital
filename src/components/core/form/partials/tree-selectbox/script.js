import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {EventBus} from "../../../../../eventbus/event-bus";

var treeSelect = {
    // ===Component name
    name: "tree-select",
    // ===Props passed to component
    props: {
        name: {
            Type: String,
            Default: ""
        },
        inputLabel: {
            type: String,
            required: false
        },
        disabled: {
            type: Boolean,
        },
        flat: {
            type: Boolean,
            Default:false,
            required:false
        },
        options: {
            type: Array,
            required: true
        },
        clearable: {
            type: Boolean,
            Default: true
        },
        multiple: {
            Type: Boolean,
            Default: true
        },
        searchable: {
            Type: Boolean,
            Default: true
        },
        noResultsText: {
            Type: String,
            Default: "No results found..."
        },
        placeholder: {
            Type: String,
            Default: "Common.Select"
        },
        instanceId: {
            type: String | Number,
            required: true
        },
        value: {
            type: Array | String
        },
        valueConsistsOf:{
            Type: String,
            Default: "ALL"
        },
        valueFormat:{
            Type: String,
            Default: "id"
        },
        index: {
            type: Number,
            default: 0,
        },
        errors: {},
        sourceComponent: {
            type: String,
            required: false,
            default: 'public'
        },
        alwaysOpen: {
            type: Boolean,
            Default: false
        },
        clearOnSelect: {
            type: Boolean,
            default: true,
        },
        customInnerClass: {
            type: String,
            default: ''
        }
    },
// ===Components used by this component
    components: {
        Treeselect
    },
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
        grabinput: function (value, id) {
            EventBus.$emit('update-input-field', {
                name: id,
                value: value,
                index: this.index,
                source_component: this.sourceComponent
            });
            if(this.errors){
                this.clearError();
            }
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
export default treeSelect;
