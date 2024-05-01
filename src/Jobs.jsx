import axios from 'axios'
import React, { useEffect, useState } from 'react'
const URL = "https://api.weekday.technology/adhoc/getSampleJdJSON"
export const Jobs = () => {
    const [jobdata, setJobdata] = useState([])
    const fetchApi = async () => {
        debugger

        const raw = {
            "limit": 10,
            "offset": 0
        };
        try {
            const resp = await axios.post(URL, raw)
            const result = await resp.data
            setJobdata(result.jdList)
            console.log(result, "result");
        } catch (error) {
            console.log(error, "error");
        }


    }

    useEffect(() => {
        fetchApi()
    }, [])
    return (
        <>
            <div>Jobs</div>
            {
                jobdata && jobdata.map((jobs) => {
                    return (
                        <>
                            <ul>
                                <li>{jobs.jobRole}</li>
                                <li>{jobs.location}</li>
                                <li>{jobs.jobDetailsFromCompany}</li>
                                <li>{jobs.jdLink}</li>

                            </ul>
                        </>
                    )
                })
            }
        </>
    )
}
