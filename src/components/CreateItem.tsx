import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../store/actions/itemActions';
import { AppDispatch } from '../store';
import Wrapper from './Wrapper';
import Input from './UI/Input';
import Button from './UI/Button';

const CreateItem: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newPhotos]);

      // Create preview URLs
      const newPreviewUrls = newPhotos.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      photos.forEach((photo) => {
        formDataToSend.append('photos', photo);
      });

      await dispatch(createItem(formDataToSend));
      navigate('/market');
    } catch (error) {
      console.error('Error creating item:', error);
      setError('Error creating item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <h1 className="text-3xl font-bold mb-8">List an Item for Sale</h1>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-white mb-1"
          >
            Title
          </label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-white mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="text-lg px-[15px] py-[6px] rounded-md font-medium placeholder:opacity-60 w-full pr-[50px]"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-white mb-1"
          >
            Price ($)
          </label>
          <Input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Photos (up to 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="w-full"
            disabled={photos.length >= 5}
          />
          <p className="text-sm text-gray-500 mt-1">
            {photos.length}/5 photos selected
          </p>
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || photos.length === 0}
          addStyles="w-full"
        >
          {loading ? 'Creating...' : 'List Item'}
        </Button>
      </form>
    </Wrapper>
  );
};

export default CreateItem;
