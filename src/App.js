import React, { Component } from 'react';
import {Button,FormControl} from 'react-bootstrap';
import axios from 'axios';
import User from './components/User';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
        users:[],
        recentlyUpdated:false,
        newUserName:''
      };
  }
    
  componentDidMount() {
    axios.get(`https://simple-rest-weld.herokuapp.com/users`)
      .then(res => {
        const users = res.data.map((user)=>{
            user.editMode = false;
            return user;
        })
        console.log(users);
        
        this.setState({users});
      })
  }

  deleteUser = (index, e) => {
    const users = Object.assign([], this.state.users),
          user = users[index];
    users.splice(index, 1);
    axios.delete(`https://simple-rest-weld.herokuapp.com`)
      .then(res => {
        console.log('DELETE', user);
        this.setState({users});
        const str = 'User ' + user.name + ' is deleted!';
        alert(str);
    })
  }

  changeUserName = (id, event) => {
    const index = this.state.users.findIndex((user)=> {
        return (user.id === id);
    })

    const user = Object.assign({}, this.state.users[index]);
    user.name = event.target.value;

    const users = Object.assign([], this.state.users);
    users[index] = user;

    this.setState({users});
  }
  
  changeMode = (id, event) => {  
    const index = this.state.users.findIndex((user)=> {
        return (user.id === id);
    });
    
    if (!this.state.users[index].name) {
      return;
    }

    const user = Object.assign({}, this.state.users[index]);
    user.editMode = !user.editMode;

    const users = Object.assign([], this.state.users);
    users[index] = user;
      
    if(!user.editMode) {
        axios.put(`https://simple-rest-weld.herokuapp.com`)
          .then(res => {
            console.log('PUT', user);
            setTimeout(()=>{
              this.setState({recentlyUpdated:false});
            },2000)
            this.setState({users,recentlyUpdated:user.name});  
        })
    } else {
        this.setState({users});
    }
  }
  
  editNewUserName(event) {
      this.setState({newUserName:event.target.value});
  }
  
  addUser() {
      if(!this.state.newUserName.length) {
          return
      }
      const users = Object.assign([], this.state.users),
            user = {
              name: this.state.newUserName,
              id: users[users.length-1].id + 1
            };
      users.push(user);
      axios.post(`https://simple-rest-weld.herokuapp.com`)
        .then(res => {
          console.log('POST', user);
          setTimeout(()=>{
              this.setState({recentlyUpdated:false});
          },2000)
          this.setState({
              users,
              recentlyUpdated:user.name,
              newUserName:''
          });
      })
  }

  render(){

    return (
      <div>
        {this.state.recentlyUpdated &&
        <p className="updated">User {this.state.recentlyUpdated} is saved!</p>
        }
        <h1>Name</h1>
        <ul>
          {
            this.state.users.map((user, index) => {
              return (<User
                remove={this.deleteUser.bind(this,index)}
                change={this.changeMode.bind(this, user.id)}
                edit={this.changeUserName.bind(this, user.id)}
                editMode={user.editMode}
                key={user.id} >{user.name}</User>)
            })
          }
          <li>
              <FormControl 
                onChange={this.editNewUserName.bind(this)}
                value={this.state.newUserName}
              />
              <Button 
                bsStyle="success" 
                onClick={this.addUser.bind(this)}
              >Add</Button>
          </li>
        </ul>
        
      </div>
    )
  }
}
export default App;