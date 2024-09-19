import { Plus, X } from 'lucide-react'
import { OutlineButton } from './ui/outline-button'
import { getPendingGoals } from '../http/get-pending-goals'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createGoalCompletion } from '../http/create-goal-completion'
import { deleteGoal } from '../http/delete-goal'

export function PendingGoals() {
	const queryClient = useQueryClient()

	const { data } = useQuery({
		queryKey: ['pending-goals'],
		queryFn: getPendingGoals,
		staleTime: 1000 * 60,
	})

	if (!data) {
		return null
	}

	async function handleDeleteGoal(goalId: string) {
		await deleteGoal(goalId)
		await invalidateQueries()
	}

	async function handleCompleteGoal(goalId: string) {
		await createGoalCompletion(goalId)
		await invalidateQueries()
	}

	async function invalidateQueries() {
		queryClient.invalidateQueries({ queryKey: ['summary'] })
		queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
	}

	return (
		<div className="flex flex-wrap gap-3">
			{data.map(goal => {
				return (
					<div key={goal.id} className="relative">
						<button
							type="button"
							onClick={() => handleDeleteGoal(goal.id)}
							className="absolute -top-3 -right-3 p-1 rounded-full bg-zinc-800 hover:bg-zinc-600"
						>
							<div className="flex items-center justify-center  border-zinc-400">
								<X className="size-4 text-zinc-300" />
							</div>
						</button>

						<OutlineButton
							key={goal.id}
							disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
							onClick={() => handleCompleteGoal(goal.id)}
							className="relative flex items-center justify-between"
						>
							<div className="flex items-center">
								<Plus className="size-4 text-zinc-600" />
								<span className="ml-2">{goal.title}</span>
							</div>
						</OutlineButton>
					</div>
				)
			})}
		</div>
	)
}
