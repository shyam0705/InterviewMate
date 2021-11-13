import React from 'react'
import { WhiteBoard } from './WhiteBoard'
import './Container.css';
export const Container = () => {
    return (
        <div className="container" id="container">
            <div className="board-container">
                <WhiteBoard/>
            </div>
        </div>
    )
}
