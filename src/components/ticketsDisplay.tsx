import { GridRowId } from '@mui/x-data-grid'
import React, { useState, useEffect } from 'react'
import { Ticket, getTicketsByBookingID } from '../utils/ticket'
import { Seat, getSeat } from '../utils/seat'
import { Show, getShow } from '../utils/show'
import { Showroom, getShowroom } from '../utils/showroom'
import { Booking, getBooking } from '../utils/booking'
import { Divider } from '@mui/material'
import { CircularProgress } from '@mui/material'

export function TicketsDisplay({ bookingID }: { bookingID: GridRowId }) {

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [showroom, setShowroom] = useState<Showroom>();
    const [booking, setBooking] = useState<Booking>();

    useEffect(() => {
        getBooking(bookingID as number).then((booking) => {
            setBooking(booking);
            getShow("showID", booking.showID).then((show) => {
                getShowroom("showroomID", show.showroomID).then((showroom) => {
                    setShowroom(showroom);
                    getTicketsByBookingID(bookingID as number).then((tickets) => {
                        setTickets(tickets);
                    })
                })
            });
        });
            // getShow("showID", booking.showID).then((show) => {
            //     console.log(show);
            //     getShowroom("showroomID", show.showroomID).then(data => {
            //         setShowroom(data)
            //         getTicketsByBookingID(bookingID as number).then(data => {
            //             setTickets(data)
            //         })
            //     })
            // })
        }, [bookingID])

        useEffect(() => {
            tickets.forEach(ticket => {
                getSeat(ticket.seatID).then(data => {
                    setSeats(prev => [...prev, data])
                    setLoading(false)
                })
            })
        }, [tickets])


        return (
            <div className='w-full p-10'>
                {loading ? 
                <div className="w-full flex flex-col items-center">
                    <CircularProgress />
                </div>
                    :
                    tickets.map(ticket => {
                        const seat = seats.find(seat => seat.seatID === ticket.seatID)
                        return (
                            <>
                                <Ticket key={ticket.ticketID} seat={seat || {} as Seat} ticket={ticket} showroom={showroom || {} as Showroom} />
                                <Divider />
                            </>
                        );
                    })}
            </div>
        )
    }


function Ticket({ seat, ticket, showroom }: { seat: Seat, ticket: Ticket, showroom: Showroom }) {
            return (
                <div className='flex w-full justify-around text-xl text-primary font-extrabold p-5 hover:bg-bg-light rounded-full' >
                    <p>Ticket ID: {ticket.ticketID}</p>
                    <p>Showroom:  {showroom.roomName}</p>
                    <p>Seat Number: {seat.seatNumber}</p>
                </div>
            )
        }
