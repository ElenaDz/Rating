class Rating
{
    static  EVENT_RATING_SELECT = 'Rating.EVENT_RATING_SELECT';
    static  EVENT_RATING_INIT = 'Rating.EVENT_RATING_INIT';
    static  EVENT_RE_SELECT = 'Rating.EVENT_RE_SELECT';

    /** @type {JQuery} $rating */
    rating;

    /** @type {JQuery} $context */
    $context;

    /**
     * @param {JQuery} $context
     */
    constructor($context)
    {
        this.$context = $context;

        if (this.$context[0].Rating) return;

        this.$context[0].Rating = this;

        RatingText.create(this.$context);

        this.initRating();

        this.eventReSelect();
    }
    
    initRating() {

        this.$context.find('.text').data('id', this.id_rating);
        this.$context.find('.rating_all').text(this.data_rating);
        this.$context.find('.count_votes').text(this.data_count_votes);

        this.$context.find('.text').trigger(Rating.EVENT_RATING_INIT);

        this.rating = this.$context.find('select[name="rating"]').first();

        let rating_data = RatingStore.getRating();

        if (!rating_data){
            this.configureRatingWidget( 0);
            return;
        }

        rating_data.forEach((/** RatingStoreData */ rating_store) =>
        {
            if (rating_store.id_rating === this.id_rating) {
                let initial_rating = rating_store.stars ||  this.data_rating;

                this.rating.barrating('set', initial_rating);

                this.configureRatingWidget( initial_rating);

            } else {

                this.configureRatingWidget( this.data_rating);
            }
        });
    }

    // Метод проставляет звезду, в случае повторного выбора той же звезды
    // При повторном нажатии той же звезда, звёзды исчезали
    eventReSelect()
    {
        this.$context.on(Rating.EVENT_RE_SELECT, () =>
        {
            let rating_data = RatingStore.getRating();

            rating_data.forEach((/** RatingStoreData */ rating_store) =>
            {
                if (rating_store.id_rating === this.id_rating) {
                    this.rating.barrating('set', rating_store.stars || Math.floor(this.data_rating));
                }
            })
        })
    }

    configureRatingWidget(initialRating)
    {
        this.rating.barrating('show', {
            theme: 'css-stars',
            initialRating: parseFloat(initialRating) || this.data_rating,
            onSelect: (value, text, event) => {
                this.onRatingSelect(value, event);
            }
        });
    }

    onRatingSelect(value, event)
    {
        if (typeof (event) === 'undefined') return;

        let rating_data = RatingStore.getRating();

        rating_data.forEach((/** RatingStoreData */ rating_store) =>
        {
            if (rating_store.id_rating === this.id_rating)
            {
                if ( ! value) {
                    this.$context.trigger(Rating.EVENT_RE_SELECT)
                    value =  rating_store.stars || Math.floor(this.data_rating)
                }

                rating_store.stars = value;
            }
        })

        RatingStore.setRating(rating_data, this.id_rating, value);

        this.$context.find('.text').trigger(Rating.EVENT_RATING_SELECT);
    }

    // fixme мы находимся в классе rating зачем здесь слово rating? убрать
    get id_rating() {
        return this.$context.attr('id');
    }

    get data_rating() {
        return parseFloat(this.$context.data('rating')) || 0;
    }

    // todo не хватает getter и setter для моей оценки Я их создал Напиши реализацию Работать с localStore
    //  можно только внутри этих двух методов во всех остальных местах обращение к localStore необходимо убрать
    //  то как сделано сейчас очень сложно я пытаюсь понять что ты сделала и не понимаю, хотя там должно быть все
    //  элементарно и будет элементарно когда появляться это свойство
    get rating_my() {

    }

    set rating_my(rating) {

    }


    // fixme это не data count votes это просто count votes Сейчас мы храним их в data атрибуте, потом передумаем
    //  и будем хранить в другом месте, это не как не должно влиять на имя свойства по которому мы получаем количество
    //  проголосовавших Тоже самое касается свойства data_rating
    get data_count_votes() {
        return this.$context.data('count_votes') || 0;
    }


    /**
     * @param $context
     * @returns {Rating[]}
     */
    static create($context = $('.b_rating'))
    {
        let $ratings = $context;
        /** @type {Rating[]} */
        let ratings = [];
        $ratings.each((index, element) => {
            let rating = $(element);
            ratings.push(new Rating(rating));
        })

        if ( ! RatingStore.getRating()) RatingStore.setRating(ratings);

        return ratings;
    }
}