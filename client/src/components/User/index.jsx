import UserLayout from "../../hoc/user";
import MyButton from '../utils/button'
import UserHistoryBlock from "../utils/User/history_block";

function Userdashboard({user}) {
  return (
    <UserLayout>
      <div>
          <div className = 'user_nfo_panel'>
              <h1>User Information</h1>
              <div>
                  <span>{user.userData.name}</span>
                  <span>{user.userData.lastname}</span>
                  <span>{user.userData.email}</span>
                  <MyButton 
                  title = 'Edit account info'
                  type ="default"
                  linkTo = '/user/user_profile'
                  />
              </div>
              {
                user.userData.history ?

                <div className= 'user_nfo_panel'>
                <h1>History purchases</h1>
                <div className = 'user_product_block_wrapper'>
                    <UserHistoryBlock
                    products = {user.userData.history}
                    />
                </div>
            </div>
                : null
              }

          </div>
      </div>
    </UserLayout>
  );
}

export default Userdashboard;
