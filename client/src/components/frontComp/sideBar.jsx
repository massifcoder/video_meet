// import { Link } from 'react-router-dom';

export default function SideBar(){
    return (
        <div className="w-fit h-fit p-8">
            <div className="bg-white rounded-xl p-1 my-3 hover:scale-125 transition duration-200 ease-in-out">
                {/* <Link to={'/'}> */}
                    <img alt="m" src={'/home.png'}  />
                {/* </Link> */}
            </div>
            <div className="bg-white rounded-xl p-1 my-3 hover:scale-125 transition duration-200 ease-in-out">
                {/* <Link to={'/calender'}> */}
                    <img alt="j" src={'/calender.png'}  />
                {/* </Link> */}
            </div>
            <div className="bg-white rounded-xl p-2 my-3 hover:scale-125 transition duration-200 ease-in-out">
                {/* <Link to={'/bell'}> */}
                    <img alt="h" src={'/bell.png'} className="mx-auto" />
                {/* </Link> */}
            </div>
            <div className="bg-white rounded-xl p-1 transition duration-200 ease-in-out my-3 hover:scale-125">
                {/* <Link to={'/mail'}> */}
                    <img alt="jhgk" src={'/mail.png'}  />
                {/* </Link> */}
            </div>
            <div className="bg-white rounded-xl my-3 transition duration-200 ease-in-out p-2 hover:scale-125">
                {/* <Link to={'/account'}> */}
                    <img alt="ljh" src={'/setting.png'} />
                {/* </Link> */}
            </div>
        </div>
    )
}