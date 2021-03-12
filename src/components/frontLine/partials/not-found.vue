<template>
        <div class="text-center no-data">
            <i :class="'icon-default fa '+icon"></i>
            <div class="error-label">{{$t(text)}}</div>
        </div>
</template>

<script>
    export default {
        name: "not-found",
        props: {
            text: {
                required: true,
                type: String
            },
            icon: {
                required: true,
                type: String
            }
        },
    }
</script>

<style scoped>
    .no-data{
        color: #ACACAC;
        font-family: Helvetica;
        font-size: 14px
    }
    .icon-default{
        font-size: 40px;
    }
</style>
