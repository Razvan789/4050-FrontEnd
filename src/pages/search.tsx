import React, { useState, useEffect } from 'react'
import Layout from '../components/layout'
import { useRouter } from 'next/router'
import { Movie, searchMovies } from '../utils/movie'
import { Show, getAllShows } from '../utils/show'
import Card from '../components/card'
import CardSkeletons from '../components/cardSkeletons'
import { Chip } from '@mui/material'

export default function Search() {
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const searchTerm = router.query.term as string;
    const [showNowPlaying, setShowNowPlaying] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [showingMovies, setShowingMovies] = useState<Movie[]>([]);
    const [shows, setShows] = useState<Show[]>([]);
    useEffect(() => {
        setLoading(true);
        searchMovies(searchTerm).then((movies) => {
            setMovies(movies);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
        getAllShows().then((shows) => {
            setShows(shows);
        }).catch((err) => {
            console.log(err);
        });
    }, [searchTerm]);

    //Update ShowingMovies array
    useEffect(() => {
        const showingMovies: Movie[] = [];
        movies.forEach((movie) => {
            if (shows.find((show) => show.movieID == movie.movieID)) {
                showingMovies.push(movie);
            }
        });
        setShowingMovies(showingMovies);
    }, [shows, movies]);

    return (
        <Layout>
            <h1 className='font-extrabold text-4xl text-center pt-4 text-text-dark'><span className='text-primary'>Search</span> Results: </h1>
            <Chip label={showNowPlaying ? "Show All Movies" : "Show Now Playing"} color="primary" variant={showNowPlaying ? "filled" : "outlined"} onClick={() => setShowNowPlaying(!showNowPlaying)} className='mx-auto my-4' />
            {loading ?
                // If loading is true, show skeletons
                <CardSkeletons cardCount={5} />
                : //If loading is false, show cards 
                (
                    <div className='flex justify-center items-center flex-wrap mt-10 space-x-5 space-y-5'>
                        {showNowPlaying ? // Now playing movies
                            showingMovies.map((movie) => (
                                <Card little key={movie.movieID} movie={movie} />
                            ))
                        : //All Movies 
                        movies.map((movie, index) => {
                            return (
                                
                                        <Card
                                            little
                                            key={movie.movieID}
                                            movie={movie}
                                        />
                            );
                        })
                        }

                        {movies.length == 0 ? <h1 className='text-center text-2xl text-text-dark'>No results found</h1> : null}
                    
                    </div>
                )
            }
        </Layout>

    )
}
