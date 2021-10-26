import { gql, useQuery } from '@apollo/client';
import '../styles/home.css';
import '../styles/primary.css';
import LeftNav from '../components/LeftNav';
import Tweets from '../components/Tweets';
import HomeTweet from '../components/HomePageTweet';
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
    }
  }
`;

function Home() {
  const { loading, error } = useQuery(ME_QUERY);
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
      <div className="home">
        <div className="home-header">
          <h3 className="home-title">Tweets</h3>
        </div>
        <HomeTweet />
        <Tweets />
      </div>
      <div className="right">
        Right Nav <PopularTweets />
      </div>
    </div>
  );
}

export default Home;
