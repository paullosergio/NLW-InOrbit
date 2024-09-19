import { eq } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { HttpError } from '../http-error-class'

interface DeleteGoalRequest {
	id: string
}

export async function deleteGoal({ id }: DeleteGoalRequest) {
	const goal = await db.select().from(goals).where(eq(goals.id, id)).limit(1)

	if (goal.length === 0) {
		throw new HttpError(404, 'Goal not found')
	}

	await db.transaction(async trx => {
		await trx.delete(goalCompletions).where(eq(goalCompletions.goalId, id))
		await trx.delete(goals).where(eq(goals.id, id))
	})

	return {
		goal,
	}
}
