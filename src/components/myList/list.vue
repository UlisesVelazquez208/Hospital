<template>
    <component-container title="Manage My List" :btnLabel="$acl.currentUserCan('ADD_TO_MY_LIST', 'FAQ') ? 'Add new' : ''" btnRoute="create-mylist">
        <core-list :requestFunction="apiCall" :dateColumns="dateColumns"
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

    let filter = new AbstractFilters();
    let dateFormatter = new DateFormatter();

    export default {
        name: "mylist-list",
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
                columns: ["name", "faqs", "created_at", "actions"],
                filters: ["name", "created_at"],
                headings: {
                    name: "Name",
                    faqs: "Linked FAQs",
                    created_at: "Created",
                    actions: "Actions"
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
                filter.addSorting("id",'desc');
                filter.addWith('faqs');
                data.limit && filter.setPerPage(data.limit);
                data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc': 'desc');
                data.page && filter.setPagination(data.page);
                filter.addCondition('name:like', data.query.name);
                data.query.created_at && filter.addCondition('created_at:date_between', data.query.created_at.start + ',' + data.query.created_at.end);
                filter.addWithCondition('createdBy', 'first_name|last_name:concat_column_like', data.query.created_by);

                this.$apis.createEntity({name: '/api/my-list?'+filter.merge()});

                return this.$apis.endpoints.getAll()
                    .then(({data}) => {

                        this.data.data = data.entities.map(function (entity) {
                            entity.faqs = entity.faqs ? entity.faqs.length : 0;
                            entity.created_at = dateFormatter.set(entity.created_at).format();
                            return entity;
                        });

                        this.data.count = data.total;

                        return this.data;

                    }).catch(function (e) {
                        console.log('e', e)
                    });
            },
            exportCall:function() {
                filter.setPagination(false);
                this.$apis.createEntity({name: 'api/my-list?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                       return data;
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
        },
        created: function () {
        }
    }

</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">

</style>
