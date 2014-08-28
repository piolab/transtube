Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	// waitOn:function(){
	// 	return [Meteor.subscribe('posts',{sort:{submitted:-1}}),Meteor.subscribe('captions')];
	// }
});

PostsListControler = RouteController.extend({
	template: 'postsList',
	increment: 10,
	limit: function(){
		return parseInt(this.params.postsLimit) || this.increment;
	},
	findOptions: function(){
		return {sort: this.sort, limit: this.limit()};
	},
	waitOn: function(){
		Meteor.subscribe('posts', this.findOptions());
	},
	posts: function() {
		return Posts.find({}, this.findOptions());
	},
	data: function() {
		var hasMore = this.posts().count() === this.limit();
		return {
			posts: this.posts(),
			nextPath: hasMore ? this.nextPath() : null
		};
	}
});

NewPostsListController = PostsListControler.extend({
	sort: {submitted: -1},
	nextPath: function() {
		return Router.routes.newPosts.path({postsLimit: this.limit() + this.increment})
	}
});

Router.map(function() {
	this.route('postsList',{
	 	path: '/',
	 	controller: NewPostsListController
	});

	this.route('tranItem',{
		path: '/posts/:_id',
		data: function() {
			// Session.set("post_id", this.params._id);
			var returnData = {
				// paramsId : this.params._id,
				post : Posts.findOne(this.params._id),
				captions: Captions.find({postId: this.params._id}).fetch()
			}
			return returnData;
		},
		waitOn: function(){
			return [
				// Meteor.subscribe('posts'),
				Meteor.subscribe('singlePost', this.params._id),
				Meteor.subscribe('postCaptions', this.params._id)
			]
		}
	});

	this.route('postSubmit',{
		path: '/submit'
	});

	this.route('postEdit',{
		path:'/posts/:_id/edit',
		data: function() {
			return Posts.findOne(this.params._id);
		}
	})
});

var requireLogin = function(pause){
	if (!Meteor.user()){
		if (Meteor.loggingIn()){
			this.render(this.loadingTemplate);
		}
		else {
			this.render('accessDenied');
		}
		pause();	
	}
}

// Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only:'postSubmit'});
// Router.onBeforeAction(function() { clearErrors() });