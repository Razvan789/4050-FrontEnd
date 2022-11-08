import React from "react";

export type Movie = {
    id: number;
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


//Gets all movies from the database
export function getMovies(): Movie[] {
    return [];
}

//Gets range of movies from the database
export function getMoviesRange(start: number, end: number): Movie[] {
    return [];
}


export function getMovie(id: number): Movie {
    return ({
        id: id,
        title: "Spider-Man No Way Home",
        cast: "Tom Holland, Zendaya, Benedict Cumberbatch, Jacob Batalon, Marisa Tomei, Jamie Foxx, Alfred Molina, Toby Maguire, Andrew Garfield",
        director: "Jon Watts",
        producer: "Kevin Feige",
        synopsis: "Peter Parker's relaxing European vacation takes an unexpected turn when Nick Fury shows up in his hotel room to recruit him for a mission. The world is in danger as four massive elemental creatures, known as the Elementals, emerge from an alternate dimension. To save the planet and humanity, Parker and his friends must embark on a dangerous journey to another dimension to fight them. Parker's worst fears soon become reality when Mysterio appears to be one of the evil entities and kills Fury. Parker then realizes that all of his enemies will join forces to destroy him.",
        reviews: "Good movie",
        ratingCode: 3.5,
        trailerPic: "https://images.fandango.com/ImageRenderer/0/0/redesign/static/img/default_poster.png/0/images/masterrepository/Fandango/225415/SMRR_935x1381_Digital_1Sheet.jpg",
        video: "https://www.youtube.com/watch?v=QwievZ1Tx-8"
    });
}