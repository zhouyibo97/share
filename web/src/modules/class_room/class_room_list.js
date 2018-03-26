import React from 'react';
import {Button,Table,Spin,Modal} from 'antd';
import Contianer from '../../component/container';

import fd from '../../base/fetchData';
import BtnCreate from './create_room';
import Edit from './edit_room';

export default class extends React.Component{
    constructor(){
        super();
        this.state={
            list:[],
            loading:false,
            editRecord:null,//被选中的行
            showEdit:false//显示编辑窗口
        }
    }
    componentDidMount(){
        this.get_list();
    }

    get_list(){
        this.setState({loading:true});
        fd.getJSON(fd.ports.option.class_room.list).then((result)=>{
            this.setState({
                list:result,
                loading:false
            })
        }).catch((error)=>{
            this.setState({loading:false})
            Modal.error({
                title:"加载列表失败",
                content:error.message
            })
        })
    }

    handler_remove(room_id){
        Modal.confirm({
            title:`删除教室`,
            content:`您确定删除`,
            onOk:()=>{
                fd.postJSON(fd.ports.option.class_room.remove,{room_id}).then(()=>{
                    this.get_list();
                }).catch((error)=>{
                    Modal.error({
                        title:"删除教室出错",
                        content:error.message
                    })
                })
            }
        })
        
    }

    render(){
        //定义表格列
        const table_columns=[{
            title:'教室名称',
            dataIndex:`room_name`
        },{
            title:'容纳人数',
            dataIndex:`size`
        },{
            title:``,
            key:`action`,
            width:260,
            render:(text,record)=>{
                return(
                    <span>
                        <Button
                            icon="edit"
                            onClick={()=>{
                                this.setState({
                                    showEdit:true,
                                    editRecord:record
                                })
                            }}
                        >修改</Button>
                        <span className="ant-divider" />
                        <Button
                            icon="delete"
                            onClick={()=>this.handler_remove(record.room_id)}
                        >删除</Button>
                    </span>
                )
            }
        }]

        return(
            <div>
                <Contianer>
                    <div style={{padding:12}}>
                        <BtnCreate handler_refresh={()=>this.get_list()}/>
                    </div>
                </Contianer>
                <Contianer>
                    <Spin spinning={this.state.loading}>
                        <div style={{overflow:'hidden'}}>
                            <Table
                                columns={table_columns}
                                dataSource={this.state.list}
                                pagination={false}
                                rowKey={(r)=>r.room_id}
                            />
                        </div>
                    </Spin>
                </Contianer>
                {
                    this.state.showEdit&&<Edit
                    visible={this.state.showEdit}
                    handler_close={()=>this.setState({showEdit:false})}
                    editRecord={this.state.editRecord}
                    handler_refresh={()=>this.get_list()}
                />
                }
                
            </div>
        )
    }
}
