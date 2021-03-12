<template>
    <div>
        <component-container :title="getText('title')" class="media-container">
            <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>
            <form v-else v-on:submit.prevent="onSubmit" id="test-scroll">
                <b-container class="bv-example-row">
                    <b-row>
                        <b-col cols="10">
                            <input-text name="name" inputClass="media-name" :value="myListModel.name"
                                        inputId="name" placeholder="Enter List name" :errors="errors.name"
                                        :inputLabel="getText('inputLabel')" :required="false"></input-text>
                        </b-col>
                        <b-col>
                            <loading-button :buttonName="getText('buttonName')"
                                            :isLoading="loading"
                                            classNames="add-to-mylist btn btn-submit"
                                            :isShifted="true"
                                            shiftSize="-100px"></loading-button>
                        </b-col>
                    </b-row>
                    <div>
                    </div>
                </b-container>
            </form>
            <select-my-list v-if="getFaqId()"></select-my-list>
        </component-container>
    </div>
</template>
<script>
    import ComponentContainer from "../pages/componentContainer";
    import LoadingSpinner from "../spinner/loading-spinner";
    import inputText from "../core/form/partials/input-text/input-text.vue"
    import LoadingButton from "../spinner/loading-button";
    import SelectMyList from "./partials/selectMyList";

    export default {
        name: "add-to-my-list",
        components: {
            SelectMyList,
            LoadingButton,
            LoadingSpinner,
            ComponentContainer,
            inputText
        },
        data: function () {

            return {
                loadingSpinner: false,
                loading: false,
                myListModel: {
                    name: '',
                    faqs: [],
                },
                errors: {
                    name: ''
                },
                texts: {
                    create: {
                        title: 'Add a new list',
                        inputLabel: 'Add a new list',
                        successMessage: 'List created successfully',
                        buttonName: '+ Add'
                    },
                    update: {
                        title: 'Update list',
                        inputLabel: 'Update list',
                        successMessage: 'List updated successfully',
                        buttonName: 'Update'
                    }
                }
            }
        },
        created: function () {
            this.$eventBus.$on('update-input-field', this.updateModel);
        },
        mounted() {
            if (this.getId()) {
                this.title = 'Edit FAQ Item';
                this.getUpdateData();
            }
        },
        methods: {
            getText: function (key) {
                if (this.getId()) {
                    return this.texts.update[key];
                }
                return this.texts.create[key];
            },
            getFaqId: function () {
                return this.$route.params.faq_id;
            },
            onSubmit: function () {

                this.loading = true;
                this.addUpdateParameters();

                this.$apis.createEntity({name: '/api/my-list'});
                this.$apis.endpoints[this.getAPIMethod()](this.myListModel).then(this.createSuccess).catch(this.createFailure);
            },
            getAPIMethod() {
                return this.getId() ? 'update' : 'create';
            },
            addUpdateParameters: function () {
                this.myListModel.faqs = this.myListModel.faqs ? this.myListModel.faqs : [];
            },
            updateModel: function (data) {
                this.myListModel[data.name] = data.value;
            },
            getUpdateData: function () {
                this.loadingSpinner = true;
                this.$apis.createEntity({name: '/api/my-list'});
                this.$apis.endpoints.getOne({
                    'id': this.getId(),
                    query: ''
                }).then(this.getSuccess).catch(this.getFailure);
            },
            getSuccess({data}) {
                this.loadingSpinner = false;
                this.myListModel = data;
            },
            getFailure() {
                this.$router.replace('/404');
            },
            createSuccess: function ({data}) {
                this.loading = false;
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.getText('successMessage'),
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    if (this.getFaqId()) {
                        this.$eventBus.$emit('reload-select-my-list-component', {});
                    } else {
                        this.$router.replace('/my-list/list');
                        // this.$router.replace('/my-list/update-mylist/' + data.id);
                        this.loading = false;
                    }
                });
            },
            getId() {
                return this.$route.params.id;
            },
            createFailure: function (error) {

                this.loading = false;

                let err, errs = [], errors = error.response.data.errors;

                for (err in errors) {
                    errs[err] = errors[err][0];
                }

                this.errors = errs;

                this.scrollToClass('.text-danger');

                this.$forceUpdate();
            }
        }

    }
</script>

<style scoped>

</style>
