import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { ME_QUERY } from '../pages/Profile';
import '../styles/all-tweets.css';
import CreateComment from './CreateComment';
import DeleteLike from './DeleteLike';
import LikeTweet from './LikeTweet';

export const TWEETS_QUERY = gql`
  query {
    tweets {
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
      }
    }
  }
`;

export default function Tweets() {
  const { loading, error, data } = useQuery(TWEETS_QUERY);
  const { loading: meLoading, error: meError, data: meData } = useQuery(ME_QUERY);

  if (loading) return <p>loading</p>;
  if (error) return <p>{error}</p>;

  if (meLoading) return <p>loading</p>;
  if (meError) return <p>{error}</p>;

  return (
    <div>
      {data.tweets.map((tweet: any) => (
        <div className="tweet-container">
          <Link to={`/tweet/${tweet.id}`}>
            <div className="tweet-header">
              <img
                src={tweet.author.avatar.url}
                style={{ width: '40px', borderRadius: '50%' }}
                alt="avatar"
              />
              <Link to={`/user/${tweet.author.id}`}>
                <h4 className="name">{tweet.author.name} </h4>
              </Link>
            </div>
            <p>{tweet.content}</p>
          </Link>
          {meData.me.userLikes.map((like: any) => like.tweetId).includes(tweet.id) ? (
            <span>
              <DeleteLike
                id={meData.me.userLikes.filter((like: any) => like.tweetId === tweet.id)[0].id}
              />
              {tweet?.likes?.length}
            </span>
          ) : (
            <span>
              <LikeTweet id={tweet.id as number} />
              {tweet?.likes?.length}
            </span>
          )}
          <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <CreateComment tweetId={tweet.id} />
          </span>
          {tweet.comments?.length}
        </div>
      ))}
    </div>
  );
}
