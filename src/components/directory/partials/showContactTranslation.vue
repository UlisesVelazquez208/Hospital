<template>
    <div>
        <div class="row">
            <div class="col-lg-12 col-md-12">
                <p>{{ $t('Common.Translations')}}</p>
            </div>
        </div>
        <div v-for="(langItem, index) in languageContents" class="row" :key="index">
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-lg-12 col-md-12">
                    <h5>{{ langItem.label }}</h5>
                    </div>
                </div>
            <div class="row form-group">
                <label for="contact_label" class="col-sm-12  col-lg-3 col-form-label">{{$t('Contact.ContactLabel')}}</label>
                <div class="col-sm-12 col-lg-9">
                    {{langItem.contact_label}}
                </div>
            </div>
            <div class="row form-group">
                <label for="address_line_one" class="col-sm-12  col-lg-3 col-form-label">{{$t('Contact.AddressLine1')}}</label>
                <div class="col-sm-12 col-lg-9">
                    {{ langItem.address_line_one}}
                </div>
            </div>
            <div class="row form-group">
                <label for="address_line_two" class="col-sm-12  col-lg-3 col-form-label">{{$t('Contact.AddressLine2')}}</label>
                <div class="col-sm-12 col-lg-9">
                    {{ langItem.address_line_two}}
                </div>
            </div>
            <div class="row form-group">
                <div class="col-sm-6">
                    <div class="row">
                        <label for="building_name" class="col-sm-12  col-lg-6 col-form-label">{{$t('Contact.BuildingName')}}</label>
                        <div class="col-sm-12 col-lg-6">
                        {{ langItem.building_name}}

                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="row">
                        <label for="landmark"
                            class="col-sm-12  col-lg-6 col-form-label ">{{ $t('Contact.Landmark')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            {{ langItem.landmark }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row form-group">
                <div class="col-sm-6">
                    <div class="row">
                        <label for="metro" class="col-sm-12  col-lg-6 col-form-label">{{$t('Contact.Metro')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            {{ langItem.metro }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="row form-group">
                <div class="col-sm-6">
                    <div class="row">
                        <label for="city" class="col-sm-12  col-lg-6 col-form-label">{{ $t('Contact.City')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            {{ langItem.city}}
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="row">
                        <label for="neighbourhood"
                            class="col-sm-12  col-lg-6 col-form-label">{{$t('Contact.Neighbourhood')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            {{ langItem.neighbourhood }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="row form-group">
                <div class="col-sm-6">
                    <div class="row">
                        <label for="proximity" class="col-sm-12  col-lg-6 col-form-label">{{ $t('Contact.Proximity')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            {{ langItem.proximity }}
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="row">
                        <label for="district"
                            class="col-sm-12  col-lg-6 col-form-label">{{ $t('Contact.District')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            {{ langItem.district }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="row form-group">
                <div class="col-sm-6">
                    <div class="row">
                        <label for="governorate" class="col-sm-12  col-lg-6 col-form-label">{{ $t('Contact.Governorate')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            {{ langItem.governorate}}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        languageContents:{
            type:Array,
            default: function() {
                return [];
            }
        }
    }
}
</script>