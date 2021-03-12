class AbstractFilters {

    constructor() {
        this.init();
    }

    init(){
        this.pagination = 0;
        this.per_page = 10;
        this.sorting = [];
        this.with = [];
        this.conditions = [];
        this.with_conditions = [];
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

    addCondition(condition,value) {
        let newKey = 'conditions['+condition+']';
        this.conditions[newKey] = value;
    }

    reset(key){
        key = key || '';

        if(!key){
            this.init();
        }else{
            this[key] = [];
        }
    }

    getConditions()
    {
        return this.conditions;
    }

    addWith(value){
        let length = Object.keys(this.with).length ? Object.keys(this.with).length : 0;

        let arr = [], row;

        for(row in this.with){
            arr.push(this.with[row])
        }

        if(!arr.includes(value)){
            this.with['with['+length+']'] = value;
        }
    }

    getWith(){
        return this.with;
    }

    addWithCondition(wwith, key,condition) {
        if(this.with.includes(wwith)){
            this.with.push(wwith);
        }

        var newKey = 'with_conditions['+wwith+']['+key+']';

        this.with_conditions[newKey] = condition;
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

    serialize(obj){
        let row, string =[];

        for(let i in obj){
            row = obj[i];
            if(typeof row === 'string'){
                string.push(i + '=' + row);
            }else{
                string.push(this.serialize(row))
            }
        }

        return string.join('&');
    }

    merge() {
        let query = [];

        query.push(this.serialize(this.getWith()));
        query.push(this.serialize(this.getConditions()));
        query.push(this.serialize(this.getWithConditions()));
        query.push(this.serialize(this.getSorting()));
        if(this.pagination) {
            query.push('per_page' + '=' + this.getPerPage());
            query.push('page' + '=' + this.getPagination());
        } else {
            query.push('paginate=0');
        }

        return this.clean(query).join('&');
    }

    clean(actual) {
        var newArray = new Array();
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    };
}

export default AbstractFilters;
