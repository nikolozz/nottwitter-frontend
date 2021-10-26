import { useQuery } from '@apollo/client';
import { TWEETS_QUERY } from './Tweets';
import '../styles/popular-tweets.css';

export default function PopularTweets() {
  const { loading, error, data } = useQuery(TWEETS_QUERY);
  if (loading) return <p>loading</p>;
  if (error) return <p>{error}</p>;

  const popularTweets = data.tweets
    .map((tweet: any) => tweet)
    .sort((a: { likes: any[] }, b: { likes: any[] }) => b.likes?.length - a.likes?.length)
    .slice(0, 6);

  return (
    <div className="popular-tweets">
      <h3 className="trending">Trending</h3>
      {popularTweets.map((tweet: any) => (
        <div className="popular-tweet-container" key={tweet.id}>
          <div className="date-title">
            <div className="title-logo">
              <img
                src={tweet.author.avatar.url}
                style={{ width: '40px', borderRadius: '50%' }}
                alt="avatar"
              />
              <p className="tweet-content">{tweet.content}</p>
            </div>
          </div>
          <div className="tweet-likes">
            {tweet.likes.length > 0 ? <span>Likes {tweet.likes.length}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
