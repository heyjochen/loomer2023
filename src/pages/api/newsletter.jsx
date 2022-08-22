import axios from 'axios'

export default async function handler(req, res) {
  const listId = process.env.LIST_ID
  const apiKey = process.env.MAILCHIMP_API_KEY

  const { email_address } = req.body

  if (!email_address) {
    res.status(400).json({ message: 'Please provide an email address' })
  }

  try {
    const payload = {
      email_address: email_address,
      status: 'subscribed',
    }
    const { data } = await axios.post(
      `https://us14.api.mailchimp.com/3.0/lists/${listId}/members`,
      payload,
      {
        headers: {
          Authorization: `Basic ${apiKey}`,
        },
      }
    )

    res.status(200).json({ data })
  } catch (e) {
    console.log(e)
    res.status(500).json({ error })
  }
}
