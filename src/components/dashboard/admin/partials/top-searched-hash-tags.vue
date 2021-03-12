<template>
    <component-container-white title="Top Searched Hashtags" class="top-faq-viewed" :date-picker="true"
                         date-picker-name="topSearchedHashtags">

        <error-message v-if="topSearchedHashTagsError" :error="topSearchedHashTagErrorMessage"/>

        <empty-message v-else-if="topSearchedHashTagsEmpty" :message="topSearchedHashTagsEmptyMessage"/>

        <loading-spinner v-else-if="!hashTags.length" :is-loading="!hashTags.length"></loading-spinner>

        <template v-else>
            <b-row class="row-style head">
                <b-col cols="3" class="text-left">Tag</b-col>
                <b-col cols="7" class="text-center">Views</b-col>
                <b-col cols="2" class="text-center">Searches</b-col>
            </b-row>
            <div class="container">
                <top-searched-hash-tags-row v-for="(hashTag, index) in hashTags" :hashtag="hashTag"
                                            :max-views="maxViews"
                                            :key="index"/>
            </div>
        </template>

    </component-container-white>
</template>

<script>
    import ComponentContainer from "../../../pages/componentContainer";
    import ErrorMessage from "../../frontLiner/partials/error-message";
    import LoadingSpinner from "../../../spinner/loading-spinner";
    import EmptyMessage from "../../frontLiner/partials/empty-message";
    import TopSearchedHashTagsRow from "./top-searched-hash-tags-row";
    import ComponentContainerWhite from "../../../pages/componentContainerWhite";

    export default {
        name: "top-searched-hash-tags",
        components: {
            ComponentContainerWhite,
            TopSearchedHashTagsRow,
            EmptyMessage, LoadingSpinner, ErrorMessage, ComponentContainer
        },
        data: function () {
            return {
                hashTags: [],
                maxViews: 0,
                topSearchedHashTagsEmpty: false,
                topSearchedHashTagsEmptyMessage: 'No data found!',
                topSearchedHashTagsError: false,
                topSearchedHashTagErrorMessage: 'Something went wrong please try again later!',
            }
        },
        created: function () {
            this.topSearchedHashtags();
            this.listen();
        },
        methods: {
            listen: function () {
                this.$eventBus.$on('widgets-date-picker-update', this.updateDate);
            },
            updateDate: function (data) {
                switch (data.name) {
                    case 'topSearchedHashtags':
                        this.topSearchedHashtags(data);
                        break;
                }
            },
            topSearchedHashtags: function (date) {

                let url = '/api/hashtag/trending';

                this.hashTags = [];
                this.topSearchedHashTagsEmpty = false;
                this.topSearchedHashTagsError = false;

                if (date) {
                    url += '?start_date=' + date.first_day + '&end_date=' + date.last_day;
                }

                this.$apis.createEntity({name: url});
                return this.$apis.endpoints.getAll().then(this.topSearchedHashtagsSuccess).catch(this.topSearchedHashtagsFailure);
            },
            topSearchedHashtagsSuccess: function ({data}) {

                let maxValue = 0;

                this.hashTags = data.map(function (hashTag) {
                    if (parseInt(hashTag.views) > parseInt(maxValue)) {
                        maxValue = hashTag.views;
                    }

                    return hashTag;
                });

                this.maxViews = maxValue;

                if (!this.hashTags.length) {
                    this.topSearchedHashTagsEmpty = true;
                }

                this.$forceUpdate();
            },
            topSearchedHashtagsFailure: function (e) {
                this.topSearchedHashTagsError = true;
            },
        }
    }
</script>

<style scoped>
    .row-style.head {
        background-color: #e7e7e7;
        padding: 10px;
        margin-bottom: 15px;
    }

    .container {
        height: 175px;
    }
</style>
