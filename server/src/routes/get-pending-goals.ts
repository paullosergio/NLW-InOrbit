import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekPendingGoals } from '../functions/get_week-pending-goals';

export const getPendingGoalRoute: FastifyPluginAsyncZod = async (app) =>{
  
  app.get('/pending-goals', async () => {
    const { pendingGoals } = await getWeekPendingGoals()
  
    return { pendingGoals }
  })

};