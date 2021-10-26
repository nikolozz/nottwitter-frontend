import { gql, useMutation } from '@apollo/client';
import { ME_QUERY } from '../pages/Profile';
import { TWEETS_QUERY } from './Tweets';

const DELETE_LIKE = gql`
  mutation deleteLike($id: Int!) {
    deleteLike(likeId: $id) {
      id
    }
  }
`;

function DeleteLike({ id }: { id: number }) {
  const [deleteLike] = useMutation(DELETE_LIKE, {
    refetchQueries: [{ query: ME_QUERY }, { query: TWEETS_QUERY }],
  });

  const handleDeleteLike = async () => {
    await deleteLike({
      variables: { id },
    });
  };

  return (
    <span onClick={handleDeleteLike} style={{ marginRight: '5px' }}>
      <i className="far fa-thumbs-down" aria-hidden="true" />
    </span>
  );
}

export default DeleteLike;
