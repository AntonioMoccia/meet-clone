import React from 'react'
import {ws} from '../ws'
function CreateButton() {

    const createRoom =()=>{
            ws.emit('room:create')
    }

    return (
    <button className=' bg-red-600 rounded px-4 py-2' onClick={createRoom}>Create new room</button>
  )
}

export default CreateButton