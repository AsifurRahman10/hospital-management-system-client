Hospital Management System frontend foundation built with Next.js App Router, TypeScript, Tailwind CSS 4, and shadcn/ui. The initial landing screen follows the supplied dental clinic design brief.

## Getting Started

Install dependencies and start the development server with pnpm:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page in `src/app/page.tsx`. The page auto-updates as you edit the file.

Useful checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

The CSS-first Tailwind theme is in `src/app/globals.css`; shared shadcn/ui primitives are in `src/components/ui`. Clinical workflows, appointment submission, authentication, and data integrations are intentionally not included until their requirements and service contracts are defined.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
