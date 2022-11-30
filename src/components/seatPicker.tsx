import React, { useState, useEffect } from 'react'
import { Show } from '../utils/show'
import {Seat, getSeatCount, clientSeat, getAllBookedSeats } from '../utils/seat'


interface SeatPickerProps {
    show?: Show | null;
    ticketCount: number;
}



export default function SeatPicker({ show, ticketCount }: SeatPickerProps) {
    const [seats, setSeats] = useState<clientSeat[]>([]);
    const [bookedIndexs, setBookedIndexs] = useState<number[]>([]);
    const [seatCount, setSeatCount] = useState(0);
    const [seatsLeft, setSeatsLeft] = useState(ticketCount);
    const seatSize = 25;

    useEffect(() => {
        console.log("Show", show);
        if (show) { // A show was passed in

            //Get however many seats there are in the show's showroom
            //get Correct seat count
            getSeatCount(show.showroomID).then((count) => {
                setSeatCount(count);
            }).catch((err) => {
                console.log(err);
            })
            //Populate booked seats
            getAllBookedSeats(show.showID).then((bookedSeats) => {
                const bookedIndexs = bookedSeats.map((seat) => seat.seatNumber);
                setBookedIndexs(bookedIndexs);
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [show])
    useEffect(() => {
        //Create seats
        const seats: clientSeat[] = [];
        for (let i = 0; i < seatCount; i++) {
            seats.push({
                seatNumber: i,
                showID: show?.showID || 0,
                booked: bookedIndexs.includes(i),
                selected: false
            })
        }
        setSeats(seats);
    }, [seatCount, bookedIndexs, show])


    function selectSeat(seatNum: number) {
        if(seatsLeft > 0) {
            const newSeats = seats.map((seat) => {
                if (seat.seatNumber === seatNum) {
                    return {
                        ...seat,
                        selected: !seat.selected
                    }
                } else {
                    return seat;
                }
            })
            setSeats(newSeats);
            setSeatsLeft(seatsLeft - 1);
            console.log("Seats Left", seatsLeft);
        }
    }
    function deselectSeat( seatNum: number) {
        const newSeats = seats.map((seat) => {
            if (seat.seatNumber === seatNum) {
                return {
                    ...seat,
                    selected: false
                }
            } else {
                return seat;
            }
        });
        setSeats(newSeats);
        setSeatsLeft(seatsLeft + 1);
        console.log("Seats Left", seatsLeft);
    }

    return (
        <div className='w-[300px] bg-bg-dark min-h-[300px] rounded-xl p-2 shadow-xl text-primary border-[1px] border-primary '>
            <div className={`grid grid-cols-7 gap-y-2 p-5`}>
                {seats.map((seat, index) => 
                    <SeatSquare key={index} seat={seat} size={seatSize} handleDeselectSeat={()=>{deselectSeat(seat.seatNumber)}} handleSelectSeat={()=>{selectSeat(seat.seatNumber)}}/>
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
