<template>
    <p class="card-text-error"><i class="fa fa-exclamation"></i><br/>{{error}}</p>
</template>

<script>
    export default {
        name: "error-message",
        props: {
            error: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped>
    .card-text-error{
        text-align: center;
        font-size: 14px;
        color: #712b21
    }
</style>
