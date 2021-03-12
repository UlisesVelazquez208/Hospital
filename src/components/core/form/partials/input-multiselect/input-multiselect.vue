<template>
    <div class="form-group row">
        <label v-if="inputLabel" :for="inputId" class="col-sm-12  col-lg-3 col-form-label">{{$t(inputLabel)}}</label>
        <div :class="inputClass" :id="inputId">
            <multiselect :block-keys="['Delete','Backspace']" @input="grabinput();clearError()" v-model="selectedData" :options="selectOptions" :multiple="true" :close-on-select="true"
                         :clear-on-select="true" :hide-selected="true" :preserve-search="true" :name="name" :taggable="taggable"
                         :placeholder="$t(inputplaceholder)" :label="label" track-by="id" :preselect-first="true" :disabled="disabled" >
                <template slot="noResult">{{ $t('Common.NoResults')}}</template>
            </multiselect>

            <div v-if="errors" class="text-danger">
                {{ errors }}
            </div>
        </div>
    </div>
</template>

<script>
    import inputMultiSelect from "./script";

    export default inputMultiSelect;
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
    .custom__tag {
        color: #FFF;
        display: inline-block;
        padding: 3px 12px;
        background: #43bbff;
        margin-right: 8px;
        margin-bottom: 8px;
        border-radius: 10px;
        cursor: pointer;
    }
    .multiselect--active{
        z-index: 9;
    }
</style>


