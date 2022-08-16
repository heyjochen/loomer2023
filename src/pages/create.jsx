import ListingForm from '@/components/ListingForm'
import axios from 'axios'

const Create = () => {
  const addProject = (data) => axios.post('/api/projects', data)
  return (
    <div className="mx-auto max-w-screen-sm">
      <h1 className="text-xl font-medium text-gray-800">Add your project</h1>
      <p className="text-gray-500">
        Fill out the form below to list a new project.
      </p>
      <div className="mt-8">
        <ListingForm
          buttonText="Add project"
          redirectPath="/"
          onSubmit={addProject}
        />
      </div>
    </div>
  )
}

export default Create
