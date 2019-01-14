import React, {Component} from 'react'
import {Form, Input} from 'antd'

class EditModel extends Component {

	render () {
		const { getFieldDecorator } = this.props.form

		return (
			<Form>
				<Form.Item>
					{
						getFieldDecorator('name', {
							initialValue: this.props.isCreate ? '' : this.props.item.name,
							rules: [{required: true, message: '请输入分类名称'}]
						})(<Input placeholder='请输入分类名称'/>)
					}
				</Form.Item>
			</Form>
		)
	}
}

export default Form.create({})(EditModel)