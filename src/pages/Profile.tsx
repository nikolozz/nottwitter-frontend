import { gql, useQuery } from '@apollo/client';
import { Link, useHistory } from 'react-router-dom';
import UpdateProfile from '../components/UpdateProfile';
import '../styles/profile.css';
import '../styles/primary.css';
import LeftNav from '../components/LeftNav';
import PopularTweets from '../components/PopularTweets';

export const ME_QUERY = gql`
  query me {
    me {
      id
      username
      email
      bio
      website
      location
      avatar {
        url
      }
      userLikes {
        id
        tweetId
      }
    }
  }
`;

function Profile() {
  const history = useHistory();

  const { loading, error, data } = useQuery(ME_QUERY);
  if (loading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="primary">
      <div className="left">
        <LeftNav />
      </div>
      <div className="profile">
        <div className="profile-info">
          <div className="profile-head">
            <span className="back-arrow" onClick={() => history.goBack()}>
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </span>
            <span className="nickname">
              <h3>{data.me.username}</h3>
            </span>
          </div>
          <div className="avatar">
            {data.me?.avatar ? (
              <img
                src={data.me.avatar.url}
                style={{ width: '150px', borderRadius: '50%' }}
                alt="avatar"
              />
            ) : (
              <i className="fa fa-user fa-5x" aria-hidden="true"></i>
            )}
          </div>
          <div className="make-profile">
            {data.me ? <UpdateProfile /> : <Link to="login">Log In</Link>}
          </div>

          <h3 className="name">{data.me.username}</h3>

          {data.me ? (
            <p>
              <i className="fas fa-link"> </i>{' '}
              <Link to={{ pathname: `http://${data.me.website}` }} target="_blank">
                {data.me.website}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
      <div className="right">
        <PopularTweets />
      </div>
    </div>
  );
}

export default Profile;
