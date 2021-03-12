<template>
    <div class="component-container">
        <div class="component-header">
            <div class="row">
                <div :class="btnLabel ? 'col-md-6' : 'col-md-12'">
                    <div class="component-title">
                        <h3><i :class="'fa '+icon" v-if="icon"></i> {{ $t(title) }}</h3>
                        <!-- <h3><i :class="'fa '+icon"></i> {{ $t(title) }}</h3> -->
                    </div>
                </div>
                <div v-if="btnLabel" class="col-md-6">
                    <router-link tag="a" :to="btnRoute" class="btn btn-primary  pull-right btn-lg ">
                        {{btnLabel}}
                    </router-link>
                </div>
                <div v-if="datePicker" class="col-md-6 align-right">
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
        name: "component-container",
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
        background-color: #f9f9f9;
        padding: 20px 40px;
        .component-header {
            margin-bottom: 15px;
            .component-title h3 {
                color: #0072BC;
                font-weight: 400;
                font-size: 22px;
                margin-bottom: 20px;
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
