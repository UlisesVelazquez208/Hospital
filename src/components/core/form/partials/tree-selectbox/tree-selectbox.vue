<template>
    <div class="form-group row">
        <label v-if="inputLabel"  class="col-sm-12  col-lg-3 col-form-label">{{ $t(inputLabel)}}</label>
        <div :class="customInnerClass || 'col-sm-12  col-lg-9'">
            <treeselect :multiple="multiple"
                        :options="options"
                        :placeholder="$t(placeholder)"
                        :name="name"
                        :clearable="clearable"
                        @input="grabinput"
                        :instanceId="instanceId"
                        :searchable="searchable"
                        :valueConsistsOf="valueConsistsOf"
                        :valueFormat="valueFormat"
                        :value="value"
                        :flat="flat"
                        :alwaysOpen="alwaysOpen"
            />
            <div v-if="errors" class="text-danger">
                {{ errors }}
            </div>
        </div>
    </div>
</template>

<script>
    import treeSelect from "./script";
    export default treeSelect;

</script>

<style type="text/css" lang="scss">
    .vue-treeselect__control{
        height: 40px;
    }

</style>    

