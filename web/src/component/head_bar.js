// 顶部工具条组件
import React, {Component } from 'react';
import { Layout,Icon } from 'antd';
import {connect} from 'react-redux';
import actionTypes from '../redux/actionTypes';
import Breadcrumd from './breadcrumd';
import state from '../redux/state';
const { Header } = Layout;

class Head extends Component {
    toggle(){
        this.props.dispatch(actionTypes.create(actionTypes.COLLAPSED_VIEW_SIDER,!this.props.collapsed));
    }
    render() { 
        return (
            <Header style={{ background: '#fff', padding: 0 }}>
                <Icon
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle.bind(this)}
                />
                {/*面包屑组件*/}
                <Breadcrumd />
            </Header>
        )
    }
}
export default connect (state=>({collapsed:state.getIn(["view","collapsed"])}))(Head);