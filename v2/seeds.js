const mongoose = require("mongoose"),
Campground     = require("./models/campground"),
Comment        = require("./models/comment");


const campgroundData = [
    {
        name: "Cider Valley",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac sem mi. Donec vel tincidunt dui. Vestibulum luctus sem sed lacus pellentesque tempus. Maecenas suscipit, turpis sit amet vestibulum posuere, orci tellus sollicitudin neque, vel viverra nulla metus quis eros. Quisque sed leo condimentum, molestie nisl et, tincidunt ligula. Pellentesque ac enim in lorem scelerisque hendrerit quis a dolor. Donec consequat augue et enim vulputate efficitur. Mauris accumsan purus vitae quam tincidunt, at bibendum leo viverra. Donec dolor risus, vestibulum fermentum sem sed, vulputate tincidunt nulla."
    },
    {
        name: "Mountain View",
        image: "https://blog-assets.thedyrt.com/uploads/2018/06/freecampingspot-2000x1120.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac sem mi. Donec vel tincidunt dui. Vestibulum luctus sem sed lacus pellentesque tempus. Maecenas suscipit, turpis sit amet vestibulum posuere, orci tellus sollicitudin neque, vel viverra nulla metus quis eros. Quisque sed leo condimentum, molestie nisl et, tincidunt ligula. Pellentesque ac enim in lorem scelerisque hendrerit quis a dolor. Donec consequat augue et enim vulputate efficitur. Mauris accumsan purus vitae quam tincidunt, at bibendum leo viverra. Donec dolor risus, vestibulum fermentum sem sed, vulputate tincidunt nulla."
    },
    {
        name: "Sohill Spring",
        image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_md.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac sem mi. Donec vel tincidunt dui. Vestibulum luctus sem sed lacus pellentesque tempus. Maecenas suscipit, turpis sit amet vestibulum posuere, orci tellus sollicitudin neque, vel viverra nulla metus quis eros. Quisque sed leo condimentum, molestie nisl et, tincidunt ligula. Pellentesque ac enim in lorem scelerisque hendrerit quis a dolor. Donec consequat augue et enim vulputate efficitur. Mauris accumsan purus vitae quam tincidunt, at bibendum leo viverra. Donec dolor risus, vestibulum fermentum sem sed, vulputate tincidunt nulla."
    }
]



function seedDB(){
    //Remove all campgrounds & comments
    Campground.deleteMany({}, function(err){
        // if(err){
        //     console.log(err)
        // } else {
        //     console.log("removed campgrounds!");
        //     Comment.deleteMany({}, function(err){
        //       if (err) {
        //         console.log(err);
        //       } else {
        //         console.log("removed comments!");
        //         //Add a few campgrounds
        //         campgroundData.forEach(seed => {
        //             Campground.create(seed, function(err, campground){
        //                 if (err) {
        //                     console.log(err)
        //                 } else {
        //                     console.log("added a campground!")
        //                     //Add a few comments
        //                     Comment.create({text: "Absolutely splendid experience", author: "Jacob"}, function(err, comment){
        //                         if (err) {
        //                             console.log(err)
        //                         } else {
        //                             campground.comments.push(comment);
        //                             campground.save();
        //                             console.log("created new comment!");
        //                         }
        //                     });
        //                 }
        //             });
        //         });
        //       }  
        //     })
        // }
    });
}


module.exports = seedDB;