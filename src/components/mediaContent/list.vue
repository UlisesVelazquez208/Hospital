<template>
    <component-container title="Media.ManageMediaContent" :btnLabel="$acl.currentUserCan('SAVE', 'Media') ? $t('Common.AddNew') : ''" btnRoute="/media/create-media-content">
        <core-list :componentName="getComponentName()"
                   :requestFunction="apiCall" :dateColumns="dateColumns"
                   :listColumns="listColumns" :columns="columns" :headings="headings" :filters="filters" :sorting="sorting" :id="id"
                   :templates="templates" :responseAdapter="responseAdapter" :exportFunction="exportCall">
        </core-list>
    </component-container>
</template>
<script>
    import actions from "./templates/actions.vue"
    import thumbnail from "./templates/thumbnail.vue"
    import coreList from "../core/list/list.vue"
    import ComponentContainer from "../pages/componentContainer.vue";
    import AbstractFilters from "../APIs/AbstractFilters";
    import DateFormatter from "../utils/DateFormatter";

    let dateFormatter = new DateFormatter();
    let filter = new AbstractFilters();

    export default {
        name: "media-content-list",
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
                data: {
                    data: [],
                    count: 0
                },
                columns: ["thumbnail","title", "content_type","linked_faqs_count", "language", "countries", "nationalities", "service_categories", "created_by", "updated_at", "actions"],
                filters: ["title", "content_type", "countries", "nationalities", "created_by", "language"],
                sorting: ["title", "content_type", "created_by", "created_at", "updated_at"],
                id:'media-list',
                headings: {
                    thumbnail: 'Thumbnail',
                    title: 'Title',
                    content_type: "Content Type",
                    service_categories: 'Service Category',
                    countries: 'Country',
                    nationalities: 'Nationality',
                    language: 'Language',
                    linked_faqs_count: 'Linked FAQs',
                    created_by: 'Created By',
                    created_at: 'Created',
                    updated_at: 'Updated',
                    actions: 'Actions'
                },
                listColumns: {
                    content_type: [
                        {
                            id: 'POSTER',
                            text: 'Poster'
                        },
                        {
                            id: 'VIDEO',
                            text: 'Video'
                        },
                        {
                            id: 'AUDIO',
                            text: 'Audio'
                        },
                        {
                            id: 'PDF',
                            text: 'PDF'
                        }
                    ],
                    language: langList
                },
                dateColumns: ["created_at", "updated_at"],
                templates: {
                    actions: actions,
                    thumbnail: thumbnail
                }
            }
        },
        methods: {
            apiCall(data) {
                filter.reset();
                filter.addWith('createdBy');
                filter.addWith('meta');
                filter.addWith('nationalities');
                filter.addWith('countries');
                filter.addWith('serviceCategories');
                filter.addWith('language');

                if(data.orderBy == undefined) {
                    filter.addSorting('updated_at', 'desc');
                } else  {
                    if(data.orderBy == 'directory_type') data.orderBy = 'type_id';
                    data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                }
                
                data.limit && filter.setPerPage(data.limit);
                data.page && filter.setPagination(data.page);
                filter.addCondition('title:like', data.query.title);
                filter.addCondition('content_type', data.query.content_type);
                data.query.created_at && filter.addCondition('created_at:date_between', data.query.created_at.start + ',' + data.query.created_at.end);
                filter.addWithCondition('createdBy', 'first_name|last_name:concat_column_like', data.query.created_by);
                filter.addWithCondition('nationalities','nationality:like', data.query.nationalities);
                filter.addWithCondition('countries','country:like', data.query.countries);
                filter.addWithCondition('language','id', data.query.language);

                this.$apis.createEntity({name: 'api/media?'+filter.merge()});

                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        var entitiesArr = [];
                        let category, categoryStr = [];

                        for (let entity of entities) {
                            if (entity.service_categories != undefined) {
                                for (this.category of entity.service_categories) {
                                    categoryStr.push(this.category.name);
                                }
                            }

                            entity.service_categories == null ? [] : entity.service_categories = entity.service_categories.map(a => a.name).join(", ");
                            entity.created_by_id = entity.created_by ? entity.created_by.id : undefined;
                            entity.created_by = entity.created_by != null?entity.created_by.first_name + ' ' + entity.created_by.last_name:'';
                            entity.nationalities = entity.nationalities == null? [] : entity.nationalities.map(a => a.nationality).join(", ");
                            entity.countries = entity.countries == null? [] : entity.countries.map(a => a.country).join(", ");
                            entity.created_at = dateFormatter.set(entity.created_at).format();
                            entity.updated_at = dateFormatter.set(entity.updated_at).format();
                            entity.language = entity.language !== null? entity.language.name:'';

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
                this.$apis.createEntity({name: 'api/media?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        let theData = [];
                        for(let entity of data) {
                            entity.service_categories == null ? [] : entity.service_categories = entity.service_categories.map(a => a.name).join(", ");
                            entity.created_by = entity.created_by != null?entity.created_by.first_name + ' ' + entity.created_by.last_name:'';
                            entity.nationalities = entity.nationalities == null? [] : entity.nationalities.map(a => a.nationality).join(", ");
                            entity.countries = entity.countries == null? [] : entity.countries.map(a => a.country).join(", ");


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
                return "media-content-list"
            }
        },
        created: function () {
        }
    }

</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
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
