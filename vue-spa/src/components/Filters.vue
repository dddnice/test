<template>
    <div class="filters">
        <input type="text" class="filters__search" placeholder="Начните что-то вводить..." @keyup="searchQuery()" v-model="query" />
        <div class="filters__categories">
            <label>
                <input type="checkbox" id="c_image" value="image" v-model="categories" @change="categoryQuery" />
                Image
            </label>
            <label>
                <input type="checkbox" id="c_video" value="video" v-model="categories" @change="categoryQuery" />
                Video
            </label>
            <label>
                <input type="checkbox" id="c_text" value="text" v-model="categories" @change="categoryQuery" />
                Text
            </label>
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
