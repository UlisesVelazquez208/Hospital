<template>
    <component-container title="UserGroup.UserGroupManagement" :btnLabel="$acl.currentUserCan('SAVE', 'Group') ? $t('Common.AddNew') : ''"
                         btnRoute="create-unit">
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
        name: "unit-list",
        components: {
            ComponentContainer,
            coreList
        },
        data: function () {
            return {
                columns: ["group_name", "created_by", "actions"],
                filters: ["group_name", "created_by"],
                headings: {
                    group_name: 'User Group',
                    created_by: 'Created By',
                    actions: 'Actions'
                },
                templates: {
                    actions: actions
                },
                dateColumns: [],
                data: [],
            }
        },
        methods: {
            apiCall(data) {

                filter.addSorting("id",'desc');
                filter.addWith('createdBy');
                data.limit && filter.setPerPage(data.limit);
                data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                data.page && filter.setPagination(data.page);
                filter.addCondition('group_name:like', data.query.group_name);
                filter.addWithCondition('createdBy', 'first_name|last_name:concat_column_like', data.query.created_by);

                this.$apis.createEntity({name: '/api/group?' + filter.merge()});
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        var entitiesArr = [];

                        for (let entity of entities) {
                            entity.created_by = entity.created_by?(entity.created_by.first_name + ' ' + entity.created_by.last_name):'';
                            entity.created_by_id = entity.created_by ? entity.created_by.id : undefined;
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
                this.$apis.createEntity({name: 'api/group?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        let theData = [];

                        for (let entity of data) {
                            entity.created_by = entity.created_by?(entity.created_by.first_name + ' ' + entity.created_by.last_name):'';
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
                return "unit-list"
            }
        },
    }

</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">

</style>    
