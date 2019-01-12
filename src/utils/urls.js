// const protocol = window.location.protocol
// const host = window.location.host

const urls = {
	// baseURL: protocol + '//' + host,
	baseURL: window.location.origin,
	signin: '/api/users/signin',
	signup: '/api/users/signup',
	signout: '/api/users/signout',
	category: '/api/categories'
}

export default urls