<template>
    <component-container title="Directory.ViewDirectory">
        <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>
        <white-container title="User.GeneralInformation">
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('Directory.Name')}}</div>
                <div class="col-lg-8 col-md-8">{{ directoryModel.name}}</div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('Directory.Description') }}</div>
                <div class="col-lg-8 col-md-8 description" v-html="directoryModel.description"></div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('Directory.Type') }}</div>
                <div class="col-lg-8 col-md-8">{{ directoryModel.directory_type?directoryModel.directory_type.type_name:'' }}</div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('Common.ServiceCategory') }}</div>
                <div class="col-lg-8 col-md-8">{{ serviceCategories }}</div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('Directory.Status') }}</div>
                <div class="col-lg-8 col-md-8">{{ directoryModel.status }}</div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 font-weight-bold">{{ $t('Directory.Image') }}</div>
                <div class="col-lg-8 col-md-8">
                    <img class="rounded img-fluid float-md-left float-sm-left" width="150px" :src="directoryModel.directory_media.url" v-if="directoryModel.directory_media">
                </div>
            </div>
        </white-container>

        <show-translations :languageContents="languageContents" v-if="languageContents.length > 0"></show-translations>
                    <!-- Hashtags -->
        <hashtags :hashtags="directoryModel.hashtags" v-if="directoryModel.hashtags"></hashtags>

        <!-- Social Media Links -->
        <directory-media-links :directoryMediaLinks="directoryModel.directory_media_links" v-if="directoryModel.directory_media_links && directoryModel.directory_media_links.length>0"></directory-media-links>

        <white-container title="Contact.ContactInformation">
            <div class="selected-list">
                <div class="row">
                    <div class="col-lg-12 col-md-12">
                        <ul>
                            <li v-for="(contactForm, index) in directoryModel.contact_forms === null?[]:directoryModel.contact_forms" :key="index">
                                <contact-detail :contactModel="contactForm"></contact-detail>
                            </li>
                        </ul>
                    </div>
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
                    <div>

                    <button class="btn faq-draft faq-submit btn-success"
                            v-on:click="goBack"
                    >
                        <i class='fa fa-angle-left'></i> {{ $t('Common.Return')}}
                    </button>

                    </div>
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
    import contactDetail from "./partials/contact-detail.vue";
    import directoryMediaLinks from "./../partials/directoryMediaLinks.vue";
    import hashtags from "./../partials/hashtags.vue";
    import showTranslations from "./partials/showDirectoryTranslation";

    export default {
        // ===Component name
        name: "view-directory",
        // ===Props passed to component
        props: {},
        // ===Components used by this component
        components: {
            LoadingSpinner,
            componentContainer,
            whiteContainer,
            'ClipLoader': ClipLoader,
            "contact-detail":contactDetail,
            "directory-media-links": directoryMediaLinks,
            "hashtags":hashtags,
            "show-translations":showTranslations
        },
        // ===component Data properties
        data() {
            let contactForm =
                {
                    address_line_one: "",
                    address_line_two: "",
                    contact_label:"",
                    country: "",
                    lat:0,
                    lng:0,
                    pluscode:"",
                    governorate: "",
                    district: "",
                    postal_code: "",
                    email: "",
                    building_name:"",
                    landmark:"",
                    metro:"",
                    city:"",
                    neighbourhood:"",
                    proximity:"",
                    phones: [],
                    working_hours: [],
                    translations:[]
                };
            return {
                directoryModel: {
                    name: "",
                    description: "",
                    directory_type: Object,
                    directory_media: Object,
                    service_category: [],
                    directoryMediaLinks:[],
                    status: true,
                    image: '',
                    contact_forms: []
                },
                previousID:0,
                nextID:0,
                loadingSpinner: false,
                theLanguages:[],
                langLocale:"",
                languageContents:[]
            };
        },
        // ===Code to be executed when Component is mounted
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-directory-view');
            if (this.getId()) {
                this.retriveUpdateData();
            }
            this.theLanguages = JSON.parse(localStorage.getItem('languages'));
            this.langLocale = localStorage.getItem('lang_locale');

            for(var i=0; i < this.theLanguages.length; i++) {
                var theItem = this.theLanguages[i];
                if(theItem.is_default == 0) {
                    var langContent = {};
                    langContent.language_id = theItem.id;
                    langContent.directory_name = theItem.name;
                    langContent.directory_alternative_name ="";
                    langContent.directory_acronym = "";
                    langContent.description = "";

                    this.languageContents.push(langContent);
                }
            }
        },
        // ===Computed properties for the component
        created: function () {
        },
        computed:{
            serviceCategories: function() {
                if (this.directoryModel.service_categories == null)
                    return "";

                return this.directoryModel.service_categories.map(a=>a.name).join(', ');
            },
            nationalities: function() {
                if (this.directoryModel.nationalities == null)
                    return "";

                return this.directoryModel.nationalities.map(a=>a.nationality).join(', ');
            },
            countries: function() {
                if (this.directoryModel.countries == null)
                    return "";

                return this.directoryModel.countries.map(a=>a.country).join(', ');
            },
        },

        // ===Component methods
        methods: {
            goBack() {
                return this.$router.go(-1);
            },
            getId() {
                return this.$route.params.id;
            },
            getModule() {
                return "directory";
            },
            retriveUpdateData() {
                this.loadingSpinner = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getSuccess, this.getFailure, '?with[]=serviceCategories&with[]=directoryType&with[]=directoryMedia&with[]=serviceCategories.children&with[]=hashtags&with[]=directoryMediaLinks&with[]=contactForms&with[]=contactForms.translations&with[]=contactForms.phones&with[]=contactForms.workingHours&with[]=translations');
            },
            getSuccess({data}) {
                this.loadingSpinner = false;
                this.directoryModel = data;

                let langFilter = this.theLanguages.filter((item) => {
                    if(item.is_default == 1)
                        return item;
                });

                if(this.directoryModel.translations.length > 0) {
                    for(var i = 0; i < this.directoryModel.translations.length; i++) {
                        let theItem = this.directoryModel.translations[i];
                        for(var j = 0; j < this.languageContents.length; j++) {
                            if(this.languageContents[j].language_id == theItem.language_id) {
                                this.languageContents[j].directory_name = theItem.name;
                                this.languageContents[j].directory_alternative_name = theItem.alternative_name;
                                this.languageContents[j].directory_acronym = theItem.acronym;
                                this.languageContents[j].description = theItem.description;
                            }
                        }
                    }
                }

                let directoryAPI = new API();

                directoryAPI.createEntity({name:'api/directory/'+this.getId()+'/previous'});
                directoryAPI.endpoints.get({}).then(this.getPrevious).catch(this.failure);

                directoryAPI.createEntity({name:'api/directory/'+this.getId()+'/next'});
                directoryAPI.endpoints.get({}).then(this.getNext).catch(this.failure);
            },
            goNext(){
                this.$router.replace('/directory/view/'+this.nextID);
            },
            goPrevious(){
                this.$router.replace('/directory/view/'+this.previousID);
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
                    return env.API_URL + '/api/directory/' + this.getId();
                }
                return env.API_URL + '/api/directory';
            },
            getImageUrl(imageUrl) {
                return this.directoryModel.directory_media ? this.directoryModel.directory_media.url : '';
            }
        }
    };
</script>
<style type="text/css" lang="scss">
    .description ul {
        list-style: inherit !important;
    }
    .hashtag-details {
        .hashtags-list {
            overflow: auto;
            padding: 3px 15px;
            margin: 0;

            li {
                display: inline;
                float: left;
            }
        }
        .hashtag-link {
            display: block;
            padding: 10px;
            margin-right: 5px;
            margin-bottom: 5px;
            background-color: #E1EFF5;
            border-radius: 4px;
            color: #000;
        }
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
                /*box-shadow: 1px 1px 1px 1px #bbbbbbf5;*/
                /*box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);*/
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
                        /*display: none;*/
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
