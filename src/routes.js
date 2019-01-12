import React, { Component } from 'react'
import {Router, Switch, Route} from 'react-router-dom'
import Home from './page/home/index'
import Admin from './page/admin/index'
import createHistory from 'history/createHashHistory'
const history = createHistory()
// 监听路由，进行拦截
history.listen(local => {
	if (local.pathname === '/admin' && !sessionStorage.getItem('username')) {
		history.push('/')
	}
})
export default class Routes extends Component {
	render() {
		return (
			<Router history={history}>
				<Switch>
					<Route exact path='/' component={Home}></Route>
					<Route path='/admin' component={Admin}></Route>
				</Switch>
			</Router>
		)
	}
}