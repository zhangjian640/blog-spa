import React, { Component } from 'react'
import { Row, Col } from 'antd'
import {Route} from 'react-router-dom'
import './index.less'
import NavLeft from '../../components/NavLeft'
import Header from '../../components/Header'
import Welcome from '../../page/welcome'
import Article from '../../page/article'
import Category from '../../page/category'
export default class Home extends Component{
	render () {
		return (
			<Row className='admin-page'>
				<Col span={24}>
					<Header />
					<Row>
						<Col span={3}>
							<NavLeft />
						</Col>
						<Col span={21}>
							<Route exact path='/admin' component={Welcome} />
							<Route path='/admin/category' component={Category} />
							<Route path='/admin/article' component={Article} />
						</Col>
					</Row>
				</Col>
			</Row>
		)
	}
}