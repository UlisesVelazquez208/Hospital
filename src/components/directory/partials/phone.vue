<template>
    <!--here it is-->
    <div class="row form-group">
        <div class="col-sm-12">
            <div class="row">
                <label for="phone" class="col-sm-12  col-lg-3 col-form-label">{{ $t('Contact.Phone')}}</label>
                <div class="col-sm-2  col-lg-2">
                    <input type="number" name="country_code" id="country_code"
                           :placeholder="$t('Contact.PhoneCountryCode')"
                           value=""
                           class="form-control phone"
                           v-model="model.country_code"
                           @keyup="clearError"
                    >
                    <div v-if="custom_errors" class="text-danger">
                        {{ custom_errors }}
                    </div>
                </div>
                <div class="col-sm-2  col-lg-2">
                    <input type="number" name="area_code" id="area_code"
                           :placeholder="$t('Contact.PhoneAreaCode')"
                           value=""
                           class="form-control phone"
                           v-model="model.area_code"
                           @keyup="clearError"
                    >
                    <div v-if="custom_errors" class="text-danger">
                        {{ custom_errors }}
                    </div>
                </div>
                <div class="col-sm-8  col-lg-4">
                    <input type="number" name="phone" id="phone"
                           :placeholder="$t('Contact.Phone')"
                           value=""
                           class="form-control phone"
                           v-model="model.phone"
                           @keyup="clearError"
                    >
                    <div v-if="custom_errors" class="text-danger">
                        {{ custom_errors }}
                    </div>
                </div>
                <div class="col-sm-2 col-lg-2 col-xl-1">
                    <button @click="addLink()" type="button" class="btn add-btn btn-secondary">+</button>
                </div>
            </div>
            <div class="phone-list ">
                <div class="row">
                    <div v-if="localPhones" class="col-sm-12 col-lg-9 offset-lg-3">

                        <div v-if="errors.length" class="text-danger">
                            {{ errors }}
                        </div>
                        <ul>

                            <li  v-if="!phone.deleted" v-for="(phone, index) in localPhones">
                                <span v-if="phone.phone">{{phone.country_code}} {{phone.area_code}} {{phone.phone}}</span>
                                <span v-if="phone.phone" class="custom__remove pull-right" @click="removeLink(index)">❌</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--here it is-->
</template>

<script>
    import Vue from 'vue'
    import {EventBus} from '../../../eventbus/event-bus.js'
    import inputText from "../../core/form/partials/input-text/input-text.vue"
    import inputTextarea from "../../core/form/partials/input-textarea/input-textarea.vue"
    import inputSelect from "../../core/form/partials/input-select/input-select.vue"
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    export default {
        name: "phone",
        components: {
            inputText,
            inputTextarea,
            inputSelect
        },
        props: {
            phones: {
                type: Array,
                required: true,
            },
            contactFormIndex: {
                type: Number,
                required: true
            },
            errors: {
                default: ''
            }
        },
        data: function () {
            return {
                model: {
                    country_code:'',
                    area_code:'',
                    phone: ''
                },
                localPhones: this.phones,
                custom_errors: ''
            };
        },
        created(){
            let self = this;
            this.$eventBus.$on('empty-phone', function () {
                self.localPhones = [];
                self.model.phone = '';
                self.model.country_code = '';
                self.model.area_code = '';
            });
        },
        methods: {
            addLink: function () {

                if(!this.model.phone){
                    this.custom_errors = 'Phone number is empty!';
                    this.$forceUpdate();
                    return;
                };

                this.localPhones.push({
                    country_code:this.model.country_code,
                    area_code:this.model.area_code,
                    phone: this.model.phone
                });

                this.model.localPhones = '';
                this.pushData();
            },
            clearError: function(){
                this.errors = '';
            },
            removeLink: function (index) {
                if(this.localPhones[index] && this.localPhones[index].id){
                    this.localPhones[index].deleted = true;
                }else{
                    this.localPhones.splice(index, 1);
                }
                this.$forceUpdate();
                this.pushData();
            },
            pushData: function () {
                EventBus.$emit('add-to-parent', {
                    name: 'phones',
                    contact_form_index: this.contactFormIndex,
                    value: this.localPhones
                });
            }
        }
    }
</script>

<style scoped type="text/css" lang="scss">
    .btn-submit {

        background-color: #0072BC;
    }

    .btn-cancel {
        background-color: #fff;
        border: 1px solid #0072BC;
        color: #0072BC;
    }

    .toggle-btn-container {
        margin: 7px 0;
    }

    .label {
        font-size: 14px;
    }

    .add-btn {
        background-color: #0C83C6;
        padding: 5px 5px;
        width: 100%;
        border: none;
    }
    .add-btn:hover {
        background-color: #0b5d8c;
    }
    .phone-list, .working-hours-list {
        ul {
            list-style: none;
            padding: 0;
            margin: 20px 0px;
        }
        li {
            padding: 15px 15px;
            /*box-shadow: 1px 1px 1px 1px #bbbbbbf5;*/
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
            margin: 7px 0;

        }
        .custom__remove {
            color: #0C83C6;
            &:hover {
                cursor: pointer;

            }
        }
    }
    .phone{
        height:40px;
    }

</style>

