class AbstractFiltersForEs {

    constructor() {
        this.init();
    }

    init(){
        this.pagination = 0;
        this.per_page = 10;
        this.sorting = [];
        this.with = [];
        this.conditions = '';
        this.with_conditions = {};
        this.custom_conditions = [];
    }

    setPagination(pagination) {
        this.pagination = pagination
    }

    getPagination() {
        return this.pagination;
    }

    setPerPage(per_page) {
        this.per_page = per_page
    }

    getPerPage() {
        return this.per_page;
    }

    addSorting(column,sortType) {

        let newKey = 'sorting['+column+']';

        this.sorting[newKey] = sortType;
    }

    getSorting()
    {
        return this.sorting;
    }

    addCondition(condition) {
        this.conditions = condition;
    }

    getConditions()
    {
        return this.conditions;
    }

    addWith(key){
        this.with.push(key);
    }

    getWith(){
        return this.with;
    }

    addWithCondition(key, condition) {
        this.with_conditions[key] = condition;
    }

    getWithConditions()
    {
        return this.with_conditions;
    }

    addCustomConditions(key, condition)
    {
        this.custom_conditions[key] = condition;
    }

    getCustomConditions() {
        return this.custom_conditions;
    }

    reset(key, defaultValue){
        key = key || '';

        if(!key){
            this.init();
        }else{
            this[key] = defaultValue;
        }
    }
}

export default AbstractFiltersForEs;
