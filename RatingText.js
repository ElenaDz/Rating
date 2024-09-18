class RatingText {
    /**
     * @param {JQuery} $context
     */
    constructor($context) {
        this.$context = $context;

        this.bindEvents();
    }

    bindEvents() {
        $('body').on(Rating.EVENT_CHANGE_TEXT, () =>
        {
            let rating_data = RatingStore.getRating();

            this.yourVoice  = rating_data.stars;
            this.rating     = rating_data.rating;
            this.countVotes = rating_data.count_votes;
        })
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