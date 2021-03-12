<template>
    <component-container
        title="DirectoryMedia.ManageDirectoryMedia"
        :btnLabel="$acl.currentUserCan('SAVE', 'DirectoryMedia') ? $t('Common.AddNew') : ''"
        btnRoute="/directory-media/create"
    >
        <core-list
            :componentName="getComponentName()"
            :requestFunction="apiCall"
            :dateColumns="dateColumns"
            :listColumns="listColumns"
            :columns="columns"
            :headings="headings"
            :filters="filters"
            :sorting="sorting"
            :id="id"
            :templates="templates"
            :responseAdapter="responseAdapter"
            :exportFunction="exportCall">
        </core-list>
    </component-container>
</template>
<script>
    import coreList from "../core/list/list.vue"
    import ComponentContainer from "../pages/componentContainer.vue";
    import thumbnail from "./templates/thumbnail.vue"
    import actions from "./templates/actions.vue"
    import AbstractFilters from "../APIs/AbstractFilters";
    import DateFormatter from '../utils/DateFormatter';

    let filter = new AbstractFilters();
    let dateFormatter = new DateFormatter();

    export default {
        name: "directory-media-list",
        components: {
            ComponentContainer,
            coreList
        },
        data: function () {
            return {
                columns: ["thumbnail","title", "description", "created_by", "updated_at", "actions"],
                filters: ["title", "description", "created_by"],
                sorting: ["title", "description", "created_by", "created_at", "updated_at"],
                id:'directory-media-list',
                headings: {
                    thumbnail: 'Thumbnail',
                    title: 'Title',
                    description: "Description",
                    created_by: 'Created By',
                    created_at: 'Created',
                    updated_at: 'Updated',
                    actions: 'Actions'
                },
                listColumns: {},
                dateColumns: ["created_at", "updated_at"],
                templates: {
                    actions: actions,
                    thumbnail: thumbnail
                },
                data: [],
            }
        },
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-directory-media-list');
        },
        methods: {
            apiCall(data) {
                if(data.orderBy == undefined) {
                    filter.addSorting('updated_at', 'desc');
                } else  {
                    data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                }

                data.limit && filter.setPerPage(data.limit);
                data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                data.page && filter.setPagination(data.page);
                filter.addCondition('title:like', data.query.title);
                filter.addCondition('description:like', data.query.description);
                filter.addCondition('created_by:like', data.query.created_by);
                data.query.created_at && filter.addCondition('created_at:date_between', data.query.created_at.start + ',' + data.query.created_at.end);
                this.$apis.createEntity({name: '/api/directory-media?' + filter.merge()});
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        var entitiesArr = [];

                        for (let entity of entities) {
                            entity.created_at = dateFormatter.set(entity.created_at).format();
                            entity.updated_at = dateFormatter.set(entity.updated_at).format();
                            const description = entity.description ? (entity.description).replace(/(<([^>]+)>)/ig, ''): '';
                            entity.description = description.length > 50 ? description.substring(0, 47)+'...' : description;
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
                this.$apis.createEntity({name: 'api/directory-media?' + filter.merge()});
                
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
            getComponentName() {
                return "directory-media-list";
            }
        },
    }

</script>
