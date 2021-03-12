<template>
    <div class="form-group row">
        <label v-if="inputLabel" :for="inputId" class="col-sm-12 col-lg-3 col-form-label">{{ $t(inputLabel) }}</label>
        <div :class="'col-sm-12'+ (inputLabel ? ' col-lg-9' : '')">
            <select @input="grabinput($event.target)" :name="name" size="0" class="input-select form-control" :inputClass="inputClass"
                    :selectOptions="selectOptions" :id="inputId" :required="required" :disabled="disabled" :multiple="multiple" @change="clearError">
                <option value="null">{{ $t('Select.NothingSelected') }}</option>
                <option
                    v-for="(option, index) in selectOptions"
                    :key="index"
                    v-bind:value="option.value"
                    :selected="option.selected"
                    :test="option.selected ? $t('Yes') : $t('False') "
                >
                    {{ option.text }}
                </option>
            </select>
            <div v-if="errors" class="text-danger">
                {{ errors }}
            </div>
        </div>
    </div>
</template>

<script>
    import inputSelect from "./script";

    export default inputSelect;
</script>

<style type="text/css" lang="scss">
    .input-select{
        height: 30px;
    }
</style>

