import { useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'
import { Formik, Form } from 'formik'
import Input from '@/components/Input'
import ImageUpload from '@/components/ImageUpload'
import axios from 'axios'
import { Button } from './Button'

const ListingSchema = Yup.object().shape({
  title: Yup.string().trim().required(),
  description: Yup.string().trim().required(),
  camera: Yup.string().trim().required(),
  lens: Yup.string().trim().required(),
  film: Yup.string().trim().required(),
})

const ListingForm = ({
  initialValues = null,
  redirectPath = '',
  buttonText = 'Submit',
  onSubmit = () => null,
}) => {
  const router = useRouter()

  const [disabled, setDisabled] = useState(false)
  const [imageUrl, setImageUrl] = useState(initialValues?.image ?? '')

  const upload = async (image) => {
    if (!image) return

    let toastId
    try {
      setDisabled(true)
      toastId = toast.loading('Uploading...')
      const { data } = await axios.post('/api/image-upload', { image })
      setImageUrl(data?.url)
      toast.success('Successfully uploaded', { id: toastId })
    } catch (e) {
      toast.error('Unable to upload', { id: toastId })
      setImageUrl('')
    } finally {
      setDisabled(false)
    }
  }

  const handleOnSubmit = async (values = null) => {
    let toastId
    try {
      setDisabled(true)
      toastId = toast.loading('Submitting...')
      // Submit data
      if (typeof onSubmit === 'function') {
        await onSubmit({ ...values, image: imageUrl })
      }
      toast.success('Successfully submitted', { id: toastId })
      // Redirect user
      if (redirectPath) {
        router.push(redirectPath)
      }
    } catch (e) {
      toast.error('Unable to submit', { id: toastId })
      setDisabled(false)
    }
  }

  const { image, ...initialFormValues } = initialValues ?? {
    image: '',
    title: '',
    description: '',
    camera: '',
    lens: '',
    film: '',
  }

  return (
    <div>
      <div className="mb-8 max-w-md">
        <ImageUpload
          initialImage={{ src: image, alt: initialFormValues.title }}
          onChangePicture={upload}
        />
      </div>

      <Formik
        initialValues={initialFormValues}
        validationSchema={ListingSchema}
        validateOnBlur={false}
        onSubmit={handleOnSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-8">
            <div className="space-y-6">
              <Input
                name="title"
                type="text"
                label="Title"
                placeholder="Late summer photo"
                disabled={disabled}
              />

              <Input
                name="description"
                type="textarea"
                label="Description"
                placeholder="Large Format photo, summer 2022"
                disabled={disabled}
                rows={5}
              />

              <Input
                name="camera"
                type="text"
                label="Camera"
                placeholder="Chamonix V810"
                disabled={disabled}
              />

              <div className="flex space-x-4">
                <Input
                  name="lens"
                  type="text"
                  label="Lens"
                  placeholder="Fujinon 450 5.6"
                  disabled={disabled}
                />
                <Input
                  name="film"
                  type="text"
                  label="Film"
                  placeholder="Kodak Portra 400"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="solid"
                color="blue"
                type="submit"
                disabled={disabled || !isValid}
              >
                <span>{isSubmitting ? 'Submitting...' : buttonText}</span>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

ListingForm.propTypes = {
  initialValues: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    camera: PropTypes.string,
    lens: PropTypes.string,
    film: PropTypes.string,
  }),
  redirectPath: PropTypes.string,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func,
}

export default ListingForm
