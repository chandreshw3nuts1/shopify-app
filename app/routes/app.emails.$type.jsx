import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request, params }) => {


	return json({ params: params });
};

export default function LandingPage() {
	const { params } = useLoaderData();
	console.log(params.type);
	const type = params.type;
	if (type == 'review-reminder') {
		return (
			<div>
				<p>
				review-reminder
				</p>
			</div>
		)
	} else if (type == 'review-reminders') {
		return (
			<div>
				<p>
				review-reminders
				</p>
			</div>
		)
	}
	
}
