import BasicServer from '../utils/request'
import urls from '../utils/urls'

/**
 * 拼接对象为请求字符串
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
function encodeSearchParams(obj) {
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

function list(data) {
	return BasicServer.ajax({
		url: urls.category + '?' + encodeSearchParams(data),
		method: 'get'
	})
}
function create(option) {
	return BasicServer.ajax({
		url: urls.category,
		method: 'post',
		data: option.data
	})
}
function update(id, option) {
	return BasicServer.ajax({
		url: urls.category + '/' + id,
		method: 'put',
		data: option.data
	})
}
function remove(id) {
	return BasicServer.ajax({
		url: urls.category + '/' + id,
		method: 'delete'
	})
}

export default {
	list,
	create,
	update,
	remove
}


