<template>
    <div class="directories-page">
        <component-container title="Directory.DirectorySearch">
            <form @submit.stop.prevent="onSubmit()">
                <b-row>
                    <b-col lg="6" md="6" sm="6" cols="6" class="pr-0">
                        <div class="search-input-container">
                            <div class="search-icon">
                                <span><i class="fa fa-search"></i></span>
                            </div>
                            <input
                                id="keyword"
                                type="text"
                                name="keyword"
                                v-model="keyword"
                                class="form-control form-control-lg"
                            />
                        </div>
                    </b-col>
                    <b-col lg="2" md="2" sm="2" cols="2">
                        <button @click.stop.prevent="onSubmit()" type="submit" class="btn btn-search" value="Search">
                            <span><i class="fa fa-filter"></i> {{ $t('Home.Search') }}</span>
                        </button>
                    </b-col>
                    <b-col lg="4" md="4" sm="6" cols="6" class="pl-0">
                        <tree-select v-if="countryOptions" name="country" placeholder="Home.SearchByCountry" instanceId="country"
                            :options="countryOptions"
                            :multiple="true"
                            :clearable="true"
                            :searchable="true"
                            :value="countryIds"
                            :customInnerClass="'col-md-12'"
                            inputLabel=""
                            valueConsistsOf="LEAF_PRIORITY"
                            class="custom-dropdown-filter-by-country"
                        />
                    </b-col>
                </b-row>
            </form>
            <hr>
            <b-row>
                <b-col lg="12" md="12" sm="12" xs="12" class="d-flex justify-content-center">
                    <a class="character" v-for="index in 26" :key="index" href="#/directory" v-on:click="listByAlphabet((index+9).toString(36))">{{ (index+9).toString(36) }}</a>
                </b-col>
            </b-row>
            <hr>
        </component-container>
        <div class="new-container">
            <b-row>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 faqs-list-wrapper">
                    <directory-list :resultItems="resultItems" :catBusy="catBusy" :total="total"></directory-list>
                </div>
                <b-col cols="12" lg="8" md="8">
                    <directory-details :singleDirectory="singleDirectory" :directoryBusy="directoryBusy"></directory-details>
                </b-col>
            </b-row>
        </div>
    </div>
</template>
<script>
import ComponentContainer from "./../pages/componentContainer.vue";
import AbstractFiltersForEs from "../APIs/AbstractFiltersForEs";
import directoriesService from "./../../helpers/directoriesService.js";
import directoryDetails from './../partials/directoryDetails.vue';
import LoadingSpinner from "./../spinner/loading-spinner";
import directoryList from "./../partials/directory-list.vue";
import directoryCountryService from '../../helpers/directoryCountryService';
import treeSelect from '../core/form/partials/tree-selectbox/tree-selectbox';
import {EventBus} from './../../eventbus/event-bus.js';

let filter = new AbstractFiltersForEs();
let directoryService = new directoriesService();
const directoryCountryServ = new directoryCountryService();

export default {
    name:'directories-list',
    components:{
        LoadingSpinner,
        ComponentContainer,
        directoryDetails,
        treeSelect,
        "directory-list":directoryList
    },
    // directives: {infiniteScroll},
    data() {
        return {
            keyword:'',
            resultItems:[],
            // scrollPosition: 700,
            catBusy:false,
            directoryBusy:false,
            total:-1,
            page:1,
            lastPage:1,
            isAlpha:false,
            singleDirectory:null,
            searchAlpha:'',
            countryOptions: [],
            countryIds: [],
        }
    },
    created() {
        EventBus.$off('show-directory', this.showDirectorySide);
        EventBus.$on('show-directory', this.showDirectorySide);
        EventBus.$off('update-model', this.updateModel);
        EventBus.$on('update-model', this.updateModel);
        EventBus.$off('update-input-field', this.updateFilterInput);
        EventBus.$on('update-input-field', this.updateFilterInput);
        this.getCountryList();
    },
    mounted(){
        if (this.isDirectoryView()) {
            this.showDirectorySide(this.getDirectoryId());
        }

        document.querySelector('body').setAttribute('id', 'page-directory-list');
        // window.addEventListener('scroll', this.updateScroll);
    },
    destroyed () {
        // window.removeEventListener('scroll', this.updateScroll);
    },
    methods:{
        onSubmit:function() {
            this.resetSearch();
            this.performSearch();
        },
        performSearch:function() {
            if(this.page <= this.lastPage) {
                this.catBusy = true;
                filter.reset();
                if(this.isAlpha) {
                    filter.addCustomConditions('filter_by_first_char', this.searchAlpha);
                } else {
                    if(this.countryIds.length > 0) {
                        filter.addWith('country_ids');
                        filter.addWithCondition('country_ids', this.countryIds);
                    }
                    if(this.keyword && this.keyword.trim()) {
                        filter.addCondition(this.keyword);
                    }
                }
                filter.addWith('translations');
                filter.setPagination(true);
                directoryService.getDirectoriesFromEs(filter, this.page).then(this.listDirectories);
                this.page = this.page+1;
            }
        },
        getDirectoryId() {
            return this.$route.params.directory_id;
        },
        updateModel:function() {
            this.updateScroll();
        },
        remotelyFetchDirectory: function(directoryID) {
            return directoryService.getDirectory(directoryID, this.page);
        },
        isDirectoryView: function() {
            return this.$route.path.search(/frontline\/directory\/[0-9]/i) !== -1;
        },
        listDirectories:function(data) {
            if(this.resultItems.length == 0) {
                this.resultItems = data.entities;
            } else {
                this.resultItems = this.resultItems.concat(data.entities);
            }
            let lastPage = data.last_page;
            this.lastPage = data.last_page;
            let currentPage = data.current_page;
            this.total = data.total;
            this.catBusy = false;
        },
        showDirectorySide:function(directoryID) {
            if (this.singleDirectory
                && (this.singleDirectory.id == directoryID)) {
                return;
            }

            this.resetData();
            this.directoryBusy = true;
            this.catBusy = this.isDirectoryView() ?!this.catBusy:this.catBusy;
            this.remotelyFetchDirectory(directoryID).then((data)=> {
                this.singleDirectory = data;
                this.directoryBusy = false;

                if(this.isDirectoryView()) {
                    this.catBusy = false;
                    this.resultItems = [this.singleDirectory];
                }
            }). catch((e)=>{
                console.log(e);
            });
        },
        resetData: function() {
            this.singleDirectory = null;
        },
        resetSearch:function() {
            this.resultItems = [];
            this.page = 1;
            this.isAlpha = false;
            this.singleDirectory = null;
            this.catBusy = false;
            this.lastPage = 1;
        },
        listByAlphabet:function(theLetter) {
            this.resetSearch();
            this.searchAlpha = theLetter;
            this.isAlpha = true;
            this.performSearch();
        },
        updateScroll() {
            // this.scrollPosition = 580;
            this.performSearch();
        },
        updateFilterInput: function(data) {
            if(Array.isArray(data.value)) {
                this.countryIds = data.value;
            }
        },
        getCountryList() {
            directoryCountryServ.getDirectoryCountries().then((data) => {
                this.countryOptions = data;
            });
        }
    }
}
</script>
<style type="text/css" lang="scss">
    .label-text{
        padding-top: 8px;
    }
    .new-container {
        padding:20px;
        padding-right: 0;
        padding-bottom: 0;
    }
    a.character{
        float: left;
        margin-left: 5px;
        margin-right: 5px;
        text-transform: capitalize;
        font-size: 1.3rem;
    }
    .btn-search {
        width: 100%;
        padding: 7px 10px;
    }
</style>
