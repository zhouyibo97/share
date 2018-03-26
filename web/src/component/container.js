/**内容区容器组件 */
import React,{Component} from 'react'; 
import {Layout} from 'antd';
const {Content}=Layout;

export default class extends Component{
    render(){
        return (
            <Content style={{ margin: '24px 16px 0px 16px',  background: '#fff' }}>
                {this.props.children}
            </Content>
        )
    }
}