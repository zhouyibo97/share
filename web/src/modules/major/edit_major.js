import React from 'react';

import Contianer from '../../component/container';

import fd from '../../base/fetchData';

import { Button, Table, Spin, Modal, Form, Input,Select } from 'antd';

class Edit extends React.Component {
    constructor(props) {
        super();
        this.state = {
            visible: false || props.visible,
            submitting: false,
            lesson_list:[]
        }
    }
    //显示弹层
    handler_show() {
        this.setState({
            visible: true
        })
    }
    //关闭弹层
    handler_hidden() {
        this.setState({
            visible: false
        });

    }

    //提交动作
    handler_submit(e) {
        if (e) {
            e.preventDefault();
        }
        this.props.form.validateFields((error, values) => {
            if (!error) {
                values.major_id = this.props.editRecord.major_id;
                //验证通过，提交请求
                this.setState({ submitting: true });
                fd.postJSON(fd.ports.option.major.update, values).then(() => {
                    this.setState({ submitting: false });
                    this.handler_hidden();
                    this.props.handler_refresh();
                }).catch((error) => {
                    Modal.error({
                        title: "添加教室错误",
                        content: error.message
                    })
                    this.setState({ submitting: false });
                })
            }
        })
    }
    async get_lesson(){
        try{
            this.setState({submitting:true});
            let list=await fd.getJSON(fd.ports.option.lesson.list);
            this.setState({lesson_list:list});
        }catch(error){
            Modal.error({
                title: "添加错误",
                content: error.message
            })
        }finally{
            this.setState({submitting:false});
        }
    }

    componentDidMount() {
        if (this.props.editRecord) {
            const { major_name, lesson_list, remark } = this.props.editRecord;
            this.props.form.setFieldsValue({
                major_name, lesson_list:lesson_list.split(","),  remark 
            });
        }
        this.get_lesson();
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
        return (
            <Modal
                title="添加教室"
                visible={this.state.visible}
                onCancel={() => this.handler_hidden()}
                maskClosable={false}
                footer={null}
                afterClose={() => this.props.handler_close()}
            >
                <Form onSubmit={(e) => { this.handler_submit(e) }} className="login-form">
                    <FormItem
                        {...formItemLayout}
                        label="专业名称"
                    >
                        {getFieldDecorator('major_name', {
                            rules: [{
                                max: 30,
                                message: `最多只能输入20个字`
                            }, {
                                required: true,
                                message: '必须输入名称',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="课程等级"
                    >
                        {getFieldDecorator('lesson_list', {
                            rules: [{
                                required: true, message: '必须选择课程',
                            }],
                        })(
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                            >
                                {
                                    this.state.lesson_list.map((v, k) => {
                                        return (
                                            <Select.Option key={v.lesson_id}>{v.lesson_name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                    >
                        {getFieldDecorator('remark', {
                            rules: [{
                                max: 200,
                                message: `最多只能输入200个字`
                            }],
                        })(
                            <Input.TextArea />
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ xs: { offset: 4, span: 20 } }}
                        style={{ marginBottom: 0, textAlign: 'right' }}
                    >
                        <Button type="primary" htmlType="submit" loading={this.state.submitting}>提交</Button>
                        <Button onClick={() => this.handler_hidden()} style={{ marginLeft: 15 }}>关闭</Button>
                    </FormItem>
                </Form>
            </Modal>

        )
    }
}

export default Form.create()(Edit);