import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'
import { HttpError } from '../http-error-class'

interface CreateGoalCompletionRequeste {
	goalId: string
}

export async function createGoalCompletion({
	goalId,
}: CreateGoalCompletionRequeste) {
	const goal = await db.select().from(goals).where(eq(goals.id, goalId))

	if (goal.length === 0) {
		throw new HttpError(404, 'Goal not found') // Not found status code
	}

	const firstDayOfWeek = dayjs().startOf('week').toDate()
	const lastDayOfWeek = dayjs().endOf('week').toDate()

	const goalCompletionCounts = db.$with('goal_completion_counts').as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completionCount: count(goalCompletions.id).as('completionCount'),
			})
			.from(goalCompletions)
			.where(
				and(
					gte(goalCompletions.createdAt, firstDayOfWeek),
					lte(goalCompletions.createdAt, lastDayOfWeek),
					eq(goalCompletions.goalId, goalId)
				)
			)
			.groupBy(goalCompletions.goalId)
	)
	const result = await db
		.with(goalCompletionCounts)
		.select({
			desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
			completionCount:
				sql`COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith(
					Number
				),
		})
		.from(goals)
		.leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
		.where(eq(goals.id, goalId))
		.limit(1)

	const { completionCount, desiredWeeklyFrequency } = result[0]

	if (completionCount >= desiredWeeklyFrequency) {
		throw new HttpError(400, 'Goal already completed this week')
	}

	await db.insert(goalCompletions).values({ goalId })
}
