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
            class_list:[]
        }
    }
    componentDidMount(){
        this.get_class();
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

    get_class(){
        fd.getJSON(fd.ports.option.class.all_list).then((result)=>{
            this.setState({
                class_list:result
            })
        }).catch((error)=>{
            Modal.error({
                title:"加载班级列表失败",
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
                fd.postJSON(fd.ports.option.student.create,values).then(()=>{
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
    //验证省份证号码
    isIdCard(value){
        return true;
        if(!value&&value!==0){
            return true;
        }
        var factor=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]
        var validCode=["1","0","x","9","8","7","6","5","4","3","2"]
        try{
            if(parseInt(value).toString().length!=18){
                return false;
            }else{
                var number=value.substring(0,17);
                var count=0;
                for(var i=0;i<number.length;i++){
                    count+=Number(number[i])*factor[i];
                }
                var last=validCode[count%11];
                var CardNumber=number.toString()+last;
                if(CardNumber.toUpperCase()==value.toUpperCase()){
                    return true;
                }else{
                    return false;

                }
            }
        }catch(ex){
            return false;
        }
    }
    

    render() {
        //验证组件
        const { getFieldDecorator } = this.props.form;
        //表单内输入项大小比例
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const FormItem = Form.Item;
        return (
            <span>
                <Button icon="file-add" onClick={() => this.handler_show()}>添加学生</Button>
                <Modal
                    title="添加学生"
                    visible={this.state.visible}
                    onCancel={() => this.handler_hidden()}
                    maskClosable={false}
                    footer={null}
                >
                    <Form onSubmit={(e) => { this.handler_submit(e) }} className="login-form">
                        <FormItem
                            {...formItemLayout}
                            label="学生姓名"
                        >
                            {getFieldDecorator('student_name', {
                                rules: [{
                                    max: 20,
                                    message: `最多只能输入20个字`
                                }, {
                                    required: true,
                                    message: '必须输入',
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="手机号"
                        >
                            {getFieldDecorator('mobile', {
                                rules: [{
                                    required: true, message: '必须填写',
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="身份证号码"
                        >
                            {getFieldDecorator('id_card_number', {
                                rules: [{
                                    required: true, message: '必须填写',
                                },{
                                    max:18,
                                    message:`身份证号码最大18位`
                                },{
                                    validator:(rule,value,callback)=>{
                                        if(this.isIdCard(value)){
                                            callback()
                                        }else{
                                            callback(`身份证号码有误`)
                                        }
                                    }
                                }],
                                initailValue:0
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="选择班级"
                        >
                            {getFieldDecorator('class_id', {
                                rules: [{
                                    required: true, message: '必须选择班级',
                                }],
                            })(
                                <Select placeholder="请选择"
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        
                                        this.state.class_list.map((v,k)=>{
                                            return(
                                                <Select.Option key={v.class_id}>{v.class_name}</Select.Option>
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