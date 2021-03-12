<template>
    <component-container title="Search" class="search">
        <div class="row m-0 p-0">
            <div class="col-lg-12 p-0 mx-auto">
                <form @submit.stop.prevent="onSubmit()">
                    <div class="form-group row m-0 p-0 d-flex align-items-center">
                        <div class="col-lg-6 col-md-6 p-0">
                            <div class="search-input-container">
                                <div class="search-icon">
                                    <span><i class="fa fa-search"></i></span>
                                </div>
                                <input type="text" v-model="keyword" class="form-control" name="keyword" placeholder="Enter Keyword Here" id="keyword" />
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-2">
                            <button @click.stop.prevent="onSubmit()" type="submit" class="btn btn-search btn-search-custom" value="Search">
                                <span><i class="fa fa-filter"></i> Search</span>
                            </button>
                        </div>
                        <div class="col-lg-4 col-md-4 pl-0">
                            <tree-select v-if="theSection !== 'directories'" name="country" placeholder="Home.SearchByCountry" instanceId="country"
                                :options="this.$store.state.countries"
                                :multiple="true"
                                :clearable="true"
                                :searchable="true"
                                :value="countryIds"
                                :customInnerClass="'col-md-12'"
                                inputLabel=""
                                valueConsistsOf="LEAF_PRIORITY"
                                class="custom-dropdown-filter-by-country"
                            />
                            <tree-select v-if="theSection === 'directories'" name="country" placeholder="Home.SearchByCountry" instanceId="country"
                                :options="countryOptions"
                                :multiple="true"
                                :clearable="true"
                                :searchable="true"
                                :value="countrySelect"
                                :customInnerClass="'col-md-12'"
                                inputLabel=""
                                valueConsistsOf="LEAF_PRIORITY"
                                class="custom-dropdown-filter-by-country"
                            />
                        </div>

                        <div class="col-lg-6 col-md-6 p-0 mt-3">
                            <div class="row d-flex align-items-center">
                                <div class="col-lg-4 col-md-4 d-flex justify-content-center">
                                    <label class="label-container">FAQ
                                        <input type="radio" v-model="searchSection" name="searchOption" value="faq" id="faq" :click="changeSection()">
                                        <span class="checkmark"></span>
                                    </label>
                                </div>
                                <div class="col-lg-4 col-md-4 d-flex justify-content-center">
                                    <label class="label-container">Directory
                                        <input type="radio" v-model="searchSection" name="searchOption" value="directories" id="directories" :click="changeSection()">
                                        <span class="checkmark"></span>
                                    </label>
                                </div>
                                <div class="col-lg-4 col-md-4 d-flex justify-content-center">
                                    <label class="label-container">Media
                                        <input type="radio" v-model="searchSection" name="searchOption" value="media" id="media" :click="changeSection()">
                                        <span class="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </component-container>
</template>
<script>
import smallSearchBox from './small-search-box.js';
export default smallSearchBox;
</script>
<style>
    .btn-search {
        font-size: 14px;
        background-color: #F9F9F9 !important;
        color: #0072BC !important;
        border-color: #0072BC !important;
    }
    .btn-search:hover {
        color: #F9F9F9 !important;
        background-color: #0072BC !important;
    }
    .btn-search-custom {
        padding: 7px 0px !important;
    }

    .form-label {
        font-size: 14px;
    }

    /* Customize the label (the container) */
    .label-container {
        display: block;
        position: relative;
        padding-left: 25px;
        margin-bottom: 0px !important;
        cursor: pointer;
        font-size: 14px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-weight: bold;
        color: rgba(1, 0, 0, 0.65);
    }

    /* Hide the browser's default radio button */
    .label-container input {
        position: absolute;
        opacity: 0;
    }

    /* Create a custom radio button */
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 20px;
        background-color: #eee;
        border-radius: 50%;
    }

    /* On mouse-over, add a grey background color */
    .label-container:hover input ~ .checkmark {
        background-color: #ccc;
    }

    /* When the radio button is checked, add a blue background */
    .label-container input:checked ~ .checkmark {
        background-color: #414242;
    }

    /* Create the indicator (the dot/circle - hidden when not checked) */
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the indicator (dot/circle) when checked */
    .label-container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the indicator (dot/circle) */
    .label-container .checkmark:after {
        top: 6px;
        left: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
    }

    .form-label {
        font-weight: bold;
        color: rgba(1, 0, 0, 0.65);
    }

</style>