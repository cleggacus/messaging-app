import React from 'react';

import axios from 'axios';

import { Redirect } from 'react-router-dom';

interface IState {
  loading: boolean,
  redirect: boolean
}

export default (ComponentToProtect:any) => {
  return class extends React.Component<{}, IState>{
    constructor(props: any) {
      super(props);

      this.state = {
        loading: true,
        redirect: false
      };
    }

    componentDidMount() {
      axios.get(`/api/user/auth`, {withCredentials: true}).then(res => {
        if(res.status == 200){
          this.setState({ loading: false });
        }else{
          const error = new Error(res.data);
          throw error;
        }
      }).catch(err => {
        console.error(err);
        this.setState({ loading: false, redirect: true });
      });
    }

    render() {
      if (this.state.loading) {
        return null;
      }
      if (this.state.redirect) {
        return <Redirect to="/entry" />;
      }
      return <ComponentToProtect {...this.props} />;
    }
  }
}