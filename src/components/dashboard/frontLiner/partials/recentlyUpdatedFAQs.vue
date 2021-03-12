<template>
    <component-container title="Home.RecentlyUpdatedFAQs">

        <error-message v-if="errors.categories" :error="errors.categories"/>

        <empty-message v-else-if="categoriesEmpty" :message="categoriesEmptyMessage"/>

        <loading-spinner v-else-if="!categories.length" :is-loading="!categories.length"></loading-spinner>

        <b-card-group deck v-else>
            <b-card v-for="(category, index) in categories"
                    :header="category.name" header-tag="header"
                    :key="index"
                    class="cat-block bg-fa"
                    @click="openRecentCat(category)">
                <p class="card-text">{{category.views}}</p>
            </b-card>
        </b-card-group>
    </component-container>
</template>

<script>
    import componentContainer from '../../../pages/componentContainer.vue'
    import LoadingSpinner from "../../../spinner/loading-spinner";
    import ErrorMessage from "./error-message";
    import EmptyMessage from "./empty-message";
    export default {
        components: {
            EmptyMessage,
            ErrorMessage,
            LoadingSpinner,
            componentContainer,
        },
        props: {
            categories: {
                type: Array,
                required: true
            },
            errors: {
                type: Object,
                default: {}
            },
            categoriesEmpty: {
                type: Boolean,
                default: false
            },
            categoriesEmptyMessage: {
                type: String,
                default: ''
            }
        },
        name: "recently-updated-faqs",
        methods: {
            openRecentCat(category) {
                this.$router.replace("/frontline/category/"+category.id+"/recent-faqs")
            }
        }
    }
</script>

<style scoped>
    .card {
        box-shadow: 1px 1px 25px -8px #8e8c8e;
    }
    .card:hover{
        box-shadow: 1px 1px 38px -8px #8e8c8e;
    }
    .card-header {
        background-color: #0082c9;
        color: white;
        font-size: 18px;
        text-align: center;
    }

    .card-text {
        font-family: "Helvetica Neue";
        text-align: center;
        font-size: 35px;
    }

    .cat-block:hover {
        cursor: pointer;
    }
</style>
