/* eslint-disable react/prop-types */
import { useContext, useEffect,useLayoutEffect, useRef, useState } from "react"
import SocketContext from '../../socketContext'
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function MySelf(props) {
    const {room} = useParams();
    const history = useNavigate();
    const lastMessageRef = useRef();
    const socket = useContext(SocketContext);
    const [myName,setMyName] = useState('');
    const inputRef = useRef();
    const [messages,setMessage] = useState([]);
    
    useEffect(()=>{
        const token = localStorage.getItem('authToken');
        setMyName(token);
        if(!token){
            history('/');
        }
        socket.on('msg',(mesg)=>{
            setMessage((prevMsg)=>[...prevMsg,mesg]);
        })

        return ()=>{
            socket.off('msg');
            socket.off('chat');
            socket.emit('leaveRoom',room);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useLayoutEffect(() => {
        scrollToLatestMessage();
      }, [messages]);

    const sendMsg = ()=>{
        const msg = inputRef.current.value;
        inputRef.current.value='';
        scrollToLatestMessage();
        socket.emit('chat',room,{msg:msg,sender:myName});
    }

    const buttonClick = (e)=>{
        if(e.key=='Enter'){
            sendMsg();
        }
    }

    function scrollToLatestMessage() {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      

    return (
        <div className={`${props.showChat ? 'visible' : 'hidden'} z-50 relative w-[340px] bg-white border-4 p-4 border-purple-700 text-black rounded-2xl`}>
            <h1 className="text-center text-purple-700 font-bold text-xl m-2">Chats.</h1>
            <div className="h-0.5 bg-purple-700"></div>
            <div className="p-2 py-4 w-full">
                <div className="h-[200px] w-full relative overflow-x-auto">
                    {
                        messages.map((value,index)=>{
                            const isLastMessage = index === messages.length - 1;
                            if(value.sender==myName){
                                return <div key={index} ref={isLastMessage ? lastMessageRef : null} className={`p-2 border-2 relative float-right clear-both bg-purple-300 text-black border-black w-fit my-2 rounded-md px-4`}>{value.msg}</div>
                            }
                            return <div ref={isLastMessage ? lastMessageRef : null} key={index} className={`p-2 float-left relative clear-both border-2 bg-purple-300 text-black border-black w-fit my-2 rounded-md px-4`}>{value.msg}</div>
                        })
                    }
                </div>
                <div className="flex border-2 border-black p-2 rounded-full px-4">
                    <input onKeyDown={buttonClick} ref={inputRef} className="outline outline-0" type="text" placeholder="Message..."/>
                    <img onClick={sendMsg} src="/send.png" className="w-8 mr-2"/>
                </div>
            </div>
        </div>
    )
}