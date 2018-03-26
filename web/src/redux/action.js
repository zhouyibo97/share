import types from './actionTypes';
//import immutable from 'immutable';

let action={};
export default action; 

action[types.COLLAPSED_VIEW_SIDER]=(state,date)=>{ 
    return state.setIn(["view","collapsed"],date);  //state是immutable对象，date是true/false
}
 