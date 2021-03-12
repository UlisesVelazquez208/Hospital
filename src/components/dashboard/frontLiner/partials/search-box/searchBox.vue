<template>
    <component-container title="Home.Search" class="search">
        <div class="row">
            <div class="col-lg-12">
                <form @submit.stop.prevent="onSubmit()" class="row">
                    <div class="col-lg-6 col-md-6 pr-0">
                        <div class="search-input-container">
                            <div class="search-icon">
                                <span><i class="fa fa-search"></i></span>
                            </div>
                            <input
                                type="text"
                                class="form-control form-control-lg"
                                name="keyword"
                                id="keyword"
                                placeholder=""
                                v-model="keyword"
                            />
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-2">
                        <button @click.stop.prevent="onSubmit()" type="submit" class="btn btn-search btn-lg" value="Search">
                            <span><i class="fa fa-filter"></i> {{ $t('Home.Search') }}</span>
                        </button>
                    </div>
                    <div class="col-lg-4 col-md-4 pl-0">
                        <tree-select v-if="searchOption !== 'directories'" name="country" placeholder="Home.SearchByCountry" instanceId="country"
                            :options="this.$store.state.countries"
                            :multiple="true"
                            :clearable="true"
                            :searchable="true"
                            :customInnerClass="'col-md-12'"
                            inputLabel=""
                            valueConsistsOf="LEAF_PRIORITY"
                            class="custom-dropdown-filter-by-country"
                        />
                        <tree-select v-if="searchOption === 'directories'" name="country" placeholder="Home.SearchByCountry" instanceId="country"
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

                    <div class="col-lg-6 col-md-6 row p-0 m-0 align-items-center">
                        <div class="col-lg-4 col-md-4 d-flex justify-content-center">
                            <label class="label-container">{{ $t('Home.FAQ') }}
                                <input type="radio" v-model="searchOption" name="searchOption" value="faq" id="faq">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                        <div class="col-lg-4 col-md-4 d-flex justify-content-center">
                            <label class="label-container">{{ $t('Home.Directory') }}
                                <input type="radio" v-model="searchOption" name="searchOption" value="directories" id="directories">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                        <div class="col-lg-4 col-md-4 d-flex justify-content-center">
                            <label class="label-container">{{ $t('Home.Media') }}
                                <input type="radio" v-model="searchOption" name="searchOption" value="media" id="media">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </component-container>
</template>
<script>
    import searchBox from "./search-script";

    export default searchBox;
</script>



<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">
    .btn-search {
        font-size: 15px;
        padding: 7px 0px !important;
        background-color: #F9F9F9 !important;
        color: #0072BC !important;
        border-color: #0072BC !important;
        width: 100%;
    }
    .btn-search:hover {
        color: #F9F9F9 !important;
        background-color: #0072BC !important;
    }

    .form-label {
        font-size: 14px;
    }

    /* Customize the label (the container) */
    .label-container {
        display: block;
        position: relative;
        padding-left: 25px;
        margin-bottom: 0px;
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
