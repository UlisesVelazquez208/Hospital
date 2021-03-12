<template>
    <b-card header-text-variant="white"
            :header="cardHeader"
            align="left"
            class="media-header"
    >
        <div class="carousel-container">

            <template v-if="videos.length">
                <!-- Search Box -->
                <b-input-group class="mb-3 search-container" v-if="videos.length > 4">
                    <b-form-input v-model="search"
                                  type="text"
                                  placeholder="search related videos">
                    </b-form-input>
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>

                </b-input-group>

                <!-- Media Carousel -->
                <carousel class="px-2"
                          :perPage="2"
                          :paginationEnabled="false"
                          :navigationEnabled="videosFiltered.length > 2"
                          :mouseDrag="true"
                          :loop="true"
                          navigationPrevLabel='<a href="#" style="display: block; position: relative; left: 25px; font-size: 20px;">❮</a>'
                          navigationNextLabel='<a href="#" style="display: block; position: relative; right: 25px; font-size: 20px;">❯</a>'
                          v-if="videosFiltered.length > 0"
                >
                    <template v-if="videosFiltered.length > 0">
                        <slide v-for="video in videosFiltered" class="px-2 iframe-media-content-slide" :key="video.id" :data-index="video.id" style="padding-left:10px;">
                            <b-card :class="shrinked" :footer="video.title">
                                <iframe :src="getMeta(video.meta, 'embed_url')" frameborder="0"
                                        class="iframe-video"></iframe>
                            </b-card>
                        </slide>
                    </template>
                    <template v-else>No Videos Found</template>
                </carousel>
            </template>

            <not-found v-else text="Common.NoVideo" icon="fa-question-circle"></not-found>

        </div>
    </b-card>
</template>

<script>

    import {Carousel, Slide} from 'vue-carousel';
    import NotFound from "./not-found";

    export default {
        name: "video-media-content-box",
        props: {
            videos: {
                type: Array,
                required: true
            }
        },
        data: function () {
            return {
                header: "Related Videos",
                search: ""
            };
        },
        methods: {
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
            }
        },
        computed: {
            cardHeader: function () {
                return this.header + " (" + this.videosFiltered.length + ")";
            },
            videosFiltered: function () {

                if (this.videos.length == 0) {
                    return [];
                }

                if (this.search == "") {
                    return this.videos;
                }
                let search = this.search;
                return this.videos.filter(function (video) {
                    return video.title.toLowerCase().search(search) != -1 || video.description.toLowerCase().search(search) != -1
                }.bind(search));

            },
            shrinked: function () {
                return "";
                let videosNo = this.videosFiltered.length;
                return videosNo < 4 ? "w-" + (100 - ((4 - videosNo) * 25)) : "";
            }
        },
        components: {
            NotFound,
            Carousel,
            Slide
        },
    }
</script>
<style scoped type="text/css" lang="scss">
    .form-control:focus{
        border: 1px solid #ced4da;
        box-shadow: none;
    }
    .VueCarousel-slide {
        width: 34%;
    }
    .search-container {
        width: 255px;
        padding-left: 45px;
    }

    .iframe-video {
        width: 100%;
        border: 0;
    }

    .noData {
        padding: 15px 0 15px 45px;
        margin-bottom: 0;
    }

    .VueCarousel-inner {
        visibility: visible;
        flex-basis: 100%;
        width: 100%;
    }

    .carousel-container {
        padding: 20px 0px;
    }

    .iframe-media-content-slide .card-body {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 56.25%;
    }

    .iframe-media-content-slide .card-body .iframe-video{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0.5rem;
    }
</style>


