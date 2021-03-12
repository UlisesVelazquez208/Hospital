<!--<template>-->
    <!--<white-container title="General Information">-->
        <!--&lt;!&ndash;media content section here form&ndash;&gt;-->
        <!--<input-text name="title" inputClass="media-title"-->
                    <!--inputId="title" placeholder="Enter Title Here"-->
                    <!--inputLabel="Title" :required="true"></input-text>-->
        <!--<input-textarea name="description" inputClass="media-description" inputId="description"-->
                        <!--placeholder="Enter description Here"-->
                        <!--inputLabel="Description" :required="true" :row="8"></input-textarea>-->
        <!--<input-select name="content_type" inputClass="media-type" inputLabel="Content Type"-->
                      <!--inputId="type"-->
                      <!--:selectOptions="[{ value:'egypt', text:'egypt'},{ value:'UAE', text:'UAE'}]"></input-select>-->
        <!--<input-text name="url" inputClass="media-url"-->
                    <!--inputId="url" placeholder="Enter Url Here"-->
                    <!--inputLabel="Content URL" :required="true"></input-text>-->
    <!--</white-container>-->

    <!--&lt;!&ndash;</div>&ndash;&gt;-->
<!--</template>-->
<!--<script>-->
    <!--import Vue from "vue"-->
    <!--import componentContainer from '../pages/componentContainer.vue'-->
    <!--import WhiteContainer from "../pages/whiteContainer.vue";-->
    <!--import {EventBus} from '../../eventbus/event-bus.js';-->
    <!--import API from "../APIs/AbstractAPIs";-->
    <!--import inputText from "../core/form/partials/input-text/input-text.vue"-->
    <!--import inputTextarea from "../core/form/partials/input-textarea/input-textarea.vue"-->
    <!--import inputSelect from "../core/form/partials/input-select/input-select.vue"-->


    <!--export default {-->
        <!--// ===Component name-->
        <!--name: "create-directory",-->
        <!--// ===Props passed to component-->
        <!--props: {},-->
        <!--// ===Components used by this component-->
        <!--components: {-->
            <!--WhiteContainer,-->
            <!--componentContainer,-->
            <!--inputText,-->
            <!--inputTextarea,-->
            <!--inputSelect,-->
        <!--},-->
        <!--// ===component Data properties-->
        <!--data() {-->
            <!--return {-->
                <!--mediaModel: {-->
                    <!--url: "",-->
                    <!--title: "",-->
                    <!--description: "",-->
                    <!--content_type: "",-->
                <!--}-->
            <!--};-->
        <!--},-->
        <!--// ===Code to be executed when Component is mounted-->
        <!--mounted() {-->
        <!--},-->
        <!--// ===Computed properties for the component-->
        <!--created: function () {-->
            <!--EventBus.$on('update-input-field', this.updateModel);-->
        <!--},-->

        <!--// ===Component methods-->
        <!--methods: {-->
            <!--updateModel: function (data) {-->
                <!--this.mediaModel[data.name] = data.value;-->
            <!--},-->
            <!--onSubmit() {-->
                <!--let mediaAPI = new API();-->
                <!--mediaAPI.createEntity({name: 'api/media'});-->
                <!--mediaAPI.endpoints.create({-->
                    <!--title: this.mediaModel.title,-->
                    <!--description: this.mediaModel.description,-->
                    <!--content_type: this.mediaModel.content_type,-->
                    <!--url: this.mediaModel.url,-->
                <!--})-->
            <!--}-->
        <!--}-->
    <!--};-->
<!--</script>-->
<!--&lt;!&ndash; styles &ndash;&gt;-->

<!--&lt;!&ndash; adding scoped attribute will apply the css to this component only &ndash;&gt;-->
<!--<style scoped type="text/css" lang="scss">-->
    <!--.btn {-->
        <!--font-size: 20px;-->
        <!--padding: 10px 70px;-->
    <!--}-->

    <!--.btn-submit {-->

        <!--background-color: #1183C5;-->
    <!--}-->

    <!--.btn-cancel {-->
        <!--background-color: #fff;-->
        <!--border: 1px solid #1183C5;-->
        <!--color: #1183C5;-->
    <!--}-->
<!--</style>-->
