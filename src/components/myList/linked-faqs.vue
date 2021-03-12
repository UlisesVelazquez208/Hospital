<template>
    <component-container title="Manage My List">
        <core-list :requestFunction="apiCall"
                   :columns="columns" :headings="headings" :filters="filters"
                   :templates="templates" :responseAdapter="responseAdapter" :exportFunction="exportCall">
        </core-list>
    </component-container>
</template>
<script>
    import linkedFaqActions from "./templates/linkedFaqActions.vue"
    import coreList from "../core/list/list.vue";
    import ComponentContainer from "../pages/componentContainer.vue";
    import AbstractFilters from "../APIs/AbstractFilters";
    import Question from "./templates/QuestionCol.vue";

    let filter = new AbstractFilters();

    export default {
        name: "mylist-list",
        components: {
            ComponentContainer,
            coreList,
            Question
        },
        data: function () {
            return {
                data: {
                    data: [],
                    count: 0
                },
                columns: ["question", "service_category", "created_at", "actions"],
                filters: ["question"],
                headings: {
                    question: "Question",
                    service_category: "Service Categories",
                    actions: "Actions"
                },
                templates: {
                    actions: linkedFaqActions,
                    question: Question
                }
            }
        },
        methods: {
            apiCall(data) {
                filter.reset();
                filter.addSorting("id", 'desc');

                filter.addWith('faqs');
                filter.addWith('faqs.serviceCategories');

                data.limit && filter.setPerPage(data.limit);
                data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
                data.page && filter.setPagination(data.page);

                filter.addWithCondition('faqs', 'question:like', data.query.question);

                this.$apis.createEntity({name: 'api/my-list'});

                return this.$apis.endpoints.getOne({id: this.getListId(), query: '?' + filter.merge()})
                    .then(({data}) => {
                        let faqs = data.faqs != null ? data.faqs.map(function (faq) {
                            return {
                                id: data.id,
                                name: data.name,
                                faq_id: faq.id,
                                question: faq.question,
                                service_category: faq.service_categories.map((service_category) => service_category.name).join(',')
                            };
                        }) : [];
                        this.data.data = faqs;
                        this.data.count = data.faqs != null && data.faqs.length ? data.faqs.length : 0;
                        
                        return this.data;

                    }).catch(this.failure);
            },
            failure: function (e) {
                this.data.data = [];
                this.data.count = 0;
            },
            getListId: function () {
                return this.$route.params.list_id;
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
