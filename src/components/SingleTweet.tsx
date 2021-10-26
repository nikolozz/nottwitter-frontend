import { gql, useQuery } from '@apollo/client';
import '../styles/home.css';
import '../styles/primary.css';
import LeftNav from '../components/LeftNav';
import PopularTweets from '../components/PopularTweets';
import { useHistory, useParams } from 'react-router-dom';

export const TWEET_QUERY = gql`
  query tweet($id: Int!) {
    tweet(id: $id) {
      id
      content
      author {
        id
        username
        avatar {
          url
        }
      }
      likes {
        id
      }
      comments {
        id
        content
        author {
          username
        }
      }
    }
  }
`;

function SingleTweet() {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const history = useHistory();
  const { loading, error, data } = useQuery(TWEET_QUERY, { variables: { id: parseInt(id) } });

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
        <span className="back-arrow" onClick={() => history.goBack()}>
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
        </span>
        <div className="home-header">
          <h3 className="home-title">Tweet</h3>
        </div>
        <div>{data.tweet.content}</div>
        {data.tweet.comments.map((comment: any) => (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 8fr',
                marginTop: '10px',
                marginLeft: '10px',
              }}
            >
              <h5>{comment.author.username}</h5>
            </div>
            <p>{comment.content}</p>
          </>
        ))}
      </div>
      <div className="right">
        <PopularTweets />
      </div>
    </div>
  );
}

export default SingleTweet;
