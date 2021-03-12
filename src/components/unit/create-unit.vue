<template>
    <!--<div class="component-container">-->

    <component-container :title="CreatePageTitle" class="unit-container">
        <loading-spinner v-if="loading" :isLoading="loading"></loading-spinner>
        <!-- Add FAQ Main Details -->
        <form v-else v-on:submit.prevent="onSubmit">
            <!--nationality content section here form-->
            <input-text name="group_name" inputClass="unit" :value="unitModel.group_name"
                        inputId="unit" placeholder="Enter Unit / Group Here"
                        :errors="errors.group_name"
                        inputLabel="UserGroup.UserGroup" :required="false "></input-text>
            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3 mt-3">
                    <router-link tag="a" to="/unit/list"
                                 class="btn btn-cancel pull-left btn-lg ">{{$t('Common.Cancel')}}
                    </router-link>
                    <loading-button :buttonName="$t(submitBtnLabel)"
                                    :isLoading="submitLoading"
                                    classNames="btn btn-submit"
                                    :isShifted="true"
                                    shiftSize="-350px">
                    </loading-button>
                </div>
            </div>
        </form>
    </component-container>

    <!--</div>-->
</template>
<script>
    import Vue from "vue"
    import componentContainer from '../pages/componentContainer.vue'
    import {EventBus} from '../../eventbus/event-bus.js';
    import API from "../APIs/AbstractAPIs";
    import inputText from "../core/form/partials/input-text/input-text.vue"
    import coreFormClass from "../core/form/script"
    import loadingButton from "../spinner/loading-button";
    import LoadingSpinner from "../spinner/loading-spinner";

    let unitAPI = new API();

    export default {
        // ===Component name
        name: "create-unit",
        // ===Props passed to component
        props: {},
        // ===Components used by this component
        components: {
            LoadingSpinner,
            componentContainer,
            inputText,
            loadingButton
        },
        // ===component Data properties
        data() {
            return {
                errors:[],
                CreatePageTitle: "UserGroup.CreatePageTitle",
                submitBtnLabel: 'Common.Save',
                unitModel: {
                    group_name: "",
                },
                loading: false,
                submitLoading: false
            };
        },
        // ===Code to be executed when Component is mounted
        mounted() {
            if (this.getId()) {
                this.retriveUpdateData();
            }
        },
        // ===Computed properties for the component
        created: function () {
            EventBus.$on('update-input-field', this.updateModel);
            EventBus.$on('clear-input-field', this.clearError);
        },

        // ===Component methods
        methods: {
            success() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('UserGroup.GroupCreated'),
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    this.$router.replace("/unit/list")
                })
            },
            clearError: function (data) {

                if (!this.isMyScope(data)) {
                    return;
                }

                if (this.errors[data.name]) {
                    this.errors[data.name] = '';
                    this.$forceUpdate();
                }
            },
            update() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('UserGroup.GroupUpdated'),
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    this.$router.replace("/unit/list")
                })
            },
            failure(error) {
                this.submitLoading = false;
                let errors = error.response.data.errors;

                let err, errs = [];

                for (err in errors) {
                    errs[err] = errors[err][0];
                }

                this.errors = errs;
            },
            updateModel: function (data) {

                if (!this.isMyScope(data)) {
                    return;
                }

                this.unitModel[data.name] = data.value;
            },
            onSubmit() {
                this.submitLoading = true;
                if (this.getId()) {
                    unitAPI.createEntity({name: 'api/group/' + this.getId()});
                    unitAPI.endpoints.create({
                        group_name: this.unitModel.group_name,
                        _method: "PATCH"
                    }).then(this.update).catch(this.failure)
                }
                else {
                    unitAPI.createEntity({name: 'api/group'});
                    unitAPI.endpoints.create({
                        group_name: this.unitModel.group_name,

                    }).then(this.success).catch(this.failure)
                }
            },
            getsuccess({data}) {
                this.loading = false;
                this.unitModel.group_name = data.group_name;
            },
            getfailure() {
                this.$router.replace('/404');
            },
            getId() {
                if(this.$route.params.id)
                    this.CreatePageTitle = 'UserGroup.UpdatePageTitle';
                return this.$route.params.id;
            },
            getModule() {
                return "group"
            },
            retriveUpdateData() {
                // this.CreatePageTitle = 'UserGroup.UpdatePageTitle';
                this.submitBtnLabel = 'Common.Update';
                this.loading = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getsuccess, this.getfailure);
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/group/' + this.getId();
                }
                return env.API_URL + '/api/group';
            },
            isMyScope(data) {
                if (!data.hasOwnProperty("source_component")) {
                    return true;
                }

                if (data.source_component === "public") {
                    return true;
                }

                if (data.source_component === "create-unit") {
                    return true;
                }

                return false;
            },
        },
    }
</script>
<!-- styles -->

<!-- adding scoped attribute will apply the css to this component only -->
<style scoped type="text/css" lang="scss">
    .btn {
        font-size: 16px;
        padding: 5px 74px;
    }

    .btn-submit {
        padding-left: 85px;
        padding-right: 85px;
        background-color: #0072BC;
        color: #fff;
    }

    .btn-cancel {
        background-color: #fff;
        border: 1px solid #0072BC;
        color: #0072BC;
        margin-right: 15px;
    }
</style>
