/**路由引入 */
import React from 'react';
import{
    Route,
    Switch
}from 'react-router-dom';

//引入功能性组件
import NotFound from './component/NotFound';
//引入业务组件
import ClassRoom from './modules/class_room/class_room_list';
import Lesson from './modules/lesson/lesson_list';
import Major from './modules/major/major_list';
import ClassList from './modules/class/class_list';
import Student from './modules/student/student_list';
import Schedule from './modules/lesson_schedule/schedule';

export default ()=>(
    <Switch>
        {/*教室管理*/}
        <Route path="/room" component={ClassRoom}/>
        {/*课程管理*/}
        <Route path="/lesson" component={Lesson}/>
        {/*专业管理*/}
        <Route path="/major" component={Major}/>
        {/*班级管理*/}
        <Route path="/class" component={ClassList}/>
        {/*学生管理*/}
        <Route path="/student" component={Student}/>
        {/*课程表*/}
        <Route path="/schedule" component={Schedule}/>
        {/*404*/}
        <Route component={NotFound} />
    </Switch>

)