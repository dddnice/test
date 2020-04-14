<template>
    <div class="filters">
        <input type="text" class="filters__search" placeholder="Начните что-то вводить..." @keyup="searchQuery()" v-model="query" />
        <div class="filters__categories">
            <div>Categories:</div>
            <div>
                <label v-for="(item, index) in newsCategories" :key="index" class="checkbox">
                    <input type="checkbox" v-bind:id="'c_' + item" v-bind:value="item" v-model="categories" @change="categoryQuery" />
                    <span></span>
                    {{item}}
                </label>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                query: "",
                categories: []
            }
        },

        computed: {
            newsCategories() {
                return this.$store.getters.getCategories;
            }
        },

        methods: {
            searchQuery: function () {
                this.$store.dispatch('searchByText', this.query);
            },

            categoryQuery: function () {
                this.$store.dispatch('searchByCat', this.categories);
            }
        }
    }
</script>

<style lang="scss">
    .filters {
        background: #ffffff;
        margin: 0 0 30px;
        padding: 20px;

        &__categories {
            padding: 10px;
            border: 1px #eee solid;
            display: flex;

            label {
                text-transform: capitalize;
                margin: 0 10px;

                @media screen and (max-width: 860px) {
                    display: block;
                }
            }
        }

        &__search {
            display: block;
            padding: 10px;
            border: 1px #eee solid;
            width: 100%;
            margin: 0 0 10px;
            font-size: 16px;
        }

        &__search::placeholder {
            font-style: italic;
        }
    }
</style>
