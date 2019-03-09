import React, {Component} from 'react'
import {Button, Col, Form, Input, message, Modal, Popconfirm, Row, Table} from 'antd'
import BasicServer from '../../utils/request'
import urls from '../../utils/urls'
import CategoryEditModel from '../../components/CategoryEditModel'
export default class Category extends Component {
	state = {
		dataSource: [],
		item: {}, // 修改时的当前数据
		title: '',
		editVisible: false, // 模态窗口是否显示
		isCreate: true,
		pagination: {
			current: 1,
			pageSize: 5
		},
		keyword: '', // 查询字段
		multiple: false, // 删除多选
		selectedRowKeys: [] // 选中项
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
	// 全部删除
	delete = () => {
		this.setState({
			multiple: true
		}, this.removeCategory(this.state.selectedRowKeys[0]))
	}
	editConform = () => {
		this.EditForm.props.form.validateFields((err, category) => {
			if (err) {
				return
			}
			BasicServer.ajax({
				url: urls.category,
				type: this.state.isCreate ? 'post' : 'put',
				data: category,
				id: this.state.item._id
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
		})
	}
	editCancel = () => {
		this.setState({
			editVisible: false
		})
	}
	pageChange = (current) => {
		this.setState({
			pagination: {...this.state.pagination, current}
		}, this.getList)
	}
	getList = () => {
		BasicServer.ajax({
			url: urls.category,
			type: 'get',
			data: {
				pageNum: this.state.pagination.current,
				pageSize: this.state.pagination.pageSize,
				keyword: this.state.keyword
			}
		})
			.then(res => {
				if (res.code === 0) {
					const { items, pageNum: current, pageSize, total } = res.data
					this.setState({
						dataSource: items.map(item => {
							item.key = item._id
							return item
						}),
						pagination: {
							current,
							pageSize,
							total,
							showTotal: total => `总共${total}条`,
							onChange: this.pageChange
						}
					})
				} else {
					message.error('失败')
				}
			})
	}

	editCategory = (item) => {
		this.setState({
			title: '修改分类',
			isCreate: false,
			editVisible: true,
			item
		})
	}

	removeCategory = (id) => {
		BasicServer.ajax({
			url: urls.category,
			type: 'delete',
			id,
			multiple: this.state.multiple,
			data: {
				ids: this.state.selectedRowKeys
			}
		})
			.then(res => {
				if (res.code === 0) {
					this.setState({
						pagination: {...this.state.pagination, current: 1}
					}, this.getList)
				} else {
					message.error('失败')
				}
			})
	}

	// 多选
	rowSelection = {
		onChange: (selectedRowKeys) => {
			this.setState({selectedRowKeys})
		}
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
				render: (text, recode, index) => {
					return (
						<div>
							<Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.editCategory(recode)}>修改</Button>
							<Popconfirm
								title='确定要删除吗？'
								okText='确定'
								cancelText='取消'
								onConfirm={() => this.removeCategory(recode._id)}
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
					<Col span={4}>
						<Button type='primary' onClick={this.create}>添加分类</Button>
					</Col>
					<Col span={4}>
						<Button type='danger' style={{marginLeft: '10px'}} onClick={this.delete}>全部删除</Button>
					</Col>
					<Col span={10}>
						<Input.Search
							enterButton
							placeholder='请输入分类'
							onSearch={keyword => this.setState({keyword}, this.getList)}
						/>
					</Col>
				</Row>
				<Row style={{marginTop: '12px'}}>
					<Col span={24}>
						<Table
							dataSource={this.state.dataSource}
							columns={columns}
							pagination={this.state.pagination}
							rowSelection={this.rowSelection}
						/>
						<Modal
							onOk={this.editConform}
						   	onCancel={this.editCancel}
						   	okText='确定'
						   	cancelText='取消'
							destroyOnClose
						   	visible={this.state.editVisible}
							title={this.state.title}>
							<CategoryEditModel
								wrappedComponentRef={inst => this.EditForm = inst}
								isCreate={this.state.isCreate}
								item={this.state.item}
							/>
						</Modal>
					</Col>
				</Row>
			</div>
		)
	}
}
Category = Form.create({})(Category)