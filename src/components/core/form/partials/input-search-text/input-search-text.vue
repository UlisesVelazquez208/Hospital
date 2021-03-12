<template>
    <div class="form-group row">
        <label v-if="inputLabel" :for="inputId" class="col-sm-12  col-lg-3 col-form-label">{{ $t(inputLabel) }}</label>
        <div class="col-sm-12  col-lg-9">
            <div class="search-input-container">
                <div class="search-icon">
                    <span><i class="fa fa-search"></i></span>
                </div>
                <input
                    :id="inputId"
                    :name="name"
                    type="text"
                    class="form-control input-field"
                    :class="inputClass"
                    :required="required"
                    :placeholder="$t(placeholder)"
                    :value="value"
                    :disabled="disabled"
                    @input="grabInput"
                    @keyup="clearError"
                >
                <div v-if="errors" class="text-danger">
                    {{ errors }}
                </div>
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

