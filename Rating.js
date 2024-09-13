class Rating
{
    /**
     * @param {JQuery} $context
     */

    /** @type {RatingText} rating_text */
    rating_text;

    constructor($context) {

        this.$context = $context;

        if (this.$context[0].Rating) return;

        this.$context[0].Rating = this;

        this.rating_text = RatingText.create(this.$context);

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

        let rating_data = RatingStore.getRating()[0];

        let initial_rating = rating_data.flag ? rating_data.stars : rating_data.rating;

        rating.barrating('set', initial_rating);

        this.build();

        rating.barrating('show', {
            theme: 'css-stars',
            initialRating:parseInt(rating_data.stars) || parseInt(rating_data.rating),
            onSelect: (value, text, event) => this.onRatingSelect(value, event)
        })
    }

    onRatingSelect(value, event) {

        if (typeof (event) !== 'undefined') {
            let rating_data = RatingStore.getRating()[0];

            if (rating_data.rating === 0) {

                RatingStore.setRating(value, true, value, 1)
            } else {

                let new_rating = this.calculateNewRating(value, rating_data);
                let new_vote_count = rating_data.flag ? rating_data.count_votes : rating_data.count_votes + 1;

                RatingStore.setRating(value, true, new_rating, new_vote_count);
            }

            this.showRatingText();
        }
    }

    calculateNewRating(value, rating_data) {
        let totalVotes = rating_data.count_votes;
        let currentRating = rating_data.rating * totalVotes;

        if (rating_data.flag) {
            return (((currentRating - rating_data.stars + parseInt(value)) / totalVotes).toFixed(1));
        } else {
            return (((currentRating + parseInt(value)) / (totalVotes + 1)).toFixed(1));
        }
    }


    build() {
        let rating_data = RatingStore.getRating()[0];

        if (rating_data.rating != 0) {
            this.showRatingText();
        }

        if (rating_data.stars != 'null') {
            this.$context.find('.inner_your_voice').removeClass('hide');
        }
        this.rating_text.yourVoice = rating_data.stars;
        this.rating_text.rating = rating_data.rating;
        this.rating_text.countVotes = rating_data.count_votes;
    }

    showRatingText() {
        this.$context.find('.b_text').removeClass('hide');
    }


    static create($context) {
        let $ratings = $context;
        let ratings = [];
        $ratings.each((index, element) => {
            let rating = $(element);
            ratings.push(new Rating(rating));
        })
        return ratings;
    }
}