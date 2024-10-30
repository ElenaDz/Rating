// fixme почему здесь все методы public? исправь на private все которые можно ok
// fixme бардак с именами методов и переменных Смотри, думай, переименовывай Главное имя в этом классе это data
//  именно с ним ты работаешь, оно взялось из RatingStoreData и убранным из этого имени имени этого класса
class RatingStore
{
    static KEY_LOCAL_STORE = 'rating_store_data';

    // fixme такой jsdoc с объявлением типа return не понимает phpstorm, так как это ts можно обойтись без jsdoc
    //  добавь : RatingStoreData[] в строке объявления имени фукнции чтобы объявить тип возвращаемого знания ok
    private static getRating(): RatingStoreData[]
    {
        return JSON.parse(localStorage.getItem(RatingStore.KEY_LOCAL_STORE)) || [];
    }

    private static setRating(rating_data, id, rating_my)
    {
        let list_ratings = [];

        rating_data.forEach((/** Rating */rating_store) =>
        {
            if (rating_store.id === id){
                rating_store = this.getMapRating(rating_my, rating_store.id)

            }

            list_ratings.push(rating_store);
        });

        localStorage.setItem(
            RatingStore.KEY_LOCAL_STORE,
            JSON.stringify(list_ratings)
        );
    }

    public static getRatingMeForId(id)
    {
        let rating_my;
        let rating_data = RatingStore.getRating();

        rating_data.forEach((/** RatingStoreData */ rating_store) =>
        {
            if (rating_store.id === id) {
                rating_my = rating_store.rating_my;
            }
        })
        return rating_my;
    }

    public static setRatingMeForId(id, rating_my)
    {
        let rating_data = this.getRating();

        if ( ! this.hesRatingForId(id))
        {
            rating_data.push(RatingStore.getMapRating(rating_my, id));

            this.setRating(rating_data, id, rating_my);

        } else {
            rating_data.forEach((/** RatingStoreData */ rating_store) =>
            {
                if (rating_store.id === id) {
                    rating_store.rating_my = rating_my;
                }
            })

            this.setRating(rating_data, id, rating_my);
        }
    }

    private static hesRatingForId(id)
    {
        let rating_data = this.getRating();

        return ! rating_data.find( (rating_store) => rating_store.id === id ) === false;
    }

    /**
     * @returns {RatingStoreData}
     */
    private static getMapRating(rating_my = 0, id )
    {
        let rating_store_data = new RatingStoreData();

        rating_store_data.rating_my = rating_my;
        rating_store_data.id = id;

        return rating_store_data;
    }
}