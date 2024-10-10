class RatingText {
    /**
     * @param {JQuery} $context
     */
    constructor($context) {
        this.$context = $context;

        this.bindEvents();
    }


    bindEvents() {

        this.eventRatingInit();

        this.eventRatingSelect();
    }

    eventRatingInit() {
        this.$context.on(Rating.EVENT_RATING_INIT, () =>
        {
            if (!this.rating === false) {
                this.showRatingText();
            }

            let rating_data = RatingStore.getRating();

            if (!rating_data) return;

            rating_data.forEach((/** RatingStoreData */ rating_store) => {
                if (rating_store.id_rating === this.getDataId()) {
                    if (rating_store.has_your_voice ) {

                        this.$context.find('.inner_your_voice').removeClass('hide');

                        this.yourVoice = rating_store.stars;

                        let initial_rating = rating_store.has_your_voice ? rating_store.stars : this.rating;

                        this.rating = this.calculateNewRatingInit(parseFloat(initial_rating), rating_store).toFixed(1);

                        this.countVotes = this.countVotes + 1;

                    }
                    if (!this.rating === false) {
                        this.showRatingText();
                    }
                }
            })

        })
    }

    eventRatingSelect() {
        this.$context.on(Rating.EVENT_RATING_SELECT, () => {

            let rating_data = RatingStore.getRating();

            if (!rating_data) return;

            rating_data.forEach((/** RatingStoreData */ rating_store) => {

                if (rating_store.id_rating === this.getDataId()) {
                    if (this.yourVoice > 0) {

                        this.rating = this.calculateNewRating(this.yourVoice, rating_store).toFixed(1);

                        rating_store.stars = this.yourVoice;
                    }

                    if (rating_store.has_your_voice === false) {
                        this.countVotes = this.countVotes + 1;

                        this.$context.find('.inner_your_voice').removeClass('hide');
                    }
                }

                if (!this.rating === false) {
                    this.showRatingText();
                }
            })

            RatingStore.setRating(rating_data, this.getDataId(), this.yourVoice, true);
        })
    }

    calculateNewRatingInit(value, rating_store)
    {
        let count_votes = this.countVotes;
        let sum_rating = this.rating * count_votes ;

        return rating_store.has_your_voice
            ? (((sum_rating + value )/ (count_votes + 1)))
            : this.rating;
    }
    calculateNewRating(value, rating_store)
    {
        let count_votes = this.countVotes || 0;
        let sum_rating = (this.rating || 0)  * count_votes ;

        return rating_store.has_your_voice
            ? (((sum_rating - rating_store.stars + value) / count_votes))
            : (((sum_rating + value) / (count_votes + 1)));
    }

    getDataId() {
        return this.$context.data('id')
    }
    showRatingText() {
        this.$context.removeClass('hide');
    }
    get rating() {
        return parseFloat(this.$context.find('.rating_all').text()) || 0;
    }

    get countVotes() {
        return parseInt(this.$context.find('.count_votes').text()) || 0;
    }

    set rating(rating) {
        this.$context.find('.rating_all').text(rating);
    }

    set countVotes(count_votes) {

        this.$context.find('.count_votes').
        html(
            count_votes + ' ' + '<span>' + RatingText.declofNum(count_votes, ['человек', 'человека', 'человек']) + '</span>'
        );
    }

    set yourVoice(your_voice) {
        this.$context.find('.your_voice').text(your_voice);
    }

    get yourVoice() {
        return parseInt(this.$context.find('.your_voice').text()) || 0;
    }

    static declofNum(number, titles) {
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }

    /**
     * @param {JQuery} $parent_context
     */
    static create($parent_context) {
        return new RatingText($parent_context.find('.b_text'));
    }
}