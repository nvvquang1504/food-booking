import {elements} from "./base";
import * as searchView from './searchView'

export const renderLike = (item) => {
    const markup = `<li>
    <a class="likes__link" href="#${item.id}">
        <figure class="likes__fig">
            <img src="${item.img}" alt="Test">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${searchView.limitRecipeTitle(item.title) }</h4>
            <p class="likes__author">${item.author}</p>
        </div>
    </a>
</li>
    `
    document.querySelector('.likes__list').insertAdjacentHTML('afterbegin',markup);
}
export const deleteLike = (id) => {
    const element = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (element) {
        element.parentElement.removeChild(element);
    }

}

// export const toggleLikeBtn = (isLiked) => {
//     const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
//     console.log(document.querySelector('.recipe__love use'))
//     document.querySelector('.recipe__love use').setAttribute('href', `./img/icons.svg#${iconString}`)
//     // document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#icon-heart`)
//
// }
export const toggleLikeMenu = (numLikes) => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}