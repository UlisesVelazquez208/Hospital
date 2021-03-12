<template>
    <component-container title="DirectoryType.ManageDirectoryTypes" :btnLabel="$acl.currentUserCan('SAVE', 'Directory') ? $t('Common.AddNew') : ''"
                         btnRoute="create-directory-type">
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
    import DateFormatter from '../utils/DateFormatter';

    let filter = new AbstractFilters();
    let dateFormatter = new DateFormatter();

    export default {
        name: "directory-type-list",
        components: {
            ComponentContainer,
            coreList
        },
        data: function () {
            let availableLanguages = JSON.parse(localStorage.getItem('languages'));
            let langList = [];

            langList = availableLanguages.map((item) => {
                return {id:item.id, text: item.name}
            });
            return {
                columns: ["type_name", "languages", "actions"],
                filters: ["type_name", "languages"],
                headings: {
                    type_name: 'Directory Type',
                    created_at: 'Created',
                    languages: 'Languages',
                    actions: 'Actions'
                },
                listColumns:{
                    languages:langList
                },
                templates: {
                    actions: actions
                },
                dateColumns: [],
                data: [],
                exportData:[]
            }
        },
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-directory-type-list');
        },
        methods: {
            apiCall(data) {
                filter.reset();
                filter.addWith('translations');

                if(data.orderBy == undefined) {
                    filter.addSorting('updated_at', 'desc');
                } else  {
                    data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                }

                data.limit && filter.setPerPage(data.limit);
                data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                data.page && filter.setPagination(data.page);
                filter.addCondition('type_name:like', data.query.country);
                data.query.created_at && filter.addCondition('created_at:date_between', data.query.created_at.start + ',' + data.query.created_at.end);
                this.$apis.createEntity({name: '/api/directory-type?' + filter.merge()});
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        var entitiesArr = [];
                        let availableLanguages = JSON.parse(localStorage.getItem('languages'));

                        for (let entity of entities) {
                            entity.created_at = dateFormatter.set(entity.created_at).format();
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
            exportCall:function() {
                filter.setPagination(false);
                this.$apis.createEntity({name: 'api/directory-type?' + filter.merge()});
                
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
                return "directory-type-list";
            }
        },
    }

</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">

</style>    
