import type React from 'react';
import { useEffect, useState, type FC } from 'react';
import { FileText, Book } from 'lucide-react';
import Wrapper from '@/components/Wrapper';
import ReactMarkdown from 'react-markdown';
import type { Tag, Topic } from '@/types';
import { getTags } from '@/services/tagsService';
import { createNew } from '@/services/newsService';
import { getForumTopics } from '@/services/topicService';
import { useNavigate } from 'react-router-dom';

interface CreateNewsForm {
  title: string;
  content: string;
  topicId: string;
  tagIds: string[];
}

const CreateNews: FC = () => {
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [image, setImage] = useState<any | null>(null);
  const [form, setForm] = useState<CreateNewsForm>({
    title: '',
    content: '',
    topicId: '',
    tagIds: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
    fetchTags();
  }, []);

  const fetchTopics = async () => {
    setTopics((await getForumTopics()) as Topic[]);
  };

  const fetchTags = async () => {
    setTags(await getTags());
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNew(
        form.title,
        form.content,
        form.topicId,
        isMarkdown,
        image,
        form.tagIds
      );
      navigate('/news');
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImage(file);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleTag = (tagId: string) => {
    setForm((prev) => {
      if (prev.tagIds.includes(tagId)) {
        return {
          ...prev,
          tagIds: prev.tagIds.filter((id) => id !== tagId),
        };
      } else {
        return {
          ...prev,
          tagIds: [...prev.tagIds, tagId],
        };
      }
    });
  };

  const isTagSelected = (tagId: string) => {
    return form.tagIds.includes(tagId);
  };

  return (
    <Wrapper className="pt-[100px]">
      <section className="container mx-auto py-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Create News</h1>
          <div className="flex items-center gap-2 bg-[#222225]/50 rounded-lg p-1">
            <button
              onClick={() => setIsMarkdown(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                !isMarkdown
                  ? 'bg-[#646cff] text-[#f0f0f0]'
                  : 'text-[#f0f0f0]/60 hover:text-[#f0f0f0] hover:bg-[#646cff]/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Editor</span>
            </button>
            <button
              onClick={() => setIsMarkdown(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isMarkdown
                  ? 'bg-[#646cff] text-[#f0f0f0]'
                  : 'text-[#f0f0f0]/60 hover:text-[#f0f0f0] hover:bg-[#646cff]/10'
              }`}
            >
              <Book className="w-4 h-4" />
              <span className="text-sm">Markdown</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#f0f0f0]/80"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#222225] border border-[#646cff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#646cff]/50 transition-all placeholder:text-[#f0f0f0]/30"
              placeholder="Enter news title"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-[#f0f0f0]/80"
            >
              Topic
            </label>
            <select
              id="topic"
              name="topicId"
              required
              value={form.topicId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#222225] border border-[#646cff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#646cff]/50 transition-all text-[#f0f0f0]/80"
            >
              <option value="" disabled className="bg-[#222225]">
                Select a topic
              </option>
              {topics.map((topic) => (
                <option
                  key={topic._id}
                  value={topic._id}
                  className="bg-[#222225]"
                >
                  {topic.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-[#f0f0f0]/80"
            >
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleTag(tag._id)}
                  className={`px-4 py-2 rounded-lg text-[#f0f0f0]/80 transition-all ${
                    isTagSelected(tag._id)
                      ? 'border-2 border-[#646cff] bg-[#646cff]/10'
                      : 'border border-[#646cff]/20 hover:bg-[#646cff]/5'
                  }`}
                >
                  {tag.title}
                </button>
              ))}
            </div>
            {form.tagIds.length > 0 && (
              <p className="text-xs text-[#646cff]">
                {form.tagIds.length} tag{form.tagIds.length !== 1 ? 's' : ''}{' '}
                selected
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-[#f0f0f0]/80"
            >
              Preview Image
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-[#f0f0f0]/80"
            >
              Content
            </label>
            <div className="relative">
              <textarea
                id="content"
                name="content"
                required
                value={form.content}
                onChange={handleInputChange}
                rows={12}
                className="w-full px-4 py-3 bg-[#222225] border border-[#646cff]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#646cff]/50 transition-all placeholder:text-[#f0f0f0]/30 font-mono"
                placeholder={
                  isMarkdown
                    ? '# Your markdown content here...'
                    : 'Enter your content here...'
                }
              />
              {isMarkdown && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-[#646cff]/10 rounded text-xs text-[#646cff]">
                  Markdown
                </div>
              )}
            </div>
          </div>

          {isMarkdown && form.content && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#f0f0f0]/80">
                Preview
              </label>
              <div className="p-4 bg-[#222225] border border-[#646cff]/20 rounded-lg prose prose-invert max-w-none">
                <ReactMarkdown>{form.content}</ReactMarkdown>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={goBack}
              type="button"
              className="px-6 py-2 bg-[#222225] hover:bg-[#646cff]/10 border border-[#646cff]/20 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#646cff] hover:bg-[#646cff]/80 rounded-lg transition-colors"
            >
              Create News
            </button>
          </div>
        </form>
      </section>
    </Wrapper>
  );
};

export default CreateNews;
