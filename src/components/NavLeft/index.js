import React, { Component } from 'react'
import { Menu } from 'antd'
import {withRouter, Link} from 'react-router-dom'
class NavLeft extends Component {
	render() {
		return (
			<Menu
				mode='inline'
				theme='light'
				defaultSelectedKeys={[window.location.hash.slice(1)]}
			>
				<Menu.Item key='/admin' title='首页'>
					<Link to='/admin'>首页</Link>
				</Menu.Item>
				<Menu.Item key='/admin/category' title='分类管理'>
					<Link to='/admin/category'>分类管理</Link>
				</Menu.Item>
				<Menu.Item key='/admin/article' title='文章管理'>
					<Link to='/admin/article'>文章管理</Link>
				</Menu.Item>
			</Menu>
		)
	}
}

export default withRouter(NavLeft)