import { useContext, useEffect, useState } from "react"
import MeetStarter from "./frontComp/meetStarter"
import GetCaller from "./frontComp/getCaller"
import SocketContext from '../socketContext';

export default function Front() {
    const socket = useContext(SocketContext);
    const [gettingCall, setGettingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callRoom, setCallRoom] = useState('');
    const [callerMail, setCallerMail] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('authToken')
        socket.emit("infoExchange", token);

        socket.on('reject', (reply) => {
            setGettingCall(false);
        });

        socket.on('getCall', (room,name,caller) => {
            setCaller(name);
            setCallRoom(room);
            setCallerMail(caller);
            setGettingCall(true);

        })

        return ()=>{
            socket.off('reject');
            socket.off('getCall');
        }


    }, [])

    return (
        <div className="relative w-full">
            <MeetStarter />
            {gettingCall ? <div className="absolute w-[300px] right-10 top-10">
                <GetCaller callerMail={callerMail} callRoom={callRoom} setCallRoom={setCallRoom} gettingCall={gettingCall} setGettingCall={setGettingCall} heading={'Ringing'} caller={caller} />
            </div> : null}
        </div>
    )



}