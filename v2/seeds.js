const mongoose = require("mongoose"),
Campground     = require("./models/campground"),
Comment        = require("./models/comment");


const campgroundData = [
    {
        name: "Cider Valley",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        description: "Not just for the cider sweetness, also for relaxing"
    },
    {
        name: "Mountain View",
        image: "https://blog-assets.thedyrt.com/uploads/2018/06/freecampingspot-2000x1120.jpg",
        description: "Mount Everest camping experience"
    },
    {
        name: "Sohill Spring",
        image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_md.jpg",
        description: "Don't pack water, come for the freshest of spring water"
    }
]



function seedDB(){
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err)
        } else {
            console.log("removed campgrounds!")
            //Add a few campgrounds
            campgroundData.forEach(seed => {
                Campground.create(seed, function(err, campground){
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added a campground!")
                        //Add a few comments
                        Comment.create({text: "Absolutely splendid experience", author: "Jacob"}, function(err, comment){
                            if (err) {
                                console.log(err)
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment!");
                            }
                        });
                    }
                });
            });
        }
    });


}


module.exports = seedDB;