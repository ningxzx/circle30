import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { Button, Form } from '@tarojs/components'
import { postFormId } from '../../actions/message'

class PostButton extends Component {
    static externalClasses = ['btn-class']

    static defaultProps = {
        className: '',
        onClick: ()=>{},
        disabled:false
    }
    formSubmit = (e) => {
        const form_id = e.detail.formId
        const open_id = Taro.getStorageSync('openid')
        if (form_id) {
            postFormId({
                form_id,
                open_id
            })
        }
    }
    render() {
        return (
            <Form reportSubmit={true} onSubmit={this.formSubmit} >
                <Button onClick={this.props.onClick}  formType='submit' className="btn-class" disabled={this.props.disabled}>{this.props.children}</Button>
            </Form>
        )
    }
}

export default PostButton