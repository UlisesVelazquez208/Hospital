<template>
    <component-container title="Welcome back!">
        <div class="no-faq-container">
            <div class="text-center no-faq">
                <b-card>
                    <i class="fa fa-user-circle"></i>
                    <hr/>
                    <h2>Welcome, {{this.$store.state.user.name}} </h2>
                </b-card>
            </div>
        </div>
    </component-container>
</template>

<script>
    import ErrorMessage from "./admin/partials/error-message";
    import NotFound from "../frontLine/partials/not-found";
    import ComponentContainer from "../pages/componentContainer";

    export default {
        name: "other",
        components: {ComponentContainer, NotFound, ErrorMessage}
    }
</script>

<style scoped>
    .no-faq-container {
        height: 100%;
    }

    .no-faq {
        color: #0072BC;
        padding: 10% 25%;
    }

    i {
        font-size: 120px;
    }

    h2 {
        font-size: 18px;
    }
</style>
