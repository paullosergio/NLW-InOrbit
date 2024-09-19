import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { deleteGoal } from '../functions/delete-goal'
import { HttpError } from '../http-error-class'
import type { isDayjs } from 'dayjs'

export const deleteGoalRoute: FastifyPluginAsyncZod = async app => {
	app.delete(
		'/delete-goal',
		{
			schema: {
				body: z.object({
					id: z.string(),
				}),
			},
		},

		async (request, reply) => {
			const { id } = request.body
			try {
				await deleteGoal({
					id,
				})
				reply.status(200).send({ message: 'Goal deleted successfully' })
			} catch (error) {
				const statusCode = error instanceof HttpError ? error.statusCode : 500
				const message =
					error instanceof HttpError ? error.message : 'Internal Server Error'
				reply.status(statusCode).send({ message })
			}
		}
	)
}
