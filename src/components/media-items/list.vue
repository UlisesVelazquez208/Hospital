<template>
    <div class="media-items-page">
        <component-container title="Media.MultimediaSearch">
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
                    <b-col lg="4" md="4" sm="4" cols="4" class="pl-0">
                        <tree-select v-if="this.$store.state.countries" name="country" placeholder="Home.SearchByCountry" instanceId="country"
                            :options="this.$store.state.countries"
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
            <b-row>
                <b-col lg="6" md="6" sm="6" cols="6" class="tab__titles">
                    <b-row>
                        <b-col lg="3" md="3" cols="3" class="text-center">
                            <div class="custom-radio">
                                <label class="label-container">{{ $t('Media.Video') }}
                                    <input
                                        id="content-type-VIDEO"
                                        name="contentType"
                                        type="radio"
                                        value="VIDEO"
                                        @click="onChanggeContentType('VIDEO')"
                                    />
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <!-- <a href="#/media-items" v-on:click="showItems('VIDEO')">{{ $t('Media.Video') }}</a> -->
                        </b-col>
                        <b-col lg="3" md="3" cols="3" class="text-center">
                            <div class="custom-radio">
                                <label class="label-container">{{ $t('Media.Audio') }}
                                    <input
                                        id="content-type-AUDIO"
                                        name="contentType"
                                        type="radio"
                                        value="AUDIO"
                                        @click="onChanggeContentType('AUDIO')"
                                    />
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <!-- <a href="#/media-items" v-on:click="showItems('AUDIO')">{{ $t('Media.Audio') }}</a> -->
                        </b-col>
                        <b-col lg="3" md="3" cols="3" class="text-center">
                            <div class="custom-radio">
                                <label class="label-container">{{ $t('Media.Poster') }}
                                    <input
                                        id="content-type-POSTER"
                                        name="contentType"
                                        type="radio"
                                        value="POSTER"
                                        @click="onChanggeContentType('POSTER')"
                                    />
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <!-- <a href="#/media-items" v-on:click="showItems('POSTER')">{{ $t('Media.Poster') }}</a> -->
                        </b-col>
                        <b-col lg="3" md="3" cols="3" class="text-center">
                            <div class="custom-radio">
                                <label class="label-container">{{ $t('Media.PDF') }}
                                    <input
                                        id="content-type-pdf"
                                        name="contentType"
                                        type="radio"
                                        value="PDF"
                                        @click="onChanggeContentType('PDF')"
                                    />
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <!-- <a href="#/media-items" v-on:click="showItems('PDF')">{{ $t('Media.PDF') }}</a> -->
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </component-container>
        <div class="new-container">
            <b-row>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 faqs-list-wrapper">
                    <media-items :resultItems="resultItems" :catBusy="catBusy" :total="total"></media-items>
                </div>
                <b-col cols="12" lg="8" md="8">
                    <media-details :singleMedia="singleMedia" :mediaBusy="mediaBusy"></media-details>
                </b-col>
            </b-row>
        </div>
    </div>
</template>
<script>
import ComponentContainer from "./../pages/componentContainer.vue";
import AbstractFiltersForEs from "../APIs/AbstractFiltersForEs";
import mediaService from "./../../helpers/mediaService.js";
import LoadingSpinner from "./../spinner/loading-spinner";
import mediaDetails from "./../partials/mediaDetails.vue";
import mediaList from "./../partials/media-list.vue";
import treeSelect from '../core/form/partials/tree-selectbox/tree-selectbox';
import {EventBus} from './../../eventbus/event-bus.js';

let filter = new AbstractFiltersForEs();
let servMedia = new mediaService();

