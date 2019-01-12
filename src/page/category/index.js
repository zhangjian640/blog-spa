import React, {Component} from 'react'
import {Button, Col, Input, message, Popconfirm, Row, Table, Modal, Form} from 'antd'
import BasicServer from '../../utils/request'
import urls from '../../utils/urls'

class EditModel extends Component {

	render () {
		const { getFieldDecorator } = this.props.form

		return (
			<Form>
				<Form.Item>
					{
						getFieldDecorator('name', {
							rules: [{required: true, message: '请输入分类名称'}]
						})(<Input placeholder='请输入分类名称'/>)
					}
				</Form.Item>
			</Form>
		)
	}
}

const WrappedEditModel = Form.create({})(EditModel)

export default class Category extends Component {
	state = {
		dataSource: [],
		title: '',
		editVisible: false, // 模态窗口是否显示
		isCreate: true
	}

	componentWillMount() {
		this.getList()
	}

	create = () => {
		this.setState({
			title: '添加分类',
			isCreate: true,
			editVisible: true
		})
	}

	editConform = () => {
		const category = this.formRef.props.getFieldsValue()
		console.log(category)
		BasicServer.ajax({
			url: urls.category
		})
			.then(res => {
				if (res.code === 0) {
					this.getList()
					this.setState({
						editVisible: false
					})
				} else {
					message.error('失败')
				}
			})

	}

	editCancel = () => {
		this.setState({
			editVisible: false
		})
	}

	getList = () => {
		BasicServer.ajax({
			url: urls.category,
			type: 'get'
		})
			.then(res => {
				if (res.code === 0) {
					this.setState({
						dataSource: res.data.items.map(item => {
							item.key = item._id
							return item
						})
					})
				} else {
					message.error('失败')
				}
			})
	}

	render() {
		const columns = [
			{
				title: '名称',
				dataIndex: 'name',
				key: 'name'
			},
			{
				title: '操作',
				render(text, recode, index) {
					return (
						<div>
							<Button style={{ marginRight: '10px' }} type="primary">修改</Button>
							<Popconfirm
								title='确定要删除吗？'
								okText='确定'
								cancelText='取消'
								onConfirm={() => message.warn('您已经删除')}
							>
								<Button type="danger">删除</Button>
							</Popconfirm>
						</div>
					)
				}
			}
		]
		return (
			<div style={{ 'padding': '15px' }}>
				<Row>
					<Col span={3}>
						<Button type='primary' onClick={this.create}>添加分类</Button>
					</Col>
					<Col span={18}>
						<Input.Search
							enterButton
							placeholder='请输入分类'
							onSearch={(keyword) => {
								console.log(keyword)
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Table dataSource={this.state.dataSource} columns={columns}/>
						<Modal onOk={this.editConform} onCancel={this.editCancel} okText='确定' cancelText='取消' visible={this.state.editVisible} title={this.state.title}>
							<WrappedEditModel
								wrappedComponentRef = {inst => this.formRef = inst}
							/>
						</Modal>
					</Col>
				</Row>
			</div>
		)
	}
}

