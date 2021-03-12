<template>
    <div class="row">
        <div class="col-sm-9">
            <h4 class="directory-title">{{directory.name.replace(' ('+directory.countryLabel+')', '')}} <span v-if="directory.acronym">({{directory.acronym}})</span> <span v-if="contactAddress[0].directory_country">- {{ contactAddress[0].directory_country.country}}</span><span v-else-if="contactAddress[0].country">- {{ contactAddress[0].country}}</span><span v-if="directory.category">, {{directory.category}}</span></h4>
            <ul>
                <li v-for="(item, index) in directory.contact_forms" :key="index" class="contact-labels">
                    <label for=""><input type="checkbox" :value="item.id" @change="updateSelected(item.id)" :checked="dirContacts.indexOf(item.id)!== -1?'checked':''"> {{ item.contact_label}}</label>
                </li>
            </ul>
        </div>
        <div class="col-sm-3">
            <img v-if="directory.directory_media" class="rounded img-fluid float-md-right float-sm-left"
                    :src="directory.directory_media.url"
            >
        </div>
    </div>
</template>

<script>
    import ComponentAsModal from "../../modal/component-as-modal";
    import {EventBus} from "../../../eventbus/event-bus";
    import inputMultiSelect from "../../core/form/partials/input-multiselect/input-multiselect.vue";

    export default {
        name: "faq-directory",
        components: {ComponentAsModal, inputMultiSelect},
        props: {
            directory: {
                required: true,
                type: Object
            },
            dirContacts:{
                type: Array,
                required: false
            }
        },
        data() {
            return {
                selectedContacts:[],
                contactAddress:[]
            }
        },
        methods: {
            updateSelected:function(itemID) {
                EventBus.$emit('contact-selected', itemID);
            },
            showSelected:function(event) {
                if(event.name == 'contact-information') {
                    let eventValues = event.value;
                    let theAddress = event.value[eventValues.length - 1];
                    let contactObject = {
                        directory_id:0,
                        contactAddresses:[]
                    };

                    let theIndex = -1;

                    for(var i=0; i < this.selectedContacts.length; i++) {
                        let addressItem = this.selectedContacts[i];

                        if(addressItem.directory_id == theAddress.directory_id) {
                            theIndex = i;
                            break;
                        }
                    }
                    
                    if(theIndex == -1) {
                        contactObject.directory_id = this.directory.id;
                        contactObject.contactAddresses.push(theAddress);
                        this.selectedContacts.push(contactObject);
                    } else {
                        this.selectedContacts[theIndex].contactAddresses.push(theAddress);
                    }

                    EventBus.$emit('update-multi-select', this.selectedContacts);
                }
            },
            removelink: function (index, directoryID) {
                for(var i = 0; i < this.selectedContacts.length; i++) {
                    let directoryItem = this.selectedContacts[i];

                    if(directoryItem.directory_id == directoryID) {
                        this.selectedContacts[i].contactAddresses.splice(index, 1);
                    }
                }
            },
        },
        computed:{
            directoryContacts: function() {
                let selectedContacts = [];

                selectedContacts = this.selectedContacts.filter((item) => {
                    if(item.directory_id == this.directory.id) {
                        return item;
                    }
                });

                return selectedContacts.length > 0? selectedContacts[0].contactAddresses:[];
            }
        },
        created:function() {
            EventBus.$on('update-multi-select', this.showSelected);

            let contactAddresses = [];

            contactAddresses = this.directory.contact_forms.map((item)=>{
                item.name = item.contact_label;
                return item;
            });

            this.contactAddress = contactAddresses;
        }
    }
</script>

<style>
    li.contact-labels {
        padding: 0px 0px !important;
        border: none !important;
        box-shadow: none !important;
        min-height: 30px !important;
        margin-left:0px !important;
        -webkit-box-shadow: none !important;
    }
</style>