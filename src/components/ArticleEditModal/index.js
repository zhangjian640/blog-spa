import React, {Component} from 'react'
import {Form, Input, Select} from 'antd'
import BasicServer from '../../utils/request'
import urls from '../../utils/urls'
class ArticleEditModel extends Component {
	state = {
		categories: []
	}
	componentWillMount () {
		BasicServer.ajax({
			url: urls.category,
			type: 'get',
			data: {
				pageNum: 1,
				pageSize: 10
			}
		})
			.then(res => {
				if (res.code === 0) {
					const { items } = res.data
					this.setState({ categories: items })
				}
			})
	}
	render () {
		const { getFieldDecorator } = this.props.form
		return (
			<Form style={{margin: '10px'}}>
				<Form.Item>
					{
						getFieldDecorator('category', {
							initialValue: this.props.isCreate ? '' : this.props.item.category._id,
							rules: [{required: true, message: '请选择标题'}]
						})(<Select>
							{
								this.state.categories.map(item => (
									<Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>
								))
							}
						</Select>)
					}
				</Form.Item>
				<Form.Item>
					{
						getFieldDecorator('title', {
							initialValue: this.props.isCreate ? '' : this.props.item.title,
							rules: [{required: true, message: '请输入标题'}]
						})(<Input placeholder='请输入标题'/>)
					}
				</Form.Item>
				<Form.Item>
					{
						getFieldDecorator('content', {
							initialValue: this.props.isCreate ? '' : this.props.item.content,
							rules: [{required: true, message: '请输入内容'}]
						})(<Input.TextArea placeholder='请输入内容'/>)
					}
				</Form.Item>
			</Form>
		)
	}
}

export default Form.create({})(ArticleEditModel)