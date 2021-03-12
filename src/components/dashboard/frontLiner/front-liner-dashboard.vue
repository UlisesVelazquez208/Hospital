<template>
    <div class="front-liner-dashboard">
        <b-row>
            <b-col cols="12" lg="12" md="12">
                <search-box />
            </b-col>
        </b-row>
        <br/>
        <recently-updated-faqs
            :categories="categories"
            :errors="errors"
            :categories-empty="categoriesEmpty"
            :categories-empty-message="empty.categories"
        />
        <br/>
        <b-row>
            <b-col cols="12" lg="8" md="12" sm="12" class="mb-3">
                <trending-faqs
                    :faqs="trendingFaqs"
                    :errors="errors"
                    :trending-faqs-empty="trendingFaqsEmpty"
                    :trending-faqs-empty-message="empty.trendingFaqs"
                />
            </b-col>
            <b-col cols="12" lg="4" md="12" sm="12">
                <latest-media
                    :media="lastestMedia"
                    :errors="errors"
                    :lastest-media-empty="lastestMediaEmpty"
                    :lastest-media-empty-message="empty.lastestMedia"
                />
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import componentContainer from '../../pages/componentContainer.vue'
    import RecentlyUpdatedFaqs from "./partials/recentlyUpdatedFAQs";
    import TopFaqViewedByYou from "./partials/topFaqViewedByYou";
    import TrendingFaqs from "./partials/trendingFAQs";
    import searchBox from "./partials/search-box/searchBox";
    import latestMedia from './partials/latestMedia';
    import API from "./../../APIs/AbstractAPIs";
    import AbstractFiltersForEs from "./../../APIs/AbstractFiltersForEs";

    let filter = new AbstractFiltersForEs();

    export default {
        name: "front-liner-dashboard",
        components: {
            TrendingFaqs,
            TopFaqViewedByYou,
            RecentlyUpdatedFaqs,
            componentContainer,
            searchBox,
            latestMedia,
        },
        data: function () {
            return {
                categories: [],
                topFaqViewedByYou: [],
                trendingFaqs: [],
                lastestMedia: [],
                categoriesEmpty: false,
                topFaqViewedByYouEmpty: false,
                trendingFaqsEmpty: false,
                lastestMediaEmpty: false,
                empty: {
                    categories: 'No data found',
                    topFaqViewedByYou: 'No data found',
                    trendingFaqs: 'No data found',
                    lastestMedia: 'No data found',
                },
                errors: {
                    categories: '',
                    topFaqViewedByYou: '',
                    trendingFaqs: '',
                    lastestMedia: '',
                }
            };
        },
        created: function () {
            this.getCategories();
            // this.getTopFaqViewedByYou();
            this.getTrendingFaqs();
            this.getLastestMedia();
        },
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-home-dashboard');
        },
        methods: {
            getCategories: function () {
                this.$apis.createEntity({name: 'api/service-category/recent'});
                return this.$apis.endpoints.getAll().then(this.getCategoriesSuccess).catch(this.getCategoriesFailure);
            },
            getCategoriesSuccess: function ({data}) {
                let entitiesArr = [];
                for (let entity of data) {
                    entitiesArr.push({
                        id: entity.id,
                        name: entity.name,
                        views: entity.no_of_recent_faqs,
                    });
                }

                this.categories = entitiesArr;

                if(!this.categories.length){
                    this.categoriesEmpty = true;
                }

                this.$forceUpdate();
            },
            getCategoriesFailure: function (e) {
                this.errors.categories = 'Something went wrong please try again later!';
            },

            getTopFaqViewedByYou: function () {
                this.$apis.createEntity({name: 'api/me/top-viewed?with[]=serviceCategories'});
                return this.$apis.endpoints.getAll().then(this.getTopFaqViewedByYouSuccess).catch(this.getTopFaqViewedByYouFailure);
            },
            getTopFaqViewedByYouSuccess: function ({data}) {
                this.topFaqViewedByYou = data;

                if(!this.topFaqViewedByYou.length){
                    this.topFaqViewedByYouEmpty = true;
                }

                this.$forceUpdate();
            },
            getTopFaqViewedByYouFailure: function () {
                this.errors.topFaqViewedByYou = 'Something went wrong please try again later!';
            },

            getTrendingFaqs: function () {
                this.$apis.createEntity({name: 'api/faq/trending?with[]=serviceCategories&is_homepage=true'});
                return this.$apis.endpoints.getAll().then(this.getTrendingFaqsSuccess).catch(this.getTrendingFaqsFailure);
            },
            getTrendingFaqsSuccess: function ({data}) {
                this.trendingFaqs = data;
                if(!this.trendingFaqs.length){
                    this.trendingFaqsEmpty = true;
                }
                this.$forceUpdate();
            },
            getTrendingFaqsFailure: function () {
                this.errors.trendingFaqs = 'Something went wrong please try again later!';
            },

            getLastestMedia: function() {
                this.$apis.createEntity({name: 'api/media/lastest'});
                let currentLocale = localStorage.getItem('locale');
                let theLanguages = JSON.parse(localStorage.getItem('languages'));

                // let selectedLang = theLanguages.filter((item) => {
                //     if(item.acronym == currentLocale) {
                //         return item;
                //     }
                // });

                // if(selectedLang.length > 0) {
                //     filter.reset();
                //     filter.addWith('language_id');
                //     filter.addWithCondition('language_id', selectedLang[0].id);

                //     let theData = {
                //         "with":filter.getWith(),
                //         "with_conditions":{...filter.getWithConditions()}
                //     }
                //     let mediaApi = new API();
                //     mediaApi.createEntity({name: 'api/media/lastest'});
                //     return mediaApi.endpoints.post(theData).then(this.getLastestMediaSuccess).catch(this.getLastestMediaFailure);
                    
                // }
                return this.$apis.endpoints.get().then(this.getLastestMediaSuccess).catch(this.getLastestMediaFailure);
            },
            getLastestMediaSuccess: function({data}) {
                this.lastestMedia = data;
                if(!this.lastestMedia.length){
                    this.lastestMediaEmpty = true;
                }
                this.$forceUpdate();
            },
            getLastestMediaFailure: function() {
                this.errors.lastestMedia = 'Something went wrong please try again later!';
            }

        }
    }
</script>

<style scoped>

</style>
