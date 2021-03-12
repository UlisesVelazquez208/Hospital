<template>
    <div class="menu-item-container">
        <ClipLoader :loading="isLoading"
                    :color="loaderColor"
                    :size="loaderSize"
        >
        </ClipLoader>
    </div>
</template>

<script>
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

    export default {
        name: "loading-spinner",
        props: {
            menuText: {
                type: String,
            },
            isLoading: {
                type: Boolean,
                required: true
            },
            isShifted: {
                type: Boolean,
                required: false,
                default: false
            },
            shiftSize: {
                type: String,
                required: false
            }
        },
        data: function () {
            return {
                loaderColor: "#0072BC",
                loaderSize: "20px"
            };
        },
        methods: {},
        components: {
            'ClipLoader': ClipLoader
        }

    }

</script>
<style scoped type="text/css" lang="scss">

    .menu-item-container{
        /*right: 38%;*/
        /*bottom: 10%;*/
    }
</style>
