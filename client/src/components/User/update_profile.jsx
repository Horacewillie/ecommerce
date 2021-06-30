import React from 'react'
import UserLayout from "../../hoc/user"
import UpdatePersonalInfo  from './update_personalinfo'

function UpdateProfile() {
    return (
        <UserLayout>
            <h1>Profile</h1>
            <UpdatePersonalInfo />
        </UserLayout>
    )
}

export default UpdateProfile