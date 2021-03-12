<template>
    <div class="media-list-nav">
        <div class="container faqs-list-content"
            v-infinite-scroll="updateModel"
            :infinite-scroll-disabled="catBusy"
            infinite-scroll-distance="10"
        >
            <div class="text-left p-3 widget_social_icons faq-container" v-for="(item, index) in resultItems" :key="index">
                <div class="widget_social_inner1">
                    <div v-on:click="showMediaSide(item.id)" class="faq">{{ item.title }}</div>
                    <div d-if="item.service_categories" class='service-categories'>
                        {{ item.service_categories ? item.service_categories.map(a=>a.name).join(', '):'' }}
                    </div>
                    <div v-if="(item.content_type=='VIDEO' || item.content_type=='AUDIO' || item.content_type=='PDF') && item.meta && item.meta.thumbnail" class="image__container">
                        <img :src="item.meta.thumbnail" class="img-fluid img-thumb w-100" />
                    </div>
                    <div v-if="(item.content_type=='AUDIO') && !(item.meta && item.meta.thumbnail)" class="image__container">
                        <img :src="audioDefaultIcon" class="img-fluid img-thumb w-100" />
                    </div>
                    <div v-if="item.content_type=='POSTER'" class="image__container" v-on:click="showMediaSide(item.id)">
                        <img :src="item.url" class="img-fluid img-thumb w-100" />
                    </div>
                </div>
            </div>
            <loading-spinner :is-loading="catBusy"></loading-spinner>
            <b-card v-if="!total" class="bg-fa">
                <not-found text="No matching results"
                        icon="fa-question-circle"></not-found>
            </b-card>
        </div>
    </div>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll';
import NotFound from "./../frontLine/partials/not-found";
import LoadingSpinner from "./../spinner/loading-spinner";
import { EventBus } from "./../../eventbus/event-bus.js";

export default {
    name:"media-list",
    components:{
        NotFound,
        LoadingSpinner
    },
    directives: {infiniteScroll},
    props:{
        resultItems:{
            type:Array,
            required:true
        },
        total:{
            type:Number,
            required:true
        },
        catBusy:{
            type:Boolean,
            required:true
        }
    },
    data() {
        return {audioDefaultIcon: require('img/media-thumbnail-icons/audio-icon.png')};
    },
    mounted() {
        window.addEventListener('scroll', this.updateScroll);
    },
    methods:{
        updateModel:function(event) {
            EventBus.$emit('update-model', event);
        },
        showMediaSide:function(mediaID) {
            EventBus.$emit('show-media', mediaID);
        },
        updateScroll() {
            let height = document.getElementsByClassName('tab-content')[0] ? document.getElementsByClassName('tab-content')[0].clientHeight : 0;
            this.scrollPosition = height > 600 ? height - 130 : 800;
        }
    }
}
</script>
<style lang="scss">
    .media-list-nav {
        color: #1D87C4;
        padding: 30px 0 10px 0;

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
                margin: 10px 20px 20px 5px;
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
        .img-thumb {
            max-width:200px;
        }

        .faq {
            margin-bottom: 10px;
            color: #0072BC;
            cursor: pointer;
            font-size: 16px;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }
        .service-categories {
            font-weight: normal;
            color: #555555;
            margin-bottom: 5px;
        }
        .image__container{
            padding: 25px 10px;
            text-align: center;
            background-color: rgba(0,0,0,0.05);
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
    }
</style>
