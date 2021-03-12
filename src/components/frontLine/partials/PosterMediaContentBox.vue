<template>
    <b-card header-text-variant="white"
            :header="cardHeader"
            align="left"
            class="media-header"
    >
        <div class="carousel-container">
            <template v-if="posters.length">
                <!-- Search Box -->
                <b-input-group class="mb-3 search-container" v-if="posters.length > 4">
                    <b-form-input v-model="search"
                                  type="text"
                                  placeholder="Search related Posters">
                    </b-form-input>
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                </b-input-group>

                <!-- Media Carousel -->
                <carousel class="px-5"
                          :perPage="Math.min(postersFiltered.length, 4)"
                          :loop="true"
                          :mouseDrag="true"
                          :paginationEnabled="false"
                          navigationPrevLabel='<a href="#" style="display: block; position: relative; left: 25px; font-size: 20px;">❮</a>'
                          navigationNextLabel='<a href="#" style="display: block; position: relative; right: 25px; font-size: 20px;">❯</a>'
                          :navigationEnabled="postersFiltered.length > 4"
                          v-if="postersFiltered.length > 0"
                >
                    <template v-if="postersFiltered.length > 0">
                        <template v-for="poster in postersFiltered">
                            <slide
                                v-if="poster.content_type === 'POSTER'"
                                v-b-modal.modal1
                                :key="poster.id"
                                :data-index="poster.id"
                                :style="'padding-left:10px; max-width: 200px; width: '+(100/Math.min(postersFiltered.length, 4))+'%;'"
                            >
                                <b-card @click="setCurrentUrl(poster.url)" style="cursor: pointer" class="w-100" :footer="poster.title">
                                    <div style="display: flex; height: 200px; overflow:hidden; vertical-align: middle; text-align: center;">
                                        <b-card-img
                                            :src="getImageUrl(poster.id)"
                                            :alt="poster.title" header
                                            class="img-fluid m-auto"
                                        ></b-card-img>
                                    </div>
                                </b-card>
                            </slide>
                            <slide
                                v-else-if="poster.content_type === 'PDF'"
                                :key="poster.id"
                                :data-index="poster.id"
                                :style="'padding-left: 10px; max-width: 200px; width: '+(100/Math.min(postersFiltered.length, 4))+'%;'"
                            >
                                <b-card style="cursor: pointer" class="w-100" :footer="poster.title">
                                    <div style="display: flex; height: 200px; overflow:hidden; vertical-align: middle; text-align: center;">
                                        <a
                                            :href="poster.url"
                                            target="_blank"
                                            class="m-auto pdf-file"
                                        >
                                            <i class="fa fa-file-pdf-o" style="font-size: 50px"></i>
                                        </a>
                                    </div>
                                </b-card>
                            </slide>
                        </template>
                    </template>
                    <template v-else>No Posters Found</template>
                </carousel>
            </template>
            <not-found v-else text="Common.NoPoster" icon="fa-question-circle"></not-found>
        </div>
        <!-- Modal Component -->
        <b-modal size="lg" :hide-header="true" centered :hide-footer="true" id="modal1" title="Bootstrap-Vue">
            <div class="text-center custom-style">
                <a :href="currentUrl" target="_blank">
                    <img :src="currentUrl" class="img-fluid" />
                </a>
            </div>
        </b-modal>
    </b-card>
</template>

<script>
    import {Carousel, Slide} from 'vue-carousel';
    import NotFound from "./not-found";
    import env from '../../../Env.js';

    export default {
        name: "poster-media-content-box",
        props:
            {
                posters: {
                    type: Array,
                    required: true
                },
            },
        data: function () {
            return {
                header: "Related Posters",
                search: "",
                text: true,
                currentUrl: ''
            };
        },
        computed: {
            cardHeader: function () {
                return this.header + " (" + this.postersFiltered.length + ")";
            },
            postersFiltered: function () {
                if (this.posters.length === 0)
                    return [];

                if (this.search === "")
                    return this.posters;

                let search = this.search;
                return this.posters.filter(function (poster) {
                    return poster.title.toLowerCase().search(search) !== -1 || poster.description.search(search) !== -1
                }.bind(search));
            }
        },
        components: {
            NotFound,
            Carousel,
            Slide
        },
        methods: {
            getImageUrl: function (id) {
                return env.API_URL + '/api/media/resize/' + id + '/medium';
            },
            setCurrentUrl(url) {
                console.log(url);
                this.currentUrl = url;
            }
        }
    }
</script>

<style scoped type="text/css" lang="scss">
    .card-img {
        width: auto;
        max-height: 100%;
    }

    .form-control:focus {
        border: 1px solid #ced4da;
        box-shadow: none;
    }

    .search-container {
        width: 255px;
        padding-left: 40px;
    }

    .search-container input {
        padding: 10px;
    }

    .noData {
        padding: 15px 0 15px 45px;
        margin-bottom: 0;
    }

    .poster-box {
        padding: 7px 7px;
        border: 1px solid #ccc;
        border-radius: 5px 6px;
        box-shadow: 1px 1px 3px 0px #9c9c9c;
        margin-bottom: 16px;
        width: 94%;

        .poster-image {
            width: 100%;
            height: 150px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }

        .poster-text {
            margin-top: 10px;
            margin-bottom: 10px;
            height: 50px;
        }
    }

    .custom-style {
        overflow: hidden;
    }

    .carousel-container {
        padding: 20px 0px;
    }

    #modal1 .img-fluid {
        max-height: 80vh;
    }

    #modal1 .pdf-file {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>


