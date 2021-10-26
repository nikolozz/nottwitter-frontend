import { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import Modal from 'react-modal';
import { customStyles } from '../styles/custom-modal-styles';
import '../styles/tweet.css';
import { gql, useMutation } from '@apollo/client';
import { ME_QUERY } from '../pages/Profile';
import * as yup from 'yup';

const CREATE_COMMENT_MUTATION = gql`
  mutation addComment($tweetId: Int!, $content: String!) {
    addComment(input: { tweetId: $tweetId, content: $content }) {
      id
      content
      author {
        username
      }
    }
  }
`;

function CreateComment({ tweetId }: { tweetId: number }) {
  const initialValues = {
    content: '',
  };

  const [modalIsOpen, setmodalIsOpen] = useState(false);

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const validationSchema = yup.object({
    content: yup.string().required().min(1).max(256, 'Max allowed characters is 256'),
  });

  return (
    <div>
      <span onClick={() => setmodalIsOpen(true)}>
        <i className="far fa-comment" aria-hidden="true" />
      </span>
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
            await createComment({ variables: { ...values, tweetId } });
            setSubmitting(false);
            setmodalIsOpen(false);
          }}
        >
          <Form>
            <Field name="content" type="text" placeholder="Content" />
            <div className="footer" />
            <button type="submit" className="tweet-button">
              <span>Create Comment</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}

export default CreateComment;
