import axios from 'axios'
import urls from '../utils/urls'
export default class BasicServer {
	static ajax(option) {
		return new Promise((resolve, reject) => {
			axios({
				url: option.url,
				method: option.type || 'post',
				data: option.data || '',
				timeout: 8000,
				baseURL: urls.baseURL,
				withCredentials: true // 跨域请求携带cookie
			})
				.then(response => {
					if (response.status === 200) {
						const result = response.data
						if (result.error) {
							console.log(result.error.message)
						}
						resolve(result)
					} else {
						reject(response.data)
					}
				})
				.catch(err => {
					console.error(`request URL ${err}`)
				})
		})
	}
}
