import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createGoal } from '../functions/create-goals'
import { HttpError } from '../http-error-class'

export const createGoalRoute: FastifyPluginAsyncZod = async app => {
	app.post(
		'/goals',
		{
			schema: {
				body: z.object({
					title: z.string().min(1),
					desiredWeeklyFrequency: z.number().int().min(1).max(7),
				}),
			},
		},

		async (request, reply) => {
			try {
				const { title, desiredWeeklyFrequency } = request.body
				const goal = await createGoal({ title, desiredWeeklyFrequency })
				reply.status(201).send(goal)
			} catch (error) {
				const statusCode = error instanceof HttpError ? error.statusCode : 500
				const message =
					error instanceof HttpError ? error.message : 'Internal Server Error'
				reply.status(statusCode).send({ message })
			}
		}
	)
}
