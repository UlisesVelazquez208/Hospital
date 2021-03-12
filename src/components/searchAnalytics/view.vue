<template>
    <component-container title="SearchAnalytics.ViewSearchRequest">
        <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>
        <white-container title="SearchAnalytics.SearchRequestInformation">
            <div class="row pt-3">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('SearchAnalytics.Keywords')}}</div>
                <div class="col-lg-8 col-md-8">{{ searchRequestModel.search_string }}</div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('SearchAnalytics.IPAddress') }}</div>
                <div class="col-lg-8 col-md-8 description">{{ searchRequestModel.ip_address }}</div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('SearchAnalytics.Location') }}</div>
                <div class="col-lg-8 col-md-8">{{ searchRequestModel.location }}</div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('SearchAnalytics.SearchObject') }}</div>
                <div class="col-lg-8 col-md-8">{{ searchRequestModel.model }}</div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('SearchAnalytics.SearchLanguage') }}</div>
                <div class="col-lg-8 col-md-8">{{ searchRequestModel.language }}</div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('SearchAnalytics.SearchTimes') }}</div>
                <div class="col-lg-8 col-md-8">{{ searchRequestModel.created_at }}</div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('SearchAnalytics.OtherParams') }}</div>
                <div class="col-lg-8 col-md-8">
                    <p v-html="searchRequestModel.params_string"></p>
                </div>
            </div>
        </white-container>

        <div class="row">
            <div class="col-sm-4">
                <div class="form-group text-right" v-if="this.previousID!=0">
                    <span v-on:click="goPrevious()" class="btn faq-draft btn-nav btn-default btn-success">
                        <span> &laquo;</span>
                    </span>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group text-center">
                    <button
                        class="btn faq-draft faq-submit btn-success"
                        v-on:click="goBack"
                    >
                        <i class='fa fa-angle-left'></i> {{ $t('Common.Return')}}
                    </button>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="form-group text-left" v-if="this.nextID!=0">
                    <span v-on:click="goNext()" class="btn btn-nav faq-draft btn-default btn-success">
                        <span> &raquo;</span>
                    </span>
                </div>
            </div>
        </div>
    </component-container>
</template>

<script>
    import Vue from "vue";
    import env from './../../Env';
    import coreFormClass from "../core/form/script";
    import componentContainer from '../pages/componentContainer.vue';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
    import LoadingSpinner from "../spinner/loading-spinner";
    import whiteContainer from "./../pages/whiteContainer.vue";
    import API from "../APIs/AbstractAPIs";

    export default {
        name: "view-search-request",
        props: {},
        components: {
            LoadingSpinner,
            componentContainer,
            whiteContainer,
            'ClipLoader': ClipLoader
        },
        data() {
            
            return {
                searchRequestModel: {
                    keywords: "",
                    ip_address: "",
                    location: "",
                    created_at: "",
                },
                previousID:0,
                nextID:0,
                loadingSpinner: false
            };
        },
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-search-request-view');
            if (this.getId()) {
                this.retriveUpdateData();
            }
        },
        methods: {
            goBack() {
                return this.$router.go(-1);
            },
            getId() {
                return this.$route.params.id;
            },
            getModule() {
                return "search-analytics";
            },
            retriveUpdateData() {
                this.loadingSpinner = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getSuccess, this.getFailure);
            },
            getSuccess({data}) {
                this.loadingSpinner = false;
                this.searchRequestModel = data;

                let directoryAPI = new API();
                directoryAPI.createEntity({name:'api/search-analytics/'+this.getId()+'/previous'});
                directoryAPI.endpoints.get({}).then(this.getPrevious).catch(this.failure);

                directoryAPI.createEntity({name:'api/search-analytics/'+this.getId()+'/next'});
                directoryAPI.endpoints.get({}).then(this.getNext).catch(this.failure);
            },
            goNext(){
                this.$router.replace('/search-analytics/view/'+this.nextID);
            },
            goPrevious(){
                this.$router.replace('/search-analytics/view/'+this.previousID);
            },
            getPrevious({data}) {
                if(data.id) {
                    this.previousID = data.id;
                }
            },
            getNext({data}) {
                if(data.id) {
                    this.nextID = data.id;
                }
            },
            getfailure() {
                this.$router.replace('/404');
            },
            scrollToClass(className) {
                let el = this.$el.querySelector(className);
                let rect = el.getBoundingClientRect();
                window.scrollTo(rect.left, rect.top);
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/search-analytics/' + this.getId();
                }
                return env.API_URL + '/api/search-analytics';
            }
        }
    };
</script>

<style type="text/css" lang="scss">
    .description ul {
        list-style: inherit !important;
    }
    .selected-list {
        margin-left: 13px;

        ul {
            list-style: none;
            padding: 0;
            margin: 20px 0px;
        }
        li {
            min-height: 150px;
            padding: 15px 15px;
            border: 1px solid #ccc;
            -webkit-border-radius: 5px 5px;
            -moz-border-radius: 5px 5px;
            border-radius: 5px 5px;
            margin: 15px 0;
            position: relative;
            img {
                max-height: 120px;
            }
            .directory-title {
                font-weight: bold;
                font-size: 15px;
                margin-bottom: 20px;
            }
            .directory-info {
                margin-bottom: 8px;

                div {
                    display: inline-block;
                    padding-left: 25px;

                    &:first-of-type {
                        padding-left: 0;
                        display: inline-block;
                    }
                }

                p {
                    margin-bottom: 0;
                    display: inline-block !important;
                }

                i {
                    width: 15px;
                    vertical-align: top;
                }

                .timeFrom {
                    padding: 10px;
                }

                .day {
                    text-transform: lowercase;
                }
            }
        }
    }
    .selected-list ul li span {
        display: block;
    }
    .selected-list ul li span label{
        font-size: small;
        font-weight: 500;
    }

    .faq-draft {
        font-size: 20px;
        padding: 10px 74px !important;
        background-color: #F9F9F9 !important;
        color: #0072BC !important;
        border-color: #0072BC !important;
    }

    .btn-nav {
        padding:10px 30px !important;
    }
</style>
