import React from 'react'
import { DirectChat } from './DirectChat/DirectChat'
import { Participants } from './Participants'
import { ParticipantsLabel } from './ParticipantsLabel'
export const ParticipantSection = () => {
    return (
        <div className="participants_section_container" id="participants_section_container">
            <ParticipantsLabel/>
            <Participants/>
            <DirectChat/>
        </div>
    )
}
