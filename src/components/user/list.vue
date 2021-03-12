<template>
    <component-container title="User.UserManagement"
                         :btnLabel="$acl.currentUserCan('SAVE', 'FAQ') ? $t('Common.AddNew') : ''"
                         btnRoute="create-user"
    >
        <core-list :componentName="getComponentName()"
                   :requestFunction="apiCall" :dateColumns="dateColumns"
                   :columns="columns" :headings="headings" :filters="filters"
                   :templates="templates" :responseAdapter="responseAdapter" :exportFunction="exportCall">

        </core-list>
    </component-container>
</template>
<script>
    import coreList from "../core/list/list.vue"
    import ComponentContainer from "../pages/componentContainer.vue";
    import actions from "./templates/actions.vue"
    import AbstractFilters from "../APIs/AbstractFilters";


    let filter = new AbstractFilters();

    export default {
        name: "user-list",
        components: {
            ComponentContainer,
            coreList
        },
        data: function () {
            return {
                columns: ["name", "type", "group", "roles", "countries", "status", "actions"],
                filters: ["name", "type", "group", "roles", "countries", "status"],
                headings: {
                    name: 'Name',
                    type: 'User Type',
                    group: 'User Group',
                    countries: 'Countries',
                    roles: 'Roles',
                    status: 'Status',
                    actions: 'Actions'
                },
                dateColumns: [],
                templates: {
                    actions: actions
                },
                data: [],
            }
        },
        methods: {
            apiCall(data) {
                filter.reset();
                filter.addWith('roles');
                filter.addWith('groups');
                filter.addWith('countries');
                filter.addSorting('id', 'desc');
                data.page && filter.setPagination(data.page);
                data.limit && filter.setPerPage(data.limit);
                filter.addCondition('first_name|last_name:concat_column_like', data.query.name);
                filter.addCondition('type:like', data.query.type);
                filter.addWithCondition('groups', 'group_name:like', data.query.group);
                filter.addWithCondition('countries','country:like', data.query.countries);
                filter.addWithCondition('roles', 'name:like', data.query.roles);
                filter.addCondition('status:like', data.query.status);

                this.$apis.createEntity({name: '/api/user?' + filter.merge()});

                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        var entitiesArr = [];
                        for (let entity of entities) {
                            entity.name = entity.first_name + ' ' + entity.last_name;
                            entity.roles = entity.roles ? entity.roles.map((item) => item.name).join(', ') : "";
                            entity.group = entity.groups ? entity.groups.map((item) => item.group_name).join(', ') : "";
                            entity.countries = entity.countries == null? [] : entity.countries.map(a => a.country).join(", ");
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
                this.$apis.createEntity({name: 'api/user?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        let theData = [];

                        for (let entity of data) {
                            entity.name = entity.first_name + ' ' + entity.last_name;
                            entity.roles = entity.roles ? entity.roles.map((item) => item.name).join(', ') : "";
                            entity.groups = entity.groups ? entity.groups.map((item) => item.group_name).join(', ') : "";
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
                return "user-list";
            }
        },
    }

</script>
<style type="text/css" lang="scss">
</style>
