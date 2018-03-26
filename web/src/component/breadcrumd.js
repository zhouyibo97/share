/**面包屑组件 */

import React from 'react';
import {Breadcrumb,Icon} from 'antd';
import menuData from '../options/left_menu';

export default class extends React.Component{

    find_path(url){
        const path=[];
        const find=(list=[])=>{
            for(let item of list){
                //保存进入路径
                path.push(item);
                switch(item.type){
                    case "SubMenu":
                    case "MenuItemGroup":
                        if(find(item.children)){
                            return true;
                        }
                        break;
                    case "Item":
                        if(url==item.url){
                            return true;
                        }
                }
                path.pop();
            }
        }
        find(menuData);
        return path;
    }

    create_item(){
        
        const url=window.location.pathname;
        
        console.log(url)
        return this.find_path(url).map((v,k)=>{
            return(
                <Breadcrumb.Item key={`k`}>
                    <Icon type={v.icon}/>
                    <span>{v.title}</span>
                </Breadcrumb.Item>
            )
        });
    }

    render(){
        return (
            <Breadcrumb className="breadcrumb">
                
                {
                    this.create_item()
                }
            </Breadcrumb>
        )
    }
}