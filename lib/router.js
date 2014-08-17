Router.configure({
	layoutTemplate: 'layout',
	// loadingTemplate: 'loading',
	waitOn:function(){
		return [Meteor.subscribe('posts',{sort:{submitted:-1}}),[Meteor.subscribe('sentences')],[Meteor.subscribe('captions')]];
	}
});
Router.map(function() {
	this.route('postsList', {path: '/'});

	this.route('tranItem',{
		path: '/posts/:_id',
		data: function() {
            Session.set("post_id", this.params._id);
            var returnData = {
                paramsId : this.params._id,
                post : Posts.findOne(this.params._id)
            }
            return returnData;
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