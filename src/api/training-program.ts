import request from '@/utils/http'
export function fetchGetControl() {
  return request.get<Api.TrainingProgram.ControlItem>({
    url: '/api/tp/control/get'
  })
}
export function fetchEditControl(params: Api.TrainingProgram.ControlItem) {
  return request.post<Api.TrainingProgram.ControlItem>({
    url: '/api/tp/control/save',
    params
  })
}
