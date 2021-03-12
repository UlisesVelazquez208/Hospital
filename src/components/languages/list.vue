<template>
    <component-container title="Language.ManageLanguage" :btnLabel="$acl.currentUserCan('SAVE', 'Language') ? $t('Common.AddNew') : ''"
                         btnRoute="create-language">
        <core-list :componentName="getComponentName()"
                   :requestFunction="apiCall" :dateColumns="dateColumns"
                   :columns="columns" :headings="headings" :filters="filters"
                   :templates="templates" :responseAdapter="responseAdapter" :exportFunction="exportCall"></core-list>
    </component-container>
</template>
<script>
    import coreList from "../core/list/list.vue"
    import ComponentContainer from "../pages/componentContainer.vue";
    import actions from "./templates/actions.vue"
    import AbstractFilters from "../APIs/AbstractFilters";

    let filter = new AbstractFilters();

    export default {
        name: "language-list",
        components: {
            ComponentContainer,
            coreList
        },
        data: function () {
            return {
                columns: ["name", "acronym", "is_default", "text_direction", "created_by", "actions"],
                filters: ["name"],
                headings: {
                    name: 'Name',
                    acronym: 'Acronym',
                    text_direction: 'Text Direction',
                    is_default: 'Is Default',
                    is_active: 'is Active',
                    created_by: 'Created By',
                    actions: 'Actions'
                },
                templates: {
                    actions: actions
                },
                listColumns:{
                    is_default:[
                        {
                            id:"0",
                            text:"No"
                        },
                        {
                            id:"1",
                            text:"Yes"
                        }
                    ]
                },
                dateColumns: [],
                data: [],
            }
        },
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-language-list');
        },
        methods: {
            apiCall(data) {

                filter.setPagination(true);
                filter.addWith('createdBy');

                if(data.orderBy == undefined) {
                    filter.addSorting('updated_at', 'desc');
                } else  {
                    data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                }
                data.limit && filter.setPerPage(data.limit);
                data.page && filter.setPagination(data.page);
                filter.addCondition('name:like', data.query.name);
                filter.addCondition('is_active', data.query.is_active);
                filter.addCondition('is_default', data.query.v);
                this.$apis.createEntity({name: '/api/language?' + filter.merge()});
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        var entitiesArr = [];

                        for (let entity of entities) {
                            entity.created_by = entity.created_by?entity.created_by.first_name + ' ' + entity.created_by.last_name:'';
                            entity.is_active = entity.is_active == 1 ? this.$t('Common.Yes'):this.$t('Common.No');
                            entity.is_default = entity.is_default == 1 ? this.$t('Common.Yes'):this.$t('Common.No');
                            entitiesArr.push(entity);
                        }
                        this.data.data = entitiesArr;

                        this.data.count = total;

                        return this.data;

                    }).catch(function (e) {
                        console.log('e', e)
                    });
            },
            exportCall:function() {
                filter.setPagination(false);
                this.$apis.createEntity({name: 'api/language?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        let theData = [];

                        for (let entity of data) {
                            entity.created_by = entity.created_by?entity.created_by.first_name + ' ' + entity.created_by.last_name:' ';
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
                return "language-list";
            }
        },
    }

</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">

</style>    
