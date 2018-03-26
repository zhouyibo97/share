import React from 'react';
import { Layout} from 'antd';
import LeftNav from './left_nav';
import {connect} from 'react-redux';

class LeftBar extends React.Component {
    render() {
        return (
            <Layout.Sider
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
            >
                <div className="logo" >四组学生管理系统</div>
                <LeftNav />

            </Layout.Sider>
        )
    }
}

export default connect (state=>({collapsed:state.getIn(["view","collapsed"])}))(LeftBar);