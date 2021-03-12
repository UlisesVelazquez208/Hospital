<template>
    <!-- Directories -->
    <div class="text-left p-4 widget_social_icons general-info-container ">
        <h5 class="section-title">{{ $t('Directory.Directory')}}</h5>
        <div class="directory-details">
            <ul v-if="faq.directories && faq.directories.length">
                <li v-for="(item) in faq.directories" :key="item.id">
                    <faq-directory :directory="item" :dirContacts="directoryContacts(item.id)"></faq-directory>
                </li>
            </ul>
            <not-found v-else text="Common.NoDirectory" icon="fa-question-circle"></not-found>
        </div>
        <!-- Map Modal -->
        <component-as-modal buttonTag=""
                            showModalButton=""
                            componentName="contactFormMap"
                            :componentData="mapModalData">
        </component-as-modal>
    </div>
</template>

<script>
    import ComponentAsModal from "../../modal/component-as-modal";
    import directory from "./directory.vue";
    import NotFound from "./not-found";
    import {EventBus} from "../../../eventbus/event-bus";

    export default {
        name: "faq-directories",
        components: {
            NotFound, 
            ComponentAsModal,
            "faq-directory":directory
        },
        props: {
            faq: {
                required: true,
                type: Object
            }
        },
        data() {
            return {
                mapModalData: {},
            }
        },
        // filters: {
        //     capitalize: function (value) {
        //         if (!value) return ''
        //         value = value.toString()
        //         return value.charAt(0).toUpperCase() + value.slice(1)
        //     }
        // },
        created:function() {
            EventBus.$on('show-map', this.onModalButtonClicked);
        },
        methods: {
            onModalButtonClicked: function (mapModel) {
                this.mapModalData = mapModel;
            },
            directoryContacts:function(directoryID) {
                let contacts = [];
                contacts = this.faq.contacts.length > 0? this.faq.contacts.filter((item)=>{
                    if(item.directory_id == directoryID) {
                        return item;
                    }
                }):[];

                return contacts;
            }
            
        }
    }
</script>

<style scoped>

</style>
