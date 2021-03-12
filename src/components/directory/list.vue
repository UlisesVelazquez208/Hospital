<template>
    <component-container title="Directory.ManageDirectories" :btnLabel="$acl.currentUserCan('SAVE', 'Directory') ? $t('Common.AddNew') : ''" btnRoute="create-directory">
        <core-list :componentName="getComponentName()"
                   :requestFunction="apiCall" :dateColumns="dateColumns" :sorting="sorting" :listColumns="listColumns" :id="id"
                   :columns="columns" :headings="headings" :filters="filters"
                   :templates="templates" :responseAdapter="responseAdapter" :exportFunction="exportCall"></core-list>
    </component-container>
</template>
<script>
    import coreList from "../core/list/list.vue"
    import ComponentContainer from "../pages/componentContainer.vue";
    import actions from "./templates/actions.vue"
    import AbstractFilters from "../APIs/AbstractFilters";
    import DateFormatter from "../utils/DateFormatter";
    import directoryCountryService from '../../helpers/directoryCountryService';

    let filter = new AbstractFilters();
    let dateFormatter = new DateFormatter();
    const directoryCountrySer = new directoryCountryService();

    export default {
        name: "directory-list",
        components: {
            ComponentContainer,
            coreList
        },
        mounted(){
            document.querySelector('body').setAttribute('id', 'page-directories-list');
            this.getDirectoryCountries();
        },
        data: function () {
            let availableLanguages = JSON.parse(localStorage.getItem('languages'));
            let langList = [];

            langList = availableLanguages.map((item) => {
                return {id:item.id, text: item.name}
            });

            return {
                columns: ["name", "acronym", "directory_type", "country", "languages", "created_by", "service_categories", "status", "updated_at", "actions"],
                headings: {
                    name: 'Name',
                    acronym: 'Acronym',
                    directory_type: 'Type',
                    service_categories: 'Service Category',
                    country: 'Country',
                    languages: 'Languages',
                    status: 'Status',
                    created_by: 'Created By',
                    created_at: 'Created',
                    updated_at: 'Updated',
                    actions: 'Actions'
                },
                filters: ["name", "acronym", "directory_type", "created_by", "service_categories", "status", "country", "languages"],
                sorting:["name", "directory_type", "created_at", "updated_at", "created_by", "status", "country"],
                dateColumns: ['created_at', 'updated_at'],
                id:"directory-list",
                listColumns: {
                    status: [
                        {
                            id: 'ACTIVE',
                            text: 'Active'
                        },
                        {
                            id: 'INACTIVE',
                            text: 'Inactive'
                        }
                    ],
                    country: [],
                    languages:langList
                },
                templates: {
                    actions: actions
                },
                data: [],
                service_categories: []
            }
        },
        methods: {
            apiCall(data) {
                filter.reset();
                filter.addWith('createdBy');
                filter.addWith('contactForms');
                filter.addWith('contactForms.directoryCountry');
                filter.addWith('serviceCategories');
                filter.addWith('directoryType');
                filter.addWith('translations');

                if(data.orderBy == undefined) {
                    filter.addSorting('updated_at', 'desc');
                } else  {
                    if(data.orderBy == 'directory_type') data.orderBy = 'type_id';
                    data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                }

                data.limit && filter.setPerPage(data.limit);
                data.page && filter.setPagination(data.page);
                data.query.name && filter.addCondition('name:like', data.query.name);
                data.query.acronym && filter.addCondition('acronym:like', data.query.acronym);
                // data.query.country && filter.addCondition('contactForms.country:like', data.query.country);
                data.query.status && filter.addCondition('status', data.query.status);
                data.query.country && filter.addWithCondition('contactForms', 'country_id', data.query.country);
                data.query.service_categories && filter.addWithCondition('serviceCategories', 'name:like', data.query.service_categories);
                data.query.directory_type && filter.addWithCondition('directoryType', 'type_name:like', data.query.directory_type);
                data.query.created_at && filter.addCondition('created_at:date_between', data.query.created_at.start + ',' + data.query.created_at.end);
                data.query.created_by && filter.addWithCondition('createdBy', 'first_name|last_name:concat_column_like', data.query.created_by);

                this.$apis.createEntity({name: 'api/directory?' + filter.merge()});
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities, total} = data;
                        var entitiesArr = [];
                        let category, categoryStr = [];
                        let availableLanguages = JSON.parse(localStorage.getItem('languages'));

                        for (let entity of entities) {

                            if (entity.service_categories != undefined) {
                                for (this.category of entity.service_categories) {
                                    categoryStr.push(this.category.name);
                                }
                            }

                            entity.created_by_id = entity.created_by ? entity.created_by.id : undefined;
                            // entity.created_at = dateFormatter.set(entity.created_at).format();
                            // entity.updated_at = dateFormatter.set(entity.updated_at).format();
                            entity.created_at = entity.created_at;
                            entity.updated_at = entity.updated_at;
                            entity.service_categories == null ? [] : entity.service_categories = entity.service_categories.map(a => a.name).join(", ");
                            entity.created_by == null ? [] : entity.created_by = entity.created_by.first_name + ' ' + entity.created_by.last_name;
                            entity.directory_type == null ? [] : entity.directory_type = entity.directory_type.type_name;

                            let theCountry = '';

                            if(entity.contact_forms.length > 0) {
                                let theContactForm = entity.contact_forms[0];
                                const directoryCountry = theContactForm.directory_country;
                                theCountry = directoryCountry ? directoryCountry.country : theContactForm.country ? theContactForm.country : '';
                            }
                            entity.country = theCountry;

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
                this.$apis.createEntity({name: 'api/directory?' + filter.merge()});
                
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        let theData = [];
                        for(let item of data) {
                            item.service_categories = item.service_categories == null? [] : item.service_categories.map(a => a.name).join(", ");
                            item.created_by = item.created_by ? item.created_by.first_name+' '+item.created_by.last_name : undefined;
                            item.directory_type == null ? [] : item.directory_type = item.directory_type.type_name;
                            let theCountry = '';

                            if(item.contact_forms.length > 0) {
                                let theContactForm = item.contact_forms[0];
                                theCountry = theContactForm.country !== ''?theContactForm.country:'';
                            }
                            delete item.contact_forms;
                            item.country = theCountry;
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
            getServiceCategory() {
                this.$apis.createEntity({name: '/api/service-category?' + "conditions[parent_id]="});
                return this.$apis.endpoints.getAll()
                    .then(({data}) => {
                        const {entities} = data;
                        this.service_category = entities;
                    })
            },
            getDirectoryCountries() {
                return directoryCountrySer.getDirectoryCountries(false)
                    .then((countries) => {
                        this.listColumns.country = countries.map(country => ({id: country.id, text: country.country}));
                    });
            },
            getComponentName() {
                return "directory-list";
            }
        },
    }

</script>
<!-- styles -->
<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">
#directory-list thead tr th:nth-child(1) {
    width:15%;
}
#directory-list thead tr th:nth-child(2) {
    width:8%;
}
#directory-list thead tr th:nth-child(3), #directory-list thead tr th:nth-child(4) {
    width:10%;
}
#directory-list thead tr th:nth-child(5) {
    width:9%;
}
#directory-list thead tr th:nth-child(6) {
    width:20%;
}
</style>    
