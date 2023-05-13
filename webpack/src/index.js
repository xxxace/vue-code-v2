import Vue from 'vue';

console.log('index.js')

const app = new Vue({
    el: '#app',
    data() {
        return {
            name: 'ace',
            info: { age: 18 },
            cars: ['BMW']
        }
    }
});

console.log(app, app.name)

app.info.age = 26
app.info.gender = '男'
app.name = 'a_ce'

app.cars.push({
    name: 'Lamborghini',
    color: 'siliver'
})

console.log(app.cars)