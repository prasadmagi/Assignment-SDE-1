import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardActions, Button, Typography, Grid, CircularProgress, Skeleton } from '@mui/material';
const URL = "https://api.weekday.technology/adhoc/getSampleJdJSON"
export const Jobs = () => {
    const [jobdata, setJobdata] = useState([])
    const [displayedCards, setDisplayedCards] = useState(10)
    const [offset, setOffset] = useState(0)
    const [loading, setloading] = useState(false)
    useEffect(() => {
        fetchApi();

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight
        ) {
            fetchApi();
        }
    };
    const fetchApi = async () => {
        debugger
        setloading(true)
        const raw = {
            "limit": displayedCards,
            "offset": offset
        };
        try {
            const resp = await axios.post(URL, raw)
            const result = await resp.data.jdList
            setJobdata(prevData => [...prevData, ...result]); // Concatenate new data with existing data
            setOffset(prevOffset => prevOffset + 10);

            console.log(result, "result");
        } catch (error) {
            console.log(error, "error");
        } finally {
            setloading(false)
        }


    }
    const handleApply = (link) => {
        debugger
        window.open(`${link}`, '_blank');
        // setDisplayedCards(prev => prev + 10); // Increase the number of displayed cards by 10
    };

    return (
        <>
            <Grid container spacing={3}>
                {jobdata.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h2" component="div">
                                    {item.jobRole}
                                </Typography>
                                <Typography variant="h4" component="div">
                                    {item.location}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.jobDetailsFromCompany}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleApply(item.jdLink)}> Apply</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {loading && <CircularProgress />}
        </>
    )
}
