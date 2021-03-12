<template>
    <component-container
        title="DirectoryCountry.ManageCountries" 
        :btnLabel="$acl.currentUserCan('SAVE', 'DirectoryCountry') ? $t('Common.AddNew') : ''"
        btnRoute="create"
    >
        <core-list
            :componentName="getComponentName()"
            :requestFunction="apiCall"
            :dateColumns="dateColumns"
            :columns="columns"
            :headings="headings"
            :filters="filters"
            :templates="templates"
            :responseAdapter="responseAdapter"
            :exportFunction="exportCall"
        ></core-list>
    </component-container>
</template>
<script>
    import coreList from "../core/list/list.vue"
    import ComponentContainer from "../pages/componentContainer.vue";
    import actions from "./templates/actions.vue"
    import AbstractFilters from "../APIs/AbstractFilters";

    let filter = new AbstractFilters();
    const apiPath = '/api/directory-country';

    export default {
        name: "directory-country-list",
        components: {
            ComponentContainer,
            coreList
        },
        data: function () {
            return {
                columns: ["country", "continent", "actions"],
                filters: ["country", "continent"],
                headings: {
                    country: 'Country of Asylum',
                    continent: 'Continent',
                    actions: 'Actions'
                },
                templates: {
                    actions: actions
                },
                dateColumns: [],
                data: [],
            }
        },
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-directory-country-list');
        },
        methods: {
            apiCall(data) {
                filter.addSorting("country",'asc');
                filter.addWith('createdBy');
                data.limit && filter.setPerPage(data.limit);
                data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                data.page && filter.setPagination(data.page);
                filter.addCondition('country:like', data.query.country);
                filter.addCondition('continent:like', data.query.continent);
                this.$apis.createEntity({name: `${apiPath}?${filter.merge()}`});
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        var entitiesArr = [];

                        for (let entity of entities) {
                            entity.created_by_id = entity.created_by ? entity.created_by.id : undefined;
                            entitiesArr.push(entity);
                        }
                        this.data.data = entitiesArr;
                        this.data.count = total;

                        return this.data;
                    }).catch(function (errors) {
                        console.log(errors);
                    });
            },
            exportCall:function() {
                filter.setPagination(false);
                this.$apis.createEntity({name: `${apiPath}?${filter.merge()}`});

                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        let theData = [];
                        for (let entity of data) {
                            entity.created_by = entity.created_by?entity.created_by.first_name + ' ' + entity.created_by.last_name:' ';
                            theData.push(entity);
                        }

                        return theData;
                    }).catch(function (errors) {
                        console.log(errors);
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
                return "directory-country-list";
            }
        },
    }

</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">

</style>
