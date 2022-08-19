import { prisma } from '@/lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method === 'POST') {
    try {
      const { image, title, description, camera, lens, film } = req.body

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      const project = await prisma.project.create({
        data: {
          image,
          title,
          description,
          camera,
          lens,
          film,
          ownerId: user.id,
        },
      })
      res.status(200).json(project)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['POST'])
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
}
