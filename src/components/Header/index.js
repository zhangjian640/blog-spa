import React, { Component } from 'react'
import { Row, Col, Icon } from 'antd'
import {message} from 'antd/lib/index'
import urls from '../../utils/urls'
import BasicServer from '../../utils/request'
import {withRouter} from 'react-router-dom'
class Header extends Component{
	constructor (props) {
		super(props)
		this.state = {
			username: ''
		}
	}
	componentWillMount () {
		const username = sessionStorage.getItem('username') || ''
		this.setState({username})
	}
	logOut = () => {
		BasicServer.ajax({
			url: urls.signout
		})
			.then(res => {
				console.log(res.data)
				if (res.code === 0) {
					sessionStorage.removeItem('username')
					this.props.history.push('/')
				} else {
					message.error('失败')
				}
			})

	}
	render () {
		return (
			<Row className='admin-header'>
				<Col span={18}>
					<div style={{marginLeft: '10px',fontSize: '20px'}}>张建的博客</div>
				</Col>
				<Col span={6}>
					<div style={{float: 'right'}}>
						<span>欢迎，{this.state.username}</span>
						<a href='/#' className='logout' onClick={this.logOut}>
							<Icon type='logout'/>
							退出
						</a>
					</div>
				</Col>

			</Row>
		)
	}
}

export default withRouter(Header)