/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { Howl } from 'howler';
import SocketContext from '../../socketContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export default function GetCaller(props) {
    const socket = useContext(SocketContext);
    const history = useNavigate();

    if(!props.gettingCall){
        return (<div className=' m-6'>Loading...</div>)
    }

    const sound = new Howl({
        src: ['./tone.mp3']
    });


    const CancelCall = () => {
        sound.pause();
        socket.emit('cancelCall',props.callRoom);
        props.setGettingCall(false);
    }

    const TakeCall = () => {
        socket.emit('answerCall',props.callRoom);
        sound.pause();
        history(`/call/${props.callRoom}`)
    }

    useEffect(() => {
        if (props.gettingCall) {
            sound.play();
        }

        return () =>{
            sound.pause();
        }

    }, [])

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full m-6 relative flex flex-col items-center justify-around rounded-xl border-4 border-green-700 h-[420px]">
                <h1>{props.heading}...</h1>
                <h1>{props.callerMail}</h1>
                <div className="relative flex items-center justify-center">
                    <div className="border border-3 border-green-600 p-5 rounded-full relative z-20 bg-white">
                        <img src="./calling.png" alt="imag" />
                    </div>
                    <div className="border-2 border-green-600 animate-ping w-20 h-20 rounded-full absolute z-10"></div>
                </div>
                <div className="font-bold text-xl">
                    <h1 className="my-3 text-center">{props.caller}</h1>
                    <div className="flex space-x-8 justify-around">
                        <div onClick={TakeCall} className="p-2 animate-bounce m-2 w-10 h-10 bg-green-600 rounded-full">
                            <img src="/call.png" />
                        </div>
                        <div onClick={CancelCall} className="p-1 animate-bounce m-2 w-10 h-10 bg-red-400 rounded-full">
                            <img src="./dropcall.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}