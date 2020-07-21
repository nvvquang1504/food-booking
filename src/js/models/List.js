import uniqid from 'uniqid'

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid('item-'),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        // console.log(this.items)
        return item

    }

    deleteItem(id) {
        const index = this.items.findIndex((el) => {
            el.id === id
        })
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        let element = this.items.find((el) => {
            return el.id === id;
        })
        element.count = newCount;
    }
}
