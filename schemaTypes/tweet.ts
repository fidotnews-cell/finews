import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'tweet',
  title: 'Tweet',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
    }),
    defineField({
      name: 'authorHandle',
      title: 'Author Handle',
      type: 'string',
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Author Avatar',
      type: 'url',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
    }),
    defineField({
      name: 'retweets',
      title: 'Retweets',
      type: 'number',
    }),
    defineField({
      name: 'views',
      title: 'Views',
      type: 'number',
    }),
  ],
})
