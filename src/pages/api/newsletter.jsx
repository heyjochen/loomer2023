import axios from 'axios'

export default async function handler(req, res) {
  {
    console.log(req)
  }
  const listId = process.env.LIST_ID
  const apiKey = process.env.MAILCHIMP_API_KEY

  const { email_address } = req.body

  if (!email_address) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please provide an email address' }),
    }
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
    {
      console.log(data)
    }
    return res.status(200).json({ data })

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify(data),
    // }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
