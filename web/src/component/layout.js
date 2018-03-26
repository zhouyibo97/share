// 布局容器组件

import React from 'react';
import { Layout } from 'antd';

//路由组件引入

import Routes from '../routes';

//功能组件引入
import LeftBar from './left_bar';
import Header from './head_bar';
//国际化组件，实现弹层中的文字都为中文
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
//引入redux组件
import { Provider } from 'react-redux';
import store from '../redux/store';
const { Sider } = Layout;

class ViewLayout extends React.Component {
    constructor() {
        super();
        this.state = {
            collapsed: false
        }
    }

    render() {
        return (
            <Provider store={store}>
                <LocaleProvider locale={zh_CN}>
                    <Layout className="layout">
                        <LeftBar />
                        <Layout style={{ paddingBottom: 24 }}>
                            <Header collapsed={this.state.collapsed} url={window.location.pathname} />
                            {/*路由组件引入区*/}
                            <Routes />
                        </Layout>
                    </Layout>
                </LocaleProvider>
            </Provider>
        )
    }
}
export default ViewLayout;