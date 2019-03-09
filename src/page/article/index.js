import React, {Component} from 'react'
import {Button, Col, Input, Modal, Popconfirm, Row, Table} from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import BasicServer from '../../utils/request'
import urls from '../../utils/urls'
import ArticleEditModal from '../../components/ArticleEditModal'
import ArticleCommentModal from '../../components/ArticleCommentModal'
import ArticleViewModal from '../../components/ArticleViewModal'
import {message} from 'antd/lib/index'

export default class Article extends Component {
	state = {
		title: '',
		keyword: '',
		items: [],
		item: {}, // 当前项
		loading: false,
		pagination: {
			current: 1,
			pageSize: 5
		},
		multiple: false, // 删除多选
		selectedRowKeys: [], // 删除项
		editVisible: false, // 编辑
		viewVisible: false, // 查看
		commentVisible: false, // 评论 是否显示
		isCreate: false
	}

	componentWillMount() {
		this.getList()
	}

	getList = () => {
		this.setState({
			loading: true
		})
		BasicServer.ajax({
			url: urls.article,
			type: 'get',
			data: {
				pageNum: this.state.pagination.current,
				pageSize: this.state.pagination.pageSize,
				keyword: this.state.keyword,
				current: this.state.pagination.current
			}
		})
			.then(res => {
				this.setState({
					loading: false
				})
				if (res.code === 0) {
					const { items, pageNum: current, pageSize, total } = res.data
					this.setState({
						items: items.map(item => {
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
				}
			})
	}
	// 多选
	rowSelection = {
		onChange: (selectedRowKeys) => {
			this.setState({ selectedRowKeys })
		}
	}
	create = () => {
		this.setState({ editVisible: true, isCreate: true, title: '新增文章' })
	}
	editCancel = () => {
		this.setState({ editVisible: false })
	}
	viewCancel = () => {
		this.setState({ viewVisible: false })
	}
	commentCancel = () => {
		this.setState({ commentVisible: false })
	}
	commentOk = () => {
		const comment = this.commentForm.props.form.getFieldsValue()
		BasicServer.ajax({
			url: urls.addComment,
			type: 'put',
			data: {
				...comment
			},
			id: this.state.item._id
		})
			.then(res => {
				if (res.code === 0) {
					this.setState({ commentVisible: false }, this.getList)
				}
			})
	}
	editOk = () => {
		const article = this.editForm.props.form.getFieldsValue()
		BasicServer.ajax({
			url: urls.article,
			type: this.state.isCreate ? 'post' : 'put',
			data: {
				...article
			},
			id: this.state.item._id
		})
			.then(res => {
				if (res.code === 0) {
					this.setState({ editVisible: false }, this.getList)
				}
			})
	}
	// 编辑
	edit = (item) => {
		this.setState({ editVisible: true, item, isCreate: false })
	}
	// 详情
	view = (item) => {
		this.setState({ viewVisible: true, item }, () => {
			BasicServer.ajax({
				url: urls.addPv,
				type: 'put',
				id: item._id
			})
				.then(res => {
					if (res.code === 0) {
						this.getList()
					}
				})
		})
	}
	// 评论
	comment = (item) => {
		this.setState({ commentVisible: true, item })
	}
	removeArticle = (id) => {
		BasicServer.ajax({
			url: urls.article,
			type: 'delete',
			id,
			data: {
				ids: this.state.selectedRowKeys
			}
		})
			.then(res => {
				if (res.code === 0) {
					this.setState({
						pagination: { ...this.state.pagination, current: 1 }
					}, this.getList)
				} else {
					message.error('失败')
				}
			})
	}
	// 全部删除
	delete = () => {
		this.setState({
			multiple: true
		}, this.removeArticle(this.state.selectedRowKeys[0]))
	}
	pageChange = (current) => {
		this.setState({
			pagination: { ...this.state.pagination, current }
		}, this.getList)
	}
	handleSearch = (keyword) => {
		this.setState({
			keyword,
			pagination: { ...this.state.pagination, current: 1 }
		}, this.getList)
	}
	deleteComment = (articleId, commentId) => {
		BasicServer.ajax({
			url: urls.delComment,
			type: 'delete',
			id: articleId,
			data: {
				commentId
			}
		})
			.then(res => {
				if (res.code === 0) {
					this.setState({
						commentVisible: false
					}, this.getList)
				} else {
					message.error('失败')
				}
			})
	}

	render() {
		const columns = [
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title'
			},
			{
				title: '内容',
				dataIndex: 'content',
				key: 'content',
				width: 300,
				render: (text) => {
					if (text.length > 35) {
						return text.slice(0, 35) + '...'
					}
					return text
				}
			},
			{
				title: '分类',
				dataIndex: 'category',
				key: 'category',
				render: (text, recode) => {
					return text.name
				}
			},
			{
				title: '阅读量',
				dataIndex: 'pv',
				key: 'pv'
			},
			{
				title: '添加时间',
				dataIndex: 'createAt',
				key: 'createAt',
				render: text => moment(text).fromNow()
			},
			{
				title: '评论数',
				dataIndex: 'comments',
				key: 'comments',
				render: text => text.length
			},
			{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
				render: (text, recode) => {
					return (
						<Button.Group>
							<Button
								type='dashed'
								onClick={() => this.view(recode)}
							>查看</Button>
							<Button type='dashed'
									style={{ marginLeft: '5px' }}
									onClick={() => this.edit(recode)}
							>编辑</Button>
							<Button
								type='dashed'
								style={{ marginLeft: '5px' }}
								onClick={() => this.comment(recode)}
							>评论</Button>
							<Popconfirm
								title='确定要删除吗？'
								okText='确定'
								cancelText='取消'
								onConfirm={() => this.removeArticle(recode._id)}
							>
								<Button
									type='danger'
									style={{ marginLeft: '5px' }}
								>删除</Button>
							</Popconfirm>

						</Button.Group>
					)
				}
			}
		]
		return (
			<div style={{ 'padding': '15px' }}>
				<Row>
					<Col span={24}>
						<Row>
							<Col span={4}>
								<Button
									type='primary'
									onClick={this.create}
								>添加文章</Button>
							</Col>
							<Col span={4}>
								<Button
									type='danger'
									onClick={this.delete}
								>删除文章</Button>
							</Col>
							<Col span={10}>
								<Input.Search
									enterButton
									placeholder='请输入分类'
									onSearch={this.handleSearch}
								/>
							</Col>
						</Row>
						<Table
							columns={columns}
							loading={this.state.loading}
							dataSource={this.state.items}
							pagination={this.state.pagination}
							rowSelection={this.rowSelection}
						/>
						<Modal
							visible={this.state.editVisible}
							title={this.state.title}
							onCancel={this.editCancel}
							onOk={this.editOk}
							destroyOnClose
						>
							<ArticleEditModal
								wrappedComponentRef={inst => this.editForm = inst}
								isCreate={this.state.isCreate}
								item={this.state.item}
							/>
						</Modal>
						<Modal
							visible={this.state.viewVisible}
							destroyOnClose
							onCancel={this.viewCancel}
							footer={null}
						>
							<ArticleViewModal
								item={this.state.item}
							/>
						</Modal>
						<Modal
							visible={this.state.commentVisible}
							onCancel={this.commentCancel}
							onOk={this.commentOk}
							destroyOnClose
						>
							<ArticleCommentModal
								wrappedComponentRef={inst => this.commentForm = inst}
								deleteComment={this.deleteComment}
								item={this.state.item}
							/>
						</Modal>
					</Col>
				</Row>
			</div>
		)
	}
}