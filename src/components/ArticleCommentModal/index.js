import React, {Component} from 'react'
import {Form, Row, Col, List, Button, Avatar, Input, Spin} from 'antd'

class ArticleCommentModal extends Component {
	state = {
		start: 0,
		limit: 5,
		comments: this.props.item.comments.slice(0, 5),
		initLoading: false
	}
	onLoadMore = () => {
		this.setState({
			initLoading: true
		})
		setTimeout(() => {
			this.setState({
				start: this.state.start + this.state.limit,
				initLoading: false
			}, () => {
				this.setState({
					comments: this.props.item.comments.slice(0, this.state.start + this.state.limit)
				})
			})
		}, 1000)
	}
	render() {
		const { getFieldDecorator } = this.props.form
		const loadMore = this.state.start + this.state.limit < this.props.item.comments.length ? (
			<div style={{
				textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
			}}
			>
				{
					this.state.initLoading ? <Spin/> : <Button onClick={this.onLoadMore}>loading more</Button>
				}
			</div>
		) : null;
		return (
			<Row>
				<Col span={24}>
					<Form>
						<Form.Item>
							{
								getFieldDecorator('content', {
								})(<Input placeholder='请输入评论' />)
							}
						</Form.Item>
					</Form>
					<List
						loading={this.state.initLoading}
						itemLayout="horizontal"
						loadMore={loadMore}
						dataSource={this.state.comments}
						renderItem={item => (
							<List.Item actions={[<Button type="danger" icon="delete" onClick={() => this.props.deleteComment(this.props.item._id, item._id)}>删除</Button>]}>
								<List.Item.Meta
									avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
									title={item.user.username}
									description={item.user.email}
								/>
								<div>{item.content}</div>
							</List.Item>
						)}
					/>
				</Col>
			</Row>
		)
	}
}

export default Form.create({})(ArticleCommentModal)