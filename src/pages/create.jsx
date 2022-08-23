import ListingForm from '@/components/ListingForm'
import axios from 'axios'
import { getSession } from 'next-auth/react'

export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context)

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

const Create = () => {
  const addProject = (data) => axios.post('/api/projects', data)
  return (
    <div className="mx-auto mt-4 max-w-screen-sm px-12">
      <h1 className="text-xl font-medium text-gray-800">Add your project</h1>
      <p className="text-gray-500">
        Fill out the form below to list a new project.
      </p>
      <div className="mt-4">
        <ListingForm
          buttonText="Add project"
          redirectPath="/dashboard"
          onSubmit={addProject}
        />
      </div>
    </div>
  )
}

export default Create
