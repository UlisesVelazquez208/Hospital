<template>
    <section class="white-section" :class="sectionClass">
        <b-card header="" header-tag="h4" class="bg-info-card">
            <div class="row">
                <div class="col-sm-12">
                    <div class="white-section_title">
                        <h4>{{$t(title)}}</h4>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="white-section_details">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </b-card>
    </section>
</template>
<script>
    export default {
        // ===Component name
        name: "white-container",
        // ===Props passed to component
        props: {
            title: {
                type: String,
                required: true
            },
            sectionClass:{
                type:String
            }
        },
        // ===Components used by this component
        components: {},
        // ===component Data properties
        data() {
            return {}
        },
        // ===Code to be executed when Component is mounted
        mounted() {

        },
        // ===Computed properties for the component
        computed: {},
        // ===Component methods
        methods: {}
    }
</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
<style scoped type="text/css" lang="scss">
    .white-section {
        margin: auto;
        .bg-info-card {
            border: none;
            // border-top: 5px solid #0072BC;
            box-shadow: 2px 2px 15px 0px #ccc;
            background-color: #FAFAFA;
            margin-bottom: 10px;
        }
        .white-section_title h4{
            color: #0072BC;
            font-weight: 400;
            margin-bottom: 25px;
        }
    }
</style>
