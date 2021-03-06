import axios from "axios";

import { SITE_SERVER} from "../components/utils/misc";
import {
 GET_SITE_DATA,
 UPDATE_SITE_DATA
} from "./types";

export function getSiteData(){
    const request = axios.get(`${SITE_SERVER}/site_data`).then(res => {
        console.log(res)
        return res.data
    })
    return {
        type: GET_SITE_DATA,
        payload:request
    }
}

export async function updateSiteData(dataToSubmit){
    console.log(dataToSubmit)
    const request = await axios.post(`${SITE_SERVER}/site_data`, dataToSubmit).then(res => res.data)
    return {
        type: UPDATE_SITE_DATA,
        payload: request
    }
}







