// import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react"
import SocketContext from "../../socketContext";

export default function Header() {
    const socket = useContext(SocketContext);
    const history = useNavigate();

    const deleteLocal = ()=>{
        socket.emit('log-out',localStorage.getItem('authToken'));
        localStorage.removeItem('authToken');
        history('/')
    }

    return (
        <div className="font-mono flex justify-between items-center p-6 pb-2">
            <img alt="kjh" src={'/logo.png'} className="bg-white hover:scale-125 m-2 transition duration-500 ease-in-out" height={50} width={50} />
            <div className="flex items-center justify-between w-full px-6">
                <div className="text-black">
                    <div className="text-gray-400 text-sm hover:scale-125 transition duration-500 ease-in-out">Ongoing event</div>
                    <div className="text-xl text-white transition duration-500 ease-in-out hover:scale-125">
                        {/* <Link to={'/'}>Nanda  .  Meet</Link> */} Nanda  .  Meet
                    </div>
                </div>
                <div className="flex items-center text-white w-[200px] justify-between">
                    <div className="h-fit hover:scale-110 transition duration-500 ease-in-out p-2 px-3 bg-[#6619d0] rounded-full">
                        --
                    </div>
                    <div onClick={deleteLocal} className="h-fit px-3 flex hover:scale-110 transition duration-300 ease-in-out p-2 bg-red-500 items-center rounded-full">
                        <div className="border-4 select-none bg-red-500 border-white h-4 w-4 mx-1 rounded-full"></div>
                        <div className="mx-2 select-none">Log Out</div>
                    </div>
                </div>
            </div>
        </div>
    )
}