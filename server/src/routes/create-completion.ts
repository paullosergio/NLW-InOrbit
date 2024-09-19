import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createGoalCompletion } from '../functions/create-goal-completion'
import { HttpError } from '../http-error-class'

export const createCompletionRoute: FastifyPluginAsyncZod = async app => {
	app.post(
		'/completions',
		{
			schema: {
				body: z.object({
					goalId: z.string(),
				}),
			},
		},

		async (request, reply) => {
			try {
				const { goalId } = request.body

				await createGoalCompletion({ goalId })

				reply.status(200).send({ message: 'Completion created successfully' })
			} catch (error) {
				if (error instanceof HttpError) {
					reply.status(error.statusCode).send({ message: error.message })
				} else {
					reply.status(500).send({ message: 'Internal Server Error' })
				}
			}
		}
	)
}
