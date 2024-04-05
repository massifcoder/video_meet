/* eslint-disable react-hooks/rules-of-hooks */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import SocketContext from '../socketContext';
import Peer from 'peerjs';
import 'webrtc-adapter';
import Chat from './meet/chat';
import Draw from "./meet/draw";

export default function Meeting() {
    const socket = useContext(SocketContext);
    const { room } = useParams();
    if (room === undefined) {
        return <h1>Loading...</h1>
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const history = useNavigate();
    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);
    const peerInstance = useRef(null);
    const callRef = useRef(null);
    const localStreamRef = useRef(null);
    const [showCamera, setShowCamera] = useState(true);
    const [showMic, setShowMic] = useState(true);
    const [showHand, setShowHand] = useState(false);
    const [showPresent, setShowPresent] = useState(false);
    const [showOption, setShowOption] = useState(false);
    const [showBoard, setShowBoard] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showMusic, setShowMusic] = useState(false);
    const [onCall, cutCall] = useState(true);

    useEffect(() => {

        socket.on('leftRoom', () => {
            cutCalls();
        })

        async function delay() {
            // Use a Promise to create an asynchronous delay
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(); // Resolve the Promise after 1 second
              }, 1000); // 1000 milliseconds (1 second)
            });
          }

        const peer = new Peer(socket.id);
        if (room == socket.id) {
            socket.emit('giveId');
            socket.on('getId',(id) => {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then(async (stream) => {
                        localVideoRef.current.srcObject = stream;
                        // localStream = stream;
                        localStreamRef.current = stream;
                        await delay();
                        const call = peer.call(id, stream);
                        call.on('stream', (remoteStream) => {
                            remoteVideoRef.current.srcObject = remoteStream;
                        })
                        callRef.current = call;
                        peerInstance.current = peer;
                    }).catch((err) => {
                        console.log('Failed to control the devices.', err);
                    })
            })
        }
        else {

            const ask =peer.on('call', (call) => {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then((stream) => {
                        localStreamRef.current = stream;
                        localVideoRef.current.srcObject = stream;
                        call.answer(stream);
                        call.on('stream', (remoteStream) => {
                            remoteVideoRef.current.srcObject = remoteStream;
                        })
                        callRef.current = call;
                        peerInstance.current = peer;

                    }).catch((err) => {
                        console.log('Failed to get the devices control.', err);
                    })
            });
            console.log(ask);
            socket.on('returnId', () => {
                socket.emit('gettingId', socket.id, room);
            });
        }
        return () => {
            socket.emit('log-out', localStorage.getItem('authToken'));
            console.log('Unmout the product');
            socket.off('leftRoom');
            socket.off('getId');
            socket.off('returnId');
            if (peerInstance.current) {
                peerInstance.current.destroy();
            }
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cutCalls = () => {
        socket.emit('log-out', localStorage.getItem('authToken'));
        console.log('Unmout the product');
        localVideoRef.current.srcObject = null;
        if (peerInstance.current) {
            peerInstance.current.destroy();
        }
        if (localStreamRef.current) {
            console.log('Releasing mic and camera.')
            localStreamRef.current.getTracks().forEach(track => track.stop());
            history('/');
        }

    }

    const toggleCamera = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled;
            })
            setShowCamera(!showCamera);
        }
    }

    const toggleMic = () => {
        if (localStreamRef) {
            localStreamRef.current.getAudioTracks().forEach((track) => {
                track.enabled = !track.enabled;
            })
            setShowMic(!showMic);
        }
    }

    const screenShare = async () => {
        let showPresents = !showPresent;
        setShowPresent(showPresents);
        console.log(showPresents);

        if (callRef.current && callRef.current.peerConnection) {
            const sender = callRef.current.peerConnection.getSenders().find((sender) => sender.track.kind === 'video');
            if (sender) {
                if (showPresents) {
                    navigator.mediaDevices.getDisplayMedia({ video: true })
                        .then((stream) => {
                            if (localStreamRef.current) {
                                localStreamRef.current.getTracks().forEach(track => track.stop());
                            }
                            localStreamRef.current = stream;
                            localVideoRef.current.srcObject = stream;
                            sender.replaceTrack(stream.getVideoTracks()[0]);
                        })
                        .catch((error) => {
                            console.log('Error accessing screen share:', error);
                        });
                } else {
                    if (localStreamRef.current) {
                        localStreamRef.current.getTracks().forEach(track => track.stop());
                    }
                    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                        .then((stream) => {
                            localStreamRef.current = stream;
                            localVideoRef.current.srcObject = stream;
                            if (sender.track.kind === 'video') {
                                sender.replaceTrack(stream.getVideoTracks()[0]);
                            }
                        })
                        .catch((error) => {
                            console.log('Error accessing camera and microphone:', error);
                        });
                }
            }
        }
    };



    return (
        <div className='w-full'>
            <div className="flex justify-between w-full h-fit">
                <div className="flex space-x-6 px-24 w-full">
                    <div className={`${showBoard ? 'w-1/3' : 'w-full'}`}>
                        <div className={`rounded-2xl video`}>
                            <video ref={remoteVideoRef} className={`rounded-2xl w-full`} autoPlay ></video>
                        </div>

                    </div>
                    <div className={`space-y-4 pb-4 ${showBoard ? 'w-full' : 'w-1/3'}`}>
                        <div className="rounded-2xl p-2 video w-full">
                            <video ref={localVideoRef} className={`rounded-2xl ${showBoard ? 'hidden' : 'visible'}`} autoPlay></video>
                            <Draw showBoard={showBoard} />
                        </div>
                        <Chat showChat={showChat} />
                    </div>

                </div>

            </div>
            <div className="flex z-20 space-x-6 justify-start pl-24 fixed w-full bottom-6">
                <div onClick={() => { cutCall(!onCall); cutCalls(); }} className={`${onCall ? 'bg-[#3c4043]' : 'bg-[#ea4335]'} p-3 w-fit h-fit rounded-full`}>
                    <img src={'/call.png'} alt="call" className="w-10" />
                </div>
                <div onClick={toggleCamera} className={`${showCamera ? 'bg-[#3c4043]' : 'bg-[#ea4335]'} h-fit p-3 w-fit rounded-full`}>
                    <img src={`/${showCamera ? '' : 'no'}camera.png`} alt="call" className="w-10" />
                </div>
                <div onClick={toggleMic} className={`${showMic ? 'bg-[#3c4043]' : 'bg-[#ea4335]'} p-3 h-fit w-fit rounded-full`}>
                    <img src={`/${showMic ? 'mic' : 'mute'}.png`} alt="call" className="w-10" />
                </div>
                <div onClick={() => { setShowHand(!showHand) }} className={`${!showHand ? 'bg-[#3c4043]' : 'bg-[#ea4335]'} h-fit p-3 w-fit rounded-full`}>
                    <img src={`/hand.png`} alt="call" className="w-10" />
                </div>
                <div onClick={() => { setShowBoard(!showBoard) }} className={`${!showBoard ? 'bg-[#3c4043]' : 'bg-[#ea4335]'} h-fit p-3 w-fit rounded-full`}>
                    <img src={`/wboard.png`} alt="call" className="w-10" />
                </div>
                <div onClick={() => { setShowChat(!showChat) }} className={`${!showChat ? 'bg-[#3c4043]' : 'bg-[#ea4335]'} h-fit p-3 w-fit rounded-full`}>
                    <img src={`/chat.png`} alt="call" className="w-10" />
                </div>
                <div onClick={() => { setShowMusic(!showMusic) }} className={`${!showMusic ? 'bg-[#3c4043]' : 'bg-[#ea4335]'} h-fit p-3 w-fit rounded-full`}>
                    <img src={`/music.png`} alt="call" className="w-10" />
                </div>
                <div onClick={screenShare} className={`${!showPresent ? 'bg-[#3c4043]' : 'bg-[#ea4335]'} h-fit p-3 w-fit rounded-full`}>
                    <img src={`/present.png`} alt="call" className="w-10" />
                </div>
                <div onClick={() => { setShowOption(!showOption) }} className={`${!showOption ? 'bg-[#3c4043]' : 'bg-[#ea4335]'} h-fit p-3 w-fit rounded-full`}>
                    <img src={`/dots.png`} alt="call" className="w-10" />
                </div>
            </div>

        </div>
    );
}
