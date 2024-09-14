class RatingStore
{
    static EVENT_UPDATE = 'RatingStore.EVENT_UPDATE';

    // fixme Откуда взялась camelCase, когда для свойст у нас везде under_score
    static keyLocalStore = 'vote';

    // fixme указать тип возвращаемого значения
    static getRating()
    {
        return JSON.parse(localStorage.getItem(RatingStore.keyLocalStore)) || [this.getMapRating()];
    }

    static setRating(stars, flag, rating = 0, count_votes = 0)
    {
        // fixme почему здесь массив, разве может быть несколько оценок пользователя, нет не может, значит не должно быть массива
        let list_rating_store_array = [];

        let rating_store_array = this.getMapRating(stars, rating, count_votes, flag);

        list_rating_store_array.push(rating_store_array);

        localStorage.setItem(
            RatingStore.keyLocalStore,
            JSON.stringify(list_rating_store_array)
        );

        $('body').trigger(RatingStore.EVENT_UPDATE);
    }

    // fixme я создал новый объект который с именем и явным объявлением в виде отдельного класса это позволит тебе избавиться
    //  от анонимного объекта который ты здесь создаешь Используй его и переименуй все связанные переменные на это новое имя
    /**
     * @returns {RatingStoreData}
     */
    static getMapRating(stars = null, rating = 0, count_votes = 0, flag = false) {
        // fixme переформатируй, одна строка - одно значение, убрать ковычики они не нужны
        // fixme имя flag плохая нужно написать что именно за флаг это
        return {'stars': stars, 'rating': rating, 'count_votes': count_votes, 'flag': flag}
    }
}