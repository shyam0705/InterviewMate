import React from 'react'

export const ErrorMessage = ({err}) => {
    return (
        <div className="error_message_container">
            {err && <p className="error_message_paragraph">{err}</p>}
        </div>
    )
}
