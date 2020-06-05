const mongoose = require("mongoose");
const Comment = require('./comment');

const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User" //Model to associate
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment" //Model to associate
		}
	]
});

//Delete comments with campgrounds when destroying
campgroundSchema.pre('remove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});


module.exports = mongoose.model("Campground", campgroundSchema);