export default {
    name:'media-list',
    components:{
        LoadingSpinner,
        ComponentContainer,
        mediaDetails,
        treeSelect,
        "media-items":mediaList
    },
    data(){
        return {
            keyword:'',
            resultItems:[],
            // scrollPosition: 700,
            catBusy:false,
            mediaBusy:false,
            total:0,
            page:1,
            lastPage:1,
            contentType: '',
            previousContentType: '',
            singleMedia:null,
            countryIds: [],
        }
    },
    created() {
        this.$store.commit('countries');
        EventBus.$off('show-media', this.showMediaSide);
        EventBus.$on('show-media', this.showMediaSide);
        EventBus.$off('update-model', this.updateModel);
        EventBus.$on('update-model', this.updateModel);
        EventBus.$off('update-input-field', this.updateFilterInput);
        EventBus.$on('update-input-field', this.updateFilterInput);
        EventBus.$on('locale', this.localeUpdated);
    },
    mounted(){
        if (this.isMediaView()) {
            this.showMediaSide(this.getMediaId());
        } else {
            this.performSearch();
            // window.addEventListener('scroll', this.updateScroll);
        }

        document.querySelector('body').setAttribute('id', 'page-media-list');
    },
    methods:{
        onSubmit:function() {
            this.resetSearch();
            this.performSearch();
        },
        localeUpdated:function(event) {
            this.resetSearch();
            this.performSearch();
        },
        performSearch:function() {
            if(this.page <= this.lastPage) {
                this.catBusy = true;
                filter.reset();

                let currentLocale = localStorage.getItem('locale');
                let theLanguages = JSON.parse(localStorage.getItem('languages'));

                let selectedLang = theLanguages.filter((item) => {
                    if(item.acronym == currentLocale) {
                        return item;
                    }
                });

                if(selectedLang.length > 0) {
                    filter.addWith('language_id');
                    filter.addWithCondition('language_id', selectedLang[0].id);
                }

                if(this.countryIds.length > 0) {
                    filter.addWith('country_ids');
                    filter.addWithCondition('country_ids', this.countryIds);
                }

                if(keyword) {
                    filter.addCondition(this.keyword);
                }

                if(this.contentType) {
                    filter.addWith('content_type.keyword');
                    filter.addWithCondition('content_type.keyword', [this.contentType]);
                }

                filter.setPagination(true);
                servMedia.getMediaItemsEs(filter, this.page).then(this.listMediaItems);
                this.page = this.page+1;
            }
        },
        showItems(type) {
            this.resetSearch();
            this.contentType = type;
            this.performSearch();
        },
        getMediaId() {
            return this.$route.params.media_id;
        },
        updateModel:function() {
            this.updateScroll();
        },
        remotelyFetchMedia: function(mediaID) {
            return servMedia.getMedia(mediaID, this.page);
        },
        isMediaView: function() {
            return this.$route.path.search(/media-items\/[0-9]/i) !== -1;
        },
        listMediaItems:function(data) {
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
        showMediaSide:function(mediaID) {
            if (this.singleMedia
                && (this.singleMedia.id == mediaID)) {
                return;
            }

            this.resetData();
            this.mediaBusy = true;
            this.catBusy = this.isMediaView() ?!this.catBusy:this.catBusy;
            this.remotelyFetchMedia(mediaID).then((data)=> {
                this.singleMedia = data;
                this.mediaBusy = false;

                if(this.isMediaView()) {
                    this.catBusy = false;
                    this.total = 1;
                    this.resultItems = [this.singleMedia];
                }
            }). catch((e)=>{
                console.log(e);
            });
        },
        resetData: function() {
            this.singleMedia = null;
        },
        resetSearch:function() {
            this.resultItems = [];
            this.page = 1;
            this.catBusy = false;
            this.lastPage = 1;
            this.singleMedia = null;
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
        onChanggeContentType: function(contentType) {
            if(this.contentType === contentType) {
                this.contentType = '';
                document.getElementById(`content-type-${contentType}`).checked = false;
            } else {
                this.contentType = contentType;
            }
            this.onSubmit();
        }
    }
}
</script>
<style type="text/css" lang="scss">
    .media-items-page {
        .btn-search {
            font-size: 15px;
            width: 100%;
            padding: 7px 0;
            background-color: #F9F9F9 !important;
            color: #0072BC !important;
            border-color: #0072BC !important;
            &:hover {
                color: #F9F9F9 !important;
                background-color: #0072BC !important;
            }
        }
        .widget_social_icons{
            margin: 5px 0 10px;
        }
        .label-text{
            padding-top: 8px;
        }
        .new-container {
            padding:20px 0 0px 20px;
        }
        a.character{
            float: left;
            margin-left: 5px;
            margin-right: 5px;
            text-transform: capitalize;
            font-size: 1.3rem;
        }
        .container {
            height: calc(100vh - 378px);
            overflow-y: scroll;
        }

        .loadingClass {
            position: relative;
            text-align: center;
            margin-top: 1%;
            margin-bottom: 5%;
            background: white;
            padding: 10px;
            height: auto;
            border: 1px solid #f7f7f7;
            border-radius: 10px;
        }

        .faq-container {
            box-shadow: 1px 1px 4px 1px #ccc;
            border-radius: 4px;
            margin-top: 10px;
            margin-bottom: 10px;
            background-color: #FAFAFA;
            padding-top: 30px;
            padding-bottom: 30px;
            position: relative;
            .widget_social_inner1 {
                margin: 20px 20px 20px 5px;
                font-family: Helvetica;
            }
            .text-ash {
                margin: 20px 20px 60px 5px;
                font-family: Helvetica;
            }
            .add-to-list {
                color: #0072BC;
                position: absolute;
                bottom: -2px;
                right: 14px;
                font-size: 12px;
                // margin-bottom: 15px;
                margin-top:10px;
            }
        }

        .faq {
            color: #0072BC;
            cursor: pointer;
            font-size: 16px;
            overflow-wrap: break-word;
            word-wrap: break-word;
            font-family: Helvetica;

        }

        .faq-answer {
            font-size: 14px;
            color: #606060;
            font-family: Helvetica;
            word-wrap: break-word;
        }

        .faqs-list-wrapper {
            background-color: #F4F4F4;
            border: 1px solid #ddd;
        }

        .faqs-list-nav {
            color: #1D87C4;
            padding: 30px 15px 10px 15px;
        }

        .text-center {
            padding-top: 0px;
        }

        .general-info {
            height: calc(100vh - 406px);
            overflow-y: scroll;
        }
    }
</style>
