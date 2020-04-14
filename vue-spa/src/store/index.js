import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        news: [{
            title: 'Это видео взорвало интернет',
            category: 'video'
        },{
            title: 'Эта новость шокировала всех',
            category: 'text'
        },{
            title: 'Этот котик не оставит равнодушным',
            category: 'image'
        },{
            title: 'Каскадер выполнил что-то невообразимое',
            category: 'video'
        },{
            title: 'МОЛНИЯ! Спекулянты взвинтили цены на укроп',
            category: 'text'
        },{
            title: 'Каким будет Angular 24? Все нововведения в одной картинке!',
            category: 'image'
        }],
        searchParams: {
            filterByCategory: '',
            filterByName: ''
        }
    },

    getters: {
        getNews(state) {

            return state.news.filter((x) => {
                if (state.searchParams.filterByCategory.length) {
                    return x.title.match(state.searchParams.filterByName) && state.searchParams.filterByCategory.indexOf( x.category ) !== -1;
                } else {
                    return x.title.match(state.searchParams.filterByName);
                }

            });

        }
    },

    mutations: {
        setFilterByNames(state, text) {
            state.searchParams.filterByName = text;
        },

        setFilterByCats(state, cats) {
            state.searchParams.filterByCategory = cats;
        },
    },

    actions: {

        searchByText({commit}, text) {
            commit('setFilterByNames', text);
        },

        searchByCat({commit}, cats) {
            commit('setFilterByCats', cats);
        }

    }
});

export default store;
