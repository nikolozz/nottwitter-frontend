import { gql, useMutation } from '@apollo/client';
import { ME_QUERY } from '../pages/Profile';
import { TWEETS_QUERY } from './Tweets';

const LIKE_TWEET = gql`
  mutation like($id: Int!) {
    like(tweetId: $id) {
      id
    }
  }
`;

function LikeTweet({ id }: { id: number }) {
  const [likeTweet] = useMutation(LIKE_TWEET, {
    refetchQueries: [{ query: ME_QUERY }, { query: TWEETS_QUERY }],
  });

  const handleCreateLike = async () => {
    await likeTweet({
      variables: { id },
    });
  };

  return (
    <span onClick={handleCreateLike} style={{ marginRight: '5px' }}>
      <i className="far fa-thumbs-up" aria-hidden="true" />
    </span>
  );
}

export default LikeTweet;
