export async function deleteGoal(goalId: string) {
	await fetch('http://localhost:3333/delete-goal', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id: goalId }),
	})
}
