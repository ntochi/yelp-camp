const mongoose = require("mongoose");
const Comment = require('./comment');

const campgroundSchema = new mongoose.Schema({
	title: String,
	price: String,
	image: String,
	description: String,
	location: String,
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


module.exports = mongoose.model("Campground", campgroundSchema);