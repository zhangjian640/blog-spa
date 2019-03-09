import React, {Component} from 'react'
import {Form, Card} from 'antd'
class ArticleViewModal extends Component {
	render () {
		return (
			<Card title='查看文章' style={{margin: '10px'}}>
				<p>标题：{this.props.item.title}</p>
				<p>内容：{this.props.item.content}</p>
			</Card>
		)
	}
}

export default Form.create({})(ArticleViewModal)