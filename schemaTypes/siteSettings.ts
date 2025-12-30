import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'sidebarAd',
      title: 'Sidebar Ad',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Ad Image',
          type: 'image',
        }),
        defineField({
          name: 'url',
          title: 'Ad Link URL',
          type: 'url',
        }),
        defineField({
          name: 'active',
          title: 'Is Active?',
          type: 'boolean',
          initialValue: true
        })
      ]
    }),
    defineField({
      name: 'topNotification',
      title: 'Top Notification (Orange)',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Notification Text',
          type: 'string',
        }),
        defineField({
          name: 'active',
          title: 'Is Active?',
          type: 'boolean',
          initialValue: true
        })
      ]
    }),
    defineField({
      name: 'aiNotification',
      title: 'AI Notification (Purple)',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Notification Text',
          type: 'string',
        }),
        defineField({
          name: 'active',
          title: 'Is Active?',
          type: 'boolean',
          initialValue: true
        })
      ]
    }),
  ],
})
