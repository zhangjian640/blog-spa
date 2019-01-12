import React, {Component} from 'react'
import {Button, Form, Input, message} from 'antd'
import BasicServer from '../../utils/request'
import urls from '../../utils/urls'
import './index.less'

const FormItem = Form.Item
export default class Admin extends Component {
	loginSubmit = (isSignUp, value) => {
		BasicServer.ajax({
			url: isSignUp ? urls.signup : urls.signin,
			data: value
		})
			.then(res => {
				console.log(res.data)
				if (res.code === 0) {
					if (! isSignUp) {
						console.log(res)
						sessionStorage.setItem('username', res.data.username)
					}
					this.props.history.push('/admin')
				} else {
					message.error('失败')
				}
			})
	}

	render() {
		return (
			<div className='login-page'>
				<div className="login-content-wrap">
					<div className="login-content">
						<div className="word">张建的博客</div>
						<div className="login-box">
							<div className="title">欢迎您</div>
							<LoginForm loginSubmit={this.loginSubmit}/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class LoginForm extends Component {
	state = {
		isSignUp: true
	}
	checkUserName = (rule, value, callback) => {
		const reg = /^1\d{10}$/
		if (! value) {
			callback('请输入手机号')
		} else if (! reg.test(value)) {
			callback('请输入正确的手机号')
		} else {
			callback()
		}
	}
	submitLogin = () => {
		const data = this.props.form.getFieldsValue()
		// console.log(data)
		this.props.loginSubmit(
			this.state.isSignUp,
			data
		)
	}

	render() {
		const { getFieldDecorator } = this.props.form
		return (
			<Form>
				<FormItem>
					{
						getFieldDecorator('username', {
							rules: [
								{ validator: this.checkUserName }
							]
						})(<Input placeholder='用户名'/>)
					}
				</FormItem>
				<FormItem>
					{
						getFieldDecorator('password', {
							rules: [
								{ required: true, message: '请输入密码' }
							]
						})(<Input type='password' placeholder='密码'/>)
					}
				</FormItem>
				{
					this.state.isSignUp && <FormItem>
						{
							getFieldDecorator('email', {
								rules: [
									{ required: true, message: '请输入邮箱' }
								]
							})(<Input type='email' placeholder='邮箱'/>)
						}
					</FormItem>
				}

				<FormItem>
					<Button type='primary' className='login-form-button' onClick={this.submitLogin}>
						{
							this.state.isSignUp ? '注册' : '登录'
						}
					</Button>
					<a href='/#' onClick={() => this.setState({ isSignUp: ! this.state.isSignUp })}>
						{this.state.isSignUp ? '已有账号？直接登录' : '没有账号，请注册'}
					</a>
				</FormItem>
			</Form>
		)
	}
}

LoginForm = Form.create({})(LoginForm)