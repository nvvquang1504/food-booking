import Axios from "axios";

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await Axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert(error)
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']
        const units = [...unitsShort, 'kg', 'g'];
        const newIngredients = this.ingredients.map((el) => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, units[index])
            })
            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, "  ")
            // 3) Parse into object {count, unit, ingredient}
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex((el2) => {
                return unitsShort.includes(el2);
            })
            let objIng = {};
            if (unitIndex > -1) {
                //There is having a unit
                const arrCount = arrIng.slice(0, unitIndex)
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrCount[0].replace('-', '+'))
                } else {
                    count = eval(arrCount.slice(0).join('+'))
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(arrIng[0], 10)) {
                //There is NO unit BUT 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' '),
                }
            } else if (unitIndex === -1) {
                // NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            // console.log(objIng)
            return objIng;
        })
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1
        this.ingredients.forEach((ing) => {
            return ing.count = ing.count * (newServings / this.servings)
        })
        this.servings = newServings;
    }
}