import { prisma } from '@/lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { image, title, description, camera, lens, film } = req.body

      const project = await prisma.project.create({
        data: {
          image,
          title,
          description,
          camera,
          lens,
          film,
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
