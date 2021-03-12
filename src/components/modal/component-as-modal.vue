<template>
    <div>
        <b-btn v-if="buttonTag == 'button'"
               :class="buttonClasses"
               v-b-modal="'myModal' + componentName"
               @click="modalButtonClicked">
            {{ $t(showModalButton) }}
        </b-btn>

        <a v-if="buttonTag == 'a'"
           v-b-modal="'myModal' + componentName"
           @click="modalButtonClicked">
            {{ $t(showModalButton) }}
        </a>
        <b-modal centered
                :id="'myModal' + componentName"
                :ref="'myModal' + componentName"
                size="lg"
                :ok-disabled="true"
                :cancel-disabled="true"
                :hide-header="false"
                :hide-footer="true">
            <component :is="componentName"
                       :componentData="componentData"
                       @processDone="onProcessDone"
                       @closeMe="onCloseMe"
                       :isModal="true">
            </component>
        </b-modal>
    </div>
</template>


<script>
    import Vue from "vue";
    import createDirectory from "./../directory/create-directory/create-directory.vue";
    import createMediaContent from "./../mediaContent/create-media-content.vue";
    import createHashTag from "./../hashtag/create-hashtag.vue";
    import contactFormMap from "./../frontLine/partials/contactFormMap.vue";
    import linkedFaqs from "./../hashtag/partials/linked-faqs.vue";
    import faqPreview from "./../faq/preview.vue";

    export default {
        name: "component-as-modal",
        props: {
            showModalButton: {
                type: String,
                required: true,
            },
            componentName: {
                type: String,
                required: true
            },
            componentData: {
                type: Object,
                required: false
            },
            buttonClasses: {
                type: String,
                required: false,
                default: "btn btn-primary details-link btn-lg"
            },
            buttonTag: {
                type: String,
                required: false,
                default: "button"
            }
        },
        data: function() {
            return {
            };
        },
        methods: {
            getModalRef: function() {
                return 'myModal' + this.componentName;
            },
            showModal: function() {
                this.$refs[this.getModalRef()].show();
            },
            hideModal: function() {
                this.$refs[this.getModalRef()].hide();
            },
            onProcessDone: function() {
                var self = this;
                setTimeout(function () {
                    this.$emit('modalClosed');
                    self.hideModal();
                }.bind(self), 200);

                this.$emit('processDone');
            },
            modalButtonClicked: function() {
                this.$emit("modalButtonClicked");
            },
            onCloseMe: function() {
                this.hideModal();
            }
        },
        components: {
            createDirectory,
            createMediaContent,
            createHashTag,
            contactFormMap,
            faqPreview,
            linkedFaqs
        },
        computed: {

        }

    }




</script>
<style scoped type="text/css">
    .component-container {
        background-color: transparent;
        padding: 0px 0px;
    }
</style>