import React,{ useState, useEffect, useContext, createRef } from 'react'
import '../css/rightsidebar.css'
import { Avatar, IconButton } from '@material-ui/core'
import AttachmentRoundedIcon from '@material-ui/icons/AttachmentRounded';
import MoreVertRoundedIcon from '@material-ui/icons/MoreVertRounded';
import MoodRoundedIcon from '@material-ui/icons/MoodRounded';
import MicRoundedIcon from '@material-ui/icons/MicRounded';
import axios from 'axios';
import {DataContext} from '../Context';
import WhatshotRoundedIcon from '@material-ui/icons/WhatshotRounded';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';

export default function Rightsidebar(props) {
    
    var context = useContext(DataContext);
    var myref = createRef();

    const [chat_msg, setChatMsg] = useState('');
    const [message, setMessage] = useState([]);
    const [user, setUser] = useState(null);
    const [cuser, setCuser] = useState(null);
    const [cuserProfile, togglecUserProfile] = useState(false);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [ViewImg, setViewImg] = useState(null);
    const [SearchBar, setSearchBar] = useState(false);
    const [searchMessage, setSearchMessage] = useState([]);

    useEffect(() => {
            if(context.User === null) console.log('check user', props)
            setUser(context.User)
            setCuser(context.cUser)
            setSearchBar(false)
            setSearchMessage([])
            togglecUserProfile(false)
    },[context.cUser])

    useEffect(() => {
            setMessage(context.messages);
    }, [context.messages]);
    
    function handleAttach() {
        myref.current.click();
    }
   
    function SendMessage(e) {
        e.preventDefault();
        if(chat_msg.length > 0 || chat_msg !== '') {
            const chat_message = {
                id : new Date().getTime(),
                message : chat_msg,
                time : new Date().toLocaleTimeString().split(' ')[0],
                uid : user.id,
                cid : cuser.id
            }
            // alert(JSON.stringify(chat_message));
            context.sendMessage(chat_message);
            // setMessage([...message, chat_message])
            setChatMsg('');
        }
        else{
            alert('empyt msg')
        }
    }

    function handleFileChange(e) {
        const img = e.target.files[0];
        if(img) {
            setFile(img);
            const imgUrl = URL.createObjectURL(e.target.files[0]);
            setPreview(imgUrl);
        }
    }

    function handlePreviewBack () {
        setPreview(null);
        setFile(null);
    }

    const uploadFile = async (e) => {
        // e.persist(); 
        e.preventDefault(); 
        console.log(e)
        const formData = new FormData(); 
         
        console.log('upload',file); 
    
        formData.append( 
          "image", 
          file, 
          file.name 
        ); 
        
        try {
          context.uploadImage(formData)
          
          setPreview(null);
          setFile(null);
          
         } catch(err) {
           console.log('file post error ', err)
         }    
        
      }

    const handleSearch = (e) => {
        const searchedMessage = e.target.value.toLowerCase().trim();
        if(searchedMessage) {
            var msg = message.filter(m => (m.type === 'text' && m.message.toLowerCase().search(searchedMessage) !== -1))
            setSearchMessage(msg)
        }
        else {
            setSearchMessage([])
        }
    }
    return (
        cuser ?
        <>
        <div className="right_sidebar">
            <div className='right_header'>
                <div onClick={() => {
                        togglecUserProfile(!cuserProfile);
                        setSearchBar(false);
                        }} style={{padding:'0 10px 0 0'}}>
                    <Avatar>{context.cUser.Name}</Avatar>
                </div>
                <div className='user_name_msg user_details'>
                        <h4>{context.cUser.Name}</h4>
                        <span>{message.length > 0 && message[message.length - 1].time}</span>
                    </div>
                <div className='header_icon'>
                    <div><IconButton><SearchRoundedIcon onClick={() => {
                        setSearchBar(true)
                        setSearchMessage([]);
                        togglecUserProfile(false);}} style={{color:'gray',fontSize: 25 }} /></IconButton></div>
                    <div><IconButton><MoreVertRoundedIcon style={{color:'gray',fontSize: 25 }} /></IconButton></div>
                </div>
            </div>
            <div className='right_chat' style={{padding: preview && '0'}}>
                {preview === null ? message.map(({id, message, type, time, uid}) => (                    
                   <div key={id} className={ uid !== context.User.id ? 'message_chat_receive' : 'message_chat_receive message_chat_send'}> 
                        <div className='message_body' style={{padding:type==='image'?'4px 4px':'',borderRadius:type==='image'?'7px':'4px'}}>
                            {type === 'image' ? 
                            <img onClick={() => setViewImg(message)} style={{minWidth:'200px',minHeight:'200px',objectFit:'cover'}} width='100px' alt={message} src={require(`../../Images/${message}`)} /> : message}
                        <span className='msg_time' style={type === 'image' ? {display:'flex',flexDirection:'column',alignItems:'flex-end',bottom:'2px'} : {}}>{time}</span></div>
                    </div>
                )) : 
                <div className='image_preview_body'>
                    <div className='image_preview_header'>
                    <ArrowBackRoundedIcon onClick={() => handlePreviewBack()} style={{color:'gray',fontSize: 25 }} />
                    </div>
                    <div className='preview_image'><img width='250' src={preview} alt='previewImage' /></div>
                    <hr />
                    <div className='preview_image_send_button'>
                    {/* <form onSubmit={(e) => uploadFile(e)}> */}
                        <IconButton type='button' onClick={(e) => uploadFile(e)} style={{backgroundColor:'#50c9c9'}}><SendRoundedIcon style={{color:'white',fontSize: 27 }} /></IconButton>
                    {/* </form> */}
                    </div>
                    <hr />
                </div>}                
            </div>
            <div className='right_input'>
                <div className='right_input_box'>
                    <div><IconButton><MoodRoundedIcon style={{color:'gray',fontSize: 27 }} /></IconButton></div>
                    <div>
                        <input type='file' style={{display:'none'}} onChange={(e) => handleFileChange(e)} ref={myref} />
                        <IconButton onClick={() => handleAttach()}><AttachmentRoundedIcon style={{color:'gray',fontSize: 27 }} /></IconButton>
                        </div>
                    {/* <div><IconButton><Attach /></IconButton></div> */}
                    <div className='input_send_msg'>
                        <form onSubmit={(e) => SendMessage(e)}>
                            <input type='text' value={chat_msg} onChange={(e) => setChatMsg(e.target.value)} />
                            <button type='submit' value='' style={{display:'none'}} />
                        </form>
                    </div>
                    <div><IconButton><MicRoundedIcon style={{color:'gray',fontSize: 27 }} /></IconButton></div>
                </div>
            </div>
        </div>
        <div className='cUser' style={{width:'63%',display:SearchBar ? '' : 'none'}}>           
            <div className='left_profile'>
                <div className='left_profile_close'>
                    <ArrowBackRoundedIcon onClick={() => setSearchBar(false)} style={{color:'white',fontSize: 25 }} />
                    <span>Search Bar</span>
                </div>
                <div style={{position:'relative',top:'15%'}}>
                <div className='left_search'>
                    <input type='text' className='input_search' onChange={(e) => handleSearch(e)} placeholder='search' />
                </div>
                <div style={{overflowY:'scroll',height:'71vh'}}>
                   { searchMessage.length > 0 && searchMessage.map(sm => ( 
                   <div className='chat_search_box'>
                        <div class='message_body' style={{maxWidth:'100%',overflow:'hidden'}}>
                            {sm.message}
                            <span className='msg_time'>{sm.time}</span>
                        </div>
                    </div>))}
                </div>

                </div>
            </div>
        </div>
        <div className='cUser' style={{width:'60vw',display:!cuserProfile && 'none'}}>
            <div className='left_profile'>
                <div className='left_profile_close'>
                    <ArrowBackRoundedIcon onClick={() => togglecUserProfile(false)} style={{color:'white',fontSize: 25 }} />
                    <span>User Profile</span>
                </div>
                <div className='right_blank chatUser-profile-anim' style={{background:'#e8e7ec'}}>
                    <div className='avatar' style={{background:'#a4b4c4',borderRadius:'50%'}}><IconButton><WhatshotRoundedIcon style={{fontSize:'100px',color:'#5a6a7a'}} /></IconButton></div>
                <div style={{marginTop:'15px',fontSize:'30px'}}>{cuser.Name}</div>
                {/* <hr /> */}
                <div style={{marginTop:'15px',fontSize:'25px'}}>{cuser.Status}</div>
                </div>
            </div>
        </div>
        { ViewImg && <div className='ImageView'>
            <div className='ImageViewBack'>
                <ArrowBackRoundedIcon onClick={() => setViewImg(null)} style={{color:'white',fontSize: 25 }} />
            </div>
            <div className='ImageBody'>
                <img alt={ViewImg} src={require(`../../Images/${ViewImg}`)} />
            </div>
        </div>}
        </>
        :
        <div className='right_sidebar'>
        <div className='right_blank' style={{backgroundColor:'skyblue'}}>
            <div style={{background:'#a4b4c4',borderRadius:'50%'}}><IconButton><WhatshotRoundedIcon style={{fontSize:'100px',color:'#5a6a7a'}} /></IconButton></div>
            <div style={{marginTop:'15px',fontSize:'30px'}}>Stay Connected</div>
        </div>
        </div>
    
    
    )
}
