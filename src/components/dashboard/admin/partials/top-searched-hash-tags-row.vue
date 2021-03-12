<template>
    <b-row class="row-style">
        <b-col cols="3" class="text-left hashtag-name">
                #{{hashtag.hashtag}}
        </b-col>
        <b-col cols="7">
            <b-progress height="15px" :value="calculateWidth(hashtag.views)" variant="info" hide-value
                        class="mb-4"></b-progress>
        </b-col>
        <b-col cols="2" class="text-center">{{hashtag.views}}</b-col>
    </b-row>
</template>

<script>
    export default {
        name: "top-searched-hash-tags-row",
        props: {
            hashtag: {
                type: Object,
                required: true
            },
            maxViews: {
                required: true
            }
        },
        methods: {
            calculateWidth: function (view) {
                return 100 * parseInt(view) / parseInt(this.maxViews);
            }
        }
    }
</script>

<style>
    .hashtag-name{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .row-style {
        color: #525252;
        font-family: "Helvetica";
        font-size: 15px;
    }

    .bg-info {
        background-color: #64b7e3 !important;
    }
</style>
