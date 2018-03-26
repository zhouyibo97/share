import React, { Component } from 'react'; 
import logo from './logo.svg';
import './App.css';
import 'moment/locale/zh-cn';//引入monent国际化设置，实现弹层中的文字都为中文

import Layout from './component/layout'
import { BrowserRouter } from 'react-router-dom';

import fd from './base/fetchData';
class App extends Component {
  

  render() {
    return (
      <BrowserRouter>
        <Layout/>
      </BrowserRouter>
    );
  }
}

export default App;
