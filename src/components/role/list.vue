<template>
    <component-container title="UserRole.RoleManagement" :btnLabel="$acl.currentUserCan('SAVE', 'Role') ? $t('Common.AddNew') : ''" btnRoute="create-role">
        <core-list :componentName="getComponentName()"
                   :requestFunction="apiCall" :dateColumns="dateColumns"
                   :columns="columns" :headings="headings" :filters="filters"
                   :templates="templates" :responseAdapter="responseAdapter" :exportFunction="exportCall">
        </core-list>
    </component-container>
</template>
<script>
    import actions from "./templates/actions.vue"
    import coreList from "../core/list/list.vue"
    import ComponentContainer from "../pages/componentContainer.vue";
    import AbstractFilters from "../APIs/AbstractFilters";
    import DateFormatter from "../utils/DateFormatter";

    let dateFormatter = new DateFormatter();
    let filter = new AbstractFilters();

    export default {
        name: "role-list",
        components: {
            ComponentContainer,
            coreList
        },
        data: function () {
            return {
                data: {
                    data: [],
                    count: 0
                },
                columns: ["name", "created_by", "actions"],
                filters: ["name", "created_by", "created_at"],
                headings: {
                    name: 'Name',
                    created_by: 'Created By',
                    created_at: 'Created',
                    actions: 'Actions'
                },
                dateColumns: ['created_at'],
                templates: {
                    actions: actions
                }
            }
        },
        methods: {
            apiCall(data) {
                filter.reset();
                filter.addWith('createdBy');
                filter.addSorting("id",'desc');
                data.limit && filter.setPerPage(data.limit);
                data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc': 'desc');
                data.page && filter.setPagination(data.page);
                filter.addCondition('name:like', data.query.name);
                data.query.created_at && filter.addCondition('created_at:date_between', data.query.created_at.start + ',' + data.query.created_at.end);
                filter.addWithCondition('createdBy', 'first_name|last_name:concat_column_like', data.query.created_by);

                this.$apis.createEntity({name: '/api/role?'+filter.merge()});

                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        let entitiesArr = [];

                        for (let entity of entities) {
                            entity.created_by_id = entity.created_by ? entity.created_by.id : undefined;
                            entity.created_by = entity.created_by.first_name + ' ' + entity.created_by.last_name
                            entity.created_at = dateFormatter.set(entity.created_at).format();
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
                this.$apis.createEntity({name: 'api/role?' + filter.merge()});
                
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
                return "role-list"
            }
        },
        created: function () {
        }
    }

</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">

</style>
