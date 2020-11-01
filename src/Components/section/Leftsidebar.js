import React,{useContext,useEffect,useState} from 'react'
import '../css/leftsidebar.css'
import Avatar from '@material-ui/core/Avatar';
import ChatRoundedIcon from '@material-ui/icons/ChatRounded';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import { IconButton } from '@material-ui/core';
import {DataContext} from '../Context';
import WhatshotRoundedIcon from '@material-ui/icons/WhatshotRounded';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';


export default function Leftsidebar(props) {
    const [ChatUser, setChatUser] = useState([])
    const [profile, toggleProfile] = useState(false)
    const [search, setSearch] = useState('');
    
    var context = useContext(DataContext); 
   
    useEffect(() => {
        // console.log('User',context.User);
        setChatUser(context.ChatUsers);
    },[context.ChatUsers])

    function getClickUser(id) {
        context.getcUserById(id);
        context.getChatById(context.User.id, id);
    }

    function handleSearch(e) {
        var str = e.target.value.toLowerCase();
        if(ChatUser && str.length > 0) {
            var searchedData = context.ChatUsers.filter(u => u.Name.toLowerCase().search(str) !== -1)
            // console.log('searched user', searchedData);
            setChatUser(searchedData);
        }
        else {
            setChatUser(context.ChatUsers);
        }
    }

    return (
        <div>
        <div className="left_sidebar">
            <div className='left_header'>
                <div>
                <Avatar onClick={() => toggleProfile(!profile)}>H</Avatar>
                </div>
                <div className='header_icon'>
                    <div><IconButton><ChatRoundedIcon style={{color:'gray',fontSize: 23 }} /></IconButton></div>
                    <div><IconButton><MoreVertRoundedIcon style={{color:'gray',fontSize: 23 }} /></IconButton></div>
                </div>
            </div>
            <div className='left_search'>
                <input type='text' className='input_search' placeholder='search' onChange={e => handleSearch(e)} />
            </div>
            <div className='left_chat'>
                { ChatUser.length > 0 ? ChatUser.map(item => (
                    <div onClick={() => getClickUser(item.id)} key={item.id} className='users'>
                    <div className='user_avatar'><Avatar>A1</Avatar></div>
                    <div className='user_name_msg'>
                        <h4>{item.Name}</h4>
                        <span>{context.lastMsg.map(m => (m && item.id === m.id && m.message))}</span>
                    </div>
                    <div className='new_msg_icon'>12</div>
                    <span style={{fontSize:'10px',color:'#777'}}>{item.online}</span>
                </div>
                )) : ""}
            </div>
        </div>
        <div className="left_sidebar" style={{display:profile ? "block" : "none"  }}>
            <div className='left_profile'>
                <div className='left_profile_close'>
                    <ArrowBackRoundedIcon onClick={() => toggleProfile(!profile)} style={{color:'white',fontSize: 25 }} />
                    <span>Profile</span>
                </div>
                <div className='right_blank profile-anim'>
                    <div className='avatar' style={{background:'#a4b4c4',borderRadius:'50%'}}><IconButton><WhatshotRoundedIcon style={{fontSize:'100px',color:'#5a6a7a'}} /></IconButton></div>
                <div className='user_profile_name'>
                    <div>Your Name</div>
                    <p>{profile && context.User.Name}</p>
                </div>
                <hr />
                <div className='user_profile_name'>
                    <div>Your Status</div>
                    <p>{profile && context.User.Status}</p>
                </div>
                </div>
            </div>
        </div>
        </div>
    )
}
