import React,{useState} from 'react'
import {v4} from 'uuid'

const Home = () => {



    const [RoomId, SetRoomId] = useState('');
    const [UserName, SetUserName] = useState('');

    const CreateNewRoom =(e)=>{
        const id=v4();
        SetRoomId(id);
    }


    return (
        <div className='HomePage'>
            <div className='Form'>

                <h4 className='FormLabel'>
                    Enter Room Id and Username
                </h4>

                <div className='FormInputs'>

                    <input className='InputBox' placeholder='ROOM ID' value={RoomId} onChange={(e)=> SetRoomId(e.target.value)}/>
                    <input className='InputBox' placeholder='USERNAME' value={UserName} onChange={(e)=> SetUserName(e.target.value)}/>

                    <div className='buttons'>
                        <button className='btn Joinbtn'> Join </button>
                        <button className='btn Create' onClick={CreateNewRoom}> New Room</button>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Home