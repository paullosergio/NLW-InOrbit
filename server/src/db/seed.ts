import { client, db } from '.'
import { goalCompletions, goals } from './schema'

async function seed() {
	await db.delete(goalCompletions)
	await db.delete(goals)

	const result = await db
		.insert(goals)
		.values([
			{ title: 'Acordar Cedo', desiredWeeklyFrequency: 5 },
			{ title: 'Exercitar', desiredWeeklyFrequency: 3 },
			{ title: 'Meditar', desiredWeeklyFrequency: 1 },
		])
		.returning()
}

seed().finally(() => {
	client.end()
})
