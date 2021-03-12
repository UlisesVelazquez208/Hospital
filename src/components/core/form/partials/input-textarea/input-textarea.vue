<template>
    <div class="form-group row">
        <label v-if="inputLabel" :for="inputId" class="col-sm-12  col-lg-3 col-form-label">{{$t(inputLabel)}}</label>
        <div class="col-sm-12  col-lg-9">
            <textarea @input="grabinput($event.target.value)" :rows="row" :name="name" :class="inputClass"
                      class="form-control" :id="inputId" :value="value"
                      :placeholder="$t(placeholder)" :required="required" @keyup="clearError">
                {{value}}
            </textarea>
            <div v-if="errors" class="text-danger">
                {{ errors }}
            </div>
        </div>
    </div>
</template>

<script>
    import inputTextarea from "./script";

    export default inputTextarea;
</script>

<style type="text/css" lang="scss">

</style>    

