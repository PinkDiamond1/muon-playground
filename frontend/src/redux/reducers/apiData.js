export default function apiData(state={}, action){
    switch(action.type){
        case "API_DATA":

            return {
                    apiData: action.payload.apiData,
                }
            
        default:
            return state
        }
}