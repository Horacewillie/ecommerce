import axios from "axios";

import { USER_SERVER } from "../components/utils/misc";
import {LOGIN_USER} from './types'

export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then(res => res.data)
    .catch(err  => console.log(err.message));

    return {
        type: LOGIN_USER,
        payload: request
    }
}
