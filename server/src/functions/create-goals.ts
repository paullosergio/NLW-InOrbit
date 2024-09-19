import { eq } from 'drizzle-orm'
import { db } from '../db'
import { goals } from '../db/schema'
import { HttpError } from '../http-error-class'

interface CreateGoalRequeste {
	title: string
	desiredWeeklyFrequency: number
}

export async function createGoal({
	title,
	desiredWeeklyFrequency,
}: CreateGoalRequeste) {
	const existsGoal = await db.select().from(goals).where(eq(goals.title, title))

	if (existsGoal.length > 0) {
		throw new HttpError(409, 'Goal already exists') // Conflict status code
	}
	const [result] = await db
		.insert(goals)
		.values({ title, desiredWeeklyFrequency })
		.returning()

	return {
		result,
	}
}
