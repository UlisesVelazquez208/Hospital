<template>
    <div class="search-faqs-per-category">
        <div class="row">
            <div class="col-xs-12 col-sm-10 col-md-8 col-lg-4 faqs-list-wrapper">
                <div class="faqs-list-nav">
                    <input-search-text
                        name="search_faqs"
                        inputId="keyword"
                        inputClass="search_faq_form"
                        inputLabel="Home.Search"
                        :placeholder="''"
                        :value="hashTag"
                    />

                    <tree-select name="country" placeholder="Common.Select" instanceId="country"
                                 :options="countryOptions" :multiple="true" :clearable="true"
                                 :searchable="true"
                                 inputLabel="Search.Country" valueConsistsOf="LEAF_PRIORITY"></tree-select>

                    <tree-select name="nationality" placeholder="Common.Select" instanceId="nationality"
                                 :options="this.$store.state.nationalities" :multiple="true" :clearable="true"
                                 :searchable="true"
                                 inputLabel="Search.Nationality" valueConsistsOf="LEAF_PRIORITY"></tree-select>
                </div>

                <div class="container faqs-list-content"
                     v-infinite-scroll="updateModel"
                     :infinite-scroll-disabled="catBusy"
                     infinite-scroll-distance="10"
                >
                    <div v-for="(faq, index) in faqs" :key="index">
                        <div class="text-left p-3 widget_social_icons faq-container">
                            <div class="widget_social_inner1">
                                <div v-on:click="showFAQSide(faq.id)" class="faq">{{faq.question}}</div>
                            </div>
                            <!-- <div class="text-ash">
                                <p class="faq-answer">{{faq.shortAnswer}}</p>
                            </div> -->
                            <div class="add-to-list">
                                <span class="glyphicon glyphicon-plus" style="font-size: 15px"
                                      aria-hidden="true"></span>
                                <p>
                                    <router-link tag="a" :to="'/my-list/create-mylist/'+faq.id">
                                        <i class="fa fa-plus-square"></i> Add to list
                                    </router-link>
                                </p>
                            </div>
                        </div>
                    </div>
                    <loading-spinner :is-loading="catBusy"></loading-spinner>
                    <b-card v-if="!total" class="bg-fa">
                        <not-found text="Search.NoFAQsInCategory"
                                   icon="fa-question-circle"></not-found>
                    </b-card>
                </div>

            </div>
            <div class="col-xs-12 col-sm-10 col-md-8 col-lg-8">
                <faqs-details :singlefaq="singlefaq" :faqBusy="faqBusy"></faqs-details>
            </div>

        </div>
    </div>
</template>


