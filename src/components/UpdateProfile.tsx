/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useRef, useState } from 'react';
import { ME_QUERY } from '../pages/Profile';
import { Field, Form, Formik } from 'formik';
import Modal from 'react-modal';
import { v4 as uuid } from 'uuid';
import { customStyles } from '../styles/custom-modal-styles';
import axios from 'axios';

const UPDATE_PROFILE_MUTATION = gql`
  mutation updateUser($bio: String, $location: String, $website: String) {
    updateUser(input: { bio: $bio, location: $location, website: $website }) {
      id
    }
  }
`;

const ADD_AVATAR = gql`
  mutation addAvatar($key: String!, $url: String!) {
    addAvatar(input: { key: $key, url: $url }) {
      url
    }
  }
`;

const GET_PRESIGNED_URL = gql`
  query url($key: String!) {
    generatePresignedUrl(key: $key)
  }
`;

interface ProfileValues {
  bio?: string;
  location?: string;
  website?: string;
}

function UpdateProfile() {
  const initialValues: ProfileValues = {
    bio: '',
    location: '',
    website: '',
  };

  const inputFile = useRef(null) as any;
  const [imageLoading, setImageLoading] = useState(false);
  const [modalIsOpen, setmodalIsOpen] = useState(false);

  const [file, setFile] = useState(new Blob());

  const {
    data: { me },
  } = useQuery(ME_QUERY);
  const [updateUser] = useMutation(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });
  const [presignedUrl, { data: presignedUrlData }] = useLazyQuery(GET_PRESIGNED_URL);
  const [addAvatar] = useMutation(ADD_AVATAR, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const UploadImage = async (e: any) => {
    const [file] = e.target.files;
    const fileKey = `${uuid()}-${file.name}`;

    setImageLoading(true);
    await presignedUrl({ variables: { key: fileKey } });
    setFile({ ...file, name: fileKey });
    await addAvatar({
      variables: {
        key: fileKey,
        url: `https://nottwitter.s3.us-west-2.amazonaws.com/${fileKey}`,
      },
    });
    setImageLoading(false);
  };

  useEffect(() => {
    if (!presignedUrlData) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    console.log(file.type);
    axios.put(presignedUrlData.generatePresignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
    // fetch(presignedUrlData.generatePresignedUrl, {
    //   method: 'PUT',
    //   body: formData,
    // });
  }, [presignedUrl, presignedUrlData]);

  return (
    <div>
      <button onClick={() => setmodalIsOpen(true)} className="edit-button">
        Update Profile
      </button>
      <Modal
        id="model"
        isOpen={modalIsOpen}
        onRequestClose={() => setmodalIsOpen(false)}
        contentLabel="Modal"
        style={customStyles}
        ariaHideApp={false}
      >
        <input
          type="file"
          name="file"
          placeholder="upload file"
          onChange={UploadImage}
          ref={inputFile}
          style={{ display: 'none' }}
        />
        {imageLoading ? (
          <div>Loading</div>
        ) : me.avatar ? (
          <span onClick={() => inputFile.current.click()}>
            <img src={me.avatar.url} style={{ width: '150px', borderRadius: '50%' }} alt="avatar" />
          </span>
        ) : (
          <span onClick={() => inputFile.current.click()}>
            <i className="fa fa-user fa-5x" aria-hidden="true"></i>
          </span>
        )}
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await updateUser({ variables: values });
            setSubmitting(false);
            setmodalIsOpen(false);
          }}
        >
          <Form>
            <Field name="bio" type="text" as="textarea" placeholder="Bio" />
            <Field name="location" type="text" placeholder="Location" />
            <Field name="website" type="text" placeholder="Website" />
            <button type="submit" className="login-button">
              <span>Update Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}

export default UpdateProfile;
