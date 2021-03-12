<template>
    <div class="checkbox" :class="inputClass">
        <label class="custom-control custom-checkbox">
            <input @input="grabInput($event.target)" type="checkbox" :name="name" autocomplete="off" true-value="true"
                   class="custom-control-input"
                    :value="value" v-model="val">
            <span aria-hidden="true" class="custom-control-indicator"></span>
            <span class="custom-control-description">
            {{$t(inputLabel)}}
          </span>
        </label>
        <div v-if="errors" class="text-danger">
            {{ errors }}
        </div>
    </div>
</template>

<script>
    import inputCheckbox from "./script";

    export default inputCheckbox;
</script>

<style type="text/css" lang="scss" scoped>
    label {
        font-size: 16px !important;
        font-family: Helvetica;
    }
</style>    