<script>
    import faqsService from "../../../helpers/faqsService.js";
    import categoryService from "../../../helpers/categoryService.js";
    import FaqsDetails from "./faqDetails.vue";
    import inputSearchText from "../../core/form/partials/input-search-text/input-search-text.vue"
    import infiniteScroll from 'vue-infinite-scroll'
    import LoadingMenu from "../../spinner/loading-menu";
    import {EventBus} from "../../../eventbus/event-bus";
    import treeSelect from "../../core/form/partials/tree-selectbox/tree-selectbox.vue"
    // import countriesService from "../../../helpers/countryService";
    // import nationalitiesService from "../../../helpers/nationalityService";
    import LoadingSpinner from "../../spinner/loading-spinner";
    import NotFound from "../partials/not-found";

    const faqService = new faqsService();
    const catService = new categoryService();
    // const countryserv = new countriesService();
    // const nationalityServ = new nationalitiesService();

    export default {
        name: "faqs-per-category",
        components: {
            NotFound,
            LoadingSpinner,
            FaqsDetails,
            inputSearchText,
            LoadingMenu,
            treeSelect
        },
        directives: {infiniteScroll},
        data() {
            return {
                category_Id: 0,
                faqs: [],
                singlefaq: null,
                loading: false,
                catStopCall: false,
                catBusy: false,
                faqStopCall: false,
                faqBusy: false,
                hashTag: '',
                page: 1,
                total: -1,
                countryOptions:[],
                nationalityOptions: [],
                filters: {
                    search_faqs: '',
                    country:[],
                    nationality: []
                },
                faqIds: [],
                firstInit: 0,
                storeSubscription: false,
            }
        },
        created() {
            this.$store.commit('nationalities');
            this.$store.commit('countries');

            let theUser = this.$store.state.user;
            if(theUser.countries !== undefined && theUser.countries.length > 0) {
                let countries = theUser.countries;

                this.countryOptions = countries.map((item)=>{
                    return {id: item.id, label:item.country};
                });
            } else {
                this.countryOptions = this.$store.state.countries;
            }
        },
        mounted() {
            const self = this;

            if (this.isCategoryView()) {
                this.storeSubscription = this.$store.subscribe((mutation, state) => {

                    if (mutation.type === "routeChange" && mutation.payload === "end") {
                    } else {
                        self.faqs = [];
                        self.catBusy = true;
                        self.total = -1;
                        self.page = 1;
                    }

                    self.$forceUpdate();
                });
            }

            if (this.isFaqView()) {
                this.showFAQSide(this.getFaqId());
            }

            if (this.isCategoryRecentView()) {
                this.showRecentFAQs(this.getCategoryId());
            }

            EventBus.$off('change-menu-item', this.resetFaq);
            EventBus.$on('change-menu-item', this.resetFaq);
            EventBus.$off('update-input-field', this.updateFilterInput);
            EventBus.$on('update-input-field', this.updateFilterInput);
            // window.addEventListener('scroll', this.updateScroll);
        },
        beforeDestroy() {
            // unsubscribe
            if (typeof this.storeSubscription === "function") {
                this.storeSubscription();
            }

            // window.removeEventListener('scroll', this.updateScroll)
        },
        methods: {
            /**
             * Component Mode
             */
            isCategoryView() {
                return this.$route.path.search(/frontline\/catgeory\/[0-9]*\/faqs/i) !== -1;
            },
            isFaqView() {
                return this.$route.path.search(/frontline\/faq\/[0-9]/i) !== -1;
            },
            isCategoryRecentView() {
                return this.$route.path.search(/frontline\/catgeory\/[0-9]*\/recent-faqs/i) !== -1;
            },
            isHashTag() {
                if (this.$route.path.search(/frontline\/faq-hashtag\/[0-9a-zA-Z]/i) !== -1) {
                    this.hashTag = '#' + this.getHashTag();
                    return true;
                }
                return false;
            },
            /**
             * Initialize Component Methods
             */
            showFAQSide(faqId) {
                // if the faq is already opened, ignore
                if (this.singlefaq
                    && (this.singlefaq.id == faqId)) {
                    return;
                }
                // remove faq
                this.resetFaq();
                // set faq and cat busy flags
                this.faqBusy = true;
                this.catBusy = this.isFaqView() ? !this.catBusy : this.catBusy;
                // fetch faq
                this.remotelyFetchFAQ(faqId)
                    .then((data) => {
                        //prepare faq data
                        let faq = {
                            id: data.id,
                            category_id: this.category_Id,
                            question: data.question,
                            answer: data.answer.substring(1, 150),
                            shortAnswer: data.short_answer,
                            completeAnswer: data.answer,
                            hashtags: data.hashtags,
                            socialLinks: data.social_media_links,
                            media: data.media == null ? [] : data.media,
                            directories: data.directories ? data.directories : [],
                            contacts:data.contacts,
                            translations: data.translations,
                            // contactForms: data.directories && data.directories.contact_forms ? data.directories.contact_forms : [],
                        };

                        // set current faq
                        this.singlefaq = faq;
                        this.faqBusy = false;
                        // set current category if faq view
                        if (this.isFaqView()) {
                            this.catBusy = false;
                            this.faqs = [this.singlefaq];
                        }
                        // send faq view
                        this.trackPageView(this.singlefaq.id, this.singlefaq.category_id);
                    })
                    .catch((e) => {
                        console.log(e);
                        this.$router.replace("/404");
                    })
            },
            showRecentFAQs(catId) {
                catService
                    .getCategory(catId)
                    .then((category) => {
                        let ids = [];
                        ids.push(category.id);
                        category.children && category.children.forEach((childCat) => ids.push(childCat.id));
                        this.catBusy = true;
                        return faqService.getRecentFAQs(ids.join(','), this.page, this.filters).then(this.categorySuccess);

                    });
            },
            // just get the current faq
            remotelyFetchCurrentFAQ() {
                let faqId = this.$route.params.faq_id;
                return faqService.getFAQ(faqId);
            },
            // just get faq
            remotelyFetchFAQ(faqId) {
                return faqService.getFAQ(faqId);
            },
            /**
             *
             */
            getFaq(faqdetails) {
                this.singlefaq = faqdetails;
            },

            trackPageView(faq_id, category_id) {
                this.$ga.event({
                    eventCategory: 'c_' + category_id,
                    eventAction: 'f_' + faq_id,
                    eventLabel: 'u_' + JSON.parse(localStorage.user).id
                })
            },

            trackHashtagView(data) {
                if (data.total != 1) {
                    return;
                }

                this.$ga.event({
                    eventCategory: 'c_' + 'hashtag',
                    eventAction: 'f_' + 'hashtag',
                    eventLabel: 'u_' + JSON.parse(localStorage.user).id,
                    'dimension1': 'h_' + data.entities[0].id,
                });

                console.log({
                    eventCategory: 'c_' + 'hashtag',
                    eventAction: 'f_' + 'hashtag',
                    eventLabel: 'u_' + JSON.parse(localStorage.user).id,
                    'dimension1': 'h_' + data.entities[0].id,
                });
            },

            resetFaq() {
                this.singlefaq = null;
            },
            updateFilterInput: function (data) {
                switch (data.name) {
                    case 'search_faqs':
                        if ((data.value.length > 2 || this.filters[data.name])) {
                            this.filters[data.name] = data.value;
                            this.catStopCall = false;
                            this.faqs = [];
                            this.total = -1;
                            this.page = 1;
                            this.updateModel();
                        }
                        break;
                    case 'nationality':
                        const identical = this.filters[data.name].length === data.value.length && this.filters[data.name].sort().every(function (value, index) {
                            return value === data.value.sort()[index]
                        });

                        if (!identical) {
                            this.filters[data.name] = data.value;
                            this.catStopCall = false;
                            this.faqs = [];
                            this.total = -1;
                            this.page = 1;
                            this.updateModel();
                        }
                        break;
                    case 'country':
                        const identicalCountry = this.filters[data.name].length === data.value.length && this.filters[data.name].sort().every(function (value, index) {
                            return value === data.value.sort()[index]
                        });

                        if (!identicalCountry) {
                            this.filters[data.name] = data.value;
                            this.catStopCall = false;
                            this.faqs = [];
                            this.total = -1;
                            this.page = 1;
                            this.updateModel();
                        }
                        break;
                }

            },
            updateModel: function () {
                if (this.isFaqView() || this.isCategoryRecentView() || this.catBusy) {
                    return;
                }

                if (this.faqs.length && this.faqs.length === this.total || this.total === 0) {
                    this.catBusy = false;
                    return;
                }

                this.category_Id = this.getCategoryId();
                this.catBusy = true;

                if (this.isHashTag()) {
                    faqService.getCategoryFaqsHashtags(this.getHashTag(), this.page, this.filters).then(this.categorySuccess);
                    catService.getHashTag(this.getHashTag()).then(this.trackHashtagView);
                } else {
                    faqService.getCategoryFaqs(this.category_Id, this.page, this.filters).then(this.categorySuccess);
                }

            },
            getHashTag: function () {
                return this.$route.params.hashtag;
            },
            categorySuccess: function (data) {
                this.catBusy = false;

                this.total = data.total;

                if (this.catStopCall) {
                    this.page = 1;
                } else {
                    this.page += 1;
                }

                let _categories = [];

                for (let elem of data.entities) {
                    _categories.push({
                        id: elem.id,
                        category_id: this.category_Id,
                        question: elem.question,
                        answer: elem.answer.substring(1, 150),
                        shortAnswer: elem.short_answer,
                        completeAnswer: elem.answer,
                        hashtags: elem.hashtags,
                        socialLinks: elem.social_media_links,
                        media: elem.media == null ? [] : elem.media,
                        directories: elem.directories ? elem.directories : [],
                        contactForms: elem.directories ? elem.directories.contact_forms : [],
                    });
                }

                if (_categories.length) {
                    this.faqs.push.apply(this.faqs, _categories);
                }

                this.disabled = true;
                this.catStopCall = false;
            },
            getCategoryId() {
                return this.$route.params.id;
            },
            getFaqId() {
                return this.$route.params.faq_id;
            },
            updateScroll() {
                let height = document.getElementsByClassName('tab-content')[0] ? document.getElementsByClassName('tab-content')[0].clientHeight : 0;
                this.scrollPosition = height > 600 ? height - 130 : 800;
            }
        }
    }
</script>


<style type="text/css" lang="scss" scoped>
    .search-faqs-per-category {
        .container {
            height: calc(100vh - 306px);
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

        .search_faq_form {
            border-radius: 20px 20px;
        }
    }
</style>
