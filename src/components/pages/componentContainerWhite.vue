<template>
    <div class="component-container">
        <div class="component-header">
            <div class="row">
                <div class="col-md-7 col-12">
                    <div class="component-title">
                        <h3><i :class="'fa '+icon" v-if="icon"></i> {{$t(title)}}</h3>
                        <!-- <h3>{{title}}</h3> -->
                    </div>
                </div>
                <div v-if="btnLabel" class="col-md-6 col-12">
                    <router-link tag="a" :to="btnRoute" class="btn btn-primary  pull-right btn-lg ">
                        {{btnLabel}}
                    </router-link>
                </div>
                <div v-if="datePicker" class="col-md-5 align-right">
                    <date-filter :name="datePickerName"></date-filter>
                </div>
            </div>
        </div>
        <slot></slot>
    </div>
</template>
<script>
    import DateFilter from "../dashboard/admin/partials/date-filter";
    export default {
        // ===Component name
        name: "component-container-white",
        // ===Props passed to component
        props: {
            title: {
                type: String,
                required: true
            },
            icon: {
                type: String,
                default: ''
            },
            btnLabel: {
                type: String,
            },
            btnRoute: {
                type: String,
            },
            datePicker: {
                type: Boolean,
                default: false
            },
            datePickerName: {
                type: String,
            }
        },
        // ===Components used by this component
        components: {DateFilter},
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
    .component-container {
        background-color: #fff;
        padding: 20px 25px;
        border: 1px solid rgba(0, 0, 0, 0.125);
        border-radius: 0.25rem;
        box-shadow: 1px 1px 25px -8px #8e8c8e;
        .component-header {
            margin-bottom: 15px;
            .component-title h3 {
                color: #0072BC;
                font-weight: 400;
                font-size: 18px;
                margin-bottom: 0;
            }
            .form-label {
                font-size: 14px;
            }
            .btn-primary {
                padding: 4px 35px;
            }
        }

    }
</style>
