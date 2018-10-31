import React from 'react';

const Profile = props => {

  if(!props.user) return <div className="container profile-page">You must log in to your Twitter account to see your profile</div>

  const profile_url = props.user.photo.replace('_normal.jpg', '_400x400.jpg');

  return ( 
    <div className="container profile-page">
      <h1 className="mb-3">Hello {props.user.name}!</h1>
      <img className="profile-photo" src={profile_url} alt=""/>
    </div>
   );
}
 
export default Profile;