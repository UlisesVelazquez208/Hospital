
<template>
    <component-container title="SearchAnalytics.ListSearchRequest" :btnLabel="$acl.currentUserCan('SAVE', 'CaptureSearch') ? $t('Common.AddNew') : ''" btnRoute="/search-anlytics/dashboard">
        <core-list
            :componentName="getComponentName()"
            :requestFunction="apiCall" :dateColumns="dateColumns"
            :listColumns="listColumns" :columns="columns" :headings="headings" :filters="filters" :sorting="sorting" :id="id"
            :templates="templates" :responseAdapter="responseAdapter" :exportFunction="exportCall">
        </core-list>
    </component-container>
</template>
<script>
    import actions from "./templates/actions.vue";
    import otherParams from "./templates/otherParams";
    import coreList from "../core/list/list.vue";
    import ComponentContainer from "../pages/componentContainer.vue";
    import AbstractFilters from "../APIs/AbstractFilters";

    let filter = new AbstractFilters();

    export default {
        name: "capture-search-list",
        components: {
            ComponentContainer,
            coreList
        },
        data: function () {
            let availableLanguages = JSON.parse(localStorage.getItem('languages'));
            let langList = [];

            langList = availableLanguages.map((item) => {
                return {id:item.name, text: item.name}
            });

            return {
                data: {
                    data: [],
                    count: 0
                },
                columns: [
                    "search_string",
                    "ip_address",
                    "location",
                    "model",
                    "language",
                    "params_string",
                    "created_at",
                    "actions"
                ],
                filters: ["search_string", "ip_address", "location", "model", "language"],
                sorting: ["search_string", "ip_address", "location", "created_at"],
                id: 'capture-search-list',
                headings: {
                    search_string: 'Keywords',
                    ip_address: 'IP Address',
                    location: 'Location',
                    model: 'Search Object',
                    language: 'Search Language',
                    params_string: 'Other Search Params',
                    created_at: 'Search Time',
                    actions: 'Actions'
                },
                listColumns: {
                    model: [
                        {id: 'Directory', text: 'Directory'},
                        {id: 'Faq', text: 'Faq'},
                        {id: 'Media', text: 'Media'}
                    ],
                    language: langList
                },
                dateColumns: ["created_at"],
                templates: {
                    actions: actions,
                    params_string: otherParams
                }
            }
        },
        methods: {
            apiCall(data) {
                filter.reset();

                if(data.orderBy == undefined) {
                    filter.addSorting('created_at', 'desc');
                } else  {
                    data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                }
                
                data.limit && filter.setPerPage(data.limit);
                data.page && filter.setPagination(data.page);
                filter.addCondition('search_string:like', data.query.search_string);
                filter.addCondition('ip_address:like', data.query.ip_address);
                filter.addCondition('location:like', data.query.location);
                filter.addCondition('language:like', data.query.language);
                filter.addCondition('model:like', data.query.model);

                this.$apis.createEntity({name: 'api/search-analytics?'+filter.merge()});

                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        this.data.data = entities;
                        this.data.count = total;
                        return this.data;
                    }).catch(function (e) {
                        console.log('e', e)
                    });
            },
            exportCall:function() {
                filter.setPagination(false);
                this.$apis.createEntity({name: 'api/search-analytics?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        return data.map((row, index) => {
                            return {
                                'Keywords': row.search_string,
                                'Ip Address': row.ip_address,
                                'Location': row.location,
                                'Search Object': row.model,
                                'Search Language': row.language,
                                'Other Search Params': row.params_string ?
                                                        `\t${(row.params_string).replace('<br/>','\n')
                                                            .replace(/(<([^>]+)>)/ig,"")}`
                                                        :
                                                        '',
                                'Search Time': row.created_at
                            };
                        });
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
                return "capture-search-list"
            }
        },
        created: function () {
        }
    }

</script>

<style type="text/css" lang="scss">
    #media-list thead tr th:nth-child(1) {
        width:5% !important;
    }
    #media-list thead tr th:nth-child(2) {
        width:15% !important;
    }
    #media-list thead tr th:nth-child(3) {
        width:8%;
    }
    #media-list thead tr th:nth-child(4) {
        width:7% !important;
    }
    #media-list thead tr th:nth-child(5) {
        width:10%;
    }
    #media-list thead tr th:nth-child(6) {
        width:10%;
    }
    #media-list thead tr th:nth-child(7) {
        width:10%;
    }
    #media-list thead tr th:nth-child(8) {
        width:10%;
    }
</style>
