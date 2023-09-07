import { useContext, useEffect, useRef, useState } from "react"
import SocketContext from "../../socketContext";
import { useNavigate } from "react-router-dom";
import DoCall from './doCall'

export default function MeetStarter() {
    const socket = useContext(SocketContext);
    const history = useNavigate();
    const mailRef = useRef();
    const [isValid, setValid] = useState(false);
    const [caller, setCaller] = useState('');
    const [doCall, setDoCall] = useState(false);
    const [toCall, setToCall] = useState('')
    const [otherId, setOtherId] = useState('');

    const errorMailInput = (msg) => {
        setValid(true);
        setTimeout(() => {
            setValid(false)
            mailRef.current.value = '';
        }, 3000);
        mailRef.current.value = msg;
    }

    const handleCallNow = () => {
        if (mailRef && mailRef.current) {
            const mail = mailRef.current.value;
            const name = 'Caller'
            socket.emit('checkUser', mail, name, caller );
            socket.on('userInfo', (online,busy,id) => {
                if (online == 'false') {
                    errorMailInput('Offline')
                }
                else {
                    if (busy == 'true') {
                        errorMailInput('Busy!')
                    }
                    else {
                        setToCall(mail);
                        setOtherId(id);
                        setDoCall(true);
                    }
                }
            })
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            history('/');
        }
        
        setCaller(token);
        return () => {
            socket.off('userInfo');
            socket.off('connect');
        }
    }, [])

    if (doCall) {
        return <DoCall otherId={otherId} toCall={toCall} setDoCall={setDoCall} />
    }

    return (
        <div className="w-full flex">
            <div className="flex items-center justify-center">
                <div className="font-mono mt-16">
                    <h1 className="text-3xl font-sans font-bold">Nanda Meet Free For EveryOne.</h1>
                    <div className="font-sans my-12">
                        <h1 className='text-xl font-mono mt-3'>Call Friend Now...</h1>
                        <div className="flex space-x-6">
                            <div className="my-4">
                                <input ref={mailRef} type="text" className={`p-2 ${isValid ? 'inputMail' : ''} placeholder-gray-600 outline outline-0 text-gray-700 border font-sans border-1 border-gray-700 rounded-lg`} placeholder="Enter Mail Address..." />
                            </div>
                            <div onClick={handleCallNow} className={`p-2 cursor-pointer px-3 ${isValid ? 'bg-red-700' : 'bg-blue-800'} font-sans my-4 rounded-xl w-fit`}>Call Now</div>
                        </div>
                    </div>
                    <div className="my-16">
                        <h1 className="text-xl mt-3">Start Instant Meeting...</h1>
                        <div className="flex space-x-6">
                            <div className="p-2 px-3 bg-blue-800 cursor-pointer font-sans my-4 rounded-xl w-fit">New Meeting</div>
                            <div className="my-4">
                                <input type="text" className="p-2 outline outline-0 text-gray-600 placeholder-gray-600 border font-sans border-1 border-gray-700 rounded-lg" placeholder="Enter a code or link..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}