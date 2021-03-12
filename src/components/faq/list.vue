<template>
    <component-container title="FAQ.ManageFAQs" :btnLabel="$acl.currentUserCan('SAVE', 'FAQ') ? $t('Common.AddNew') : ''" btnRoute="create-faq">
        <core-list :componentName="getComponentName()"
                   :requestFunction="apiCall" :dateColumns="dateColumns"
                   :columns="columns" :headings="headings" :filters="filters" :sorting="sorting" :listColumns="listColumns"
                   :templates="templates" :responseAdapter="responseAdapter" :exportFunction="exportCall" :id="id"></core-list>
    </component-container>
</template>
<script>
    import coreList from "../core/list/list.vue";
    import ComponentContainer from "../pages/componentContainer.vue";
    import actions from "./templates/actions.vue";
    import AbstractFilters from "../APIs/AbstractFilters";
    import DateFormatter from "../utils/DateFormatter";

    let filter = new AbstractFilters();
    let dateFormatter = new DateFormatter();

    export default {
        name: "faq-list",
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
                columns: ["question", "service_categories", "countries", "nationalities", "languages", "visible", "status",  "updated_at", "actions"],
                filters: ["question", "service_categories", "countries", "nationalities", "languages", "visible", "status"],
                sorting:["question", "visible", "status", "created_at", "updated_at"],
                dateColumns: [],
                id:'faq-list',
                name:'faq-list',
                headings: {
                    question: 'Question',
                    service_categories: 'Service Category',
                    countries: 'Country',
                    nationalities: 'Nationality',
                    status: 'Status',
                    visible: 'Visible To',
                    languages: 'Languages',
                    created_at: 'Created',
                    updated_at: 'Updated',
                    actions: 'Actions'
                },
                templates: {
                    actions: actions
                },
                listColumns: {
                    status: [
                        {
                            id: 'DECLINED',
                            text: 'Revision requested'
                        },
                        {
                            id: 'DRAFT',
                            text: 'Draft'
                        },
                        {
                            id: 'WAITING_FOR_APPROVAL',
                            text: 'Waiting for Approval'
                        },
                        {
                            id: 'PUBLISHED',
                            text: 'Published'
                        }
                    ],
                    visible: [
                        {
                            id: 'UNHCR_STAFF',
                            text: 'Staff'
                        },
                        {
                            id: 'PARTNERS',
                            text: 'Partners'
                        },
                        {
                            id: 'PUBLIC',
                            text: 'Public'
                        }
                    ],
                    languages: langList
                },
                data: [],
                exportData:[]
            }
        },
        methods: {
            linkedFAQs(filter){

                let resourceType = this.$route.query.resource_type, resourceId = this.$route.query.resource_id

                if(resourceType && resourceId){
                    filter.addWith(resourceType);
                    filter.addWithCondition(resourceType,'id', resourceId);
                }

                return filter;
            },
            apiCall(data) {
                filter.reset();
                filter.addWith('serviceCategories');
                filter.addWith('nationalities');
                filter.addWith('countries');
                filter.addWith('socialMediaLinks');
                filter.addWith('createdBy');
                filter.addWith('translations');
                // filter.addWith('translations.language');

                if(data.orderBy == undefined) {
                    filter.addSorting('updated_at', 'desc');
                } else  {
                    data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                }
                data.limit && filter.setPerPage(data.limit);
                data.page && filter.setPagination(data.page);
                data.query.question && filter.addCondition('question:like', data.query.question);
                data.query.status && filter.addCondition('status', data.query.status);
                data.query.visible && filter.addCondition('visible', data.query.visible);

                filter.addWithCondition('serviceCategories','name:like', data.query.service_categories);
                filter.addWithCondition('nationalities','nationality:like', data.query.nationalities);
                filter.addWithCondition('countries','country:like', data.query.countries);
                filter.addWithCondition('translations', 'language_id', data.query.languages);

                filter = this.linkedFAQs(filter);

                this.$apis.createEntity({name: 'api/faq?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {

                        const {entities, total} = data;
                        let entitiesArr = [];

                        let availableLanguages = JSON.parse(localStorage.getItem('languages'));

                        for (let entity of entities) {
                            entity.created_by_id = entity.created_by ? entity.created_by.id : undefined;
                            entity.service_categories = entity.service_categories == null? [] : entity.service_categories.map(a => a.name).join(", ");
                            entity.nationalities = entity.nationalities == null? [] : entity.nationalities.map(a => a.nationality).join(", ");
                            entity.countries = entity.countries == null? [] : entity.countries.map(a => a.country).join(", ");
                            entity.created_at = entity.created_at;
                            entity.updated_at = entity.updated_at;

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
                            // entity.created_at = entity.created_at.format('Y-mm-dd');
                            // entity.created_at = dateFormatter.set(entity.created_at).format();
                            // entity.updated_at = dateFormatter.set(entity.updated_at).format();
                            entitiesArr.push(entity);
                        }

                        this.data.data = entitiesArr;
                        this.data.count = total;
                        return this.data;
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
            exportCall:function() {
                filter.setPagination(false);
                this.$apis.createEntity({name: 'api/faq?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        let theData = [];
                        for(let item of data) {
                            item.service_categories = item.service_categories == null? [] : item.service_categories.map(a => a.name).join(", ");
                            item.nationalities = item.nationalities == null? [] : item.nationalities.map(a => a.nationality).join(", ");
                            item.countries = item.countries == null? [] : item.countries.map(a => a.country).join(", ");
                            item.created_by = item.created_by ? item.created_by.first_name+' '+item.created_by.last_name : undefined;
                            item.social_media_links = item.social_media_links == null? [] : item.social_media_links.map(a => a.url).join(", ");
                            theData.push(item);
                        }
                        return theData;
                    }).catch(function (e) {
                    });
            },
            getComponentName() {
                return "faq-list";
            }
        },
        mounted(){
            document.querySelector('body').setAttribute('id', 'page-faqs-list');
        }

    }

</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">
#faq-list thead tr th:nth-child(1) {
    width:25%;
}
#faq-list thead tr th:nth-child(2) {
    width:15%;
}
#faq-list thead tr th:nth-child(3) {
    width:10%;
}
#faq-list thead tr th:nth-child(4) {
    width:10%;
}
#faq-list thead tr th:nth-child(5) {
    width:10%;
}
#faq-list thead tr th:nth-child(6) {
    width:8%;
}
#faq-list .action-container {
    width:70px;
}

</style>
