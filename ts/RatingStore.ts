
class RatingStore
{
    static KEY_LOCAL_STORE = 'rating_store_data';


    private static getRating(): RatingStoreData[]
    {
        return JSON.parse(localStorage.getItem(RatingStore.KEY_LOCAL_STORE)) || [];
    }

    private static setRating(data, id, rating_my)
    {
        let data_list = [];

        data.forEach((/** Rating */data_store) =>
        {
            if (data_store.id === id){
                data_store = this.getDataMap(rating_my, data_store.id)

            }

            data_list.push(data_store);
        });

        localStorage.setItem(
            RatingStore.KEY_LOCAL_STORE,
            JSON.stringify(data_list)
        );
    }

    public static getRatingMeForId(id)
    {
        let rating_my;
        let data= RatingStore.getRating();

        data.forEach((/** RatingStoreData */ data_store) =>
        {
            if (data_store.id === id) {
                rating_my = data_store.rating_my;
            }
        })
        return rating_my;
    }

    // Это название не меняла, ты его предложил
    public static setRatingMeForId(id, rating_my)
    {
        let data = this.getRating();

        if ( ! this.hesRatingForId(id))
        {
            data.push(RatingStore.getDataMap(rating_my, id));

            this.setRating(data, id, rating_my);

        } else {
            data.forEach((/** RatingStoreData */ data_store) =>
            {
                if (data_store.id === id) {
                    data_store.rating_my = rating_my;
                }
            })

            this.setRating(data, id, rating_my);
        }
    }

    private static hesRatingForId(id)
    {
        let data = this.getRating();

        return ! data.find( (data_store) => data_store.id === id ) === false;
    }

    private static getDataMap(rating_my = 0, id ): RatingStoreData
    {
        let data_store = new RatingStoreData();

        data_store.rating_my = rating_my;
        data_store.id = id;

        return data_store;
    }
}