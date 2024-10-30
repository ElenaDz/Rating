
class Rating
{
	static readonly EVENT_INIT = 'Rating.EVENT_INIT';
	static readonly EVENT_SELECT = 'Rating.EVENT_SELECT';

	public $context: JQuery;
	private $bar: JQuery;

	constructor($context:JQuery)
	{
		this.$context = $context;

		// fixme удали и избавься от этой костанты, ты сохраняешь данные во втором месте, а данные нужно хранить
		//  в одном месте, в данном случае в Html (исправила, если я правильно поняла)

		// fixme это должно быть ниже, сейчас не защищено от повторного вызова ok
		// @ts-ignore
		if (this.$context[0].Rating) return;

		// @ts-ignore
		this.$context[0].Rating = this;

		new RatingText(this);

		this.$bar = this.$context.find('select[name="rating"]').first();

		// fixme мне кажется эти две строки нужно поменять местами ok

		this.showBar();

		this.updateBar();

		$('body').trigger(Rating.EVENT_INIT);
	}

	// fixme отказываемся от этого метода, перенеси код в конструктор ok

	// fixme переименовать метод в showBar ok
	// fixme отказываемся от передачи аргумента в функцию, пускай сам обращается в нужному свойству ok
	private showBar()
	{
		this.$bar.barrating('show', {
			theme: 'css-rating_my',
			initialRating: this.rating_displayed,
			onSelect: ((value, text, event) =>
			{
				if (typeof (event) === 'undefined') return;

				// Исправление бага повторного нажатия на одну звезду
				if (!value) {
					this.rating_my = Math.floor(this.rating_displayed);

					this.updateBar();
				} else {
					this.rating_my = value;
				}

				this.$context.trigger(Rating.EVENT_SELECT);
			})
		})
	}

	// fixme переименовываем метод в updateBar ok
	// fixme отказываемся от передачи аргумента в функцию, пускай сам обращается в нужному свойству ok
	private updateBar()
	{
		this.$bar.barrating('set', this.rating_displayed);
	}

	public get rating():number
	{
		let rating = this.rating_my > 0
			? (((this.rating_base * (this.count_votes - 1) ) + this.rating_my )/ this.count_votes )
			: this.rating_base;

		return parseFloat(rating.toFixed(1));
	}

	private get rating_base():number
	{
		return parseFloat(this.$context.data('rating_all') || 0)
	}

	// fixme перенеси ниже к свойству rating, все похожие свойства должны быть рядом ok
	private get rating_displayed():number
	{
		return this.rating_my || this.rating  || 0;
	}

	// fixme перенеси выше к свойству rating, все похожие свойства должны быть рядом ok
	public get rating_my(): number
	{
		return parseInt(RatingStore.getRatingMeForId(this.id));
	}

	private set rating_my(rating_my: number)
	{
		RatingStore.setRatingMeForId(this.id, rating_my);
	}

	public get count_votes():number
	{
		let count_votes = parseInt(this.$context.data('count_votes') || 0)

		return  ! this.rating_my
			? count_votes
			: count_votes + 1;
	}

	private get id(): string
	{
		return this.$context.attr('id');
	}

	public static create($context = $('.b_rating'))
	{
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




