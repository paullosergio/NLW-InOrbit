interface CreateGoalRequest {
	title: string
	desiredWeeklyFrequency: number
}
export async function createGoal({
	title,
	desiredWeeklyFrequency,
}: CreateGoalRequest) {
	const response = await fetch('http://localhost:3333/goals', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			title,
			desiredWeeklyFrequency,
		}),
	})
	if (response.status === 409) {
		throw new Error('Meta já cadastrada')
	}

	return response
}
