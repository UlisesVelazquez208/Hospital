<template>
    <component-container title="Hashtag.LinkedFAQs">
        <h4>{{ componentData.hashtag }}</h4>
        <core-list v-if="componentData" :componentName="getComponentName()"
                   :requestFunction="apiCall" :dateColumns="dateColumns" :sorting="sorting"
                   :columns="columns" :headings="headings" :filters="filters"
                   :templates="templates" :responseAdapter="responseAdapter" ref="faqListing"></core-list>
    </component-container>
</template>

<script>

import coreList from "./../../core/list/list.vue";
import ComponentContainer from "./../../pages/componentContainer.vue";
import actions from "./actions.vue";
import faqsService from './../../../helpers/faqsService.js';
import AbstractFilters from "../../APIs/AbstractFilters";
import API from "../../APIs/AbstractAPIs";
import { EventBus } from './../../../eventbus/event-bus';

let faqService = new faqsService();
let filter = new AbstractFilters();

var linkedFaqs = {
    name:'linked-faqs',
    components:{
        coreList,
        ComponentContainer,
    },
    props:{
        componentData:{
            type:Object,
            required:true
        },
        isModal:{
            type:Boolean,
            required:true,
            default:true
        }
    },
    mounted() {
        EventBus.$on('unlink-faq', this.unlinkFaq);
    },
    data(){
        return {
            columns: ["question", "countries", "nationalities", "visible", "status","actions"],
            filters: [],
            sorting:[],
            dateColumns: [],
            id:'hashtag-linked-faq-list',
            headings: {
                question: 'Question',
                service_categories: "Service Category",
                countries: "Country",
                nationalities: "Nationality",
                status: "Status",
                visible: "Visible To",
                actions: "Actions"
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
                    // {
                    //     id: 'UNHCR_STAFF_PARTNERS',
                    //     text: 'UNHCR Staff and Partners'
                    // },
                    {
                        id: 'PUBLIC',
                        text: 'Public'
                    }
                ]
            },
            data: [],
        }
    },
    watch:{
        'componentData':function(){
            this.apiCall(this.data);
            this.$refs.faqListing.refreshTable();
        }
    },
    methods:{
        getComponentName:function() {
            return this.name;
        },
        unlinkFaq(id) {
            var faqID = id;
            var hashID = this.componentData.id;
            
            faqService.getFAQ(faqID).then((data)=>{
                let hashtags = data.hashtags.map((item)=>{
                    if(item.id != hashID) {
                        return item.id;
                    }
                });
                hashtags.splice(hashtags.indexOf(undefined), 1);

                let faqAPI = new API();

                faqAPI.createEntity({name: 'api/faq/'+faqID+'/unlink-hashtag'});
                faqAPI.endpoints.post({
                    // id: faqID,
                    hashtags: hashtags,
                }).then((faqItem) => {
                    this.apiCall(this.data);
                    this.$refs.faqListing.refreshTable();
                }).catch(function(e) {
                    console.log(e);
                });
            });
            // console.log(id, this.componentData.id);
        },
        apiCall(data) {
            filter.reset();
            filter.addWith('serviceCategories');
            filter.addWith('nationalities');
            filter.addWith('countries');
            filter.addWith('socialMediaLinks');
            filter.addWith('hashtags');
            filter.addWith('createdBy');

            if(data.orderBy == undefined) {
                filter.addSorting('question', 'asc');
            } else  {
                data.orderBy && filter.addSorting(data.orderBy, data.ascending ? 'asc' : 'desc');
            }
            data.limit && filter.setPerPage(data.limit);
            data.page && filter.setPagination(data.page);
            // data.query.question && filter.addCondition('question:like', data.query.question);
            // data.query.status && filter.addCondition('status', data.query.status);
            // data.query.visible && filter.addCondition('visible', data.query.visible);

            // filter.addWithCondition('serviceCategories','name:like', data.query.service_categories);
            // filter.addWithCondition('nationalities','nationality:like', data.query.nationalities);
            // filter.addWithCondition('countries','country:like', data.query.countries);
            filter.addWithCondition('hashtags','hashtag:equal', this.componentData.hashtag);

            // filter = this.linkedFAQs(filter);

            this.$apis.createEntity({name: 'api/faq?' + filter.merge()});
            return this.$apis.endpoints.getAll()
                .then(({data}) => {

                    const {entities, total} = data;
                    let entitiesArr = [];

                    for (let entity of entities) {
                        // entity.created_by_id = entity.created_by ? entity.created_by.id : undefined;
                        // entity.service_categories = entity.service_categories == null? [] : entity.service_categories.map(a => a.name).join(", ");
                        entity.nationalities = entity.nationalities == null? [] : entity.nationalities.map(a => a.nationality).join(", ");
                        entity.countries = entity.countries == null? [] : entity.countries.map(a => a.country).join(", ");
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
    }    
}
export default linkedFaqs;
</script>