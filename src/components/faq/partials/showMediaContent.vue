<template>
    <white-container title="Menu.MediaContent" sectionClass="media-content">

        <div class="selected-list">
            <div class="row">
                <div class="col-sm-12 col-lg-9">
                    <ul>
                        <li v-for="(item, index) in this.faqModel.media === null ? [] : this.faqModel.media">
                            <div class="row">

                                <div v-if="item.content_type == 'POSTER' " class="img-container">
                                    <!-- <slide @slideClick="setCurrentUrl(item.url)" v-b-modal.modal1 :key="item.id" :data-index="item.id"
                                   style="padding-left:10px;">
                                    
                                    </slide> -->
                                    <a @click="setCurrentUrl(item.url)" v-b-modal.modal1>
                                        <img class="rounded img-fluid float-md-left float-sm-left" :src="getImageUrl(item.id)" :alt="item.description">
                                    </a>
                                </div>

                                <div class="audio-container" v-else-if="item.content_type == 'AUDIO'">
                                    <b-embed type="iframe" :src="getMeta(item.meta, 'embed_url')" frameborder="0"></b-embed>
                                </div>

                                <div class="video-container" v-else-if="item.content_type == 'VIDEO'" >
                                    <b-embed type="iframe" :src="getMeta(item.meta, 'embed_url')" frameborder="0"></b-embed>
                                </div>

                                <div class="pdf-container" v-else-if="item.content_type === 'PDF'">
                                    <a :href="item.url" target="_blank">
                                        <i class="fa fa-file-pdf-o" style="font-size: 50px"></i>
                                    </a>
                                </div>

                                <div class="col-sm-7">
                                    <h4 class="media-title">{{item.title}}</h4>
                                    <div class="media-info">
                                        <span>type: </span>
                                        <p class="">{{item.content_type}}</p>
                                    </div>
                                    <div class="media-info" v-html="item.description"></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <b-modal size="lg" :hide-header="true" centered :hide-footer="true" id="modal1" title="Bootstrap-Vue">
            <div class="text-center custom-style">
                <a :href="currentUrl" target="_blank">
                    <img :src="currentUrl" class="img-fluid img-thumbnail"/>
                </a>
            </div>
        </b-modal>

        <!-- Comment -->
        <comment-section name="media_section_comment" :showComment="showComment"
                         :comments="comments"
        ></comment-section>

    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue"
    import CommentSection from "./comment-section.vue";
    import env from '../../../Env';

    export default {
        name: "media-content",
        components: {
            CommentSection,
            whiteContainer
        },
        // ===Props passed to component
        props: {
            faqModel: {
                type: Object,
                required: false
            },
            showComment:{
                type:Boolean,
                default:true,
                required:false
            }
        },
        // ===component Data properties
        data() {
            return {
                currentUrl:''
            }
        },
        // ===Component methods
        methods: {
            getImageUrl: function(id){
                return env.API_URL +'/api/media/resize/'+ id +'/medium'
            },
            getId() {
                return this.$route.params.id;
            },
            getMeta: function (metas, key) {

                if (!metas) {
                    return '';
                }

                for (let meta of metas) {
                    if (meta.key === key) {
                        return meta.value;
                    }
                }

                return '';
            },
            setCurrentUrl(url) {
                this.currentUrl = url;
            }
        },
        computed: {
            comments: function () {
                if (this.faqModel.comments == null)
                    return [];

                return this.faqModel.comments.filter(comment => comment.section == 'MEDIA');
            }
        }
    };
</script>
<style type="text/css" lang="scss">
    .media-content {
        .multiselect__option--highlight {
            background: #1E8FCD;
        }
        .multiselect__option--highlight:after {
            background: #1E8FCD;
            color: #fff
        }
        .multiselect__tags-wrap {
            display: none;
        }
        .details {
            margin-top: 100px;
        }
        .details-link {
            background-color: #fff;
            border: 2px solid #1E8FCD;
            color: #1E8FCD;
            padding: 8px 35px;
            margin-top: 15px;
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
                /*box-shadow: 1px 1px 1px 1px #bbbbbbf5;*/
                /*box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);*/
                border: 1px solid #ccc;
                -webkit-border-radius: 5px 5px;
                -moz-border-radius: 5px 5px;
                border-radius: 5px 5px;
                margin: 15px 0;
                position: relative;
                .img-container {
                    padding: 0px 0 0 15px;
                    img {
                        max-height: 120px;
                    }
                    @media (max-width: 620px) {
                        padding: 0 0 15px 15px;
                    }
                }
                .video-container{
                    width: 350px;
                    padding: 0 15px;
                }
                .audio-container{
                    width: 350px;
                    padding: 0 15px;
                }
                .pdf-container{
                    padding: 20px 30px;
                }
                .media-title {
                    font-weight: bold;
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                .media-info {

                    p {
                        margin-bottom: 8px;
                        display: inline-block !important;
                    }
                    span {
                        font-weight: bold;
                        text-transform: capitalize;
                    }
                }

            }
        }
    }
</style>
