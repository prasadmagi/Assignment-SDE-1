import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardActions, Button, Typography, Grid, CircularProgress, Skeleton, ToggleButtonGroup, ToggleButton } from '@mui/material';
const URL = "https://api.weekday.technology/adhoc/getSampleJdJSON"
export const Jobs = () => {
    const [jobdata, setJobdata] = useState([])
    const [displayedCards, setDisplayedCards] = useState(10)
    const [offset, setOffset] = useState(0)
    const [loading, setloading] = useState(false)
    const [filter, setFilter] = useState('all')
    const fetchApi = async () => {
        debugger
        setloading(true)
        const raw = {
            "limit": displayedCards,
            "offset": offset
        };
        try {
            const resp = await axios.post(URL, {
                limit: 20,
                offset: offset
            })
            const result = await resp.data.jdList
            setJobdata(prevData => [...prevData, ...result]);
            setOffset(offset => offset + 10);
            console.log(result, "result");
        } catch (error) {
            console.log(error, "error");
        } finally {
            setloading(false)
        }


    }
    useEffect(() => {
        fetchApi();

    }, [filter])
    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } =
                document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 20) {
                fetchApi();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [fetchApi]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight && !loading
        ) {
            fetchApi();
            // setTimeout(fetchData, 500)
        }
    };
    const handleApply = (link) => {
        debugger
        window.open(`${link}`, '_blank');
        // setDisplayedCards(prev => prev + 10); // Increase the number of displayed cards by 10
    };
    const handleFilterChange = (event, newFilter) => {
        debugger
        setJobdata([]);
        setOffset(0);
        setFilter(newFilter);
    };
    const filteredData = jobdata.filter(item => {
        debugger
        if (filter === 'remote') {
            return item.location === 'remote';
        } else if (filter === 'onsite') {
            return item.location !== 'remote';
        }
        return true;
    });
    return (
        <>
            <Typography variant="body2" color="text.secondary" style={{ marginLeft: '1rem' }}>
                Location:
            </Typography>
            <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={handleFilterChange}
                aria-label="text alignment"
                style={{ marginBottom: '2rem' }}
            >

                <ToggleButton value="all" aria-label="left aligned">
                    All
                </ToggleButton>
                <ToggleButton value="remote" aria-label="centered">
                    Remote
                </ToggleButton>
                <ToggleButton value="onsite" aria-label="right aligned">
                    Onsite
                </ToggleButton>
            </ToggleButtonGroup>
            <Grid container spacing={3}>
                {loading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Skeleton variant="rectangular" width="100%" height={200} />
                        </Grid>
                    ))
                ) : (
                    filteredData.map((item, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card elevation={5}>
                                <CardContent>
                                    <Typography variant="h2" component="div">
                                        {`${item.jobRole.charAt(0).toUpperCase()}${item.jobRole.slice(1)}`}
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        {item.location}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.jobDetailsFromCompany}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button className="primary" variant="contained" color="secondary" size="medium" onClick={() => handleApply(item.jdLink)}> Apply</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
            {loading && <CircularProgress style={{ margin: '1rem auto', display: 'block' }} />}

        </>
    )
}
