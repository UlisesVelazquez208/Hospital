<template>
    <div title="Contact Information">

        <div class="row form-group">
            <div class="col-sm-6">
                <div class="row">
                    <label for="weekday" class="col-sm-12  col-lg-6 col-form-label">{{ $t('Contact.WorkingHours')}}</label>
                    <div class="col-sm-12  col-lg-6">
                        <el-select
                                v-model="selectedDays"
                                multiple
                                style="width: 100%;"
                                :placeholder="$t('Contact.SelectDay')">
                            <el-option
                                    v-for="(option, key) in weekOptions"
                                    :key="key"
                                    :disabled="option.disabled"
                                    :label="option.text"
                                    :value="option.value">
                            </el-option>
                        </el-select>

                        <div v-if="errors[0]" class="text-danger">
                            {{ errors[0].day }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-4 from-to-box">
                <el-time-picker
                        style="width: 100%;"
                        format="hh:mm a"
                        is-range
                        v-model="workingHoursRange"
                        :start-placeholder="$t('Contact.SelectStartTime')"
                        :end-placeholder="$t('Contact.SelectEndTime')"
                >
                </el-time-picker>

                <div v-if="errors[0]" class="text-danger">
                    {{ errors[0].from }}
                    {{ errors[0].to }}
                </div>

            </div>
            <div class="col-sm-2 col-lg-1 button-box">
                <button @click="addWork()" type="button" class="btn add-btn btn-secondary">+</button>
            </div>
        </div>

        <div class="working-hours-list">
            <div class="row">

                <div class="col-sm-12 col-lg-9 offset-lg-3">
                    <ul>
                        <li v-if="!workingHour.deleted" v-for="(workingHour, key) in localWorkingHours">
                            <span>{{workingHour.day.charAt(0).toUpperCase() + workingHour.day.substr(1).toLowerCase()}}</span>
                            <span>{{workingHour.label}} </span>
                            <span
                                    class="custom__remove pull-right"
                                    @click="removeWork(key)">❌</span>
                        </li>
                    </ul>
                    <div  v-if="errors[0]" class="text-danger">
                    {{ errors }}
                    </div>
                </div>
            </div>
        </div>
        <div>
        </div>
        <!--here it is-->

    </div>

</template>

<script>
    import Vue from 'vue'
    import 'vue2-dropzone/dist/vue2Dropzone.min.css'
    import {EventBus} from '../../../eventbus/event-bus.js'
    import TimePicker from 'element-ui/lib/time-picker';
    import  Option from 'element-ui/lib/option';
    import Select from 'element-ui/lib/select';

    import 'element-ui/lib/theme-chalk/time-picker.css';
    import 'element-ui/lib/theme-chalk/option.css';
    import 'element-ui/lib/theme-chalk/select.css';
    import lang from 'element-ui/lib/locale/lang/en'
    import locale from 'element-ui/lib/locale'

    locale.use(lang);
    Vue.use(TimePicker);
    Vue.use(Select);
    Vue.use(Option);

    export default {
        name: "working-hour",
        props: {
            workingHours: {
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
        created() {

            let self = this;

            this.$eventBus.$on('empty-working-hours', function () {
                self.localWorkingHours = [];
                self.workingHoursRange = {};
                self.$forceUpdate()
            });

            this.localWorkingHours = this.workingHours.map((workingHour) => {

                workingHour.label =

                    new Date('January 31 2018 ' + workingHour.from).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    }) + ' to ' +

                    new Date('January 31 2018 ' + workingHour.to).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    });

                return workingHour;

            });

            this.updateWeekDays();
        },
        data: function () {
            return {
                workingHoursRange: {},
                localWorkingHours: [],
                selectedDays: [],
                selectedWorkDay: [],
                weekOptions: [
                    {text: "Saturday", value: "SATURDAY", disabled: false},
                    {text: "Sunday", value: "SUNDAY", disabled: false},
                    {text: "Monday", value: "MONDAY", disabled: false},
                    {text: "Tuesday", value: "TUESDAY", disabled: false},
                    {text: "Wednesday", value: "WEDNESDAY", disabled: false},
                    {text: "Thursday ", value: "THURSDAY", disabled: false},
                    {text: "Friday", value: "FRIDAY", disabled: false}
                ]
            };
        },
        methods: {
            addWork: function () {
                if (this.selectedDays.length && this.workingHoursRange.length) {

                    let fromHrs = new Date(this.workingHoursRange[0]);

                    let toHrs = new Date(this.workingHoursRange[1]);

                    let label =
                        fromHrs.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true}) + ' to ' +
                        toHrs.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});

                    for (let day of this.selectedDays) {

                        this.localWorkingHours.push({
                            day: day,
                            from: ((fromHrs.getHours()<10?'0':'') + fromHrs.getHours()) + ':' + ((fromHrs.getMinutes()<10?'0':'') + fromHrs.getMinutes()),
                            to: ((toHrs.getHours()<10?'0':'') + toHrs.getHours()) + ':' + ((toHrs.getMinutes()<10?'0':'') + toHrs.getMinutes()),
                            label: label
                        });
                    }

                    this.updateWeekDays();

                    this.selectedDays = [];

                    this.workingHoursRange = {};

                    this.pushData();
                }
            },
            updateWeekDays() {

                let selectedDays = [];

                selectedDays = this.localWorkingHours.filter(function (workingHour) {
                    return !workingHour.deleted;
                }).map(function (workingHour) {
                    return workingHour.day;
                });

                this.weekOptions = this.weekOptions.map((weekDay) => {
                    weekDay.disabled = selectedDays.includes(weekDay.value.toString());
                    return weekDay;
                });
            },
            removeWork: function (index) {
                if (this.localWorkingHours[index] && this.localWorkingHours[index].id) {
                    this.localWorkingHours[index].deleted = true;
                } else {
                    this.localWorkingHours.splice(index, 1);
                }
                this.pushData();
                this.updateWeekDays();
                this.$forceUpdate();
            },
            pushData: function () {
                EventBus.$emit('add-to-parent', {
                    name: 'working_hours',
                    contact_form_index: this.contactFormIndex,
                    value: this.localWorkingHours
                });
            }
        }
    }
</script>

<style scoped type="text/css" lang="scss">
    .btn {
        padding: 10px 70px;
    }

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
        padding: 10px 5px;
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

    .week-days {
        height: 2.2em;
    }

    span {
        font-weight: bold;
        color: rgba(1, 0, 0, 0.65);
        font-size: 14px;
    }

    .modal-component {

        .from-to-box {
            position: relative;
        }

        .from-box {
            position: relative;
            left: -19px;
        }

        .to-box {
            position: relative;
            left: 2px;
        }

        .button-box {
            position: relative;
            left: 25px;
            top: 4px;

        }
    }

    .time-picker input.display-time {
        height: 40px !important;
    }

    .add-btn {
        padding: 10px 5px;
        border: none;
    }
    .add-btn:hover {
        background-color: #0b5d8c;
    }
</style>

