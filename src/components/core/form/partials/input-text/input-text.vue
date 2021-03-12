<template>
    <div class="form-group row">
        <label v-if="inputLabel" :for="inputId" :class="inputLabelClass">{{$t(inputLabel)}}</label>
        <div :class="inputWrapClass">
            <input @input="grabinput($event.target.value)" :type="type" :name="name"
                   :class="inputClass" class="form-control input-field" :id="inputId" :disabled="disabled"
                   :placeholder="$t(placeholder)" :required="required" :value="value" :readonly="readOnly"
                   @keyup="clearError"
            >
            <div v-if="errors" class="text-danger">
                {{ errors }}
            </div>
        </div>
    </div>
</template>

<script>
    import inputText from "./script";
    export default inputText;

</script>

<style type="text/css" lang="scss">
    .input-text-label {
        /*display: inline-block;*/
        /*width: 140px;*/
        /*text-align: right;*/
    }
    .input-field{
        height: 40px;
    }
    .col-form-label{
        /*font-weight: bold;*/
        color: rgba(1, 0, 0, 0.65);
    }

</style>

