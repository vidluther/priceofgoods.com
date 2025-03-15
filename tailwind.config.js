/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100ch',
            color: '#374151', // text-gray-700
            lineHeight: '1.75',
            a: {
              color: '#2563eb', // text-blue-600
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            blockquote: {
              fontStyle: 'italic',
              borderLeftWidth: '4px',
              borderLeftColor: '#93c5fd', // border-blue-300
              backgroundColor: '#eff6ff', // bg-blue-50
              marginLeft: '0',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              borderRadius: '0 0.25rem 0.25rem 0',
            },
            h1: {
              color: '#1e3a8a', // text-blue-900
              fontWeight: '700',
              marginTop: '0',
              marginBottom: '1.25rem',
              fontSize: '1.875rem',
              lineHeight: '1.25',
            },
            h2: {
              color: '#1e40af', // text-blue-800
              fontWeight: '600',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              fontSize: '1.5rem',
              lineHeight: '1.3',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '0.25rem',
            },
            h3: {
              color: '#1d4ed8', // text-blue-700
              fontWeight: '500',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
              fontSize: '1.25rem',
              lineHeight: '1.4',
            },
            h4: {
              color: '#2563eb', // text-blue-600
              fontWeight: '500',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
              fontSize: '1.125rem',
            },
            p: {
              marginTop: '1rem',
              marginBottom: '1rem',
              lineHeight: '1.625',
            },
            ul: {
              marginTop: '1rem',
              marginBottom: '1rem',
              paddingLeft: '1.5rem',
            },
            ol: {
              marginTop: '1rem',
              marginBottom: '1rem',
              paddingLeft: '1.5rem',
            },
            li: {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              '&::marker': {
                color: '#3b82f6', // text-blue-500
              },
            },
            'li > ul, li > ol': {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              marginLeft: '1rem',
            },
            strong: {
              color: '#1d4ed8', // text-blue-700
              fontWeight: '600',
            },
            code: {
              color: '#1e40af', // text-blue-800
              backgroundColor: '#f1f5f9', // bg-slate-100
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
            pre: {
              backgroundColor: '#1e293b', // bg-slate-800
              color: '#f8fafc', // text-slate-100
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              borderRadius: '0.375rem',
              paddingTop: '1rem',
              paddingRight: '1.5rem',
              paddingBottom: '1rem',
              paddingLeft: '1.5rem',
              overflow: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: '400',
              color: 'inherit',
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
              borderCollapse: 'collapse',
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: '#d1d5db', // border-gray-300
            },
            'thead th': {
              backgroundColor: '#f0f9ff', // bg-blue-50
              fontWeight: '600',
              paddingTop: '0.75rem',
              paddingRight: '0.75rem',
              paddingBottom: '0.75rem',
              paddingLeft: '0.75rem',
              textAlign: 'left',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: '#e5e7eb', // border-gray-200
            },
            'tbody td': {
              padding: '0.75rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};