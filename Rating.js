class Rating
{
    static  EVENT_RATING_SELECT = 'Rating.EVENT_RATING_SELECT';
    static  EVENT_RATING_INIT = 'Rating.EVENT_RATING_INIT';

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
    }
    
    initRating() {

        this.$context.find('.b_text').data('id', this.id_rating)

        this.$context.find('.b_text').trigger(Rating.EVENT_RATING_INIT);

        let rating = this.$context.find('select[name="rating"]').first();

        let rating_data = RatingStore.getRating();

        if (!rating_data){
            this.configureRatingWidget(rating, 0);
            return;
        }

        rating_data.forEach((/** RatingStoreData */ rating_store) =>
        {
            if (rating_store.id_rating === this.id_rating) {
                let initial_rating = rating_store.has_your_voice ? rating_store.stars : this.getValueRating();

                rating.barrating('set', initial_rating);

                this.configureRatingWidget(rating, initial_rating);

            } else {
                this.configureRatingWidget(rating, this.getValueRating());

            }
        });
    }

    getValueRating() {
        return parseFloat(this.$context.find('.rating_all').text()) || 0 ;
    }

    configureRatingWidget(rating, initialRating) {
        rating.barrating('show', {
            theme: 'css-stars',
            initialRating: parseFloat(initialRating) || this.getValueRating(),
            onSelect: (value, text, event) => {
                this.onRatingSelect(value, event);
            }
        });
    }

    onRatingSelect(value, event)
    {
        if (!value) return;
        if (typeof (event) === 'undefined') return;

        this.$context.find('.your_voice').text(value);

        this.$context.find('.b_text').trigger(Rating.EVENT_RATING_SELECT);
    }

    get id_rating() {
        return this.$context.attr('id');
    }

    /**
     * @param $context
     * @returns {Rating[]}
     */
    static create($context = $('.b_rating')) {
        let $ratings = $context;
        /** @type {Rating[]} */
        let ratings = [];
        $ratings.each((index, element) => {
            let rating = $(element);
            ratings.push(new Rating(rating));
        })

        if (!RatingStore.getRating()) RatingStore.setRating(ratings);
        return ratings;
    }
}