<template>
    <div style="text-align: center">
        <b-img :src="getImageUrl(data.id)" v-if="data.content_type === 'Poster'" width="75" height="75" blank-color="#777" alt="img" class="m-1 thumb-img" @error="customImage($event)"/>

        <div v-else-if="data.content_type === 'Video'">
            <a :href="data.url" target="_blank">
                <i :class="`fa ${getVideoTypeIcon(data.url)}`" style="font-size: 50px"></i>
            </a>
        </div>

        <div v-else-if="data.content_type === 'Audio'">
            <a :href="data.url" target="_blank">
                <i class="fa fa-soundcloud" style="font-size: 50px"></i>
            </a>
        </div>

        <div v-else-if="data.content_type === 'PDF'">
            <a :href="data.url" target="_blank">
                <i class="fa fa-file-pdf-o" style="font-size: 50px"></i>
            </a>
        </div>

    </div>
</template>
<script>

    import NotFound from "../../frontLine/partials/not-found";
    import env from "../../../Env.js"

    export default {
        components: {NotFound},
        props: ['data', 'index'],
        name: 'media-thumbnail',
        data: function () {
            return {
                notFound: false
            }
        },
        methods: {
            getImageUrl: function(id){
                return env.API_URL +'/api/media/resize/'+ id +'/small'
            },
            getMeta: function (metas, key) {
                this.notFound = false;

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
            customImage(elem){
                elem.target.src = require('img/not-found.png');
            },
            getVideoTypeIcon: function(url) {
                const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const vimeoRegex = /^.*(vimeo.com\/)([^#\&\?]*).*/;
                if(url) {
                    if(url.match(youtubeRegex)) {
                        return 'fa-youtube';
                    }

                    if(url.match(vimeoRegex)) {
                        return 'fa-vimeo-square';
                    }
                }

                return 'fa-file-video-o';
            }
        }
    }
</script>
<style scoped>
    .thumb-img {
        object-fit: contain;
        overflow: hidden;
    }
</style>
