import Vue from "vue";
import {EventBus} from './../../../eventbus/event-bus.js';
import componentContainer from './../../pages/componentContainer';
import treeSelect from '../../core/form/partials/tree-selectbox/tree-selectbox';

var smallSearchBox =  {
    name: "small-search",
    components: {
        componentContainer,
        treeSelect
    },
    props: {
        keyword: {
            type: String,
            required: true
        },
        countryIds: {
            type: Array,
            required: false
        },
        countrySelect: {
            type: Array,
            required: false
        },
        countryOptions: {
            type: Array,
            required: true
        },
        theSection: {
            type: String,
            required: true
        },
    },
    data(){
        return {
            searchSection: null
        }
    },
    created() {
        this.$store.commit('countries');
    },
    mounted(){
        this.searchSection = this.theSection;
    },
    methods: {
        onSubmit:function() {
            EventBus.$emit('perform-search', {
                keyword: encodeURIComponent(this.keyword),
                // searchOption: this.theSection
            });
        },
        getSourceComponent:function(){
            return this.name;
        },
        changeSection:function() {
            EventBus.$emit('update-section', this.searchSection);
        }
    }
};

export default smallSearchBox;