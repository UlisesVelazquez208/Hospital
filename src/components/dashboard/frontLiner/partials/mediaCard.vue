<template>
    <b-card class="bg-fa">
        <a :href="'#/media-items/'+media['id']" class="media-header" >
            {{media.title}}
        </a>
        <div class="card-text" v-if="media['url']">
            <div class="iframe-container" v-if="meta && meta.length > 0">
                <iframe :src="getMeta(meta, 'embed_url')" frameborder="0"
                            class="iframe-video"></iframe>
            </div>
            <div v-else >
                <b-card style="cursor: pointer" :footer="media.title">
                    <b-card-img :src="media.url" :alt="media.title"></b-card-img>
                </b-card>
            </div>
        </div>
    </b-card>
</template>

<script>
    import mediaService from "../../../../helpers/mediaService";

    let servMedia = new mediaService();
    export default {
        name: "media-card",
        props: {
            media: {
                type: Object,
                required: true
            }
        },
        data: function () {
            return {
                meta: '',
            };
        },
        mounted() {
            const mediaID = this.media.id;
            this.remotelyFetchMedia(mediaID).then((data)=> {
                this.meta = data.meta;
            }). catch((e)=>{
                console.log(e);
            });
        },
        methods: {
            remotelyFetchMedia: function(mediaID) {
                return servMedia.getMedia(mediaID, this.page);
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
        }
    }
</script>

<style lang="scss" scoped>
    .card {
        box-shadow: 1px 1px 25px -8px #8e8c8e;
    }
    .card:hover{
        box-shadow: 1px 1px 38px -8px #8e8c8e;
    }
    .card-title{
        font-size: 18px;
        font-family: "Helvetica Neue";
        font-weight: bold;
        color: #4a4a4a;
        margin-bottom: 33px;
    }
    .card-text{
        font-size: 16px;
        font-family: "Helvetica Neue";
        color: #5e5e5e;
        margin-top: 33px;
    }
    .views-count{
        font-family: "Helvetica Neue";
        color: #5e5e5e;
    }
    .media-header {
        font-size: 18px;
        font-family: "Helvetica Neue";
        font-weight: bold;
        color: #4a4a4a;

        &:hover {
            opacity: 0.5;
            transition: opacity 0.5s;
            cursor: pointer;
        }
    }
    .iframe-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 56.25%;

        .iframe-video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }

</style>
