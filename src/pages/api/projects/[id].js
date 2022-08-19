import { getSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedProjects: true },
  })

  const { id } = req.query
  if (!user?.listedProjects?.find((project) => project.id === id)) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method === 'PATCH') {
    try {
      const project = await prisma.project.update({
        where: { id },
        data: req.body,
      })
      res.status(200).json(project)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const project = await prisma.project.delete({
        where: { id },
      })
      if (project.image) {
        const path = project.image.split(`${process.env.SUPABASE_BUCKET}/`)?.[1]
        await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([path])
      }

      res.status(200).json(project)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE'])
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
}
