import { serverUrl } from "./backendInfo";

export type Movie = {
    movieID: number;
    title: string;
    cast: string;
    director: string;
    producer: string;
    synopsis: string;
    reviews: string;
    ratingCode: number;
    trailerPic: string;
    video: string;
};




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
        fetch(`${serverUrl}/movie`).then(res => res.json()).then(data => {
            resolve(data as Movie[]);
        }).catch(err => {
            reject(err);
            return;
        })
    });
}