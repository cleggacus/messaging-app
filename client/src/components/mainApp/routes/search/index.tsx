import React from 'react';
import './style.scss';
import {Search as SeacrchIcon, Users} from 'react-feather';
import axios from 'axios';

import SearchItem from './searchItem';

interface IState{
  users: {
    _id: string,
    username: string,
    picture: string,
    status: string
  }[]
}

interface IProps{
  username: string;
}

class Search extends React.Component<IProps, IState>{
  canSearch: boolean;

  constructor(props: IProps){
    super(props);

    this.canSearch = false;

    this.state = {
      users: []
    }
  }

  search(){
    let query: HTMLInputElement = document.querySelector('.search-bar-input') as HTMLInputElement;
    this.canSearch = true;
    
    this.setState({
      users: []
    }, () => {
      if(query.value){
        this.searchReq(query.value);
      }
    });
  }
  
  searchReq(q: string){
    
    if(this.canSearch){
      this.canSearch = false;
      console.log('yes');
      axios.post('/api/user/SearchUser', {query: q, skip: this.state.users.length, limit: 12}).then(res => {
        if(res.status == 200){
          let newUsers = this.state.users;

          for(let i = 0; i < res.data.users.length; i++){
            newUsers.push(res.data.users[i]);
          }

          this.setState({
            users: newUsers
          }, () => {
            this.canSearch = res.data.users.length == 12;
          })
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  onScroll(){
    let query: HTMLInputElement = document.querySelector('.search-bar-input') as HTMLInputElement;
    let content: HTMLDivElement = document.querySelector('.search-content') as HTMLDivElement;

    if(content.scrollTop + content.clientHeight >= content.scrollHeight - 200){
      this.searchReq(query.value);
    }
  }

  render(){
    const items = this.state.users.map((item, key) => {
      if(item.username != this.props.username){
        return(<SearchItem id={item._id} username={item.username} status={item.status} profilePicture={'/pictures/'+item.picture}></SearchItem>);
      }
    });

    return(
      <div className="search">
        <div className="search-bar">
          <input onKeyDown={(e) => {if(e.keyCode == 13) this.search();}} placeholder="search" className="search-bar-input"></input>
          <div onClick={() => this.search()} className="search-button"><SeacrchIcon color="var(--primary-fg)"></SeacrchIcon></div>
        </div>

        <div onScroll={() => this.onScroll()} className="search-content">
          {items}
        </div>
      </div>
    );
  }
}

export default Search;