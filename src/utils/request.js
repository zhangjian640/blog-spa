import axios from 'axios'
import urls from '../utils/urls'
export default class BasicServer {
	 /**
	 * 拼接对象为请求字符串
	 * @param {Object} obj - 待拼接的对象
	 * @returns {string} - 拼接成的请求字符串
	 */
	 static encodeSearchParams = (obj) => {
		const params = []

		Object.keys(obj).forEach((key) => {
			let value = obj[key]
			// 如果值为undefined我们将其置空
			if (typeof value === 'undefined') {
				value = ''
			}
			// 对于需要编码的文本（比如说中文）我们要进行编码
			params.push([key, encodeURIComponent(value)].join('='))
		})

		return params.join('&')
	}
	static ajax(option) {
		return new Promise((resolve, reject) => {
			let url = ''
			if (option.type === 'get') {
				url = option.url + '?' + (option.type === 'get' ? this.encodeSearchParams(option.data) : '')
			} else if (option.type === 'put' ||option.type === 'delete') {
				url = option.url + '/' + option.id
			} else if (option.type === 'post') {
				url = option.url
			}
			axios({
				url,
				method: option.type || 'post',
				data: option.type === 'get' ? {}: option.data,
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
