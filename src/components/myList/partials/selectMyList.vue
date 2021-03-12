<template>
    <div>
        <br/>
        <b-card header="My Lists" header-tag="header">
            <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>
            <form v-else v-on:submit.prevent="onSubmit" id="test-scroll">
                <b-container class="bv-example-row">
                    <b-row class="my-list-row head-row-container">
                        <b-col>
                            <b-row class="head-row">
                                <b-col cols="9">
                                    List Name
                                </b-col>
                                <b-col cols="3">
                                    FAQs
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>

                    <b-row v-for="(myListArr,index) in myLists" class="my-list-row" :key="index">
                        <b-col cols="9">
                            <input-checkbox name="faqs" :input-label="myListArr.name" :value="myListArr.id"
                                            :checked="myListArr.checked"
                                            class="select-input"></input-checkbox>
                        </b-col>
                        <b-col cols="3" class="faqs-count">
                            {{myListArr.faqs}}
                        </b-col>
                    </b-row>
                </b-container>
                <hr/>
                <loading-button style="text-align: center;" buttonName="Save"
                                :isLoading="loading"
                                classNames="add-to-mylist btn btn-submit"
                                :isShifted="true"
                ></loading-button>
            </form>
        </b-card>
    </div>

</template>

<script>
    import ComponentContainer from "../../pages/componentContainer";
    import LoadingButton from "../../spinner/loading-button";
    import LoadingSpinner from "../../spinner/loading-spinner";
    import inputCheckbox from "../../core/form/partials/input-checkbox/input-checkbox"

    export default {
        name: "select-my-list",
        components: {LoadingSpinner, LoadingButton, ComponentContainer, inputCheckbox},
        data: function () {
            return {
                loadingSpinner: false,
                loading: false,
                myLists: [],
                selectedLists: [],
            };
        },
        created: function () {
            this.getData();
            this.$eventBus.$on('update-checkbox-field', this.updateSelectedList);
            this.$eventBus.$on('reload-select-my-list-component', this.reloadComponent);
        },
        methods: {
            reloadComponent() {
              this.getData();
            },
            updateSelectedList: function (data) {

                if (data.name !== 'faqs') {
                    return;
                }

                if (data.checked) {
                    this.selectedLists.push(data.value);
                } else {
                    this.selectedLists.splice(this.selectedLists.findIndex(function (selected) {
                        return selected.toString() === data.value.toString()
                    }), 1);
                }
            },
            mapData: function (myLists) {

                let myFinalList = [], indx = 0, numOfItemsPerRow = 2;

                for (let myList of myLists) {

                    if (!myFinalList[indx]) {
                        myFinalList[indx] = [];
                    }

                    if (myFinalList[indx].length < numOfItemsPerRow) {
                        myFinalList[indx].push(myList);
                    } else {
                        indx = indx + 1;
                        myFinalList[indx] = [];
                        myFinalList[indx].push(myList);
                    }
                }

                return myFinalList;
            },
            getFaqId: function () {
                return this.$route.params.faq_id;
            },
            getData: function () {
                this.loadingSpinner = true;
                this.$apis.createEntity({name: '/api/my-list?paginate=0&with[]=faqs'});
                let faqId = this.getFaqId();
                let self = this;

                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        let myList = data ? data.map(function (list) {
                            return {
                                id: list.id,
                                name: list.name,
                                faqs: list.faqs ? list.faqs.length : 0,
                                checked: list.faqs ? list.faqs.some(function (faq) {
                                    if (faq.id.toString() === faqId.toString()) {
                                        self.selectedLists.push(list.id);
                                    }
                                    return faq.id.toString() === faqId.toString()
                                }) : false
                            };
                        }) : [];

                        this.myLists = myList;
                        this.loadingSpinner = false;

                    }).catch(function (e) {
                        console.log('e', e)
                    });
            },
            onSubmit: function () {
                this.loading = true;
                this.$apis.createEntity({name: '/api/faq'});
                this.$apis.endpoints.getOne({
                    'id': this.getFaqId(),
                    query: '?with[]=directories&with[]=hashtags&with[]=media&with[]=nationalities&with[]=serviceCategories'
                }).then(this.getSuccess).catch(this.getFailure);

            },
            getSuccess: function ({data}) {

                this.$apis.createEntity({name: 'api/faq/my-list'});
                this.$apis.endpoints.update({
                    id: data.id,
                    question: data.question,
                    answer: data.answer,
                    service_categories: data.service_categories.map(function (serviceCategory) {
                        return serviceCategory.id;
                    }),
                    my_lists: this.selectedLists
                }).then(this.updateSuccess).catch(this.updateFailure);
            },
            getFailure: function () {
                this.loading = false;

            },
            updateSuccess: function () {
                this.loading = false;
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: 'List Updates successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    location.reload();
                });
            },
            updateFailure: function () {
                this.$swal({
                    title: 'Error',
                    text: "It looks like that this item not exist any more Do you want to refresh the page!",
                    type: 'error',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Refresh'
                }).then(function (result) {
                    if (result.value) {
                        location.reload();
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .card-header {
        background-color: #0082c9;
        color: white;
        font-size: 18px;
    }

    .card-text {
        font-size: 35px;
    }

    .card-body {
        background-color: #f6f6f6;
        font-size: 18px;
        font-family: Helvetica;
        color: #4a4a4a;
    }

    .body-column {
        padding: 10px;
    }

    .body-row, .head-row {
        margin-right: 15%;
    }

    .body-row {
        border-bottom: 1px solid #cbcbcb;
        padding-bottom: 5px;
    }

    .my-list-row:last-child .body-row {
        border-bottom: 0;
    }

    .faqs-count {
        text-align: center;
    }

    .head-row {
        margin-bottom: 10px;
    }

    .select-input {
        color: #4a4a4a;
    }

    .col-10 {
        padding-left: 0;
        padding-right: 0;
    }
</style>
