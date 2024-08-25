import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json, useLoaderData } from '@remix-run/react';
import { getDrizzleClient } from '@repo/db';
import { Markdown } from '~/components';
import { getFileContentWithCache } from '~/services/github.server';
import { parse } from '~/services/markdoc.server';

export async function loader({ context }: LoaderFunctionArgs) {
	const client = await getDrizzleClient({
		databaseUrl: context.env.DATABASE_URL,
		env: 'development',
		mode: 'cloudflare',
	});
	if (client) {
		await client.query.User.findFirst();
		console.log('Client!!');
	}
	console.log('ERROR: Could not get client');
	const content = await getFileContentWithCache(context, 'README.md');

	return json(
		{
			content: parse(content),
			// user: firstUser,
		},
		{
			headers: {
				'Cache-Control': 'public, max-age=3600',
			},
		},
	);
}

export default function Index() {
	const { content } = useLoaderData<typeof loader>();

	return <Markdown content={content} />;
}
