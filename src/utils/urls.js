// const protocol = window.location.protocol
// const host = window.location.host

const urls = {
	// baseURL: protocol + '//' + host,
	baseURL: window.location.origin,
	signin: '/api/users/signin',
	signup: '/api/users/signup',
	signout: '/api/users/signout',
	category: '/api/categories',
	article: '/api/articles',
	addPv: '/api/articles/pv',
	addComment: '/api/articles/comment',
	delComment: '/api/articles/comment'
}

export default urls