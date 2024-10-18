class RatingText
{
	private Rating:Rating;

	constructor(rating:Rating) {
		this.Rating = rating;

		$('body').on(Rating.EVENT_INIT, (e, rating) =>
		{

			this.update();
		});
	}

	private update()
	{
		this.updateRating(
			this.Rating.rating,
			this.Rating.count_votes,
			this.Rating.rating_my
		);
	}

	private updateRating(rating, count_vote, rating_my)
	{

	}
}