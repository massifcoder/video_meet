/* eslint-disable react/prop-types */
import { Howl } from 'howler';
import { useContext, useEffect, useState } from 'react';
import SocketContext from '../../socketContext';
import { useNavigate } from 'react-router-dom';

export default function DoCaller(props) {
    const history = useNavigate();
    const socket = useContext(SocketContext);
    const [timeOutId,setTimeOutId] = useState('');
    const callRing = new Howl({
        src: ['./call.mp3']
    })

    const CancelCall = () => {
        socket.emit('cancelCall', props.otherId);
        props.setDoCall(false);
        callRing.pause();
    }

    useEffect(() => {

        // eslint-disable-next-line no-unused-vars
        socket.on('reject', (req) => {
            props.setDoCall(false);
        })

        socket.on('accept', (room) => {
            socket.emit('joinRoom',room);
            history(`/call/${room}`)
        })

        callRing.play();
        const timeOutIds = setTimeout(() => {
            CancelCall();
        }, 10000);
        setTimeOutId(timeOutIds);

        return () => {
            socket.off('reject');
            socket.off('accept');
            clearTimeout(timeOutId);
            callRing.pause();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full m-6 relative flex flex-col items-center justify-around rounded-xl border-4 border-green-700 h-[420px]">
                <h1>{props.toCall}...</h1>
                <div className="relative flex items-center justify-center">
                    <div className="border border-3 border-green-600 p-5 rounded-full relative z-20 bg-white">
                        <img src="./calling.png" alt="imag" />
                    </div>
                    <div className="border-2 border-green-600 animate-ping w-20 h-20 rounded-full absolute z-10"></div>
                </div>
                <div className="font-bold text-xl">
                    <h1 className="my-3">{ }</h1>
                    <div className="flex space-x-8 justify-around">
                        <div onClick={CancelCall} className="p-1 animate-bounce m-2 w-10 h-10 bg-red-400 rounded-full">
                            <img src="./dropcall.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}