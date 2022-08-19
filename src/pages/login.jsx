import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'
import { Formik, Form, Field } from 'formik'
import { signIn } from 'next-auth/react'

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Invalid email')
    .required('This field is required'),
})

export default function Login() {
  const [disabled, setDisabled] = useState(false)
  const [showConfirm, setConfirm] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)

  const signInWithEmail = async ({ email }) => {
    let toastId
    try {
      toastId = toast.loading('Loading...')
      // Perform sign in
      const { error } = await signIn('email', {
        redirect: false,
        callbackUrl: `${window.location.origin}/dashboard`,
        email,
      })
      // Something went wrong
      if (error) {
        console.log(error)
      }
      toast.dismiss(toastId)
    } catch (err) {
      toast.error('Unable to sign in', { id: toastId })
    } finally {
      setDisabled(false)
    }
  }

  const signInWithGoogle = () => {
    toast.loading('Redirecting...')
    setDisabled(true)
    // Perform sign in
    signIn('google', {
      callbackUrl: `${window.location.origin}/dashboard`,
    })
  }

  return (
    <>
      <Head>
        <title>Sign In - Loomer</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
        </div>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={SignInSchema}
          validateOnBlur={false}
          onSubmit={signInWithEmail}
        >
          {({ isSubmitting, isValid, values, resetForm }) => (
            <Form className="mt-10 grid grid-cols-1">
              <label
                htmlFor="email"
                className="mb-3 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <Field
                label="Email address"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="jack@jameson.com"
                disabled={disabled}
                spellCheck={false}
                className="mb-8 block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
              <Button
                type="submit"
                variant="solid"
                color="blue"
                className="w-full"
                disabled={disabled || !isValid}
              >
                <span>
                  Let's get started <span aria-hidden="true">&rarr;</span>
                </span>
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 ">
            <div>
              <button
                disabled={disabled}
                onClick={() => signInWithGoogle()}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
              >
                <span className="sr-only">Sign in with Google</span>
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 30 30"
                >
                  <path
                    fillRule="evenodd"
                    d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  )
}
