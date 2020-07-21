export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLikeItem(id, title, author, img) {
        const like = {id, title, author, img}
        this.likes.push(like);

        // Set to localStorage
        this.presistData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex((el) => {
            return el.id === id;
        })
        this.likes.splice(index, 1);
        this.presistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    presistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorageData() {
        const storageLikes = JSON.parse(localStorage.getItem('likes'))
        if (storageLikes) this.likes = storageLikes;
    }
}