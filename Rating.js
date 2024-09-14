class Rating
{
    // fixme удалить или изменить так как сейчас эта строка не как помогает Ide определить тип $context
    /**
     * @param {JQuery} $context
     */

    // fixme убрать работу с этим объектом из этого класса, я просил чтобы RatingText был полностью независимым, здесь
    //  максимум его создание и все
    /** @type {RatingText} rating_text */
    rating_text;


    constructor($context) {
        // fixme не явное объявление свойства, сколько мне еще с этим бороться?
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
            initialRating: parseInt(rating_data.stars) || parseInt(rating_data.rating),
            // fixme не нужно использовать однострочный синтаксис анонимных функций как здесь, это ухудшает читаемость
            onSelect: (value, text, event) => this.onRatingSelect(value, event)
        })
    }

    onRatingSelect(value, event) {
        // fixme не нужно без необходимости увеличивать вложенность кода, здесь можно сделать return и не делать отступ
        // fixme проверку можно упросить например так ! event проверяем что event пустой должно сработать
        if (typeof (event) !== 'undefined') {
            let rating_data = RatingStore.getRating()[0];

            if (rating_data.rating === 0) {
                RatingStore.setRating(value, true, value, 1);

            } else {
                let new_rating = this.calculateNewRating(value, rating_data);
                let new_vote_count = rating_data.flag ? rating_data.count_votes : rating_data.count_votes + 1;

                RatingStore.setRating(value, true, new_rating, new_vote_count);
            }

            this.showRatingText();
        }
    }

    calculateNewRating(value, rating_data) {
        // fixme откуда у тебя периодические вылазит camelCase?
        // fixme зачем здесь вводить новое название для count_votes?
        let totalVotes = rating_data.count_votes;
        // fixme на сколько я понял это сумма всех рейтингов например 4.5*2=9=4+5 Переименую
        let currentRating = rating_data.rating * totalVotes;

        // fixme можно переписать избавиться от двух return и двух toFixed
        if (rating_data.flag) {
            return (((currentRating - rating_data.stars + parseInt(value)) / totalVotes).toFixed(1));

        } else {
            return (((currentRating + parseInt(value)) / (totalVotes + 1)).toFixed(1));
        }
    }


    build() {
        let rating_data = RatingStore.getRating()[0];

        // fixme даже phpstorm подсвечивает это как ошибку Проверка из двух символов - не строгая, с авто преобразованием типов
        //  не нужно используй трех значные проверки здесь должно быть !==
        if (rating_data.rating != 0) {
            this.showRatingText();
        }

        // fixme тут вообще какая то магия с текстом null Постарайся избавиться от этого так не должно быть
        if (rating_data.stars != 'null') {
            this.$context.find('.inner_your_voice').removeClass('hide');
        }
        this.rating_text.yourVoice  = rating_data.stars;
        this.rating_text.rating     = rating_data.rating;
        this.rating_text.countVotes = rating_data.count_votes;
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