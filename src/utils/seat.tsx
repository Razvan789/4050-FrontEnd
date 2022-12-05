import { serverUrl } from "./backendInfo";
export interface Seat {
    seatID?: number;
    showID: number;
    seatNumber: number;
}

export interface clientProps {
    booked: boolean;
    selected: boolean;
}

export type clientSeat = Seat & clientProps;


export async function getSeat(id: number): Promise<Seat> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/seat?seatID=${id}`).then(res => res.json()).then(data => {
            resolve(data as Seat);
        }).catch(err => {
            reject(err);
        })
    });
}


export async function getAllBookedSeats(showID: number): Promise<Seat[]> {
    return new Promise<Seat[]>((resolve, reject) => {
        fetch(`${serverUrl}/seat?showID=${showID}`).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                reject(res.status);
                return;
            }
        }).then(data => {
            resolve(data as Seat[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function getSeatCount(showroomID: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        fetch(`${serverUrl}/seat-count?showroomID=${showroomID}`).then(res => res.json()).then(data => {
            resolve(data.numSeats as number);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function addSeat(seat: Seat): Promise<Seat> {
    //body of addSeat here
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/seat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(seat)
        }).then(res => res.json()).then(data => {
            resolve(data as Seat);
        }).catch(err => {
            reject(err);
        })
    });
}

export async function addSeats(seats: Seat[]): Promise<Seat[]> {
    return new Promise<Seat[]>((resolve, reject) => {
        const newSeats: Seat[] = [];
        seats.map((seat) => {
            addSeat(seat).then((newSeat) => {
                newSeats.push(newSeat);
                if (newSeats.length === seats.length) {
                    resolve(newSeats);
                }
            }).catch(err => {
                reject(err);
            });
        });
    });
}