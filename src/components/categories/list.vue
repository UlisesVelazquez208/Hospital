<template>
    <component-container title="ServiceCategory.ManageServiceCategories" :btnLabel="$acl.currentUserCan('SAVE', 'ServiceCategory') ? $t('Common.AddNew') : ''" btnRoute="create-category">
        <core-list :componentName="getComponentName()"
                   :requestFunction="apiCall" :dateColumns="dateColumns"
                   :columns="columns" :headings="headings" :filters="filters"
                   :templates="templates" :responseAdapter="responseAdapter"  :exportFunction="exportCall"></core-list>
    </component-container>
</template>
<script>
    import coreList from "../core/list/list.vue"
    import ComponentContainer from "../pages/componentContainer.vue";
    import actions from "./templates/actions.vue"
    import AbstractFilters from "../APIs/AbstractFilters";
    import {EventBus} from '../../eventbus/event-bus.js';

    let filter = new AbstractFilters();

    export default {
        name: "category-list",
        components: {
            ComponentContainer,
            coreList
        },
        data: function () {
            return {
                columns: ["service_category", "sub_category", "created_by", "actions"],
                filters: ["service_category", "sub_category", "created_by"],
                headings: {
                    service_category: 'Service Category',
                    sub_category: 'Sub Categories',
                    created_by: 'Created By',
                    actions: 'Actions'
                },
                dateColumns: ['created_at'],
                templates: {
                    actions: actions
                },
                data: [],
            }
        },
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-categories-list');
        },
        methods: {
            apiCall(data) {

                filter.addSorting("id",'desc');
                filter.addWith('createdBy');
                filter.addWith('children');
                filter.addCondition('parent_id', '');


                data.limit && filter.setPerPage(data.limit);
                if(data.orderBy == undefined) {
                    filter.addSorting('updated_at', 'desc');
                } else  {
                    data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                }

                data.page && filter.setPagination(data.page);
                filter.addCondition('name:like', data.query.service_category);
                filter.addWithCondition('children', 'name:like', data.query.sub_category);
                filter.addWithCondition('createdBy', 'first_name|last_name:concat_column_like', data.query.created_by);

                this.$apis.createEntity({name: '/api/service-category?' + filter.merge()});

                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        var entitiesArr = [];

                        for (let entity of entities) {
                            entity.service_category = entity.name;
                            entity.created_by_id = entity.created_by ? entity.created_by.id : undefined;
                            entity.created_by = entity.created_by?entity.created_by.first_name + ' ' + entity.created_by.last_name:'';

                            if(entity.children != null && entity.children.length > 0) {
                                entity.sub_category = entity.children.map(function (n) {
                                    return n.name;
                                }).sort().join();
                            } else {
                                entity.sub_category = '';
                            }

                            entity.sub_category = entity.children != null? entity.children.map(function (n) {
                                return n.name;
                            }).sort().join():'';

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
                this.$apis.createEntity({name: 'api/service-category?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        let theData = [];
                        for(let item of data) {
                            item.created_by = item.created_by ? item.created_by.first_name+' '+item.created_by.last_name : undefined;
                            item.children = item.children != null? item.children.map(function (n) {
                                return n.name;
                            }).sort().join():'';
                            theData.push(item);
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
                return "category-list";
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
