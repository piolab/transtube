Posts = new Meteor.Collection("posts");

// Meteor.methods({
// 	post: function(postAttributes) {
// 		var user = Meteor.user(),
// 		postWithSameLink = Posts.findOne({url: postAttributes.url});
// 		// ensure the user is logged in
// 		// if (!user)
// 		// 	throw new Meteor.Error(401, "You need to login to post new stories");
// 		// // ensure the post has a title
// 		// if (!postAttributes.title)
// 		// 	throw new Meteor.Error(422, 'Please fill in a headline');
// 		// // check that there are no previous posts with the same link
// 		// if (postAttributes.url && postWithSameLink) {
// 		// 	throw new Meteor.Error(302,
// 		// 		'This link has already been posted',
// 		// 		postWithSameLink._id);
// 		// }

// 		var videoid = postAtributes.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
// 		var youtubeUrlApi = youtubeUrlPrefix(videoid[1]);
// 		console.log(videoid[1]);
// 		var jqxhr = $.get(youtubeUrlApi, function(responseTxt, statusTxt, xhr) {
//             if (responseTxt){
//             	var responseMedia = responseTxt['entry']['media$group'];
//             	// console.log(responseTxt['entry']['media$group']);
//             	youtubeInfo = {
//             		thumbnail: responseMedia['media$thumbnail'][3]['url'],
//             		title: responseMedia['media$title']['$t']
//             	}
//             	console.log(youtubeInfo);
//             }
//         });


// 		// pick out the whitelisted keys
// 		var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
// 			userId: user._id,
// 			author: user.username,
// 			submitted: new Date().getTime()
// 		});
// 		var postId = Posts.insert(post);
// 		return postId;
// 	},
// });

// Posts.allow({
// 	update: ownsDocument,
// 	remove: ownsDocument
// });