<template>
    <b-card 
        header-text-variant="white"
        :header="cardHeader"
        align="left"
        class="media-header"
    >
        <div class="carousel-container">
            <template v-if="audios.length">

                <b-input-group class="mb-3 search-container" v-if="audios.length > 4">
                    <b-form-input v-model="search"
                                  type="text"
                                  placeholder="search related SoundCloud">
                    </b-form-input>
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                </b-input-group>

                <!-- Media Carousel -->
                <carousel class="px-5"
                          :perPage="4"
                          :mouseDrag="true"
                          :loop="true"
                          :paginationEnabled="false"
                          :navigationEnabled="audiosFiltered.length > 4"
                          navigationPrevLabel='<a href="#" style="display: block; position: relative; left: 25px; font-size: 20px;">❮</a>'
                          navigationNextLabel='<a href="#" style="display: block; position: relative; right: 25px; font-size: 20px;">❯</a>'
                          v-if="audiosFiltered.length > 0"
                >
                    <template v-if="audiosFiltered.length > 0">
                        <slide v-for="audio in audiosFiltered" class="px-2" :key="audio.id" :data-index="audio.id" style="padding-left:10px;">

                            <b-card :class="shrinked" :footer="audio.title">
                                <iframe :src="getMeta(audio.meta, 'embed_url')" frameborder="0"
                                        class="iframe-soundcloud"></iframe>
                            </b-card>

                        </slide>
                    </template>
                    <template v-else>No Audios Found</template>

                </carousel>
            </template>

            <not-found v-else text="Common.NoAudio" icon="fa-question-circle"></not-found>

        </div>

    </b-card>
</template>

<script>

    import {Carousel, Slide} from 'vue-carousel';
    import NotFound from "./not-found";

    export default {
        name: "audio-media-content-box",
        props: {
            audios: {
                type: Array,
                required: true
            }
        },
        data: function () {
            return {
                header: "Related Audios",
                search: ""
            };
        },
        computed: {
            cardHeader: function () {
                return this.header + " (" + this.audiosFiltered.length + ")";
            },
            audiosFiltered: function () {

                if (this.audios.length == 0)
                    return [];

                if (this.search == "")
                    return this.audios;

                let search = this.search;
                return this.audios.filter(function (audio) {
                    return audio.title.toLowerCase().search(search) != -1 || audio.description.toLowerCase().search(search) != -1
                }.bind(search));

            },
            shrinked: function () {
                return "";
                let audisNo = this.audiosFiltered.length;
                return audisNo < 4 ? "w-" + (100 - ((4 - audisNo) * 25)) : "";
            }
        },
        components: {
            NotFound,
            Carousel,
            Slide
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
        created: function () {

        }
    }
</script>
<style scoped type="text/css" lang="scss">
    .form-control:focus{
        border: 1px solid #ced4da;
        box-shadow: none;
    }
    .iframe-soundcloud {
        height: 250px;
        width: 100%;
        border: 0;
    }
    .search-container {
        width: 255px;
        padding-left: 45px;
    }

    .search-container{
        padding:10px;
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
        padding: 20px 0px
    }
</style>


