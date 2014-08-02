Template.postsList.helpers({
	posts: function(){
		return Posts.find({},{sort: {submitted:-1}});
	}
});

Template.postsList.vendor=function(){
    return{
        name:"Chanel",
        address:"Paris"
    };
};