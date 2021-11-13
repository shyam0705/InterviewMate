import React from 'react'

export const RoomLabel = ({roomId}) => {
    return (
        <div className="room_label">
            <p className="room_label_paragraph">Room Id:-{roomId}</p>
        </div>
    )
}
