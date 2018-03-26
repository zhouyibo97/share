import React from 'react';
import {
    Button, Table, Spin, Modal,
    Form, Input
} from 'antd';

import { Redirect } from 'react-router-dom';
import Contianer from '../../component/container';

import fd from '../../base/fetchData';
import BtnCreate from './create_class';
import Edit from './edit_class';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            redirect_student_list: null,//跳转到学生列表的参数
            redirect_schedule:null,

            keyword: '',//关键字
            pageSize: 10,//页大小
            pageNumber: 1,//页码
            list_total: 0,
            list: [],
            loading: false,
            editRecord: null,//被选中的行
            showEdit: false//显示编辑窗口
        }
    }
    componentDidMount() {
        this.get_list();
    }

    get_list() {
        this.setState({ loading: true });
        //构建参数
        const { keyword, pageNumber, pageSize } = this.state;
        fd.getJSON(fd.ports.option.class.list, { keyword, pageNumber, pageSize }).then((result) => {
            this.setState({
                list: result.list,
                list_total: result.total,
                loading: false
            })
        }).catch((error) => {
            this.setState({ loading: false })
            Modal.error({
                title: "加载列表失败",
                content: error.message
            })
        })
    }

    handler_remove(class_id) {
        Modal.confirm({
            title: `删除课程`,
            content: `您确定删除`,
            onOk: () => {
                fd.postJSON(fd.ports.option.class.remove, { class_id }).then(() => {
                    this.get_list();
                }).catch((error) => {
                    Modal.error({
                        title: "删除课程出错",
                        content: error.message
                    })
                })
            }
        })

    }

    render() {
        //跳转选择
        if (!!this.state.redirect_student_list) {
            return (<Redirect to={{ pathname: '/student', state: { class_id: this.state.redirect_student_list } }} />);
        }else if(!!this.state.redirect_schedule){
            return (<Redirect to={{ pathname: '/schedule', state: { class_id: this.state.redirect_schedule } }} />);
        } else {
            //不跳转就渲染list

            //定义表格列
            const table_columns = [{
                title: '班级名称',
                dataIndex: `class_name`
            }, {
                title: '所属专业',
                dataIndex: `major_name`
            }, {
                title: '状态',
                dataIndex: `closed`
            }, {
                title: '学生人数',
                dataIndex: `total`
            }, {
                title: ``,
                key: `action`,
                width: 460,
                render: (text, record) => {
                    return (
                        <span>
                            <Button icon="calendar" type="primary"
                                onClick={()=>this.setState({redirect_schedule:record.class_id})}
                            >课程表</Button>
                            <span className="ant-divider" />
                            <Button icon="team"
                                onClick={() => this.setState({ redirect_student_list: record.class_id })}
                            >学生管理</Button>
                            <span className="ant-divider" />

                            <Button
                                icon="edit"
                                onClick={() => {
                                    this.setState({
                                        showEdit: true,
                                        editRecord: record
                                    })
                                }}
                            >编辑</Button>
                            <span className="ant-divider" />
                            <Button
                                icon="delete"
                                onClick={() => this.handler_remove(record.class_id)}
                            >删除</Button>
                        </span>
                    )
                }
            }]

            //分页定义
            const pagination = {
                total: this.state.list_total,
                defaultPageSize: this.state.pageSize,
                onShowSizeChange: (pageNumber, pageSize) => {
                    this.setState({ pageNumber, pageSize }, () => {
                        this.get_list()
                    })
                },
                onChange: (pageNumber, pageSize) => {
                    this.setState({ pageNumber, pageSize }, () => {
                        this.get_list()
                    })
                },
                showSizeChanger: true
            }

            return (
                <div>
                    <Contianer>
                        <div style={{ padding: 12 }}>

                            <Form layout="inline" style={{}} >
                                <Form.Item>
                                    <BtnCreate handler_refresh={() => this.get_list()} />
                                </Form.Item>
                                <Form.Item label="关键字">
                                    <Input defaultValue="" placeholder="请输入班级姓名" value={this.state.keyword}
                                        onChange={(e) => this.setState({ keyword: e.target.value })}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button icon="search" htmlType="submit">查找</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Contianer>
                    <Contianer>
                        <Spin spinning={this.state.loading}>
                            <div style={{ overflow: 'hidden' }}>
                                <Table
                                    columns={table_columns}
                                    dataSource={this.state.list}
                                    pagination={pagination}
                                    rowKey={(r) => r.room_id}
                                />
                            </div>
                        </Spin>
                    </Contianer>
                    {
                        this.state.showEdit && <Edit
                            visible={this.state.showEdit}
                            handler_close={() => this.setState({ showEdit: false })}
                            editRecord={this.state.editRecord}
                            handler_refresh={() => this.get_list()}
                        />
                    }

                </div>
            )
        }
    }
}
