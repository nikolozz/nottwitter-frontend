import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

interface LoginUser {
  username: string;
  password: string;
}

function Login() {
  const history = useHistory();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().max(20).required(),
  });

  const login = async (data: LoginUser) => {
    const res = await axios.post('http://localhost:3000/login', data);
    console.log(res.headers['authentication'], res.headers);
    localStorage.setItem('Authentication', res.headers['authentication']);
    history.push('/profile');
  };

  return (
    <div className="container">
      <img src="/twitter-logo.png" alt="logo" style={{ width: '50px' }} className="logo " />
      <h3>Not Twitter</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => login(values)}
      >
        <Form>
          <Field name="username" type="text" placeholder="Username" />
          <ErrorMessage name="username" component={'div'}></ErrorMessage>
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" component={'div'}></ErrorMessage>
          <button type="submit" className="login-button">
            <span>Login</span>
          </button>
        </Form>
      </Formik>
      <div className="register">
        <h4>Don't have an account?</h4> <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;
