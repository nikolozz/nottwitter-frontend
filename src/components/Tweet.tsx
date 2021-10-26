import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import Modal from 'react-modal';
import { customStyles } from '../styles/custom-modal-styles';
import '../styles/tweet.css';
import { gql, useMutation } from '@apollo/client';
import { ME_QUERY } from '../pages/Profile';
import * as yup from 'yup';

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

function Tweet() {
  const initialValues = {
    title: '',
    content: '',
  };

  const [modalIsOpen, setmodalIsOpen] = useState(false);

  const [createTweet] = useMutation(CREATE_TWEET_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const validationSchema = yup.object({
    content: yup.string().required().min(1).max(256, 'Max allowed characters is 256'),
  });

  return (
    <div>
      <div>
        <button onClick={() => setmodalIsOpen(true)} className="edit-button">
          Tweet
        </button>
        <Modal
          id="model"
          isOpen={modalIsOpen}
          onRequestClose={() => setmodalIsOpen(false)}
          contentLabel="Modal"
          style={customStyles}
          ariaHideApp={false}
        >
          <div className="header" />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              await createTweet({ variables: values });
              setSubmitting(false);
              setmodalIsOpen(false);
            }}
          >
            <Form>
              <Field name="title" type="text" placeholder="Title" />
              <Field name="content" type="text" placeholder="Content" />
              <div className="footer" />
              <button type="submit" className="tweet-button">
                <span>Tweet</span>
              </button>
            </Form>
          </Formik>
        </Modal>
      </div>
    </div>
  );
}

export default Tweet;
