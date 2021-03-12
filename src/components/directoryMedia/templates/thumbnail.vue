<template>
    <div style="text-align: center">
        <b-img :src="getImageUrl(data.id)" width="75" height="75" blank-color="#777" alt="img" class="m-1 thumb-img" @error="customImage($event)"/>
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
                return env.API_URL +'/api/directory-media/resize/'+ id +'/small'
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
            }
        }
    }
</script>
<style scoped>
    .thumbnail-details {

    }

    .thumb-img {
        object-fit: contain;
        overflow: hidden;
    }
</style>
