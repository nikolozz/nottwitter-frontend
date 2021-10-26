import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

interface SignupUser {
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

function Signup() {
  const history = useHistory();

  const initialValues = {
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = yup.object({
    email: yup.string().email('Invalid Email Address').required(),
    username: yup.string().required(),
    password: yup.string().max(20).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Password should match'),
  });

  const signup = async (data: SignupUser) => {
    delete data.confirmPassword;
    await axios.post('http://localhost:3000/signup', data);
    history.push('/login');
  };

  return (
    <div className="container">
      <img src="/twitter-logo.png" alt="logo" style={{ width: '50px' }} className="logo " />
      <h3>Sign Up</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => signup(values)}
      >
        <Form>
          <Field name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" component={'div'}></ErrorMessage>
          <Field name="username" type="text" placeholder="Username" />
          <ErrorMessage name="username" component={'div'}></ErrorMessage>
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" component={'div'}></ErrorMessage>
          <Field name="confirmPassword" type="password" placeholder="Confirm Password" />
          <ErrorMessage name="password" component={'div'}></ErrorMessage>
          <button type="submit" className="login-button">
            Signup
          </button>
          <div className="register">
            <h4>Already have an account?</h4> <Link to="/login">Log in</Link>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Signup;
