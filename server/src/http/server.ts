import fastify from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoalRoute } from '../routes/create-goal'
import { createCompletionRoute } from '../routes/create-completion'
import { getPendingGoalRoute } from '../routes/get-pending-goals'
import { getWeekSummaryRoute } from '../routes/get-week-summary'
import fastifyCors from '@fastify/cors'
import { deleteGoalRoute } from '../routes/delete-goal'
import z from 'zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
	origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler((error, request, reply) => {
	if (error instanceof z.ZodError) {
		const formattedErrors = error.errors.map(err => {
			return {
				campo: err.path.join('.'),
				mensagem: err.message,
			}
		})

		reply.status(422).send({
			mensagem: 'Error validating the data sent.',
			erros: formattedErrors,
		})
	}
})

app.register(createGoalRoute)
app.register(deleteGoalRoute)
app.register(createCompletionRoute)
app.register(getPendingGoalRoute)
app.register(getWeekSummaryRoute)

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
	console.log('Server is running!')
})
