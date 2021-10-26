import { Field, Form, Formik } from 'formik';
import '../styles/tweet.css';
import { gql, useMutation } from '@apollo/client';
import * as yup from 'yup';
import { TWEETS_QUERY } from './Tweets';

const CREATE_TWEET_MUTATION = gql`
  mutation createTweet($title: String!, $content: String!) {
    createTweet(input: { title: $title, content: $content }) {
      title
      content
      author {
        username
      }
      createdAt
      updatedAt
    }
  }
`;

function HomeTweet() {
  const initialValues = {
    title: '',
    content: '',
  };

  const [createTweet] = useMutation(CREATE_TWEET_MUTATION, {
    refetchQueries: [{ query: TWEETS_QUERY }],
  });

  const validationSchema = yup.object({
    content: yup.string().required().min(1).max(256, 'Max allowed characters is 256'),
  });

  return (
    <div className="home-page-tweet">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await createTweet({ variables: values });
          setSubmitting(false);
        }}
      >
        <Form>
          <Field name="title" type="text" placeholder="Title" />
          <Field name="content" type="text" placeholder="Content" />

          <button type="submit" className="home-tweet-button">
            <span>Tweet</span>
          </button>
        </Form>
      </Formik>
      <div className="footer" />
    </div>
  );
}

export default HomeTweet;
