class Rating
{
    static  EVENT_CHANGE_TEXT = 'Rating.EVENT_CHANGE_TEXT';

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
        this.bindEvents();
    }

    bindEvents() {
        $('body').on(RatingStore.EVENT_UPDATE, () =>
        {
            this.build();
        })
    }

    initRating() {
        let rating = this.$context.find('select[name="rating"]').first();

        let rating_data = RatingStore.getRating();

        let initial_rating = rating_data.has_your_voice ? rating_data.stars : rating_data.rating;

        rating.barrating('set', initial_rating);

        this.build();

        rating.barrating('show', {
            theme: 'css-stars',
            initialRating: parseInt(rating_data.stars) || parseInt(rating_data.rating),
            onSelect: (value, text, event) => {
                this.onRatingSelect(value, event)
            }
        })
    }

    onRatingSelect(value, event)
    {
        if (typeof (event) === 'undefined') return;

        let rating_data = RatingStore.getRating();

        if (rating_data.rating === 0) {
            RatingStore.setRating(value, true, value, 1);

        } else {
            let new_rating = this.calculateNewRating(value, rating_data);

            let new_vote_count = rating_data.has_your_voice ? rating_data.count_votes : rating_data.count_votes + 1;

            RatingStore.setRating(value, true, new_rating.toFixed(1), new_vote_count);
        }

        this.showRatingText();
    }

    calculateNewRating(value, rating_data)
    {
        let count_votes = rating_data.count_votes;
        let sum_rating = rating_data.rating * count_votes;

        return rating_data.has_your_voice
            ? (((sum_rating - rating_data.stars + parseInt(value)) / count_votes))
            : (((sum_rating + parseInt(value)) / (count_votes + 1)));
    }

    build() {
        let rating_data = RatingStore.getRating();

        if (rating_data.rating !== 0) {
            this.showRatingText();
        }

        if (rating_data.has_your_voice) {
            this.$context.find('.inner_your_voice').removeClass('hide');
        }

        $('body').trigger(Rating.EVENT_CHANGE_TEXT);
    }

    showRatingText() {
        this.$context.find('.b_text').removeClass('hide');
    }

    /**
     * @param $context
     * @returns {Rating[]}
     */
    static create($context) {
        let $ratings = $context;
        /** @type {Rating[]} */
        let ratings = [];
        $ratings.each((index, element) => {
            let rating = $(element);
            ratings.push(new Rating(rating));
        })
        return ratings;
    }
}