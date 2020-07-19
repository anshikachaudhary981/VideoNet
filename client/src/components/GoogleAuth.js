import React from 'react';
import {connect} from 'react-redux';
import { signIn , signOut} from '../actions';

const dotenv = require('dotenv');
dotenv.config();

class GoogleAuth extends React.Component{
    componentDidMount(){
        window.gapi.load('client:auth2',()=>{
            window.gapi.client.init({
                clientId : process.env.client_id,
                scope : 'email'
            }).then(()=>{
                this.auth = window.gapi.auth2.getAuthInstance();
                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);
            });
        });
    }

    onAuthChange=(isSignedIn)=>{

        if(isSignedIn){
            this.props.signIn(this.auth.currentUser.get().getId());
        }
        else{
            this.props.signOut();
        }
    }

    onSignInClick = ()=>{

        this.auth.signIn();

    }

    onSignOutClick = ()=>{
        this.auth.signOut();
    }
    renderAuthButton(){
        if(this.props.isSignedIn === null){
            return null;
        }
        else if(this.props.isSignedIn){
            return (
            <button onClick = {this.onSignOutClick}className="ui red google button">
                <i className="google icon"></i>
                SignOut
            </button>
            )
        }
        else{
            return (
                <button onClick={this.onSignInClick} className="ui red google button">
                <i className="google icon"></i>
                SignIn With Google
            </button>
            )
            
        }
    }
    render(){
        return <div>{this.renderAuthButton()}</div>
    }
};

const mapStateToProps = (state) =>{
    return {isSignedIn:state.auth.isSignedIn};
};
export default connect(mapStateToProps,
    {signIn,signOut
    })
    (GoogleAuth);