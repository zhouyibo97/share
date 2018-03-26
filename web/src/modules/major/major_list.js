/**
 * 专业管理
 */
import React from 'react';
import fd from '../../base/fetchData';
import Container from '../../component/container';

import {
    Button, Spin, List, Modal, Card
} from 'antd';
import Create from './create_major';
import Edit from './edit_major';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            loading: false,
            showEdit: false,
            editRecord: null
        }
    }

    async get_list() {
        try {
            this.setState({ loading: true });
            let list = await fd.getJSON(fd.ports.option.major.list);
            this.setState({ list })
        } catch (error) {
            Modal.error({ title: "加载课程列表失败", content: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }
    componentDidMount() {
        this.get_list();
    }
    async handler_remove(major_id) {
        try {
            await fd.postJSON(fd.ports.option.major.remove, { major_id });
            this.get_list();
        } catch (error) {
            Modal.error({ title: "删除失败", content: error.message });
        } finally {

        }
    }

    render() {
        
        return (
            <Container>
                <List
                    bordered
                    header={
                        <div>
                            <Create handler_refresh={() => this.get_list()} />
                        </div>
                    }

                    dataSource={this.state.list}
                    loading={this.state.loading}
                    renderItem={
                        (item) => (
                            <List.Item

                                actions={[
                                    <Button icon="edit" size="small"
                                        onClick={() => this.setState({
                                            showEdit: true,
                                            editRecord: item
                                        })}
                                    >修改</Button>,
                                    <Button icon="delete" size="small" onClick={
                                        () => {
                                            Modal.confirm({
                                                title: `删除教室`,
                                                content: `您确定删除`,
                                                onOk: () => this.handler_remove(item.major_id)
                                            })
                                        }
                                    }>删除</Button>
                                ]}>
                                <List.Item.Meta
                                    
                                    title={item.major_name}
                                />
                                <div>{`${item.total}课时`}</div>
                            </List.Item>
                        )
                    }
                />
                {
                    this.state.showEdit&&<Edit
                    visible={this.state.showEdit}
                    handler_close={()=>this.setState({showEdit:false})}
                    editRecord={this.state.editRecord}
                    handler_refresh={()=>this.get_list()}
                />
                }
            </Container>
        )
    }
}