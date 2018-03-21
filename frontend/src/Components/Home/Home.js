import React from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';


class Home extends React.Component {
    state = { user: undefined }
    getUser = () => {
        axios
        .get()
        .then(res => {
            this.setState({
                user: res.data.loggedin
            })
        }).catch(err => {
            this.setState({
                user: null
            })
        })
    }
    componentDidMount() {
        this.getUser();
    }
    render() {
        const { user } = this.state
       
        if (user) {
            console.log('User detected')
            return <Redirect to='/user' />
        } else if (user === null) {
            return <Redirect to='/login' />
        }
        return (
            <span>loading...</span>
        )
    }
}

export default Home;