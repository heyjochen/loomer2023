import Image from 'next/image'

import { prisma } from '@/lib/prisma'
// import { useRouter } from 'next/router'
// import axios from 'axios'
// import { useSession } from 'next-auth/react'
// import { useState, useEffect } from 'react'
// import toast from 'react-hot-toast'

const ListedProject = (project = null) => {
  //   const router = useRouter()
  //   const { data: session } = useSession()
  //   const [isOwner, setIsOwner] = useState(false)
  //   const [deleting, setDeleting] = useState(false)

  //   useEffect(() => {
  //     ;(async () => {
  //       if (session?.user) {
  //         try {
  //           const owner = await axios.get(`/api/projects/${project.id}/owner`)
  //           setIsOwner(owner?.id === session.user.id)
  //         } catch (e) {
  //           setIsOwner(false)
  //         }
  //       }
  //     })()
  //   }, [session?.user])

  //   const deleteProject = async () => {
  //     let toastId
  //     try {
  //       toastId = toast.loading('Deleting...')
  //       setDeleting(true)
  //       await axios.delete(`/api/projects/${project.id}`)
  //       toast.success('Successfully deleted', { id: toastId })
  //       router.push('/projects')
  //     } catch (e) {
  //       console.log(e)
  //       toast.error('Unable to delete project', { id: toastId })
  //       setDeleting(false)
  //     }
  //   }

  return (
    <div className="mx-auto max-w-screen-lg">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-x-4">
        <div>
          <h1 className="truncate text-2xl font-semibold">
            {project?.title ?? ''}
          </h1>
          <ol className="inline-flex items-center space-x-1 text-gray-500">
            <li>
              <span>{project?.camera ?? ''}</span>
              <span aria-hidden="true"> · </span>
            </li>
            <li>
              <span>{project?.lens ?? ''}</span>
              <span aria-hidden="true"> · </span>
            </li>
            <li>
              <span>{project?.film ?? ''}</span>
            </li>
          </ol>
        </div>

        {/* {isOwner ? (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => router.push(`/projects/${project.id}/edit`)}
                className="rounded-md border border-gray-800 px-4 py-1 text-gray-800 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:bg-transparent disabled:text-gray-800 disabled:opacity-50"
              >
                Edit
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={deleteProject}
                className="rounded-md border border-rose-500 px-4 py-1 text-rose-500 transition hover:bg-rose-500 hover:text-white focus:outline-none disabled:cursor-not-allowed disabled:bg-rose-500 disabled:text-white disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ) : null} */}
      </div>

      <div className="aspect-w-16 aspect-h-9 relative mt-6 overflow-hidden rounded-lg bg-gray-200 shadow-md">
        {project?.image ? (
          <Image
            src={project.image}
            alt={project.title}
            layout="fill"
            objectFit="cover"
          />
        ) : null}
      </div>

      <p className="mt-8 text-lg">{project?.description ?? ''}</p>
    </div>
  )
}

export async function getStaticPaths() {
  const projects = await prisma.project.findMany({
    select: { id: true },
  })

  return {
    paths: projects.map((project) => ({
      params: { id: project.id },
    })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  })

  if (project) {
    return {
      props: JSON.parse(JSON.stringify(project)),
    }
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}

export default ListedProject
