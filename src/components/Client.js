import React from 'react'
import Avatar from 'react-avatar'

const Client = ({username}) => {
  return (
    <div className='client' >
        <Avatar 
        name={username}
        size={50}
        round="15px"
        color='#00E980'
        fgColor='#282A36' />
        <span className='UserName'>{username}</span>
    </div>
  )
}

export default Client