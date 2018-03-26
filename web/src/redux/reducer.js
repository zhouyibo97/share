
import action from './action';
import initailState from './state';

export default (state=initailState,{type,data})=>{
    
        if(action[type]){
            //找到action
            return action[type](state,data); 
        }else{
            //没找到action
            console.log("redux未找到对应的action",type,data);
            return state;
        }
        
    
}
