<template>
    <p class="card-text-message"><i class="fa fa-exclamation"></i><br/>{{message}}</p>
</template>

<script>
    export default {
        name: "empty-message",
        props: {
            message: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped>
    .card-text-message{
        text-align: center;
        font-size: 14px;
        /*color: #712b21*/
    }
</style>
