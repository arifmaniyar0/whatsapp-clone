import React,{useState, useEffect, createContext} from 'react'
import axios from 'axios';
import Pusher from 'pusher-js';
import {useCookies} from "react-cookie";
import { useHistory } from 'react-router-dom';

export const DataContext = createContext();

const urls = {
  wUser : 'http://localhost:5000/api/User',
  wLogin : 'http://localhost:5000/login',
  wAllChat : 'http://localhost:5000/api/allChat',
  wGetChatUserById : 'http://localhost:5000/api/getChatUserById',
  wChatUsers : 'http://localhost:5000/api/ChatUsers',
  wLastMessage : 'http://localhost:5000/api/lastMessage',
  sendMessage : 'http://localhost:5000/api/addMessage',
  uploadFile : 'http://localhost:5000/api/uploadFile',
}


export function DataProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [User, setUser] = useState(null);
    const [cUser, setCUser] = useState(null);
    const [ChatUsers, setChatUser] = useState([]);
    const [messages, setMessages] = useState([]);
    const [lastMsg, setLastMsg] = useState([]);
    const [getCookie, setCookie] = useCookies(['userToken','']);
    let history = useHistory();
    // var token = getCookie.userToken;

    useEffect(() => {
      if(getCookie.userToken) { setIsLoggedIn(true)}
      else { setIsLoggedIn(false)}
    },[getCookie.userToken])

    useEffect(() => {
      // console.log(isLoggedIn)
      // if(isLoggedIn === false) { return history.push('/login') }
        axios.get(urls.wUser, { headers : {
          authorization : getCookie.userToken
        }})
        .then(res => {
          const result = res.data;
          console.log('User Api ', result)
          if(result.status === 400) 
          {
            return history.push('/login')
          }
          
            const user = result;
            setUser(user);
            // console.log('User',user)
            if(user !== null && user !== undefined && Object.keys(user).length) {
              console.log('ChatUsers',user)
              getChatUser(user.id);
            }
        });

    },[])

    // new messages
    useEffect(() => {
      var pusher = new Pusher('4399ccb6dcaab160511d', {
        cluster: 'ap2'
      });
      // console.log('m_rc_pusher',[User, cUser]);
      var channel = pusher.subscribe('chatroom');
        channel.bind('newMessage', function(data) {
        // alert(JSON.stringify(data));
        var uid = data.message.uid;
        var cid = data.message.cid;
        // console.log('pushermsg get',data.message);
        if(User !== null && cUser !== null) {
          if((uid === User.id && cid === cUser.id) || (cid === User.id && uid === cUser.id)) {
            data.message.time = new Date(data.message.time).toLocaleTimeString().split(' ')[0];
            setMessages([...messages, data.message])
            getLastMessage(ChatUsers)
          }
        }
        else {            
        }
        });
    },[messages])

    const userLogin = async (payload) => {
      const res = await axios.post(urls.wLogin, payload)
      let result = { status : false, message : 'something went wrong'}
      try {
        if(res) {
            //  console.log('result', res.data)
            var response = res.data;
            if(response.status === 200) {
                delete response.status;
                let expires = new Date()
                expires.setTime(expires.getTime() + (response.expires_in*60))
                setCookie("userToken", response.token, {path: "/", expires});
                // setCookie("User", response.user, {path: "/", expires});
                var isUser = getCurrentUser();
                if(isUser) {
                  result.status = true;
                  result.message = 'Logged in Successfully';
                  return result;
                }
                return result

          }
          else {
            result.message = response.message;
            return result;
          }
        }
      }
      catch(err) {
        return result;
      }
    }
    function getcUserById(id) {
      console.log('cUser',id)
        axios.get(`${urls.wGetChatUserById}/${id}`, { headers : {
          authorization : getCookie.userToken
        }})
      .then(res => {
        const cuser = res.data;
        console.log('cuser', cuser[0])
        setCUser(cuser[0]);
      })
      getChatById(User.id, id);
    }

    function getChatById(uid, cid) {
        const users = {
            uid : uid,
            cid : cid
        }
      axios({ method : 'post', url : urls.wAllChat, headers : {
        authorization : getCookie.userToken
      }, data : users })
      .then(res => {
        const chat = res.data;
        // console.log('chat', chat)
        setMessages(chat);
      })
    }

    function getCurrentUser() {
        axios.get(urls.wUser, { headers : {
          authorization : getCookie.userToken
        }})
        .then(res => {
          const user = res.data;
          console.log('current user get', user)
          delete user.Password;
          if (user.status === 200) {
            setUser(user)
            return true
          }
          return false
        })
    }

    function getChatUser(id) {
        axios({ method:'post', url : `${urls.wChatUsers}`, headers : {
          authorization : getCookie.userToken
        }, data : { id : id }})
        .then(res => {
          const chatuser = res.data;
          setChatUser(chatuser);

          /// get last message
          getLastMessage(chatuser)
        }).catch(err =>
          alert('problem in chat users')
        )
    }

    function getLastMessage(chatuser) {
      var cuserids = [];
          chatuser.map(u => {
            cuserids.push(u.id)
          })
          
          axios({ method:'post', url : urls.wLastMessage, headers : {
            authorization : getCookie.userToken
          }, data : cuserids})
          .then(res => {
            // console.log('last_msg',res);
            if(res.status === 200) {
              setLastMsg(res.data);
            }
          }).catch(err => alert('Error'));
    }

    function sendMessage(chat_message) {

      axios({ method : 'post', url : urls.sendMessage, headers : {
        authorization : getCookie.userToken
      }, data : { chat_message : chat_message } })
      .then(res => console.log(res));

    }

    function uploadImage(formData) {
     
      axios({ method : 'post', url : urls.uploadFile, headers : {
        authorization : getCookie.userToken
      }, data : { formData : formData } })
      .then(res => res.data)
    }

    return (
        <DataContext.Provider value={{ isLoggedIn, User, ChatUsers, messages, cUser, lastMsg, userLogin, uploadImage, getCurrentUser, getChatUser, getChatById, getcUserById, sendMessage}}>
            {props.children}
        </DataContext.Provider>
    )
}
