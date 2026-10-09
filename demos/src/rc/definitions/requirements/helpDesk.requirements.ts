import { RequirementDefinition, RequirementStatus, RequirementType } from '@reqquest/api'
import { HelpDeskCustomerServiceData, HelpDeskWeekendAvailabilityData, OptOutData } from '../models/index.js'

export const help_desk_opt_out_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'help_desk_opt_out_req',
  title: 'Opt Out',
  navTitle: 'Opt Out',
  description: 'Opt Out',
  promptKeys: ['help_desk_opt_out_prompt'],
  resolve: (data, config) => {
    const promptData = data['help_desk_opt_out_prompt'] as OptOutData
    if (promptData?.optOut) return { status: RequirementStatus.DISQUALIFYING }
    return { status: RequirementStatus.NOT_APPLICABLE }
  }
}

export const help_desk_weekend_availability_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'help_desk_weekend_availability_req',
  title: 'Weekend Availability',
  navTitle: 'Weekend Availability',
  description: 'Help desk associates must be able to work at least one weekend shift per month',
  promptKeys: ['help_desk_weekend_availability_prompt'],
  resolve: (data, config) => {
    const promptData = data['help_desk_weekend_availability_prompt'] as HelpDeskWeekendAvailabilityData
    if (promptData?.weekendAvailable == null) return { status: RequirementStatus.PENDING }
    if (!promptData.weekendAvailable) return { status: RequirementStatus.DISQUALIFYING, reason: 'Weekend availability is required', blame: ['help_desk_weekend_availability_prompt'] }
    return { status: RequirementStatus.MET }
  }
}

export const help_desk_customer_service_req: RequirementDefinition = {
  type: RequirementType.QUALIFICATION,
  key: 'help_desk_customer_service_req',
  title: 'Customer Service',
  navTitle: 'Customer Service',
  description: 'Customer Service',
  promptKeys: ['help_desk_customer_service_prompt'],
  resolve: (data, config) => {
    const promptData = data['help_desk_customer_service_prompt'] as HelpDeskCustomerServiceData
    if (promptData?.describeCustomerService == null) return { status: RequirementStatus.PENDING }
    return { status: RequirementStatus.MET }
  }
}
