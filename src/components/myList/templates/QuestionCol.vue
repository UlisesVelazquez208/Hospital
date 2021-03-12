<template>
    <div>
        <div class="quesiton-clickable" @click="openFaq">{{data.question}}</div>
    </div>
</template>
<script>
    export default {
        props: ['data', 'index'],
        name: 'html-col',
        methods: {
            openFaq() {
                this.$router.replace('/frontline/faq/' + this.data.faq_id);
            }
        },
    }
</script>

<style lang="scss" scoped>
    .quesiton-clickable {
        &:hover {
            cursor: pointer;
        }
    }
</style>
