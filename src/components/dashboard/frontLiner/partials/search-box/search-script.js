
import Vue from "vue";
import componentContainer from './../../../../pages/componentContainer.vue';
import inputText from "./../../../../core/form/partials/input-text/input-text.vue";
import treeSelect from '../../../../core/form/partials/tree-selectbox/tree-selectbox.vue';
import directoryCountryService from '../../../../../helpers/directoryCountryService';
import {EventBus} from "../../../../../eventbus/event-bus";

const directoryCountryServ = new directoryCountryService();

var searchBox =  {
    name:"search-box",
    components: {
        inputText,
        componentContainer,
        treeSelect
    },
    data() {
        return {
            keyword:'',
            searchOption:'faq',
            countryIds: [],
            countryOptions: []
        };
    },
    created() {
        this.$store.commit('countries');
        this.getCountryList();
    },
    mounted() {
        EventBus.$off('update-input-field', this.updateFilterInput);
        EventBus.$on('update-input-field', this.updateFilterInput);
    },
    methods: {
        onSubmit:function() {
            if(this.keyword != '') {
                let queryStringCountry = '';
                if(this.countryIds.length > 0) {
                    const queryArray = this.countryIds.map((countryId) => `countries[]=${countryId}`);
                    queryStringCountry = '&'+queryArray.join('&');
                } else if(this.countrySelect.length > 0) {
                    const queryArray = this.countrySelect.map((countryId) => `directory_countries[]=${countryId}`);
                    queryStringCountry = '&'+queryArray.join('&');
                }
                const q = `q=${encodeURIComponent(this.keyword)}&section=${this.searchOption}${queryStringCountry}`;
                this.$router.push(`/search-result?${q}`);
            }
        },
        getSourceComponent:function(){
            return this.name;
        },
        updateFilterInput: function(data) {
            if(Array.isArray(data.value)) {
                if(this.searchOption === 'directory'){
                    this.countryIds = data.value;
                    this.countrySelect = [];
                } else {
                    this.countrySelect = data.value;
                    this.countryIds = [];
                }
            }
        },
        getCountryList() {
            directoryCountryServ.getDirectoryCountries().then((data) => {
                this.countryOptions = data;
                this.$forceUpdate();
            });
        }
    }
};

export default searchBox;