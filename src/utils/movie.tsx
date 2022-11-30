import { serverUrl } from "./backendInfo";

export type Movie = {
    movieID: number;
    title: string;
    cast: string;
    director: string;
    producer: string;
    synopsis: string;
    reviews: string;
    ratingCode: string;
    trailerPic: string;
    video: string;
    genre: string;
};



export async function addMovie(movie: Movie): Promise<boolean> {
    return new Promise<boolean>( (resolve, reject) => {
        fetch(`${serverUrl}/movie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        }).then(res => res.json()).then(data => {
            resolve(data as boolean);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

//Gets range of movies from the database
export function getMoviesRange(start: number, end: number): Movie[] {
    return [];
}


export async function getMovie(id: number): Promise<Movie> {
    return new Promise((resolve, reject) => {
        fetch(`${serverUrl}/movie?movieID=${id}`).then(res => res.json()).then(data => {
            resolve(data as Movie);
        }).catch(err => {
            reject(err);
        })
    });
}

export async function getAllMovies(): Promise<Movie[]> {
    return new Promise<Movie[]>( (resolve, reject) => {
        fetch(`${serverUrl}/movie`).then(res => {
            if(res.status === 200) {
            return res.json();
            } else {
                reject(res.status);
                return;
            }
        }).then(data => {
            resolve(data as Movie[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}

export async function updateMovie(movie : Movie): Promise<boolean> {
    return new Promise<boolean>( (resolve, reject) => {
        fetch(`${serverUrl}/movie`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        }).then(res => res.json()).then(data => {
            resolve(data as boolean);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}


export async function searchMovies(searchTerm: string): Promise<Movie[]> {
    return new Promise<Movie[]>( (resolve, reject) => {
        fetch(`${serverUrl}/search?term=${searchTerm}`).then(res => res.json()).then(data => {
            resolve(data as Movie[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}
