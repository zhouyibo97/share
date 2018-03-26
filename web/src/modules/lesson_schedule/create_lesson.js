import React from 'react';
import Container from '../../component/container';
import moment from 'moment';
import fd from '../../base/fetchData';
import { is } from 'immutable';

import { Button, Table, Spin, Modal, Form, Input, Select, TimePicker } from 'antd';

class Craete extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false || props.visible,
            submitting: false,
            date: null || props.editRecord,
            lesson_list: [],
            room_list: []
        }
    }

    componentWillReceiveProps(nextPropss) {
        console.log("组件刷新", this.props);
        //显示窗口的判断
        if (nextPropss.visible && (nextPropss.visible != this.props.visible)) {
            this.setState({ visible: nextPropss.visible });
        }
        //日期改变的判断
        if (!is(nextPropss.editRecord, this.props.editRecord) || !is(nextPropss.lesson_list, this.props.lesson_list)) {
            //计算当日课程
            let today_lesson = nextPropss.lesson_list.filter((v, k) => {
                if (moment(nextPropss.editRecord).format("YYYY/MM/DD") === moment(v.begin_time).format("YYYY/MM/DD")) {
                    return true;
                } else {
                    return false;
                }
            });
            this.setState({ date: nextPropss.editRecord, lesson_list: today_lesson });
        }
    }

    componentDidMount() {
        this.get_room_list();
    }
    //加载教室列表
    get_room_list() {
        fd.getJSON(fd.ports.option.class_room.list).then((result) => {
            this.setState({ room_list: result });
        }).catch((error) => {
            Modal.error({
                title: "加载教室列表失败",
                content: error.message
            });
        });
    }

    //显示弹层
    handler_show() {
        this.setState({
            visible: true
        });
    }
    //关闭弹层
    handler_hidden() {
        this.setState({
            visible: false
        });
        //重置表单
        this.props.form.resetFields();
    }

    //提交动作
    handler_submit(e) {
        if (e) {
            e.preventDefault();
        }

        this.props.form.validateFields((error, values) => {
            if (!error) {
                //预提处理交参数
                let begin_time = moment(`${this.state.date.format("L")} ${values.begin_time.format("HH:mm")}:00`),
                    end_time = moment(`${this.state.date.format("L")} ${values.end_time.format("HH:mm")}:00`);
                Object.assign(values, { begin_time, end_time, class_id: this.props.class_id });
                //验证通过，提交请求
                this.setState({ submitting: true });
                fd.postJSON(fd.ports.option.schedule.create, values).then(() => {
                    this.setState({ submitting: false });
                    this.props.handler_refresh();
                }).catch((error) => {
                    Modal.error({
                        title: "添加教室出错",
                        content: error.message
                    })
                    this.setState({ submitting: false });
                });
            }
        });


    }

    handler_remove(schedule_id) {
        Modal.confirm({
            title: "确认删除",
            content: "您确认要删除该课时吗？",
            onOk: () => {
                fd.postJSON(fd.ports.option.schedule.remove, { schedule_id }).then(() => {
                    this.props.handler_refresh();
                }).catch((error) => {
                    Modal.error({
                        title: "删除课时失败",
                        content: error.message
                    })
                });
            }
        })


    }

    render() {
        //验证组件
        const { getFieldDecorator } = this.props.form;
        //表单内输入项大小比例 
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };

        const FormItem = Form.Item;

        //定义表格列
        const table_columns = [{
            title: `开始时间`,
            dataIndex: `begin_time`,
            render: (text) => `${moment(text).format("HH:mm")} 开始`
        }, {
            title: `结束时间`,
            dataIndex: `end_time`,
            render: (text) => `${moment(text).format("HH:mm")} 结束`
        }, {
            title: `教室`,
            dataIndex: `room_name`,
            render: (text) => `教室：${text}`
        }, {
            title: ``,
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button icon="delete" size="small"
                        onClick={() => this.handler_remove(record.schedule_id)}
                    >
                        删除
                    </Button>
                </span>
            )
        }];

        return (
            <span>
                <Button
                    icon="file-add" onClick={() => this.handler_show()}
                    disabled={!this.props.editRecord}
                >添加课时</Button>
                <Modal
                    title="添加课时"
                    visible={this.state.visible}
                    onCancel={() => this.handler_hidden()}
                    maskClosable={false}
                    footer={null}

                    afterClose={() => this.props.handler_close()}
                >
                    <Table
                        dataSource={this.state.lesson_list}
                        columns={table_columns}
                        bordered={false}
                        size="small"
                        showHeader={false}
                        key={"lesson_"}
                        pagination={false}
                    />
                    <Form onSubmit={(e) => this.handler_submit(e)}>
                        <FormItem
                            {...formItemLayout}
                            label="开始时间"
                        >
                            {getFieldDecorator('begin_time', {
                                rules: [{
                                    required: true,
                                    message: '必需输入时间',
                                }],
                            })(
                                <TimePicker format={'HH:mm'} minuteStep={5} />
                                )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="结束时间"
                        >
                            {getFieldDecorator('end_time', {
                                rules: [{
                                    required: true,
                                    message: '必需输入时间!',
                                }]
                            })(
                                <TimePicker format={'HH:mm'} minuteStep={5} />
                                )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="选择教室"
                        >
                            {getFieldDecorator('room_id', {
                                rules: [{
                                    required: true,
                                    message: '必需选择',
                                }],
                                initailValue: 0
                            })(
                                <Select
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        this.state.room_list.map((v, k) => {
                                            return (
                                                <Select.Option key={v.room_id}>{v.room_name}</Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                                )}
                        </FormItem>
                        <FormItem
                            wrapperCol={{ xs: { offset: 4, span: 20 } }}
                            style={{ marginBottom: 0, textAlign: 'right' }}
                        >
                            <Button type="primary" htmlType="submit" loading={this.state.submitting}>提交</Button>

                            <Button onClick={() => this.handler_hidden()} style={{ marginLeft: 15 }} >关闭</Button>
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create()(Craete)