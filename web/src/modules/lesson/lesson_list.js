/**
 * 课程管理
 */
import React from 'react';
import fd from '../../base/fetchData';
import Container from '../../component/container';

import {
    Button, Spin, List, Modal, Card
} from 'antd';
import Create from './create_lesson';
import Edit from './edit_lesson';

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
            let list = await fd.getJSON(fd.ports.option.lesson.list);
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
    async handler_remove(lesson_id) {
        try {
            await fd.postJSON(fd.ports.option.lesson.remove, { lesson_id });
            this.get_list();
        } catch (error) {
            Modal.error({ title: "删除失败", content: error.message });
        } finally {

        }
    }

    render() {
        //生成不同颜色色块的函数
        const create_level_avatar = (n) => {
            const level_colors = [
                {},
                { color: '#666', backgroundColor: '#EDDE3C' },
                { color: '#FFF', backgroundColor: '#2CAF54' },
                { color: '#FFF', backgroundColor: '#ED543C' },
                { color: '#FFF', backgroundColor: '#6332A1' },
                { color: '#FFF', backgroundColor: '#000000' },
            ]
            return (
                <div style={{
                    width: 26,
                    height: 26,
                    backgroundColor: level_colors[n].backgroundColor,
                    fontSize: 18, color: level_colors[n].color,
                    textAlign: "center"
                }}>{n}</div>
            )
        }
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
                                                onOk: () => this.handler_remove(item.lesson_id)
                                            })
                                        }
                                    }>删除</Button>
                                ]}>
                                <List.Item.Meta
                                    avatar={
                                        create_level_avatar(item.level)
                                    }
                                    title={item.lesson_name}
                                />
                                <div>{`${item.length}课时`}</div>
                            </List.Item>
                        )
                    }
                />
                {
                    this.state.showEdit && <Edit
                        visible={this.state.showEdit}
                        handler_close={() => this.setState({ showEdit: false })}
                        editRecord={this.state.editRecord}
                        handler_refresh={() => this.get_list()} />
                }
            </Container>
        )
    }
}