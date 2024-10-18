///<reference path="../_ide/jquery.d.ts"/>

class Rating
{
	static readonly EVENT_INIT = 'Rating.EVENT_INIT';

	private $context: JQuery;

	constructor($context:JQuery) {
		this.$context = $context;

		new RatingText(this);

		$('body').trigger(Rating.EVENT_INIT, this);
	}

	get id(): string
	{
		return ;
	}

	get rating():number
	{
		return ;
	}

	get count_votes():number
	{
		return;
	}

	get rating_my(): number
	{
		return ;
	}

	set rating_my(rating: number)
	{

	}
}

let rating = new Rating($());



