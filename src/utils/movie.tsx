import React from "react";

export type Movie = {
    title: string;
    rating: number;
    image: string;
};

export function getMovie(id): Movie {
    return ({
        title: "Spider-Man No Way Home",
        rating: 3.5,
        image: "https://images.fandango.com/ImageRenderer/0/0/redesign/static/img/default_poster.png/0/images/masterrepository/Fandango/225415/SMRR_935x1381_Digital_1Sheet.jpg",
    });
}