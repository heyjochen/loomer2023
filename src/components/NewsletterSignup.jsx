import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { Button } from '@/components/Button'

export default function NewsletterSignup() {
  const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
  })

  const submitForm = (values, { resetForm }) => {
    const { email } = values

    const payload = {
      email_address: email,
    }

    axios.post('/api/newsletter', payload)
    resetForm()
  }

  return (
    <div>
      <Formik
        initialValues={{
          email: '',
        }}
        onSubmit={submitForm}
        validationSchema={SignupSchema}
      >
        {(formik) => (
          <Form action="#" className="sm:mx-auto sm:max-w-xl lg:mx-0">
            <div className="sm:flex">
              <div className="min-w-0 flex-1">
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <Field
                  name="email"
                  id="cta-email"
                  type="email"
                  placeholder="Enter your email"
                  className="block w-full rounded-md border-gray-300 shadow-sm
                focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {/* <ErrorMessage
                name="email"
                className="text-black"
                component="div"
              /> */}
              </div>

              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Button
                  variant="solid"
                  color="blue"
                  type="submit"
                  disabled={!formik.isValid || !formik.dirty}
                >
                  <span>Sign up</span>
                </Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-300 sm:mt-4">
              Sign up to join our newsletter and see how we build in public.
            </p>
          </Form>
        )}
      </Formik>
    </div>
  )
}
