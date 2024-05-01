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
    useEffect(() => {
        fetchApi();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [filter])

    const fetchApi = async () => {
        debugger
        setloading(true)
        const raw = {
            "limit": displayedCards,
            "offset": offset
        };
        try {
            const resp = await axios.post(URL, {
                limit: 10,
                offset: offset
            })
            const result = await resp.data.jdList
            setJobdata(prevData => [...prevData, ...result]);
            setOffset(prevOffset => prevOffset + 10);
            console.log(result, "result");
        } catch (error) {
            console.log(error, "error");
        } finally {
            setloading(false)
        }


    }
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight && !loading
        ) {
            // fetchData();
            setTimeout(fetchData, 500)
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
                {filteredData.map((item, index) => (
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
                ))}
            </Grid>
            {/* {loading && <CircularProgress />} */}
            {loading && Array.from({ length: 10 }).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                </Grid>
            ))}
        </>
    )
}
