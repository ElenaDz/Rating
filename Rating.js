class Rating
{
    static  EVENT_CHANGE_TEXT = 'Rating.EVENT_CHANGE_TEXT';
    // fixme удалить или изменить так как сейчас эта строка не как помогает Ide определить тип $context ok

    // fixme убрать работу с этим объектом из этого класса, я просил чтобы RatingText был полностью независимым, здесь
    //  максимум его создание и все ok
    /** @type {JQuery} $context */
    $context;

    /**
     * @param {JQuery} $context
     */
    constructor($context) {
        // fixme не явное объявление свойства, сколько мне еще с этим бороться? ok
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
            // fixme не нужно использовать однострочный синтаксис анонимных функций как здесь, это ухудшает читаемость (не знаю как исправить)
            onSelect: (value, text, event) => {
                this.onRatingSelect(value, event)
            }
        })
    }

    onRatingSelect(value, event) {
        // fixme не нужно без необходимости увеличивать вложенность кода, здесь можно сделать return и не делать отступ
        // fixme проверку можно упросить например так ! event проверяем что event пустой должно сработать (не работает)
        if (typeof (event) !== 'undefined') {
            let rating_data = RatingStore.getRating();

            if (!rating_data.rating) {
                RatingStore.setRating(value, true, value, 1);

            } else {
                let new_rating = this.calculateNewRating(value, rating_data);

                let new_vote_count = rating_data.has_your_voice ? rating_data.count_votes : rating_data.count_votes + 1;

                RatingStore.setRating(value, true, new_rating.toFixed(1), new_vote_count);
            }


            this.showRatingText();
        }
    }

    calculateNewRating(value, rating_data) {
        // fixme откуда у тебя периодические вылазит camelCase? (camelCase для методов использовать буду, переменные через _)
        // fixme зачем здесь вводить новое название для count_votes? ok
        let count_votes = rating_data.count_votes;
        // fixme на сколько я понял это сумма всех рейтингов например 4.5*2=9=4+5 Переименую ok
        let sum_rating = rating_data.rating * count_votes;
        // fixme можно переписать избавиться от двух return и двух toFixed ok

        console.log(sum_rating)
        console.log(count_votes)
        console.log(rating_data.rating)
        return rating_data.has_your_voice ? (((sum_rating - rating_data.stars + parseInt(value)) / count_votes)) : (((sum_rating + parseInt(value)) / (count_votes + 1)))
    }

    build() {
        let rating_data = RatingStore.getRating();
        // fixme даже phpstorm подсвечивает это как ошибку Проверка из двух символов - не строгая, с авто преобразованием типов ок
        //  не нужно используй трех значные проверки здесь должно быть !== ok
        if (!rating_data.rating === false) {
            this.showRatingText();
        }
        // fixme тут вообще какая то магия с текстом null Постарайся избавиться от этого так не должно быть ok
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