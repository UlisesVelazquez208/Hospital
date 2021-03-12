<template>
    <white-container title="Home.Media" sectionClass="media-content">
        <input-multi-select v-bind:value="value" name="media-content" inputLabel="FAQ.SearchMedia"
            inputId="media-content" inputplaceholder="FAQ.MediaChooseMediaPlaceholder" label="titleSelect"
                            :selectOptions="selectOptions">
        </input-multi-select>
        <div class="selected-list">
            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3">
                    <ul>
                        <li v-for="(item, index) in value" :key="index">
                            <div class="row">
                                <div v-if="item.content_type == 'POSTER' " class="img-container">
                                    <img class="rounded img-fluid float-md-left float-sm-left" :src="getImageUrl(item.id)" :alt="item.description">
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

                                <div class="col-sm-8">
                                    <h4 class="media-title">{{item.title}}</h4>
                                    <div class="media-info">
                                        <span>type: </span>
                                        <p class="">{{item.content_type}}</p>
                                    </div>
                                    <div class="media-info" v-html="item.description"></div>
                                    <!-- <div class="media-info">
                                        <p class="media-info">{{item.description}}</p>
                                    </div> -->
                                </div>
                            </div>
                            <span class="custom__remove " @click="removelink(index)">❌</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Comment -->
        <comment-section name="media_section_comment"
                         :comments="comments"
                         :addNew="false"
        ></comment-section>

        <div class="details"
             v-if="!isUpdateMode() || (isUpdateMode() && faqModel.comments == null)"
        >
            <div class="row">
                <div class=" col-sm-12">
                    <h5 class="header">{{ $t('FAQ.MediaCantFind')}}</h5>
                    <!--<router-link tag="a" to="##" class="btn btn-primary details-link  pull-left btn-lg ">-->
                    <!--</router-link>-->
                    <component-as-modal showModalButton="FAQ.MediaAddNewMediaContent"
                                        componentName="createMediaContent"
                                        @processDone="onProcessDone">
                    </component-as-modal>
                </div>
            </div>
        </div>


    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue"
    import inputMultiSelect from "../../core/form/partials/input-multiselect/input-multiselect.vue"
    import {EventBus} from '../../../eventbus/event-bus.js';
    import componentAsModal from '../../modal/component-as-modal.vue';
    import CommentSection from "./comment-section.vue"
    import env from '../../../Env';
    export default {
        name: "media-content",
        components: {
            whiteContainer,
            inputMultiSelect,
            componentAsModal,
            CommentSection
        },

        // ===Props passed to component
        props: {
            faqModel: {
                type: Object,
                required: false
            },
            errors: {
                type: Array,
                required: false
            },
        },
        // ===component Data properties
        data() {
            return {
                value: [],
                selectOptions: []

            }
        },
        // ===Code to be executed when Component is mounted
        mounted() {
        },
        created: function () {
            this.getMedia();
            this.loadMedia();
        },
        // ===Computed properties for the component
        computed: {
            comments: function () {
                if (this.faqModel.comments == null)
                    return [];

                return this.faqModel.comments.filter(comment => comment.section == 'MEDIA');
            }
        },
        // ===Component methods
        methods: {
            getImageUrl: function(id){
                return env.API_URL +'/api/media/resize/'+ id +'/medium'
            },
            loadMedia: function () {
                this.value = this.faqModel.media === null ? [] : this.faqModel.media;
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
            getMedia: function () {
                this.$apis.createEntity({name: 'api/media?with[]=meta&with[]=countries&with[]=language&paginate=0&sorting[title]=asc'});
                this.$apis.endpoints.getAll().then(({data}) => {
                    this.selectOptions = data
                        .map((a) => {
                            let titleSelect = `${a.title} | ${a.content_type}`;
                            titleSelect += ` | ${a.countries ? a.countries.map(country => country.country).join(', ') : 'no countries'}`;
                            titleSelect += ` | ${a.language ? a.language.name : 'no languages' }`;
                            return {
                                titleSelect,
                                title: a.title,
                                id: a.id,
                                description: a.description,
                                content_type: a.content_type,
                                url: a.url,
                                meta: a.meta
                            }
                        });
                });

                EventBus.$on('update-multi-select', this.getvalues);
            },
            getvalues: function (data) {
                if (data.name === "media-content") {
                    this.value = data.value
                }
            },
            removelink: function (index) {
                this.value.splice(index, 1);
            },
            onProcessDone: function () {
                this.getMedia();
                this.loadMedia();            },
            getId() {
                return this.$route.params.id;
            },
            isUpdateMode() {
                return this.$route.params.id == undefined ? false : true;
            }
        },
    };
</script>
<style type="text/css" lang="scss">
    .white-section.media-content {
        .white-section_details {
            padding: 25px 0 35px;

        }
    }

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
            ul {
                list-style: none;
                padding: 0;
                margin: 20px 0px;
            }
            li {
                min-height: 150px;
                padding: 15px 15px;
                /*box-shadow: 1px 1px 1px 1px #bbbbbbf5;*/
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
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
                .audio-container{
                    width: 300px;
                    padding: 0 15px;
                }
                .video-container {
                    width: 300px;
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
            .custom__remove {
                padding-left: 1px;
                position: absolute;
                top: -8px;
                right: -9px;
                background-color: #636363;
                border-radius: 50%;
                color: #fff;
                width: 20px;
                height: 20px;
                text-align: center;
                padding-top: 1px;
                &:hover {
                    cursor: pointer;

                }
            }
        }
    }
</style>
