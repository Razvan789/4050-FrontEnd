import React, { useState, useEffect } from 'react'
import { Show } from '../utils/show'
import {Seat, getSeatCount, clientSeat, getAllBookedSeats } from '../utils/seat'


interface SeatPickerProps {
    seats: clientSeat[];
    seatsLeft: number;
    handleSelect : (seat: number) => void;
    handleDeselect : (seat: number) => void;

}



export default function SeatPicker({ seats, seatsLeft,handleSelect, handleDeselect}: SeatPickerProps) {

    const seatSize = 25;

    return (
        <div className='w-[300px] bg-bg-dark min-h-[300px] rounded-xl p-2 shadow-xl text-primary border-[1px] border-primary '>
            <div className={`grid grid-cols-7 gap-y-2 p-5`}>
                {seats.map((seat, index) => 
                    <SeatSquare key={index} seat={seat} size={seatSize} handleDeselectSeat={handleDeselect} handleSelectSeat={handleSelect}/>
                )}
            </div>
            <h1 className='text-center font-extrabold text-primary'>SCREEN</h1>
            <h2 className='text-center font font-extrabold text-text-light'>Seats Left to pick: {seatsLeft}</h2>
        </div>
    )
}


function SeatSquare({size, seat, handleSelectSeat, handleDeselectSeat }: {seat: clientSeat, size: number, handleSelectSeat: (seat: number) => void, handleDeselectSeat: (seat: number) => void}) {
    return (
        <>
        {seat.booked ?
            //Booked seat
            <div className={`w-[${size}px] h-[${size}px] rounded-full border-[1px] border-primary bg-red-500 text-text-light' text-center`}>
                <p className='text-xs'>{seat.seatNumber}</p>
            </div>
            :
            seat.selected ?
                //Selected seat
                <div onClick={()=> {handleDeselectSeat(seat.seatNumber || -1)}} className={`w-[${size}px] h-[${size}px] rounded-full border-[1px] border-primary bg-green-400 hover:bg-green-600 cursor-pointer text-text-dark hover:text-text-light hover:pointer text-center`}>
                    <p className='text-xs'>{seat.seatNumber}</p>
                </div>
                :
                //Unselected seat
                <div onClick={() => {handleSelectSeat(seat.seatNumber || -1)}} className={`w-[${size}px] h-[${size}px] rounded-full border-[1px] border-primary hover:bg-bg-light cursor-pointer text-center`}>
                    <p className='text-xs'>{seat.seatNumber}</p>
                </div>
        }
        </>
    )
}
