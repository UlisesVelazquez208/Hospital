<template>
    <b-card class="bg-fa">
        <a :href="'#/frontline/faq/'+faq.id" class="faq-header" >
            {{faq.question}}
        </a>
        <p class="card-text" v-if="showAnswer">
            {{faq.short_answer}}
        </p>
        <label v-if="faq.views" class="float-right views-count"><i class="fa fa-eye"></i> {{faq.views}}</label>
    </b-card>
</template>

<script>
    export default {
        name: "faq-card",
        props: {
            faq: {
                type: Object,
                required: true
            },
            showAnswer:{
                type:Boolean,
                required: false,
                default: true
            }
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
    .faq-header {
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

</style>
