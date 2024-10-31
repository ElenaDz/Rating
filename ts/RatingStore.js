class RatingStore {
    // fixme items у нас больше нет поэтому придется избавиться от этого слова Остались rating_my во множественном числе ratings_my ok
    static getRatingsMy() {
        return JSON.parse(localStorage.getItem(RatingStore.KEY_LOCAL_STORE)) || {};
    }
    static setRatingsMy(ratings_my) {
        localStorage.setItem(RatingStore.KEY_LOCAL_STORE, JSON.stringify(ratings_my));
    }
    // fixme ForRatingId можно убрать так как других вариантов получения просто нет 0k
    static getRatingMy(rating_id) {
        let ratings_my = RatingStore.getRatingsMy();
        // fixme формирование имени свойства дублируется нужно вынести в функцию чтобы не было дублирования ok
        return ratings_my[RatingStore.getKeyRatingMy(rating_id)];
    }
    static setRatingMy(rating_id, rating_my) {
        let ratings_my = this.getRatingsMy();
        // @ts-ignore
        ratings_my[RatingStore.getKeyRatingMy(rating_id)] = rating_my;
        this.setRatingsMy(ratings_my);
    }
    static getKeyRatingMy(rating_id) {
        return RatingStore.PREFIX_ID + rating_id;
    }
}
// fixme rating_store_data больше не соответствует действительности теперь это rating_store_ratings_my ok
RatingStore.KEY_LOCAL_STORE = 'rating_store_ratings_my';
RatingStore.PREFIX_ID = 'id_';
