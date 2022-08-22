import ListingForm from '@/components/ListingForm'
import { prisma } from '@/lib/prisma'
import { getSession } from 'next-auth/react'
import axios from 'axios'

export async function getServerSideProps(context) {
  const session = await getSession(context)

  const redirect = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }

  if (!session) {
    return redirect
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedProjects: true },
  })

  const id = context.params.id
  const project = user?.listedProjects?.find((project) => project.id === id)
  if (!project) {
    return redirect
  }

  return {
    props: JSON.parse(JSON.stringify(project)),
  }
}

const Edit = (project = null) => {
  const handleOnSubmit = (data) =>
    axios.patch(`/api/projects/${project.id}`, data)

  return (
    <div className="mx-auto max-w-screen-sm">
      <h1 className="text-xl font-medium text-gray-800">Edit your Project</h1>
      <p className="text-gray-500">
        Fill out the form below to update your project.
      </p>
      <div className="mt-8">
        {project ? (
          <ListingForm
            initialValues={project}
            buttonText="Update project"
            redirectPath={`/dashboard`}
            onSubmit={handleOnSubmit}
          />
        ) : null}{' '}
      </div>
    </div>
  )
}

export default Edit
