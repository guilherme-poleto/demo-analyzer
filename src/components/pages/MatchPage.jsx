import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './MatchPage.css'
import axios from 'axios';
import Constants from '../../utils/Constants';

export default function MatchPage() {
    const { id } = useParams();

    useEffect(() => {
        axios.get(Constants.GET_MATCH_DETAILS, {
            params: {
                id: id
            }
        }).then(res => {
            console.log(res);
        }).catch(error => {
            if (error.status == 404) {
                // alert('Match not found');
            }
        })
    }, []);

    return (
        <>
        </>
    );
}
