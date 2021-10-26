import { gql, useQuery } from '@apollo/client';

const USERS_QUERY = gql`
  query USERS_QUERY {
    sayHello
  }
`;

export default function Users() {
  const { loading, error, data } = useQuery(USERS_QUERY);
  if (loading) return <p>Loading</p>;
  if (error) return <p>error</p>;

  if (data) return <p>data</p>;
  return <div>nothing</div>;
}
