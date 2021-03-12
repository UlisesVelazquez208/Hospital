<template>
    <component-container title="Hashtag.ManageHashtags" :btnLabel="$acl.currentUserCan('SAVE', 'HashTag') ? $t('Common.AddNew') : ''"
                         btnRoute="create-hashtag">
        <core-list :componentName="getComponentName()"
                   :requestFunction="apiCall" :dateColumns="dateColumns" :sorting="sorting"
                   :columns="columns" :headings="headings" :filters="filters" ref="hashtagList"
                   :templates="templates" :responseAdapter="responseAdapter" :exportFunction="exportCall"></core-list>
        
        <component-as-modal componentName="linkedFaqs" showModalButton="" buttonTag="" ref="modalBox"
                            @processDone="onProcessDone" :componentData="hashTagData" :isShowModal="isShowModal"
        >
        </component-as-modal>
    </component-container>
</template>
<script>
    import Vue from "vue";
    import coreList from "../core/list/list.vue";
    import ComponentContainer from "../pages/componentContainer.vue";
    import actions from "./templates/actions.vue"
    import AbstractFilters from "../APIs/AbstractFilters";
    import { EventBus } from "./../../eventbus/event-bus";
    import ComponentAsModal from "./../modal/component-as-modal";


    import DateFormatter from "../utils/DateFormatter";

    let dateFormatter = new DateFormatter();
    let filter = new AbstractFilters();

    export default {
        name: "hashtag-list",
        components: {
            ComponentContainer,
            ComponentAsModal,
            coreList
        },
        data: function () {
            let availableLanguages = JSON.parse(localStorage.getItem('languages'));
            let langList = [];

            langList = availableLanguages.map((item) => {
                return {id:item.id, text: item.name}
            });
            return {
                columns: ["hashtag", "linked_faqs_count", "languages", "created_by", "updated_at", "actions"],
                filters: ["hashtag", "created_by", "languages", "updated_at"],
                dateColumns: [],
                headings: {
                    hashtag: 'Hashtag',
                    linked_faqs_count: 'Linked FAQs',
                    created_by: 'Created By',
                    // created_at: 'Created',
                    updated_at: 'Updated',
                    languages: 'Languages',
                    actions: 'Actions'
                },
                listColumns: {
                    languages: langList
                },
                sorting:["hashtag", "created_by", "created_at", "updated_at"],
                hashTagData:{},
                isShowModal:false,
                templates: {
                    actions: actions
                },
                data: [],
                exportData:[],
                bus: new Vue()
            }
        },
        mounted:function(){
            EventBus.$on('show-linked-faqs', this.showLinkedFAQs);
            // EventBus.$on('modalClosed', this.modalClosed);
            document.querySelector('body').setAttribute('id', 'page-hashtag-list');
        },
        methods: {
            apiCall(data) {

                filter.reset();
                filter.addWith('createdBy');
                filter.addWith('translations');

                if(data.orderBy == undefined) {
                    filter.addSorting('updated_at', 'desc');
                } else  {
                    data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                }
                data.limit && filter.setPerPage(data.limit);
                data.page && filter.setPagination(data.page);
                filter.addCondition('hashtag:like', data.query.hashtag);
                data.query.created_at && filter.addCondition('created_at:date_between', data.query.created_at.start + ',' + data.query.created_at.end);
                filter.addWithCondition('createdBy', 'first_name|last_name:concat_column_like', data.query.created_by);

                this.$apis.createEntity({name: 'api/hashtag?' + filter.merge()});

                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        var entitiesArr = [];
                        let availableLanguages = JSON.parse(localStorage.getItem('languages'));

                        for (let entity of entities) {
                            entity.created_by_id = entity.created_by ? entity.created_by.id : undefined;
                            entity.created_by = entity.created_by?entity.created_by.first_name + ' ' + entity.created_by.last_name:'';
                            entity.created_at = dateFormatter.set(entity.created_at).format();
                            entity.updated_at = dateFormatter.set(entity.updated_at).format();
                            
                            let languages = [];
                            languages = entity.translations.map((item)=>{
                                let languageName = availableLanguages.filter((b)=> {
                                    if(b.id == item.language_id) {
                                        return b.name;
                                    }
                                });
                                
                                if(languageName.length > 0) {
                                    return languageName[0].name;
                                }
                                // return item.language_id;
                            });
                            entity.languages = languages.join(", ");

                            entitiesArr.push(entity);
                        }
                        this.data.data = entitiesArr;

                        this.data.count = total;

                        return this.data;

                    }).catch(function (e) {
                        console.log('e', e)
                    });
            },
            onProcessDone:function() {
                this.$refs.hashtagList.refresh();
                this.apiCall(this.data);
            },
            exportCall:function() {
                filter.setPagination(false);
                this.$apis.createEntity({name: 'api/hashtag?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        let theData = [];
                        for (let entity of data) {
                            entity.created_by = entity.created_by?entity.created_by.first_name + ' ' + entity.created_by.last_name:'';
                            delete entity.faqs;
                            theData.push(entity);
                        }
                        return theData;
                    }).catch(function (e) {
                    });
            },
            responseAdapter(result) {

                const {data, count} = this.data;

                return {
                    data: data,
                    count: count
                }
            },
            getComponentName() {
                return this.name;
            },
            showLinkedFAQs:function(hashtag) {
                this.hashTagData = hashtag;
                this.isShowModal = true;
                this.$refs.modalBox.showModal();
            }
        },
    }

</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">

</style>    
