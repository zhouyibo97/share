import React from 'react';

import Contianer from '../../component/container';

import fd from '../../base/fetchData';

import { Button, Table, Spin, Modal, Form, Input, Select } from 'antd';

class Create extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            submitting: false,
            major_list:[]
        }
    }
    componentDidMount(){
        this.get_major();
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
        //重置表单
        this.props.form.resetFields();
    }

    get_major(){
        fd.getJSON(fd.ports.option.major.list).then((result)=>{
            this.setState({
                major_list:result
            })
        }).catch((error)=>{
            Modal.error({
                title:"加载专业列表失败",
                content:error.message
            })
        })
    }    
    
    //提交动作
    handler_submit(e) {
        if(e){
            e.preventDefault();
        }
        this.props.form.validateFields((error,values)=>{
            if(!error){
                //验证通过，提交请求
                this.setState({submitting:true});
                fd.postJSON(fd.ports.option.class.create,values).then(()=>{
                    this.setState({submitting:false});
                    this.handler_hidden();
                    this.props.handler_refresh();
                }).catch((error)=>{
                    Modal.error({
                        title:"添加教室错误",
                        content:error.message
                    })
                    this.setState({submitting:false});
                })
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
        return (
            <span>
                <Button icon="file-add" onClick={() => this.handler_show()}>添加班级</Button>
                <Modal
                    title="添加教室"
                    visible={this.state.visible}
                    onCancel={() => this.handler_hidden()}
                    maskClosable={false}
                    footer={null}
                >
                    <Form onSubmit={(e) => { this.handler_submit(e) }} className="login-form">
                        <FormItem
                            {...formItemLayout}
                            label="班级名称"
                        >
                            {getFieldDecorator('class_name', {
                                rules: [{
                                    max: 20,
                                    message: `最多只能输入20个字`
                                }, {
                                    required: true,
                                    message: '必须输入教室名称',
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="所属专业"
                        >
                            {getFieldDecorator('major_id', {
                                rules: [{
                                    required: true, message: '必须选择专业',
                                }],
                            })(
                                <Select placeholder="请选择专业">
                                    {
                                        this.state.major_list.map((v,k)=>{
                                            return(
                                                <Select.Option key={v.major_id}>{v.major_name}</Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="班级状态"
                        >
                            {getFieldDecorator('closed', {
                                rules: [{
                                    required: true, message: '必须选择',
                                }],
                                initailValue:0
                            })(
                                <Select >
                                    <Select.Option key="0">正常</Select.Option>
                                    <Select.Option key="1">闭班</Select.Option>
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
                            wrapperCol={{xs:{offset:4,span:20}}}    
                            style={{marginBottom:0,textAlign:'right'}}                    
                        >
                            <Button type="primary" htmlType="submit" loading={this.state.submitting}>提交</Button>
                            <Button onClick={()=>this.handler_hidden()}style={{marginLeft:15}}>关闭</Button>
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}

export default Form.create()(Create);